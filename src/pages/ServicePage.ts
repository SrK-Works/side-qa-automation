import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Generic page object for any /services/<slug> page (data-driven). */
export class ServicePage extends BasePage {
  readonly path: string;
  readonly mainHeading: Locator;

  constructor(page: Page, slug: string) {
    super(page);
    this.path = `/services/${slug}`;
    this.mainHeading = page.getByRole('main').getByRole('heading').first();
  }
}
