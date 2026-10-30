import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { CareersPage } from '../pages/CareersPage';
import { WorkableClient } from '../api/WorkableClient';
import { env } from '../config/env';

type Fixtures = {
  homePage: HomePage;
  contactPage: ContactPage;
  projectsPage: ProjectsPage;
  careersPage: CareersPage;
  workable: WorkableClient;
};

/** Page objects are injected as fixtures so specs stay short and never call `new` themselves. */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  projectsPage: async ({ page }, use) => use(new ProjectsPage(page)),
  careersPage: async ({ page }, use) => use(new CareersPage(page)),
  workable: async ({ request }, use) => use(new WorkableClient(request, env.workableAccount)),
});

export { expect } from '@playwright/test';
