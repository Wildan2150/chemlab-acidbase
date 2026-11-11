import { test, expect } from './fixtures.js';
import AxeBuilder from '@axe-core/playwright';

test.use({ automaticHelp: true });

const hint = (page) => page.locator('.contextual-hint');
async function incompleteQuiz(page) {
  await page.getByRole('button', { name: 'Buka soal 5, belum dijawab' }).click();
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
}

test('repeated incomplete quiz gets actionable help without moving keyboard focus', async ({
  page,
}) => {
  await page.goto('/#kuis');
  await incompleteQuiz(page);
  await expect(hint(page)).toHaveCount(0);
  await incompleteQuiz(page);
  await expect(hint(page)).toContainText('Gunakan peta pertanyaan');
  await expect(page.getByRole('heading', { name: /Saat HCl dilarutkan/ })).toBeFocused();
  await hint(page).getByRole('button', { name: 'Ke jawaban yang belum diisi' }).click();
  await expect(hint(page)).toHaveCount(0);
  await page.getByRole('radio').first().check();
  await incompleteQuiz(page);
  await expect(hint(page)).toHaveCount(0);
});

test('two distinct failed searches show help; suggested search succeeds and retains focus', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Cari konsep atau materi', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Cari konsep atau materi' });
  await input.fill('zzztidakada');
  await page.waitForTimeout(1700);
  await expect(hint(page)).toHaveCount(0);
  await input.fill('qqqtidakada');
  await expect(hint(page)).toContainText('Coba kata kunci yang lebih singkat');
  await expect(input).toBeFocused();
  await hint(page).getByRole('button', { name: 'Coba kata “pH”' }).click();
  await expect(input).toHaveValue('pH');
  await expect(input).toBeFocused();
  await expect(hint(page)).toHaveCount(0);
  await expect(page.locator('.search-results a').first()).toBeVisible();
});

test('first simulation visit shows guidance before loading; replay and opt-out persist', async ({
  page,
}) => {
  await page.route('https://phet.colorado.edu/sims/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Simulation test fixture</p>' }),
  );
  await page.goto('/#eksplorasi/phet');
  await expect(hint(page)).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(hint(page)).toContainText('Mulai pengamatan di simulasi PhET');
  await expect(hint(page)).toContainText('Strong Acid');
  await hint(page).getByRole('button', { name: 'Tulis prediksi pengamatan' }).click();
  await expect(page.locator('#prediction')).toBeFocused();
  await page.reload();
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(hint(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Petunjuk fitur ini' }).click();
  await expect(hint(page)).toContainText('Mulai pengamatan di simulasi PhET');
  await hint(page).getByRole('button', { name: 'Tutup saran bantuan' }).click();
  await expect(page.getByRole('button', { name: 'Petunjuk fitur ini' })).toBeFocused();
  await page.getByRole('button', { name: 'Panduan belajar', exact: true }).click();
  await page.getByRole('checkbox', { name: /Bantuan otomatis saat menemui kendala/ }).uncheck();
  await page.keyboard.press('Escape');
  await page.reload();
  await page.goto('/#kuis');
  await incompleteQuiz(page);
  await incompleteQuiz(page);
  await expect(hint(page)).toHaveCount(0);
  await page.goto('/#eksplorasi/phet');
  await page.getByRole('button', { name: 'Petunjuk fitur ini' }).click();
  await expect(hint(page)).toBeVisible();
});

test('repeated simulation reloads suggest fallback without claiming iframe failure', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'chemlab:contextual-help:v1',
      JSON.stringify({ enabled: true, seen: ['phet-start'] }),
    ),
  );
  await page.route('https://phet.colorado.edu/sims/**', (route) => route.abort());
  await page.goto('/#eksplorasi/phet');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await page.getByRole('button', { name: 'Muat ulang aktivitas' }).click();
  await expect(hint(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Muat ulang aktivitas' }).click();
  await expect(hint(page)).toContainText('Aktivitas sudah dimuat ulang beberapa kali');
  await hint(page).getByRole('button', { name: 'Lihat bacaan pendamping' }).click();
  await expect(page.locator('.activity-fallback')).toBeFocused();
  await expect(page.locator('.activity-fallback')).toHaveAttribute('open', '');
});

test('molecule first visit explains controls before starting a render', async ({ page }) => {
  await page.route('**/molecule-viewer.html*', (route) => route.abort());
  await page.goto('/#eksplorasi/molecules');
  await expect(hint(page)).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(hint(page)).toContainText('Amati model dari beberapa sisi');
  await expect(hint(page)).toContainText('keyboard');
  await hint(page).getByRole('button', { name: 'Nonaktifkan bantuan otomatis' }).click();
  await expect(hint(page)).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('chemlab:contextual-help:v1')).enabled,
    ),
  ).toBe(false);
});

test('each exploration tab introduces itself immediately despite recent hints; revisits stay quiet', async ({
  page,
}) => {
  await page.goto('/#kuis');
  await incompleteQuiz(page);
  await incompleteQuiz(page);
  await expect(hint(page)).toContainText('Gunakan peta pertanyaan');
  for (const [activity, title] of [
    ['phet', 'Mulai pengamatan di simulasi PhET'],
    ['molecules', 'Amati model dari beberapa sisi'],
    ['pubchem', 'Temukan dan periksa data senyawa'],
  ]) {
    await page.goto(`/#eksplorasi/${activity}`);
    await expect(hint(page)).toBeVisible();
    await expect(hint(page)).toContainText(title);
    await expect(page.locator('iframe')).toHaveCount(0);
    await hint(page).getByRole('button', { name: 'Tutup saran bantuan' }).click();
  }
  await page.goto('/#eksplorasi/phet');
  await expect(page.getByRole('button', { name: 'Buka aktivitas', exact: true })).toBeVisible();
  await expect(hint(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Petunjuk fitur ini' }).click();
  await expect(hint(page)).toBeVisible();
  await page.goto('/#progres');
  await page.goto('/#eksplorasi/phet');
  await expect(page.getByRole('button', { name: 'Buka aktivitas', exact: true })).toBeVisible();
  await expect(hint(page)).toHaveCount(0);
});

test('hard reload and clearing only HTTP cache preserve seen hints and learning data', async ({
  page,
  context,
}) => {
  await page.goto('/#kuis');
  await page.getByRole('radio').first().check();
  const progress = await page.evaluate(() => localStorage.getItem('chemlab:guest:v1'));
  await page.goto('/#eksplorasi/phet');
  await expect(hint(page)).toBeVisible();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await cdp.send('Page.reload', { ignoreCache: true });
  await expect(page.getByRole('button', { name: 'Buka aktivitas', exact: true })).toBeVisible();
  await expect(hint(page)).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('chemlab:guest:v1'))).toBe(progress);
  await cdp.detach();
});

test('repeat-all resets guidance and opt-out without erasing answers or unrelated browser data', async ({
  page,
}) => {
  await page.removeLocatorHandler(page.getByRole('button', { name: 'Lewati tur', exact: true }));
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(1).check();
  const progress = await page.evaluate(() => {
    localStorage.setItem('unrelated:preference', 'keep');
    return localStorage.getItem('chemlab:guest:v1');
  });
  await page.goto('/#eksplorasi/phet');
  await hint(page).getByRole('button', { name: 'Nonaktifkan bantuan otomatis' }).click();
  await page.getByRole('button', { name: 'Panduan belajar', exact: true }).click();
  await page.getByRole('button', { name: 'Ulangi semua petunjuk' }).click();
  await expect(page.locator('.onboarding-dialog')).toBeVisible();
  await expect(page.locator('.contextual-hint')).toHaveCount(0);
  await page.locator('.onboarding-dialog').getByRole('button', { name: 'Lewati tur' }).click();
  await expect(hint(page)).toBeVisible();
  await expect(hint(page)).toContainText('Mulai pengamatan di simulasi PhET');
  expect(await page.evaluate(() => localStorage.getItem('chemlab:guest:v1'))).toBe(progress);
  expect(await page.evaluate(() => localStorage.getItem('unrelated:preference'))).toBe('keep');
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('chemlab:contextual-help:v1')).enabled,
    ),
  ).toBe(true);
});

test('a genuinely fresh visit queues exploration guidance until the welcome tour is dismissed', async ({
  browser,
}) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5173' });
  try {
    const page = await context.newPage();
    await page.goto('/#eksplorasi');
    await expect(page.locator('.onboarding-dialog')).toBeVisible();
    await expect(hint(page)).toHaveCount(0);
    expect(
      await page.evaluate(() => localStorage.getItem('chemlab:contextual-help:v1')),
    ).toBeNull();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.locator('.onboarding-dialog').getByRole('button', { name: 'Lewati tur' }).click();
    await expect(hint(page)).toBeVisible();
    await expect(hint(page)).toContainText('Buka aktivitas');
    await expect(page.locator('iframe')).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('automatic exploration introduction stays visible on a narrow phone without stealing focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#eksplorasi/phet');
  await expect(hint(page)).toBeVisible();
  const popup = await hint(page).boundingBox();
  expect(
    popup.x >= 0 && popup.x + popup.width <= 320 && popup.y >= 0 && popup.y + popup.height <= 700,
  ).toBe(true);
  expect(await page.evaluate(() => !!document.activeElement.closest('.contextual-hint'))).toBe(
    false,
  );
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({ path: 'docs/preview-exploration-first-visit-mobile.png' });
});

test('repeated incomplete assessment and PubChem errors receive contextual guidance', async ({
  page,
}) => {
  await page.goto('/#asesmen');
  await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
    await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  }
  await expect(hint(page)).toContainText('Lengkapi jawaban lewat ringkasan');
  await page.reload();
  await page.route('https://pubchem.ncbi.nlm.nih.gov/rest/**', (route) =>
    route.fulfill({ status: 404, body: '{}' }),
  );
  await page.goto('/#eksplorasi/pubchem');
  await page.getByLabel('Nama senyawa', { exact: true }).fill('unknown-chemical');
  await page.getByRole('button', { name: 'Cari senyawa', exact: true }).click();
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await expect(hint(page)).toContainText('Coba nama senyawa yang dikenal PubChem');
});

test('mobile contextual guidance is accessible, nonmodal, and fits narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#eksplorasi/phet');
  await page.getByRole('button', { name: 'Petunjuk fitur ini' }).click();
  await expect(hint(page)).toBeVisible();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({ path: 'docs/preview-contextual-help-mobile.png', fullPage: true });
});
