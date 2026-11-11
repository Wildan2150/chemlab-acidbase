import { test, expect, prepareReturningVisitor } from './fixtures.js';
import AxeBuilder from '@axe-core/playwright';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test.describe.configure({ mode: 'serial' });
const teacherEmail = 'wildannashihin@gmail.com';
const password = 'Teacher learning chemistry 2026!';
const prefix = `Panel ${randomUUID().slice(0, 6)}`;
const authAdmin = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-chemlab';
const database = 'http://127.0.0.1:8080/v1/projects/demo-chemlab/databases/(default)/documents';
const synced = (page) =>
  expect(page.locator('.sync-status')).toContainText('Progres tersimpan di akun', {
    timeout: 15000,
  });
const identity = (page) =>
  page.evaluate(async () => {
    const { firebaseAuth } = await import('/src/services/firebaseClient.js');
    return {
      uid: firebaseAuth.currentUser.uid,
      token: await firebaseAuth.currentUser.getIdToken(),
    };
  });
async function register(page, email, name) {
  await page.goto('/#daftar');
  const form = page.getByRole('form', { name: 'Pendaftaran akun' });
  await form.getByLabel('Nama tampilan', { exact: true }).fill(name);
  await form.getByLabel('Alamat email', { exact: true }).fill(email);
  await form.getByLabel('Kata sandi', { exact: true }).fill(password);
  await form.getByLabel('Konfirmasi kata sandi', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Buat akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await synced(page);
}
async function login(page, email = teacherEmail) {
  await page.goto('/#masuk');
  const form = page.getByRole('form', { name: 'Masuk akun' });
  await form.getByLabel('Alamat email', { exact: true }).fill(email);
  await form.getByLabel('Kata sandi', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Masuk ke akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await synced(page);
}
async function openPanel(page) {
  await page.goto('/#guru');
  await expect(page.getByRole('heading', { name: 'Hasil per siswa' })).toBeVisible({
    timeout: 15000,
  });
}
async function completeQuiz(page, choices) {
  await page.goto('/#kuis');
  for (const [index, value] of choices.entries()) {
    await page.getByRole('radio').nth(value).check();
    if (index < 4) await page.getByRole('button', { name: 'Selanjutnya', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Selesaikan kuis' }).click();
  await synced(page);
}

test.beforeAll(async ({ request }) => {
  // Reset only the reserved teacher fixture on the local demo project, never all users.
  const response = await request.post(`${authAdmin}/accounts:lookup`, {
    headers: { Authorization: 'Bearer owner' },
    data: { email: [teacherEmail] },
  });
  expect(response.ok()).toBe(true);
  for (const user of (await response.json()).users || []) {
    const deleted = await request.post(`${authAdmin}/accounts:delete`, {
      headers: { Authorization: 'Bearer owner' },
      data: { localId: user.localId },
    });
    expect(deleted.ok()).toBe(true);
  }
});

test('only the designated verified teacher can list students and the teacher cannot write another account results', async ({
  page,
  browser,
  request,
}) => {
  await page.goto('/#guru');
  await expect(page.getByRole('heading', { name: 'Masuk sebagai guru' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Panel guru', exact: true })).toHaveCount(0);
  await register(page, teacherEmail, 'Guru Kimia');
  const unverified = await identity(page);
  await page.goto('/#guru');
  await expect(page.getByRole('heading', { name: 'Verifikasi akun guru' })).toBeVisible();
  expect(
    (
      await request.get(`${database}/learningProgress`, {
        headers: { Authorization: `Bearer ${unverified.token}` },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.get(`${database}/learnerProfiles`, {
        headers: { Authorization: `Bearer ${unverified.token}` },
      })
    ).status(),
  ).toBe(403);
  await page.goto('/#akun');
  await page.getByRole('button', { name: 'Kirim verifikasi email', exact: true }).click();
  let code;
  await expect
    .poll(async () => {
      const body = await (
        await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-chemlab/oobCodes')
      ).json();
      code = body.oobCodes?.findLast(
        (value) => value.email === teacherEmail && value.requestType === 'VERIFY_EMAIL',
      );
      return !!code;
    })
    .toBe(true);
  await page.goto(`/#tindakan-akun?mode=verifyEmail&oobCode=${encodeURIComponent(code.oobCode)}`);
  await page.getByRole('button', { name: 'Konfirmasi email', exact: true }).click();
  await expect(page.locator('.auth-success')).toContainText('berhasil dikonfirmasi');
  await expect(page.getByRole('link', { name: 'Panel guru', exact: true })).toBeVisible();
  await openPanel(page);
  const teacher = await identity(page);
  expect(
    (
      await request.get(`${database}/learningProgress`, {
        headers: { Authorization: `Bearer ${teacher.token}` },
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await request.get(`${database}/learnerProfiles`, {
        headers: { Authorization: `Bearer ${teacher.token}` },
      })
    ).status(),
  ).toBe(200);
  const other = await browser.newContext({ baseURL: 'http://127.0.0.1:5175' });
  await prepareReturningVisitor(other);
  try {
    const student = await other.newPage();
    await register(student, `role-${randomUUID()}@example.com`, teacherEmail);
    const learner = await identity(student);
    await student.goto('/#guru');
    await expect(student.getByRole('heading', { name: 'Akses khusus guru' })).toBeVisible();
    expect(
      (
        await request.get(`${database}/learningProgress`, {
          headers: { Authorization: `Bearer ${learner.token}` },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await request.get(`${database}/learnerProfiles/${teacher.uid}`, {
          headers: { Authorization: `Bearer ${learner.token}` },
        })
      ).status(),
    ).toBe(403);
    const raw = await (
      await request.get(`${database}/learningProgress/${learner.uid}`, {
        headers: { Authorization: 'Bearer owner' },
      })
    ).json();
    const fields = structuredClone(raw.fields);
    fields.revision.integerValue = String(Number(fields.revision.integerValue) + 1);
    delete fields.updatedAt;
    const write = (token, name, data) =>
      request.post(`${database}:commit`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          writes: [
            {
              update: { name, fields: data },
              updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
            },
          ],
        },
      });
    expect((await write(teacher.token, raw.name, fields)).status()).toBe(403);
    const profileName = raw.name.replace('/learningProgress/', '/learnerProfiles/');
    const profile = {
      displayName: { stringValue: 'Guru palsu' },
      email: { stringValue: teacherEmail },
    };
    expect((await write(learner.token, profileName, profile)).status()).toBe(403);
    expect(
      (
        await write(learner.token, profileName, {
          ...profile,
          email: { stringValue: 'ordinary@example.com' },
          role: { stringValue: 'teacher' },
        })
      ).status(),
    ).toBe(403);
    await student.evaluate(() => {
      localStorage.setItem('role', 'teacher');
      localStorage.setItem('email', 'wildannashihin@gmail.com');
    });
    await student.reload();
    await expect(student.getByRole('heading', { name: 'Akses khusus guru' })).toBeVisible();
    await expect(student.locator('.student-results')).toHaveCount(0);
  } finally {
    await other.close();
  }
});

test('teacher sees live student results, snapshots, notes, filters and matching JSON/CSV exports', async ({
  page,
  browser,
}) => {
  const contexts = [];
  try {
    const learnerPages = [];
    for (const name of ['Nadia', 'Raka', 'Sinta']) {
      const context = await browser.newContext({ baseURL: 'http://127.0.0.1:5175' });
      await prepareReturningVisitor(context);
      contexts.push(context);
      const learner = await context.newPage();
      learnerPages.push(learner);
      await register(learner, `panel-${randomUUID()}@example.com`, `${prefix} ${name}`);
    }
    const [nadia, raka] = learnerPages;
    await completeQuiz(nadia, [1, 2, 0, 3, 2]);
    await nadia.getByRole('button', { name: 'Mulai latihan baru' }).click();
    await completeQuiz(nadia, [0, 0, 0, 0, 0]);
    await completeQuiz(raka, [0, 0, 0, 0, 0]);
    await nadia.goto('/#eksplorasi/phet');
    await nadia.locator('#prediction').fill('Asam kuat lebih banyak terionisasi.');
    await nadia.locator('#observation').fill('HCl menunjukkan pH lebih rendah.');
    await nadia.locator('#explanation').fill('Ionisasi menghasilkan lebih banyak ion hidronium.');
    await nadia.getByRole('button', { name: 'Simpan catatan lengkap' }).click();
    await nadia.goto('/#asesmen');
    await nadia.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
    const answers = [2, 1, 0, 3, 2, 2, '2,40', '10.30', '3,00', '6.96', '1.70', 1, '4,58', 3, 0];
    for (const [index, value] of answers.entries()) {
      await nadia
        .getByRole('button', { name: new RegExp(`^Buka soal asesmen ${index + 1},`) })
        .click();
      if (typeof value === 'number') await nadia.getByRole('radio').nth(value).check();
      else await nadia.getByLabel('Jawaban pH', { exact: true }).fill(value);
    }
    await nadia.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
    await nadia.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
    await nadia
      .getByRole('dialog')
      .getByRole('button', { name: 'Kumpulkan jawaban', exact: true })
      .click();
    await synced(nadia);
    await login(page);
    await openPanel(page);
    await page.getByRole('textbox', { name: 'Cari siswa' }).fill(prefix);
    await expect(page.locator('tbody tr')).toHaveCount(3);
    const nadiaRow = page.locator('tbody tr').filter({ hasText: `${prefix} Nadia` });
    await expect(nadiaRow).toContainText('100 / 100');
    const rakaRow = page.locator('tbody tr').filter({ hasText: `${prefix} Raka` });
    await expect(rakaRow).toContainText('20 / 100');
    await raka.goto('/#materi/kenali');
    await raka.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
    await synced(raka);
    await expect(rakaRow).toContainText('1 / 3');
    await page.getByLabel('Filter hasil siswa').selectOption('review');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr')).toContainText('Raka');
    const jsonDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Ekspor JSON' }).click();
    const json = JSON.parse(await readFile(await (await jsonDownload).path(), 'utf8'));
    expect(json.type).toBe('hasil-belajar-siswa');
    expect(json.students).toHaveLength(1);
    expect(json.students[0].diagnostic.score).toBe(20);
    const csvDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Ekspor CSV' }).click();
    expect(await readFile(await (await csvDownload).path(), 'utf8')).toContain(`${prefix} Raka`);
    await page.getByLabel('Filter hasil siswa').selectOption('missing');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr')).toContainText('Sinta');
    await page.getByLabel('Filter hasil siswa').selectOption('all');
    await page.getByLabel('Jenis hasil').selectOption('assessment');
    await page.getByRole('button', { name: `Rincian ${prefix} Nadia`, exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.assessment-review .review-item')).toHaveCount(15);
    await expect(dialog.locator('.teacher-notes')).toContainText(
      'Asam kuat lebih banyak terionisasi.',
    );
    await dialog.getByLabel('Percobaan yang ditinjau').selectOption({ index: 0 });
    await expect(dialog.locator('.answer-review .review-item')).toHaveCount(5);
    await expect(dialog).toContainText('Skor 100/100');
    await dialog.getByLabel('Percobaan yang ditinjau').selectOption({ index: 1 });
    await expect(dialog).toContainText('Skor 20/100');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  } finally {
    for (const context of contexts) await context.close();
  }
});

test('teacher dashboard and details fit phones, pass automated accessibility and disappear after logout', async ({
  page,
}) => {
  await login(page);
  await openPanel(page);
  await page.getByRole('textbox', { name: 'Cari siswa' }).fill(prefix);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `width ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const check = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  };
  await check();
  await page.getByRole('button', { name: `Rincian ${prefix} Nadia`, exact: true }).click();
  await check();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
    document.querySelector('.table-scroll').scrollLeft = 0;
  });
  await page.screenshot({
    path: 'docs/preview-teacher.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector('.table-scroll').scrollLeft = 0;
  });
  await page.screenshot({
    path: 'docs/preview-teacher-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.goto('/#akun');
  await page.getByRole('button', { name: 'Keluar dari akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selamat datang kembali.' })).toBeVisible();
  await page.goto('/#guru');
  await expect(page.getByRole('heading', { name: 'Masuk sebagai guru' })).toBeVisible();
  await expect(page.locator('.student-results')).toHaveCount(0);
});
