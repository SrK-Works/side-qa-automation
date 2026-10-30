# side-qa-automation

[![Playwright Tests](https://github.com/SrK-Works/side-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/SrK-Works/side-qa-automation/actions/workflows/playwright.yml)

A Playwright + TypeScript automation framework built from scratch against **[side.inc](https://side.inc)** and Side's public **Workable jobs API**. It covers four layers from one codebase: **API**, **web UI**, **mobile viewport** and **accessibility**, wired into **GitHub Actions** with a published HTML report.

> Built as a hands-on demo for the Side Quality Engineering interview. All tests are read-only: the reCAPTCHA-protected contact form is only validated, never submitted.

**Live test report:** https://srk-works.github.io/side-qa-automation/

---

## What it covers

| Layer | Project | What is tested |
|---|---|---|
| API / backend | `api` | Status + content type, response-time SLA, JSON contract (schema), data integrity, business rules (QE role published for Bengaluru), negative case (unknown account -> 4xx, not 5xx) |
| Web UI | `desktop-chrome` | Home, header nav (data-driven), cookie consent, 9 service pages (data-driven), projects search / empty state / pagination, careers -> Workable links, broken internal links |
| Forms | `desktop-chrome` | Contact form validation: mandatory fields, 4 invalid email formats, **boundary values** (2 vs 3 char name, 19 vs 20 char message), CAPTCHA still blocks submit |
| Mobile | `mobile-chrome` (Pixel 7) | Same specs tagged `@mobile` re-run on a touch / mobile viewport, no duplicated code |
| Accessibility | `desktop-chrome` | axe-core WCAG 2.1 A/AA scan, full results attached to the report, gate on **new** critical violations vs a known baseline |

## Architecture

```
side-qa-automation/
├── playwright.config.ts        # projects: api | desktop-chrome | mobile-chrome, retries, traces, reporters
├── src/
│   ├── config/env.ts           # env-driven config (BASE_URL, API URL, SLA) via .env / CI vars
│   ├── pages/                  # Page Object Model
│   │   ├── BasePage.ts         #   shared: open(), cookie handling, header/footer helpers
│   │   ├── HomePage.ts  ContactPage.ts  ProjectsPage.ts  CareersPage.ts
│   │   └── ServicePage.ts      #   one generic page object for all /services/<slug> pages
│   ├── api/WorkableClient.ts   # API client: endpoints in one place, returns timing for SLA checks
│   ├── fixtures/index.ts       # custom fixtures inject page objects + API client into tests
│   ├── data/                   # test data: nav, services, validation messages, a11y baseline
│   └── utils/schema.ts         # tiny dependency-free schema validator (supports nullable fields)
├── tests/
│   ├── api/                    # Workable jobs API
│   ├── ui/                     # web + @mobile specs
│   └── a11y/                   # axe-core scans
└── .github/workflows/playwright.yml   # CI: typecheck -> tests -> report artifact -> GitHub Pages
```

**Design choices**

- **Role-based locators** (`getByRole`, `getByText`) instead of CSS/XPath, so tests follow what users see and survive Tailwind class changes.
- **Fixtures over `new PageObject()`** in specs: specs read like test cases, setup lives in one place.
- **Data-driven tests** for nav and service pages: adding a service is one line in `src/data/services.ts`.
- **Tags** (`@smoke`, `@regression`, `@mobile`, `@api`, `@a11y`) let CI or a developer run any slice.
- **Flakiness controls**: web-first assertions (auto-wait, no `sleep`), retries only in CI, trace + video captured on retry/failure, cookie banner handled defensively in `BasePage`.
- **Safe against production**: no real form submissions, no load on the site beyond a normal visit.

## Findings from running it

The suite already surfaced real issues on the live site and API:

1. **Accessibility (critical):** on `/contact`, dropdown `<label role="button">` elements use `aria-required`, which is not allowed on `role=button` (axe `aria-allowed-attr`).
2. **Accessibility (serious, every page):** 5 footer social icon links have no accessible name, so screen readers announce just "link".
3. **Accessibility (serious):** 3 low colour-contrast text nodes in the contact form.
4. **API data quality:** a few freelance LQA postings return `employment_type: null`. The contract test treats it as nullable, and a separate report test flags it if it grows past 5%.
5. **API data model:** multi-location postings (talent pools) are flattened into one entry per city with the **same shortcode**, so `shortcode` is not a unique key. The integrity test checks `shortcode + city + country` instead, and that entries sharing a shortcode share a title.

## Running it

```bash
npm ci
npx playwright install chromium

npm test              # everything
npm run test:smoke    # @smoke only
npm run test:api      # API layer only (no browser)
npm run test:ui       # desktop web
npm run test:mobile   # mobile viewport
npm run test:a11y     # accessibility scans
npm run report        # open the HTML report
```

Override targets with a `.env` file (see `.env.example`), e.g. `BASE_URL=https://staging.side.inc`.

## CI/CD

GitHub Actions runs on every push and PR, on demand, and on a weekday schedule (09:00 IST) to catch regressions on the live site. Pipeline: `npm ci` -> type check -> install Chromium -> run all projects -> upload report artifact -> publish the HTML report to GitHub Pages.

## Extending it

- **Mobile native apps:** the same layered structure (config -> page/screen objects -> fixtures -> specs) maps directly onto **Appium / WebdriverIO** for Android/iOS builds.
- **Unity games:** UI automation for Unity builds can plug in through **AltTester** or **GameDriver** drivers, reusing the data, reporting and CI layers.
- **Performance:** the API client already records response time; the next step is k6/JMeter load profiles against the same endpoints.
- **AI-assisted testing:** generate new data-driven cases or triage failed traces with an LLM, keeping humans in review.

---

Author: **Sandeep Reddy Konatham** · [GitHub](https://github.com/SrK-Works)
