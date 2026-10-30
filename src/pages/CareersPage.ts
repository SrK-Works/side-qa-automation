import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CareersPage extends BasePage {
  readonly path = '/careers';
  readonly heading: Locator;
  readonly workableLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'JOIN OUR SQUAD' });
    this.workableLinks = page.locator('a[href*="apply.workable.com"]');
  }
}
