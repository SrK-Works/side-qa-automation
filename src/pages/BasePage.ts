import { expect, type Locator, type Page } from '@playwright/test';

/** Shared behaviour for every page: navigation, cookie banner, header and footer. */
export abstract class BasePage {
  abstract readonly path: string;

  readonly header: Locator;
  readonly footer: Locator;
  readonly logo: Locator;
  readonly cookieDecline: Locator;

  constructor(protected readonly page: Page) {
    this.header = page.getByRole('banner');
    this.footer = page.getByRole('contentinfo').last();
    this.logo = page.getByRole('link', { name: 'side logo' });
    this.cookieDecline = page.getByRole('button', { name: 'DECLINE' });
  }

  async open(query = ''): Promise<this> {
    await this.page.goto(this.path + query, { waitUntil: 'domcontentloaded' });
    await this.dismissCookies();
    return this;
  }

  /** Cookie banner appears asynchronously; dismiss it if present without failing when absent. */
  async dismissCookies(): Promise<void> {
    const decline = this.cookieDecline.first();
    try {
      await decline.waitFor({ state: 'visible', timeout: 5_000 });
      await decline.click();
      await expect(decline).toBeHidden();
    } catch {
      /* banner not shown (already dismissed / geo rules) */
    }
  }

  navLink(name: string): Locator {
    return this.header.getByRole('link', { name, exact: true });
  }

  footerLink(name: string): Locator {
    return this.footer.getByRole('link', { name, exact: true });
  }
}
