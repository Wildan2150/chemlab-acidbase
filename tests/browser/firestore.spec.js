import { test, expect, prepareReturningVisitor } from './fixtures.js';
import { randomUUID } from 'node:crypto';

const password = 'Learning chemistry cloud 2026!';
const address = () => `firestore-${randomUUID()}@example.com`;
const synced = (page) =>
  expect(page.locator('.sync-status')).toContainText('Progres tersimpan di akun', {
    timeout: 20000,
  });
async function register(page, email) {
  await page.goto('/#daftar');
  const form = page.getByRole('form', { name: 'Pendaftaran akun' });
  await form.getByLabel('Nama tampilan', { exact: true }).fill('Pelajar Firestore');
  await form.getByLabel('Alamat email', { exact: true }).fill(email);
  await form.getByLabel('Kata sandi', { exact: true }).fill(password);
  await form.getByLabel('Konfirmasi kata sandi', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Buat akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await synced(page);
}
async function login(page, email) {
  await page.goto('/#masuk');
  const form = page.getByRole('form', { name: 'Masuk akun' });
  await form.getByLabel('Alamat email', { exact: true }).fill(email);
  await form.getByLabel('Kata sandi', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Masuk ke akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await synced(page);
}
const identity = (page) =>
  page.evaluate(async () => {
    const { firebaseAuth } = await import('/src/services/firebaseClient.js');
    return {
      uid: firebaseAuth.currentUser.uid,
      token: await firebaseAuth.currentUser.getIdToken(),
    };
  });
const endpoint = 'http://127.0.0.1:8080/v1/projects/demo-chemlab/databases/(default)/documents';
const cloud = async (request, uid) => {
  const response = await request.get(`${endpoint}/learningProgress/${uid}`, {
    headers: { Authorization: 'Bearer owner' },
  });
  expect(response.ok()).toBe(true);
  const data = await response.json();
  return JSON.parse(data.fields.payload.stringValue);
};

test('Firestore restores readings, diagnostic results, assessment snapshots and notes on a fresh device', async ({
  page,
  browser,
  request,
}) => {
  const email = address();
  await register(page, email);
  const { uid } = await identity(page);
  await page.goto('/#materi/kenali');
  await page.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
  await page.goto('/#laboratorium');
  await page.getByRole('button', { name: /Sari lemon/ }).click();
  await page.goto('/#kuis');
  for (const [i, choice] of [1, 2, 0, 3, 2].entries()) {
    await page.getByRole('radio').nth(choice).check();
    if (i < 4) await page.getByRole('button', { name: 'Selanjutnya', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
  await page.goto('/#eksplorasi/phet');
  await page.locator('#prediction').fill('Asam kuat terionisasi lebih banyak.');
  await page.locator('#observation').fill('Konsentrasi ion lebih besar.');
  await page.locator('#explanation').fill('Derajat ionisasi menentukan pH.');
  await page.getByRole('button', { name: 'Simpan catatan lengkap' }).click();
  await page.goto('/#asesmen');
  await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
  const answers = [2, 1, 0, 3, 2, 2, '2,40', '10.30', '3,00', '6.96', '1.70', 1, '4,58', 3, 0];
  for (const [index, value] of answers.entries()) {
    await page
      .getByRole('button', { name: new RegExp(`^Buka soal asesmen ${index + 1},`) })
      .click();
    if (typeof value === 'number') await page.getByRole('radio').nth(value).check();
    else await page.getByLabel('Jawaban pH', { exact: true }).fill(value);
  }
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Kumpulkan jawaban', exact: true })
    .click();
  await synced(page);
  const saved = await cloud(request, uid);
  expect(saved.attempts[0].score).toBe(100);
  expect(saved.assessment.attempts[0].score).toBe(100);
  expect(saved.assessment.attempts[0].form.questions).toHaveLength(15);
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:5175' });
  await prepareReturningVisitor(other);
  try {
    const fresh = await other.newPage();
    await login(fresh, email);
    await fresh.goto('/#materi/kenali');
    await expect(
      fresh.getByRole('button', { name: 'Sudah dipelajari', exact: true }),
    ).toBeDisabled();
    await fresh.goto('/#laboratorium');
    await expect(fresh.locator('#lab-ph')).toHaveValue('2');
    await fresh.goto('/#kuis');
    await expect(fresh.locator('.score-circle strong')).toHaveText('100');
    await fresh.goto('/#asesmen');
    await expect(fresh.locator('.assessment-result .score-circle strong')).toHaveText('100');
    await fresh.goto('/#eksplorasi/phet');
    await expect(fresh.locator('#prediction')).toHaveValue('Asam kuat terionisasi lebih banyak.');
    await fresh.reload();
    await synced(fresh);
    expect((await cloud(request, uid)).assessment.attempts[0].id).toBe(
      saved.assessment.attempts[0].id,
    );
  } finally {
    await other.close();
  }
});

test('offline edits merge with another device and an account reset is not undone by stale offline data', async ({
  page,
  context,
  browser,
  request,
}) => {
  const email = address();
  await register(page, email);
  const { uid } = await identity(page);
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:5175' });
  await prepareReturningVisitor(other);
  try {
    const fresh = await other.newPage();
    await login(fresh, email);
    await page.goto('/#kuis');
    await context.setOffline(true);
    await page.getByRole('radio').nth(1).check();
    await expect(page.locator('.sync-status')).toContainText('Belum tersinkron');
    await fresh.goto('/#materi/skala');
    await fresh.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
    await synced(fresh);
    await context.setOffline(false);
    await synced(page);
    let saved = await cloud(request, uid);
    expect(saved.completedLessons).toContain('skala');
    expect(saved.draft.answers.q1).toBe(1);
    await fresh.goto('/#kuis');
    await expect(fresh.getByRole('radio').nth(1)).toBeChecked();
    await context.setOffline(true);
    await page.getByRole('radio').nth(2).check();
    await fresh.goto('/#progres');
    await fresh.getByRole('button', { name: 'Reset progres' }).click();
    await fresh.getByRole('button', { name: 'Hapus & mulai ulang' }).click();
    await synced(fresh);
    await context.setOffline(false);
    await synced(page);
    await expect(page.getByRole('radio').nth(2)).not.toBeChecked();
    saved = await cloud(request, uid);
    expect(saved.completedLessons).toEqual([]);
    expect(saved.draft.answers).toEqual({});
  } finally {
    await context.setOffline(false);
    await other.close();
  }
});

test('Firestore rules reject guest access, another owner, listing, invalid writes and resurrection after deletion', async ({
  page,
  browser,
  request,
}) => {
  await register(page, address());
  const first = await identity(page);
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:5175' });
  await prepareReturningVisitor(other);
  try {
    const fresh = await other.newPage();
    await register(fresh, address());
    const second = await identity(fresh);
    const own = `${endpoint}/learningProgress/${first.uid}`;
    expect(
      (await request.get(own, { headers: { Authorization: `Bearer ${first.token}` } })).status(),
    ).toBe(200);
    expect((await request.get(own)).status()).toBe(403);
    expect(
      (await request.get(own, { headers: { Authorization: `Bearer ${second.token}` } })).status(),
    ).toBe(403);
    expect(
      (
        await request.get(`${endpoint}/learningProgress`, {
          headers: { Authorization: `Bearer ${first.token}` },
        })
      ).status(),
    ).toBe(403);
    const raw = await (
      await request.get(own, { headers: { Authorization: 'Bearer owner' } })
    ).json();
    const fields = structuredClone(raw.fields);
    fields.revision.integerValue = String(Number(fields.revision.integerValue) + 1);
    delete fields.updatedAt;
    const write = (token, extras = {}) =>
      request.post(`${endpoint}:commit`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          writes: [
            {
              update: { name: raw.name, fields: { ...fields, ...extras } },
              updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
            },
          ],
        },
      });
    expect((await write(second.token)).status()).toBe(403);
    expect((await write(first.token, { role: { stringValue: 'admin' } })).status()).toBe(403);
    await page.goto('/#akun');
    await page.getByRole('button', { name: 'Data & akun', exact: true }).click();
    const deletion = page.getByRole('form', { name: 'Hapus akun', exact: true });
    await deletion.getByLabel('Kata sandi untuk menghapus akun', { exact: true }).fill(password);
    await deletion.getByRole('checkbox').check();
    await deletion.getByRole('button', { name: 'Hapus akun saya' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Hapus akun permanen', exact: true })
      .click();
    await expect(page.getByRole('heading', { name: 'Halo, penjelajah kimia.' })).toBeVisible();
    const deleted = await (
      await request.get(own, { headers: { Authorization: 'Bearer owner' } })
    ).json();
    expect(deleted.fields.deleted.booleanValue).toBe(true);
    expect(deleted.fields.payload.nullValue).toBe(null);
    fields.revision.integerValue = String(Number(deleted.fields.revision.integerValue) + 1);
    expect((await write(first.token)).status()).toBe(403);
    await expect(fresh.locator('.sync-status')).toContainText('Progres tersimpan di akun');
  } finally {
    await other.close();
  }
});
