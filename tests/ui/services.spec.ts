import { test, expect } from '../../src/fixtures';
import { ServicePage } from '../../src/pages/ServicePage';
import { services } from '../../src/data/services';

test.describe('Service pages (data-driven)', () => {
  for (const svc of services) {
    test(`${svc.slug} page renders with correct title and heading @regression`, async ({ page }) => {
      const servicePage = new ServicePage(page, svc.slug);
      const response = await page.goto(servicePage.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/Side/);
      await expect(servicePage.mainHeading).toBeVisible();
      await expect(servicePage.mainHeading).toHaveText(svc.heading);
    });
  }

  test('footer service links point at the right pages @smoke', async ({ homePage }) => {
    await homePage.open();
    for (const svc of services) {
      await expect(homePage.footerLink(svc.footerLabel)).toHaveAttribute('href', `/services/${svc.slug}`);
    }
  });

  test('QA service page lists the testing types Side offers @smoke @mobile', async ({ page }) => {
    const qa = new ServicePage(page, 'quality-assurance');
    await qa.open();
    await expect(page).toHaveTitle(/QA/);
    for (const type of ['FUNCTIONALITY TESTING', 'COMPATIBILITY TESTING', 'AUTOMATION', 'PLAYTESTING']) {
      // On mobile these sit in a carousel where off-screen slides are aria-hidden,
      // so assert on DOM text rather than the accessibility tree.
      await expect(page.getByRole('main')).toContainText(new RegExp(type, 'i'));
    }
  });
});
