import { test, expect } from './fixtures.js';
import AxeBuilder from '@axe-core/playwright';

test('observations persist, export with progress and reset together', async ({ page }) => {
  await page.goto('/#eksplorasi/phet');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page
    .getByLabel('01 · Prediksi', { exact: false })
    .fill('Asam kuat lebih banyak terionisasi.');
  await page.reload();
  await expect(page.locator('#prediction')).toHaveValue('Asam kuat lebih banyak terionisasi.');
  await page.locator('#observation').fill('HCl pH 2; HA sekitar pH 3,38 pada konsentrasi sama.');
  await page.locator('#explanation').fill('Ionisasi memengaruhi konsentrasi hidronium.');
  await page.getByRole('button', { name: 'Simpan catatan lengkap' }).click();
  await expect(page.locator('.notebook-status')).toContainText('Catatan lengkap tersimpan');
  await page.goto('/#progres');
  await expect(page.locator('.activity-history')).toContainText('Catatan lengkap');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('chemlab:guest:v1')));
  expect(saved.activityNotes.phet.completedAt).toBeTruthy();
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await page.getByRole('button', { name: 'Hapus & mulai ulang' }).click();
  await page.goto('/#eksplorasi/phet');
  await expect(page.locator('#prediction')).toHaveValue('');
});

test('external resources load on request and retain local learning when unavailable', async ({
  page,
}) => {
  await page.route('https://phet.colorado.edu/**', (route) => route.abort());
  await page.route('https://3dmol.org/**', (route) => route.abort());
  await page.goto('/#eksplorasi/phet');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(page.locator('iframe')).toHaveAttribute('title', 'PhET · Acid-Base Solutions');
  await expect(page.locator('.activity-fallback')).toContainText('3,38');
  await expect(page.locator('.resource-credit')).toContainText('CC BY-NC 4.0');
  await page.goto('/#eksplorasi/molecules');
  await page.getByLabel('Molekul yang diamati').selectOption('222');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', /cid=222/);
  await expect(page.locator('.molecule-identity')).toContainText('NH₃');
  await expect(page.getByRole('link', { name: 'Identitas Amonia di PubChem' })).toHaveAttribute(
    'href',
    'https://pubchem.ncbi.nlm.nih.gov/compound/222',
  );
});

test('PubChem handles real response structure, missing records, network failure and stale results', async ({
  page,
}) => {
  await page.route('**/rest/pug/compound/**', (route) => {
    const url = decodeURIComponent(route.request().url());
    if (url.includes('/name/ethanol/'))
      return route.fulfill({
        json: {
          PropertyTable: {
            Properties: [
              {
                CID: 702,
                MolecularFormula: 'C2H6O',
                MolecularWeight: '46.07',
                IUPACName: 'ethanol',
              },
            ],
          },
        },
      });
    if (url.includes('/name/unknown/'))
      return route.fulfill({ status: 404, json: { Fault: { Code: 'PUGREST.NotFound' } } });
    return route.abort();
  });
  await page.goto('/#eksplorasi/pubchem');
  await page.getByRole('button', { name: 'Etanol', exact: true }).click();
  await expect(page.locator('.compound-card')).toContainText('46,07 g/mol');
  await expect(page.locator('.compound-card')).toContainText('CID 702');
  await page.getByLabel('Nama senyawa', { exact: true }).fill('unknown');
  await page.getByRole('button', { name: 'Cari senyawa', exact: true }).click();
  await expect(page.locator('.compound-status')).toContainText('tidak ditemukan');
  await expect(page.locator('.compound-card')).toHaveCount(0);
  await page.getByLabel('Nama senyawa', { exact: true }).fill('unavailable');
  await page.getByRole('button', { name: 'Cari senyawa', exact: true }).click();
  await expect(page.locator('.compound-status')).toContainText('belum dapat dihubungi');
  await expect(page.getByRole('button', { name: 'Coba lagi', exact: true })).toBeVisible();
});

test('activities remain accessible and fit a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of ['phet', 'molecules', 'pubchem']) {
    await page.goto(`/#eksplorasi/${id}`);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      id,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(
      true,
    );
  }
});
