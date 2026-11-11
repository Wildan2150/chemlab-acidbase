import { test as base } from '@playwright/test';

export async function prepareReturningVisitor(context, automaticHelp = false) {
  await context.addInitScript((enabled) => {
    try {
      localStorage.setItem('chemlab:onboarding:v1', 'completed');
      if (!enabled)
        localStorage.setItem(
          'chemlab:contextual-help:v1',
          JSON.stringify({ enabled: false, seen: [] }),
        );
    } catch {
      // Storage-denial scenarios still need to reach the learning interface.
    }
  }, automaticHelp);
}

// Existing feature scenarios represent returning visitors who disabled tips.
// Onboarding uses a fresh context; contextual-help.spec.js enables actual hints.
export const test = base.extend({
  automaticHelp: [false, { option: true }],
  page: async ({ page }, use) => {
    await page.addLocatorHandler(
      page.getByRole('button', { name: 'Lewati tur', exact: true }),
      async (button) => button.click(),
    );
    await use(page);
  },
  context: async ({ context, automaticHelp }, use) => {
    await prepareReturningVisitor(context, automaticHelp);
    await use(context);
  },
});

export { expect } from '@playwright/test';
