import { test, expect } from '../../src/fixtures';
import { primaryNav } from '../../src/data/services';

test.describe('Home page and navigation', () => {
  test('home page loads with title, hero and footer @smoke @mobile', async ({ homePage, page }) => {
    await homePage.open();
    await expect(page).toHaveTitle(/Side/);
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.footer).toContainText('ALL RIGHTS RESERVED');
  });

  test('cookie banner can be declined and stays dismissed @regression', async ({ homePage, page }) => {
    await page.goto('/');
    const decline = homePage.cookieDecline.first();
    await expect(decline).toBeVisible();
    await decline.click();
    await expect(decline).toBeHidden();
    await page.reload();
    await expect(page.getByText('Our website uses cookies')).toBeHidden();
  });

  for (const item of primaryNav) {
    test(`header link "${item.name}" navigates to ${item.path} @smoke`, async ({ homePage, page }) => {
      await homePage.open();
      await homePage.navLink(item.name).click();
      await expect(page).toHaveURL(new RegExp(`${item.path}(\\?|$)`));
      await expect(page.getByRole('main')).toBeVisible();
    });
  }

  test('no broken internal links on the home page @regression', async ({ homePage, page, request }) => {
    await homePage.open();
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) => [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!))]);
    const pages = hrefs.filter((h) => !h.endsWith('.pdf'));
    expect(pages.length).toBeGreaterThan(10);

    // Sequential + retries: the site resets bursts of parallel connections (rate limiting),
    // and a link checker should not hammer production anyway.
    const results: { href: string; status: number }[] = [];
    for (const href of pages) {
      const res = await request.get(href, { maxRetries: 2 });
      results.push({ href, status: res.status() });
    }
    const broken = results.filter((r) => r.status >= 400);
    expect(broken, `Broken links: ${JSON.stringify(broken)}`).toEqual([]);
  });
});
