import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const key = 'chemlab:guest:v1';
const readData = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);

test('guest learning, pH and unfinished quiz persist after reload; attempts stay separate', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Halo, penjelajah kimia.' })).toBeVisible();
  await page.getByRole('link', { name: 'Mulai belajar', exact: true }).click();
  await page.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sudah dipelajari', exact: true })).toBeDisabled();
  await page.goto('/#laboratorium');
  await page.getByRole('button', { name: /Sari lemon/ }).click();
  await expect(page.locator('.stage-readout strong')).toHaveText('2,0');
  await page.reload();
  await expect(page.locator('#lab-ph')).toHaveValue('2');
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(1).check();
  await expect.poll(async () => (await readData(page)).draft.answers.q1).toBe(1);
  const firstId = (await readData(page)).draft.id;
  await page.reload();
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await expect(page.getByText('Jawaban & pembahasan')).toHaveCount(0);
  for (const answer of [2, 0, 3, 2]) {
    await page.getByRole('button', { name: 'Selanjutnya', exact: true }).click();
    await page.getByRole('radio').nth(answer).check();
  }
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
  await expect(page.locator('.score-circle strong')).toHaveText('100');
  await expect(page.locator('.review-item')).toHaveCount(5);
  await expect.poll(async () => (await readData(page)).attempts.length).toBe(1);
  await page.reload();
  await expect(page.locator('.score-circle strong')).toHaveText('100');
  await page.getByRole('button', { name: 'Mulai latihan baru' }).click();
  await expect.poll(async () => (await readData(page)).draft.id).not.toBe(firstId);
  for (let i = 0; i < 5; i++) {
    await page.getByRole('radio').nth(0).check();
    if (i < 4) await page.getByRole('button', { name: 'Selanjutnya', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
  await expect(page.locator('.score-circle strong')).toHaveText('20');
  const saved = await readData(page);
  expect(saved.attempts).toHaveLength(2);
  expect(saved.attempts[0].id).toBe(firstId);
  expect(saved.attempts[0].score).toBe(100);
  expect(saved.attempts[1].kind).toBe('practice');
  await page.goto('/#progres');
  await expect(page.locator('.history-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await page.getByRole('button', { name: 'Batal', exact: true }).click();
  await expect(page.locator('.history-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await page.getByRole('button', { name: 'Hapus & mulai ulang' }).click();
  await expect(page.getByText('Perjalanan kuismu mulai di sini.')).toBeVisible();
  expect((await readData(page)).completedLessons).toEqual([]);
  expect(errors).toEqual([]);
});

test('incomplete diagnostics cannot be submitted and focus on missing answer', async ({ page }) => {
  await page.goto('/#kuis');
  await page.getByRole('button', { name: 'Buka soal 5, belum dijawab' }).click();
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
  await expect(page.locator('.form-message')).toContainText('Jawab kelima soal');
  await expect(page.getByRole('button', { name: 'Buka soal 1, belum dijawab' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  expect((await readData(page)).attempts).toHaveLength(0);
});

test('search and progress exports work while the teacher route stays private for guests', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Cari konsep atau materi/ }).click();
  await page.getByRole('textbox', { name: 'Cari konsep atau materi' }).fill('netralisasi');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /Kimia di sekitar kita/ })
    .click();
  await expect(page).toHaveURL(/materi\/kehidupan/);
  await page.goto('/#guru');
  await expect(page.getByRole('heading', { name: 'Masuk sebagai guru' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Panel guru', exact: true })).toHaveCount(0);
  await expect(page.locator('tbody tr')).toHaveCount(0);
  await page.goto('/#progres');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Ekspor progres' }).click();
  expect((await download).suggestedFilename()).toBe('chemlab-progres.json');
});

test('corrupt or denied browser storage does not block the learning UI', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{broken'), key);
  await page.goto('/');
  await expect(page.getByText(/Data lokal tidak dapat dibaca/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Mulai belajar', exact: true })).toBeVisible();
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Denied', 'SecurityError');
      },
    });
  });
  await page.goto('/#kuis');
  await page.reload();
  await expect(page.getByText('Draf hanya dalam sesi ini')).toBeVisible();
  await page.getByRole('radio').nth(1).check();
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
});

test('mobile navigation, keyboard range and all pages fit without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Buka navigasi' }).click();
  await page.getByRole('link', { name: 'Laboratorium pH', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Laboratorium pH.' })).toBeVisible();
  await page.locator('#lab-ph').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#lab-ph')).toHaveValue('7.5');
  for (const route of [
    'beranda',
    'materi',
    'materi/kenali',
    'laboratorium',
    'kuis',
    'progres',
    'guru',
  ]) {
    await page.goto(`/#${route}`);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      route,
    ).toBe(true);
  }
});

test('WCAG AA automated checks across learning and teacher routes', async ({ page }) => {
  for (const route of [
    'beranda',
    'materi',
    'materi/skala',
    'laboratorium',
    'kuis',
    'progres',
    'guru',
  ]) {
    await page.goto(`/#${route}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
      route,
    ).toEqual([]);
  }
});

test('save desktop and mobile previews', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Panduan belajar' }).click();
  await expect(page.getByRole('dialog')).toContainText('Kenali asam, basa, dan pH');
  await expect(page.getByRole('dialog')).not.toContainText(/demo|kuliah|Vibe Coding|PWA|cloud/i);
  await page.keyboard.press('Escape');
  for (const route of [
    'beranda',
    'materi',
    'materi/skala',
    'laboratorium',
    'kuis',
    'progres',
    'guru',
  ]) {
    await page.goto(`/#${route}`);
    await expect(page.locator('body')).not.toContainText(
      /demo|demonstrasi|Vibe Coding|dibuat sebagai|belum terhubung/i,
    );
  }
  await page.goto('/');
  await page.screenshot({ path: 'docs/preview-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.hero-copy h2')).toBeVisible();
  expect(await page.locator('.hero-copy h2').evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'docs/preview-mobile.png', fullPage: true });
});

test('narrow phones and tablets preserve content and accessible search', async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['beranda', 'materi', 'laboratorium', 'kuis', 'progres', 'guru']) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${width}: ${route}`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Cari konsep atau materi' }).click();
  const searchA11y = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(searchA11y.violations).toEqual([]);
});
