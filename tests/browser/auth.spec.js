import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { randomUUID } from 'node:crypto';

const password = 'Learning chemistry 2026!';
const nextPassword = 'New learning phrase 2026!';
const email = () => `chemlab-${randomUUID()}@example.com`;
async function register(page, address, name = 'Pelajar Kimia') {
  await page.goto('/#daftar');
  const form = page.getByRole('form', { name: 'Pendaftaran akun' });
  await form.getByLabel('Nama tampilan', { exact: true }).fill(name);
  await form.getByLabel('Alamat email', { exact: true }).fill(address);
  await form.getByLabel('Kata sandi', { exact: true }).fill(password);
  await form.getByLabel('Konfirmasi kata sandi', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Buat akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await expect(page.locator('.account-summary')).toContainText(name);
}
async function login(page, address, pass = password) {
  await page.goto('/#masuk');
  const form = page.getByRole('form', { name: 'Masuk akun' });
  await form.getByLabel('Alamat email', { exact: true }).fill(address);
  await form.getByLabel('Kata sandi', { exact: true }).fill(pass);
  await form.getByRole('button', { name: 'Masuk ke akun', exact: true }).click();
}
async function logout(page) {
  await page.goto('/#akun');
  await page.getByRole('button', { name: 'Keluar dari akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selamat datang kembali.' })).toBeVisible();
}
async function actionCode(request, address, type) {
  let found;
  await expect
    .poll(async () => {
      const response = await request.get(
        'http://127.0.0.1:9099/emulator/v1/projects/demo-chemlab/oobCodes',
      );
      const { oobCodes = [] } = await response.json();
      found = oobCodes.findLast(
        (code) =>
          (type === 'VERIFY_AND_CHANGE_EMAIL'
            ? code.newEmail === address
            : code.email === address) && code.requestType === type,
      );
      return Boolean(found);
    })
    .toBe(true);
  return found.oobCode;
}
async function verify(page, request, address) {
  await page.getByRole('button', { name: 'Kirim verifikasi email', exact: true }).click();
  const code = await actionCode(request, address, 'VERIFY_EMAIL');
  await page.goto(`/#tindakan-akun?mode=verifyEmail&oobCode=${encodeURIComponent(code)}`);
  await page.getByRole('button', { name: 'Konfirmasi email', exact: true }).click();
  await expect(page.locator('.auth-success')).toContainText('berhasil dikonfirmasi');
  await page.goto('/#akun');
  await expect(page.locator('.account-verification')).toContainText('Email terverifikasi');
}

test('Firebase lifecycle: register, verify, persist, profile, password, login and confirmed account deletion', async ({
  page,
  request,
}) => {
  const address = email();
  await register(page, address);
  await verify(page, request, address);
  await page.reload();
  await expect(page.locator('.account-summary')).toContainText(address);
  const profile = page.getByRole('form', { name: 'Ubah profil' });
  await profile.getByLabel('Nama tampilan', { exact: true }).fill('Pelajar Mandiri');
  await profile.getByRole('button', { name: 'Simpan profil' }).click();
  await expect(page.locator('.account-summary')).toContainText('Pelajar Mandiri');
  await page.getByRole('button', { name: 'Kata sandi', exact: true }).click();
  const form = page.getByRole('form', { name: 'Ubah kata sandi' });
  await form.getByLabel('Kata sandi saat ini', { exact: true }).fill(password);
  await form.getByLabel('Kata sandi baru', { exact: true }).fill(nextPassword);
  await form.getByLabel('Konfirmasi kata sandi baru', { exact: true }).fill(nextPassword);
  await form.getByRole('button', { name: 'Simpan kata sandi' }).click();
  await expect(page.locator('.auth-success')).toContainText('Kata sandi berhasil diperbarui');
  await logout(page);
  await login(page, address, password);
  await expect(page.getByRole('alert')).toContainText('tidak sesuai');
  await login(page, address, nextPassword);
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await page.getByRole('button', { name: 'Data & akun', exact: true }).click();
  const deletion = page.getByRole('form', { name: 'Hapus akun', exact: true });
  await deletion.getByLabel('Kata sandi untuk menghapus akun', { exact: true }).fill(nextPassword);
  await deletion.getByRole('checkbox').check();
  await deletion.getByRole('button', { name: 'Hapus akun saya' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Batal', exact: true }).click();
  await expect(page.locator('.account-summary')).toContainText(address);
  await deletion.getByLabel('Kata sandi untuk menghapus akun', { exact: true }).fill(nextPassword);
  await deletion.getByRole('button', { name: 'Hapus akun saya' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Hapus akun permanen', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Halo, penjelajah kimia.' })).toBeVisible();
  await login(page, address, nextPassword);
  await expect(page.getByRole('alert')).toContainText('tidak sesuai');
});

test('password recovery consumes a real emulator action code once', async ({ page, request }) => {
  const address = email();
  await register(page, address);
  await logout(page);
  await page.goto('/#lupa-password');
  await page.getByLabel('Alamat email', { exact: true }).fill(address);
  await page.getByRole('button', { name: 'Kirim petunjuk pemulihan' }).click();
  await expect(page.locator('.auth-success')).toContainText('Jika alamat tersebut terdaftar');
  const code = await actionCode(request, address, 'PASSWORD_RESET');
  const url = `/#tindakan-akun?mode=resetPassword&oobCode=${encodeURIComponent(code)}`;
  await page.goto(url);
  await page.getByLabel('Kata sandi baru', { exact: true }).fill(nextPassword);
  await page.getByLabel('Konfirmasi kata sandi baru', { exact: true }).fill(nextPassword);
  await page.getByRole('button', { name: 'Simpan kata sandi baru', exact: true }).click();
  await expect(page.locator('.auth-success')).toContainText('berhasil diperbarui');
  await login(page, address, nextPassword);
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await page.goto(url);
  await expect(page.getByRole('alert')).toContainText(/Tautan/);
});

test('new email requires password confirmation and verification before account identity changes', async ({
  page,
  request,
}) => {
  const address = email(),
    updated = email();
  await register(page, address);
  await verify(page, request, address);
  const form = page.getByRole('form', { name: 'Ubah email' });
  await form.getByLabel('Alamat email baru').fill(updated);
  await form.getByLabel('Kata sandi saat ini', { exact: true }).fill(password);
  await form.getByRole('button', { name: 'Verifikasi email baru' }).click();
  await expect(page.locator('.auth-success')).toContainText('Selesaikan verifikasi');
  await expect(page.locator('.account-summary')).toContainText(address);
  const code = await actionCode(request, updated, 'VERIFY_AND_CHANGE_EMAIL');
  await page.goto(`/#tindakan-akun?mode=verifyAndChangeEmail&oobCode=${encodeURIComponent(code)}`);
  await page.getByRole('button', { name: 'Konfirmasi email', exact: true }).click();
  await expect(page.locator('.auth-success')).toContainText('berhasil dikonfirmasi');
  await page.goto('/#akun');
  await expect(page.locator('.account-summary')).toContainText(updated);
});

test('guest and two accounts keep separate drafts; authentication forms remain accessible on phones', async ({
  page,
}) => {
  const first = email(),
    second = email();
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(0).check();
  await register(page, first, 'Pelajar Pertama');
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(0)).not.toBeChecked();
  await page.getByRole('radio').nth(1).check();
  await logout(page);
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(0)).toBeChecked();
  await register(page, second, 'Pelajar Kedua');
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(1)).not.toBeChecked();
  await logout(page);
  await login(page, first);
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.goto('/#akun');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ['Profil & email', 'Kata sandi', 'Data & akun']) {
    await page.getByRole('button', { name: tab, exact: true }).click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      tab,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await logout(page);
  for (const route of ['masuk', 'daftar', 'lupa-password']) {
    await page.goto(`/#${route}`);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      route,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('integrated assessment and exploration drafts survive account changes and reset only the active account', async ({
  page,
}) => {
  async function recordLearning(prediction, choice) {
    await page.goto('/#materi/kenali');
    await page.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
    await page.goto('/#eksplorasi/phet');
    await page.locator('#prediction').fill(prediction);
    await page.goto('/#asesmen');
    await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
    await page.getByRole('radio').nth(choice).check();
  }
  async function expectLearning(prediction, choice) {
    await page.goto('/#eksplorasi/phet');
    await expect(page.locator('#prediction')).toHaveValue(prediction);
    await page.goto('/#asesmen');
    await expect(page.getByRole('radio').nth(choice)).toBeChecked();
    await page.goto('/#materi/kenali');
    await expect(
      page.getByRole('button', { name: 'Sudah dipelajari', exact: true }),
    ).toBeDisabled();
  }
  await recordLearning('Prediksi milik tamu.', 0);
  const first = email();
  await register(page, first, 'Pelajar Integrasi');
  await recordLearning('Prediksi milik akun pertama.', 2);
  await page.reload();
  await expectLearning('Prediksi milik akun pertama.', 2);
  await logout(page);
  await expectLearning('Prediksi milik tamu.', 0);
  await register(page, email(), 'Pelajar Lain');
  await page.goto('/#eksplorasi/phet');
  await expect(page.locator('#prediction')).toHaveValue('');
  await page.goto('/#asesmen');
  await expect(page.getByRole('button', { name: 'Mulai asesmen', exact: true })).toBeVisible();
  await logout(page);
  await login(page, first);
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await expectLearning('Prediksi milik akun pertama.', 2);
  await page.goto('/#progres');
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await page.getByRole('button', { name: 'Hapus & mulai ulang' }).click();
  await page.reload();
  await page.goto('/#eksplorasi/phet');
  await expect(page.locator('#prediction')).toHaveValue('');
  await page.goto('/#asesmen');
  await expect(page.getByRole('button', { name: 'Mulai asesmen', exact: true })).toBeVisible();
  await logout(page);
  await expectLearning('Prediksi milik tamu.', 0);
});
