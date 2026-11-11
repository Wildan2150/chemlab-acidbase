import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const tourKey = 'chemlab:onboarding:v1';
const tour = (page) => page.locator('.onboarding-dialog');

test('first visit introduces all features; completion persists and replay starts fresh', async ({
  page,
}) => {
  await page.goto('/');
  await expect(tour(page)).toBeVisible();
  await expect(tour(page)).toContainText('Langkah 1 dari 7');
  await expect(tour(page).getByRole('heading', { level: 2 })).toBeFocused();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/preview-onboarding-desktop.png' });
  const progress = await page.evaluate(() => localStorage.getItem('chemlab:guest:v1'));
  await tour(page).getByRole('button', { name: 'Lanjut', exact: true }).click();
  await expect(tour(page)).toContainText('Mulai dari konsep.');
  await expect(tour(page).locator('.coachmark-card')).toHaveClass(/is-anchored/);
  await page.screenshot({ path: 'docs/preview-tour-desktop.png' });
  await tour(page).getByRole('button', { name: 'Kembali', exact: true }).click();
  await expect(tour(page)).toContainText('Langkah 1 dari 7');
  for (let i = 0; i < 6; i++) {
    await tour(page).getByRole('button', { name: 'Lanjut', exact: true }).click();
    await expect(tour(page).locator('.coachmark-card')).toHaveClass(/is-anchored/);
    const targeted = await tour(page).getAttribute('data-targeted');
    expect(targeted).toBe('true');
  }
  await expect(tour(page)).toContainText('catatan tamu tetap terpisah');
  await tour(page).getByRole('button', { name: 'Siap bereksplorasi' }).click();
  await expect(tour(page)).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), tourKey)).toBe('completed');
  expect(await page.evaluate(() => localStorage.getItem('chemlab:guest:v1'))).toBe(progress);
  await expect(page.getByRole('button', { name: 'Tur fitur', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Halo, penjelajah kimia.' })).toBeVisible();
  await expect(tour(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Tur fitur', exact: true }).click();
  await expect(tour(page)).toContainText('Langkah 1 dari 7');
});

for (const dismissal of ['skip', 'escape', 'backdrop']) {
  test(`tour dismissal via ${dismissal} persists and preserves deep links`, async ({ page }) => {
    await page.goto('/#materi/kenali');
    await expect(tour(page)).toBeVisible();
    if (dismissal === 'skip') await tour(page).getByRole('button', { name: 'Lewati tur' }).click();
    if (dismissal === 'escape') await page.keyboard.press('Escape');
    if (dismissal === 'backdrop') await page.mouse.click(5, 5);
    await expect(tour(page)).toHaveCount(0);
    await expect(page).toHaveURL(/#materi\/kenali$/);
    expect(await page.evaluate((key) => localStorage.getItem(key), tourKey)).toBe('skipped');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Tandai sudah dipelajari' })).toBeVisible();
    await expect(tour(page)).toHaveCount(0);
  });
}

test('account flows defer the tour until the first learning route', async ({ page }) => {
  for (const route of ['masuk', 'daftar', 'lupa-password', 'akun', 'guru', 'tindakan-akun']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(tour(page)).toHaveCount(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), tourKey)).toBeNull();
  }
  await page.goto('/#laboratorium');
  await expect(tour(page)).toBeVisible();
});

test('tour contains keyboard focus, blocks competing dialogs and passes mobile a11y', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await expect(tour(page)).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('.onboarding-dialog'))).toBe(
      true,
    );
  }
  for (let i = 0; i < 7; i++) {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
    expect(await tour(page).evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    const selector = await tour(page).getAttribute('data-target');
    if (selector) {
      await expect(page.locator(selector)).toBeVisible();
      const target = await page.locator(selector).boundingBox();
      const card = await tour(page).locator('.coachmark-card').boundingBox();
      expect(card.y >= 0 && card.y + card.height <= 568).toBe(true);
      expect(
        card.x + card.width <= target.x ||
          card.x >= target.x + target.width ||
          card.y + card.height <= target.y ||
          card.y >= target.y + target.height,
        `step ${i + 1}: keep target visible`,
      ).toBe(true);
    }
    if (i < 6) await tour(page).getByRole('button', { name: 'Lanjut', exact: true }).click();
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Tur fitur', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Tur fitur', exact: true }).click();
  await page.screenshot({ path: 'docs/preview-onboarding-mobile.png' });
  await tour(page).getByRole('button', { name: 'Lanjut', exact: true }).click();
  await page.screenshot({ path: 'docs/preview-tour-mobile.png' });
});

test('denied storage keeps dismissal in memory and allows learning and manual replay', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Denied', 'SecurityError');
      },
    }),
  );
  await page.goto('/');
  await expect(tour(page)).toContainText('Penyimpanan browser tidak tersedia');
  await tour(page).getByRole('button', { name: 'Lewati tur' }).click();
  await page.getByRole('link', { name: 'Kuis diagnostik', exact: true }).first().click();
  await expect(page.getByRole('radio').first()).toBeVisible();
  await expect(tour(page)).toHaveCount(0);
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Tur fitur', exact: true }).click();
  await expect(tour(page)).toBeVisible();
  expect(errors).toEqual([]);
});
