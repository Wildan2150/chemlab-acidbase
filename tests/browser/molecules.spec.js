import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import UPNG from 'upng-js';
import { molecules } from '../../src/data/molecules.js';

async function openModel(page) {
  await page.goto('/#eksplorasi/molecules');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
}

async function picture(page) {
  const canvas = page.frameLocator('.molecule-frame').locator('canvas');
  const png = await canvas.screenshot();
  const data = UPNG.decode(png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength));
  const pixels = new Uint8Array(UPNG.toRGBA8(data)[0]);
  let foreground = 0;
  let red = 0;
  let blue = 0;
  let edge = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] && Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 180) {
      foreground++;
      const x = (i / 4) % data.width;
      const y = Math.floor(i / 4 / data.width);
      if (x < 4 || y < 4 || x >= data.width - 4 || y >= data.height - 4) edge++;
    }
    if (pixels[i] > 80 && pixels[i] > pixels[i + 1] * 1.7 && pixels[i] > pixels[i + 2] * 1.7) red++;
    if (
      pixels[i + 2] > 80 &&
      pixels[i + 2] > pixels[i] * 1.7 &&
      pixels[i + 2] > pixels[i + 1] * 1.7
    )
      blue++;
  }
  return { png: png.toString('base64'), foreground, red, blue, edge };
}

test('all catalogue structures render visible atoms while third-party hosts are blocked', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(
    /^https:\/\/(3dmol\.org|pubchem\.ncbi\.nlm\.nih\.gov|cdnjs\.cloudflare\.com|code\.jquery\.com)\//,
    (route) => {
      external.push(route.request().url());
      return route.abort();
    },
  );
  await page.goto('/#eksplorasi/molecules');
  await expect(page.locator('.molecule-frame')).toHaveCount(0);
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  for (const { cid, name, atomCount: atoms, elements } of molecules) {
    await page.getByLabel('Molekul yang diamati').selectOption(String(cid));
    await expect(page.locator('.molecule-status')).toHaveText(
      `${name} siap diamati · ${atoms} atom.`,
    );
    await expect(page.frameLocator('.molecule-frame').getByRole('img')).toHaveAttribute(
      'aria-label',
      new RegExp(`${atoms} atom`),
    );
    const rendered = await picture(page);
    expect(rendered.foreground, `${name} must contain visible geometry`).toBeGreaterThan(300);
    if (cid === 962 || cid === 176 || cid === 222) {
      expect(
        rendered[elements.O ? 'red' : 'blue'],
        `${name} must contain its expected atom color`,
      ).toBeGreaterThan(100);
    }
    await expect(page.getByRole('link', { name: 'Buka di tab baru', exact: true })).toHaveAttribute(
      'href',
      `https://3dmol.org/viewer.html?cid=${cid}&style=stick`,
    );
  }
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('catalogue search supports names, aliases, formulas, CID, filters and an empty result', async ({
  page,
}) => {
  await page.goto('/#eksplorasi/molecules');
  await expect(page.locator('#molecule-results')).toContainText(
    `${molecules.length} dari ${molecules.length}`,
  );
  const search = page.getByRole('searchbox', { name: 'Cari molekul atau CID' });
  const choice = page.getByLabel('Molekul yang diamati');
  for (const [query, cid] of [
    ['ethanol', 702],
    ['H₂O₂', 784],
    ['CID: 311', 311],
    ['aspirin', 2244],
  ]) {
    await search.fill(query);
    await expect(page.locator('#molecule-results')).toContainText(`1 dari ${molecules.length}`);
    await choice.selectOption(String(cid));
    await expect(choice).toHaveValue(String(cid));
    await expect(page.locator('.molecule-identity')).toContainText(
      molecules.find((m) => m.cid === cid).formula,
    );
  }
  await search.fill('tidak-ada-senyawa-ini');
  await expect(page.locator('#molecule-results')).toContainText('Tidak ada molekul yang cocok');
  await expect(choice).toHaveValue('2244');
  await page.getByRole('button', { name: 'Hapus pencarian', exact: true }).click();
  await page.getByLabel('Kelompok senyawa').selectOption('Senyawa nitrogen');
  await expect(choice.locator('optgroup[label="Senyawa nitrogen"] option')).toHaveCount(
    molecules.filter((m) => m.category === 'Senyawa nitrogen').length,
  );
  await search.fill('trimethylamine');
  await choice.selectOption('1146');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText(
    'Trimetilamina siap diamati · 13 atom.',
  );
  await page.reload();
  await expect(choice).toHaveValue('1146');
});

test('keyboard controls, drag rotation, zoom and reset change the rendered structure', async ({
  page,
}) => {
  await openModel(page);
  await expect(page.locator('.molecule-status')).toContainText('siap diamati');
  const initial = await picture(page);
  await page.getByRole('button', { name: 'Putar ke kanan', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(async () => (await picture(page)).png).not.toBe(initial.png);
  await page.getByRole('button', { name: 'Atur ulang sudut pandang', exact: true }).click();
  await expect.poll(async () => (await picture(page)).png).toBe(initial.png);
  await page.getByRole('button', { name: 'Perbesar', exact: true }).click();
  await expect
    .poll(async () => (await picture(page)).foreground)
    .toBeGreaterThan(initial.foreground * 1.1);
  await page.getByRole('button', { name: 'Atur ulang sudut pandang', exact: true }).click();
  const canvas = page.frameLocator('.molecule-frame').locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 25, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => (await picture(page)).png).not.toBe(initial.png);
});

test('failed and invalid SDF files show an error and retry without losing notes', async ({
  page,
}) => {
  let response = 'missing';
  await page.route('**/molecules/176.sdf', (route) => {
    if (response === 'missing') return route.fulfill({ status: 404, body: 'not found' });
    if (response === 'invalid')
      return route.fulfill({ contentType: 'chemical/x-mdl-sdfile', body: 'invalid SDF' });
    return route.continue();
  });
  await page.goto('/#eksplorasi/molecules');
  await page.locator('#prediction').fill('Proton berasal dari gugus karboksil.');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText(
    'Berkas struktur belum dapat dimuat',
  );
  await expect(page.locator('.molecule-frame')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Perbesar', exact: true })).toBeDisabled();
  response = 'invalid';
  await page.getByRole('button', { name: 'Muat ulang model', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText('Berkas struktur tidak sesuai');
  response = 'valid';
  await page.getByRole('button', { name: 'Muat ulang model', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText(
    'Asam asetat siap diamati · 8 atom.',
  );
  await expect(page.locator('#prediction')).toHaveValue('Proton berasal dari gugus karboksil.');
  expect((await picture(page)).red).toBeGreaterThan(100);
});

test('switching away from a pending structure ignores its late response and restores the selection', async ({
  page,
}) => {
  let waiting;
  const request = new Promise((resolve) => {
    waiting = resolve;
  });
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/molecules/176.sdf', async (route) => {
    waiting();
    await gate;
    await route.continue().catch(() => {});
  });
  await openModel(page);
  await request;
  await page.getByLabel('Molekul yang diamati').selectOption('222');
  await expect(page.locator('.molecule-status')).toContainText('Amonia siap diamati · 4 atom.');
  release();
  await page.getByLabel('Molekul yang diamati').selectOption('962');
  await expect(page.locator('.molecule-status')).toContainText('Air siap diamati · 3 atom.');
  await page.reload();
  await expect(page.getByLabel('Molekul yang diamati')).toHaveValue('962');
  await page.getByRole('button', { name: 'Buka aktivitas', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText('Air siap diamati · 3 atom.');
  expect((await picture(page)).red).toBeGreaterThan(100);
});

test('missing WebGL gives usable guidance and retains the learning text and notes', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl|bitmaprenderer/.test(type) ? null : original.call(this, type, ...args);
    };
    if (typeof OffscreenCanvas !== 'undefined') {
      const originalOffscreen = OffscreenCanvas.prototype.getContext;
      OffscreenCanvas.prototype.getContext = function (type, ...args) {
        return /webgl/.test(type) ? null : originalOffscreen.call(this, type, ...args);
      };
    }
  });
  await openModel(page);
  await expect(page.locator('.molecule-status')).toContainText('WebGL tidak tersedia');
  await expect(page.locator('.molecule-frame')).toHaveCount(0);
  await expect(page.locator('.molecule-identity')).toContainText('CH₃–C(=O)–OH');
  await expect(page.locator('.activity-fallback')).toContainText('proton gugus karboksil');
  await page.locator('#observation').fill('Struktur ringkas menunjukkan gugus karboksil.');
  await page.reload();
  await expect(page.locator('#observation')).toHaveValue(
    'Struktur ringkas menunjukkan gugus karboksil.',
  );
});

test('losing the graphics context reports the failure and a reload recovers', async ({ page }) => {
  await page.addInitScript(() => {
    for (const prototype of [
      HTMLCanvasElement.prototype,
      typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype,
    ].filter(Boolean)) {
      const original = prototype.getContext;
      prototype.getContext = function (type, ...args) {
        const context = original.call(this, type, ...args);
        if (/webgl/.test(type) && context) window.testMoleculeContext = context;
        return context;
      };
    }
  });
  await openModel(page);
  await expect(page.locator('.molecule-status')).toContainText('siap diamati');
  await page
    .frameLocator('.molecule-frame')
    .locator('canvas')
    .evaluate(() => {
      window.testMoleculeContext.getExtension('WEBGL_lose_context').loseContext();
    });
  await expect(page.locator('.molecule-status')).toContainText('Tampilan 3D terhenti');
  await expect(page.locator('.molecule-frame')).toHaveCount(0);
  await page.getByRole('button', { name: 'Muat ulang model', exact: true }).click();
  await expect(page.locator('.molecule-status')).toContainText('siap diamati');
  expect((await picture(page)).red).toBeGreaterThan(100);
});

test('the rendered model resizes on phones and remains accessible', async ({ page }) => {
  await openModel(page);
  await expect(page.locator('.molecule-status')).toContainText('siap diamati');
  await page.getByLabel('Molekul yang diamati').selectOption('311');
  await expect(page.locator('.molecule-status')).toContainText('21 atom');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      String(width),
    ).toBe(true);
    const rendered = await picture(page);
    expect(rendered.red, String(width)).toBeGreaterThan(100);
    expect(rendered.edge, `structure must fit completely at ${width}px`).toBe(0);
  }
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});
