import { test, expect } from '../../src/fixtures';

test.describe('Projects catalogue', () => {
  test('lists projects with pagination @smoke @mobile', async ({ projectsPage }) => {
    await projectsPage.open();
    await expect(projectsPage.resultTitles.first()).toBeVisible();
    expect(await projectsPage.resultTitles.count()).toBeGreaterThan(5);
    await expect(projectsPage.pagination).toBeVisible();
  });

  test('search narrows results and is reflected in the URL @regression', async ({ projectsPage, page }) => {
    await projectsPage.open();
    await projectsPage.searchFor('Resident');
    await expect(page).toHaveURL(/q=Resident/);
    await expect(projectsPage.resultTitles.first()).toContainText(/resident/i);
    const titles = await projectsPage.resultTitles.allInnerTexts();
    for (const t of titles) expect(t.toLowerCase()).toContain('resident');
  });

  test('search with no match shows empty state @regression', async ({ projectsPage }) => {
    await projectsPage.open('?page=1&q=zzqxnomatch');
    await expect(projectsPage.emptyState).toBeVisible();
  });

  test('page 2 shows a different set of projects @regression', async ({ projectsPage, page }) => {
    await projectsPage.open('?page=1');
    await expect(projectsPage.resultTitles.first()).toBeVisible();
    const page1 = await projectsPage.resultTitles.allInnerTexts();
    await page.goto('/projects?page=2');
    await expect(projectsPage.resultTitles.first()).toBeVisible();
    const page2 = await projectsPage.resultTitles.allInnerTexts();
    expect(page2).not.toEqual(page1);
  });
});
