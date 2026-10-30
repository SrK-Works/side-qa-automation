import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProjectsPage extends BasePage {
  readonly path = '/projects';
  readonly search: Locator;
  readonly results: Locator;
  readonly resultTitles: Locator;
  readonly emptyState: Locator;
  readonly pagination: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    super(page);
    this.search = page.getByRole('textbox', { name: 'Search' });
    this.results = page.getByRole('region', { name: 'Projects', exact: true });
    this.resultTitles = this.results.getByRole('article').getByRole('heading', { level: 3 });
    this.emptyState = page.getByText('No Projects Found');
    this.pagination = page.getByRole('navigation', { name: 'Projects pagination' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
  }

  async searchFor(term: string): Promise<void> {
    await this.search.fill(term);
    await this.page.waitForURL(new RegExp(`q=${encodeURIComponent(term)}`));
  }
}
