import { test, expect } from '../../src/fixtures';

test.describe('Careers', () => {
  test('careers page links out to Workable job postings @smoke @mobile', async ({ careersPage, page }) => {
    await careersPage.open();
    await expect(page).toHaveTitle(/Careers/);
    await expect(careersPage.heading).toBeVisible();
    expect(await careersPage.workableLinks.count()).toBeGreaterThan(0);
    const href = await careersPage.workableLinks.first().getAttribute('href');
    expect(href).toMatch(/^https:\/\/apply\.workable\.com\/j\/[A-Z0-9]+/);
  });
});
