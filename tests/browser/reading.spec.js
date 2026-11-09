import { test, expect } from '@playwright/test';

test('deep reading provides navigable sections, worked examples and reflection without losing lesson progress', async ({
  page,
}) => {
  await page.goto('/#materi/kenali');
  await expect(page.locator('.reading-section')).toHaveCount(8);
  await page.getByText('Daftar isi bacaan · 8 bagian', { exact: true }).click();
  await page.getByRole('button', { name: /Lewis: ikuti pasangan elektron/ }).click();
  await expect(page.getByRole('heading', { name: 'Lewis: ikuti pasangan elektron' })).toBeFocused();
  await page.getByText('1. Pada H₂O + HCl', { exact: false }).click();
  await expect(page.locator('.reading-practice')).toContainText('Asam konjugasinya adalah H₃O⁺');
  await page.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sudah dipelajari', exact: true })).toBeDisabled();
  for (const id of ['skala', 'kehidupan']) {
    await page.goto(`/#materi/${id}`);
    await expect(page.locator('.reading-section')).toHaveCount(8);
    expect(await page.locator('.worked-example').count()).toBeGreaterThanOrEqual(3);
    expect(await page.locator('.section-references a').count()).toBeGreaterThanOrEqual(8);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
