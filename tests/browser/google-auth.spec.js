import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { randomUUID } from 'node:crypto';

const email = () => `google-${randomUUID()}@example.com`;
async function logout(page) {
  await page.goto('/#akun');
  await page.getByRole('button', { name: 'Keluar dari akun', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selamat datang kembali.' })).toBeVisible();
}
async function googlePopup(
  page,
  trigger = page.getByRole('button', { name: 'Lanjutkan dengan Google', exact: true }),
) {
  const opening = page.waitForEvent('popup');
  await trigger.click();
  const popup = await opening;
  await expect(popup).toHaveURL(/127\.0\.0\.1:9099\/emulator\/auth\/handler/);
  await popup.waitForLoadState('load');
  return popup;
}
async function chooseGoogle(popup, address, create = false) {
  if (create) {
    await popup.getByRole('button', { name: 'Add new account' }).click();
    await popup.locator('#email-input').fill(address);
    await popup.locator('#display-name-input').fill('Pelajar Google');
    await popup.locator('#sign-in').click();
  } else {
    await popup.getByText(address, { exact: true }).click();
  }
}

test('Google signup and returning login keep the same learner, remembered session and separate guest progress', async ({
  page,
  context,
}) => {
  const address = email();
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(0).check();
  await page.goto('/#daftar');
  await page.getByLabel('Ingat saya di perangkat ini').check();
  await chooseGoogle(await googlePopup(page), address, true);
  await expect(page.getByRole('heading', { name: 'Akun belajarmu.' })).toBeVisible();
  await expect(page.locator('.account-summary')).toContainText(address);
  await expect(page.locator('.account-summary')).toContainText('Masuk dengan Google');
  await expect(page.locator('.account-verification')).toContainText('Email terverifikasi');
  await expect(page.getByRole('form', { name: 'Ubah email' })).toHaveCount(0);
  const profile = page.getByRole('form', { name: 'Ubah profil' });
  await profile.getByLabel('Nama tampilan', { exact: true }).fill('Penjelajah Google');
  await profile.getByRole('button', { name: 'Simpan profil' }).click();
  await expect(page.locator('.account-summary')).toContainText('Penjelajah Google');

  const anotherTab = await context.newPage();
  await anotherTab.goto('/#akun');
  await expect(anotherTab.locator('.account-summary')).toContainText(address);
  await anotherTab.close();

  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(0)).not.toBeChecked();
  await page.getByRole('radio').nth(1).check();
  const keys = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) => key.startsWith('chemlab:user:')),
  );
  expect(keys).toHaveLength(1);
  await page.reload();
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await logout(page);
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(0)).toBeChecked();
  await page.goto('/#masuk');
  await chooseGoogle(await googlePopup(page), address);
  await expect(page.locator('.account-summary')).toContainText(address);
  await page.goto('/#kuis');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('chemlab:user:')),
    ),
  ).toEqual(keys);
  await page.goto('/#akun');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ['Profil & email', 'Kata sandi', 'Data & akun']) {
    await page.getByRole('button', { name: tab, exact: true }).click();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.getByRole('button', { name: 'Kata sandi', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Buka keamanan Google' })).toHaveAttribute(
    'href',
    'https://myaccount.google.com/security',
  );
  await expect(page.getByRole('form', { name: 'Ubah kata sandi' })).toHaveCount(0);
});

test('Google deletion requires the matching identity, survives cancellation and removes only that learner', async ({
  page,
  context,
  request,
}) => {
  const address = email();
  await page.goto('/#masuk');
  await chooseGoogle(await googlePopup(page), address, true);
  await expect(page.locator('.account-summary')).toContainText(address);
  const sessionTab = await context.newPage();
  await sessionTab.goto('/#masuk');
  await expect(sessionTab.getByRole('heading', { name: 'Selamat datang kembali.' })).toBeVisible();
  await sessionTab.close();
  const keys = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) => key.startsWith('chemlab:user:')),
  );
  expect(keys).toHaveLength(1);
  await page.getByRole('button', { name: 'Data & akun', exact: true }).click();
  const deletion = page.getByRole('form', { name: 'Hapus akun', exact: true });
  await expect(deletion.locator('input[type="password"]')).toHaveCount(0);
  await deletion.getByRole('checkbox').check();
  async function confirmDeletion() {
    await deletion.getByRole('button', { name: 'Hapus akun saya', exact: true }).click();
    return googlePopup(
      page,
      page.getByRole('dialog').getByRole('button', { name: 'Hapus akun permanen', exact: true }),
    );
  }
  await chooseGoogle(await confirmDeletion(), email(), true);
  await expect(page.getByRole('alert')).toContainText('Pilih akun Google yang sama');
  await expect(page.locator('.account-summary')).toContainText(address);
  const popup = await confirmDeletion();
  await popup.close();
  await expect(page.getByRole('alert')).toContainText('Jendela Google ditutup', { timeout: 15000 });
  await expect(page.locator('.account-summary')).toContainText(address);
  await chooseGoogle(await confirmDeletion(), address);
  await expect(page.getByRole('heading', { name: 'Halo, penjelajah kimia.' })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), keys[0])).toBeNull();
  const response = await request.get(
    'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/demo-chemlab/accounts:batchGet',
    { headers: { Authorization: 'Bearer owner' } },
  );
  expect(response.ok()).toBe(true);
  const { users = [] } = await response.json();
  expect(users.some((user) => user.email === address)).toBe(false);
});

test('Google sign-in cancellation and blocked popups allow another attempt without an account session', async ({
  page,
}) => {
  await page.goto('/#masuk');
  const popup = await googlePopup(page);
  await popup.close();
  await expect(page.locator('.auth-success')).toContainText('Masuk dengan Google dibatalkan', {
    timeout: 15000,
  });
  await expect(
    page.getByRole('button', { name: 'Lanjutkan dengan Google', exact: true }),
  ).toBeEnabled();
  await page.evaluate(() => {
    window.open = () => null;
  });
  await page.getByRole('button', { name: 'Lanjutkan dengan Google', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Izinkan pop-up');
  await expect(page.getByRole('heading', { name: 'Selamat datang kembali.' })).toBeVisible();
  await page.reload();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole('button', { name: 'Lanjutkan dengan Google', exact: true }),
  ).toBeEnabled();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
