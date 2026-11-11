import { test, expect } from './fixtures.js';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { createAssessmentDraft, makeAssessmentAttempt } from '../../src/lib/chapterAssessment.js';

const storageKey = 'chemlab:guest:v1';
const answers = [2, 1, 0, 3, 2, 2, '2,40', '10.30', '3,00', '6.96', '1.70', 1, '4,58', 3, 0];
const questionIds = [
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
];
const saved = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
async function begin(page) {
  await page.goto('/#asesmen');
  await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
}
async function fillQuestions(page, values = answers) {
  for (let index = 0; index < values.length; index++) {
    await page
      .getByRole('button', { name: new RegExp(`^Buka soal asesmen ${index + 1},`) })
      .click();
    if (typeof values[index] === 'number') await page.getByRole('radio').nth(values[index]).check();
    else await page.getByLabel('Jawaban pH', { exact: true }).fill(values[index]);
  }
}
async function submit(page) {
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Kumpulkan jawaban', exact: true })
    .click();
}

test('assessment resumes drafts, freezes results, separates retries and exports the saved instrument', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(0).check();
  await begin(page);
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: /^Buka soal asesmen 7,/ }).click();
  await page.getByLabel('Jawaban pH', { exact: true }).fill('2,40');
  await expect.poll(async () => (await saved(page)).assessment.draft.answers.b2).toBe('2,40');
  const firstId = (await saved(page)).assessment.draft.id;
  await page.reload();
  await expect(page.getByLabel('Jawaban pH', { exact: true })).toHaveValue('2,40');
  expect((await saved(page)).assessment.draft.id).toBe(firstId);
  await expect(page.locator('.assessment-review')).toHaveCount(0);
  await fillQuestions(page);
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await expect(page.locator('.submission-row')).toHaveCount(15);
  await expect(page.locator('.assessment-review')).toHaveCount(0);
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Periksa lagi', exact: true }).click();
  expect((await saved(page)).assessment.attempts).toHaveLength(0);
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Kumpulkan jawaban', exact: true })
    .click();
  await expect(page.locator('.assessment-result .score-circle strong')).toHaveText('100');
  await expect(page.locator('.assessment-review .review-item')).toHaveCount(15);
  await page.reload();
  await expect(page.locator('.assessment-result .score-circle strong')).toHaveText('100');
  expect((await saved(page)).draft.answers.q1).toBe(0);
  expect((await saved(page)).attempts).toHaveLength(0);
  await page.getByRole('button', { name: 'Mulai percobaan baru', exact: true }).click();
  expect((await saved(page)).assessment.draft.id).not.toBe(firstId);
  await fillQuestions(
    page,
    answers.map((answer) => (typeof answer === 'number' ? 0 : '0')),
  );
  await submit(page);
  await expect(page.locator('.assessment-result .score-circle strong')).toHaveText('13');
  const data = await saved(page);
  expect(data.assessment.attempts).toHaveLength(2);
  expect(data.assessment.attempts[0].score).toBe(100);
  expect(data.assessment.attempts[0].id).toBe(firstId);
  await page.goto('/#progres');
  await expect(page.locator('.assessment-history-list>a')).toHaveCount(2);
  await page.goto(`/#asesmen/${firstId}`);
  await expect(page.locator('.assessment-result .score-circle strong')).toHaveText('100');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Ekspor hasil', exact: true }).click();
  const file = await download;
  const exported = JSON.parse(await readFile(await file.path(), 'utf8'));
  expect(exported.attempt.form.questions).toHaveLength(15);
  expect(exported.attempt.id).toBe(firstId);
  expect(exported.attempt.score).toBe(100);
  expect(errors).toEqual([]);
});

test('incomplete and malformed numeric answers cannot be submitted; zero remains a valid answer', async ({
  page,
}) => {
  await begin(page);
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await expect(page.locator('.form-message')).toContainText('15 jawaban');
  await fillQuestions(page);
  await page.getByRole('button', { name: /^Buka soal asesmen 7,/ }).click();
  await page.getByLabel('Jawaban pH', { exact: true }).fill('2 pH');
  await expect(page.getByLabel('Jawaban pH', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await page.getByRole('button', { name: 'Kumpulkan asesmen', exact: true }).click();
  await expect(page.locator('.form-message')).toContainText('1 jawaban');
  expect((await saved(page)).assessment.attempts).toHaveLength(0);
  await page.getByLabel('Jawaban pH', { exact: true }).fill('0');
  await submit(page);
  await expect(page.locator('.assessment-result .score-circle strong')).toHaveText('93');
});

test('legacy and damaged assessment data preserve readings and diagnostic drafts; reset requires confirmation', async ({
  page,
}) => {
  await page.goto('/#materi/kenali');
  await page.getByRole('button', { name: 'Tandai sudah dipelajari' }).click();
  await page.goto('/#kuis');
  await page.getByRole('radio').nth(1).check();
  await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    delete data.assessment;
    localStorage.setItem(key, JSON.stringify(data));
  }, storageKey);
  await page.reload();
  expect((await saved(page)).completedLessons).toEqual(['kenali']);
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    data.assessment = { draft: { version: 'old-format' }, attempts: [] };
    localStorage.setItem(key, JSON.stringify(data));
  }, storageKey);
  await page.reload();
  await expect(page.locator('.storage-warning')).toContainText('Sebagian data asesmen');
  expect((await saved(page)).completedLessons).toEqual(['kenali']);
  await begin(page);
  await page.getByRole('radio').nth(2).check();
  await page.goto('/#progres');
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await expect(page.getByRole('dialog')).toContainText('asesmen akhir bab');
  await page.getByRole('button', { name: 'Batal', exact: true }).click();
  expect((await saved(page)).assessment.draft).not.toBeNull();
  await page.getByRole('button', { name: 'Reset progres' }).click();
  await page.getByRole('button', { name: 'Hapus & mulai ulang' }).click();
  expect((await saved(page)).assessment).toEqual({ draft: null, attempts: [] });
  expect((await saved(page)).completedLessons).toEqual([]);
});

test('assessment landing, numeric input, review and result stay accessible and fit phone widths', async ({
  page,
}) => {
  await page.goto('/#asesmen');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: 'docs/preview-assessment.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: 'docs/preview-assessment-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  async function check(stage) {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      stage,
    ).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      stage,
    ).toBe(true);
  }
  await check('landing');
  await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click();
  await check('choice');
  await page.getByRole('button', { name: /^Buka soal asesmen 7,/ }).click();
  await page.getByLabel('Jawaban pH', { exact: true }).fill('2,40');
  await check('numeric');
  await page.getByRole('button', { name: 'Tinjau semua jawaban', exact: true }).click();
  await check('review');
  const draft = createAssessmentDraft();
  draft.answers = Object.fromEntries(questionIds.map((id, index) => [id, answers[index]]));
  draft.answers.a1 = 0;
  const attempt = makeAssessmentAttempt(draft);
  await page.evaluate(
    ({ key, draft, attempt }) => {
      const data = JSON.parse(localStorage.getItem(key));
      data.assessment = { draft, attempts: [attempt] };
      localStorage.setItem(key, JSON.stringify(data));
    },
    { key: storageKey, draft, attempt },
  );
  await page.reload();
  await check('results');
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `results ${width}`,
    ).toBe(true);
  }
});
