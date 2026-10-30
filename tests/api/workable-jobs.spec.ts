import { test, expect } from '../../src/fixtures';
import { env } from '../../src/config/env';
import { validateShape } from '../../src/utils/schema';
import type { WorkableAccount } from '../../src/api/WorkableClient';

/**
 * Backend/API layer: Side's public job board is served by the Workable widget API.
 * These checks cover status, contract (schema), data integrity, business rules and an SLA.
 */
test.describe('Workable jobs API @api', () => {
  test('returns 200 JSON within SLA @smoke', async ({ workable }) => {
    const { response, durationMs } = await workable.getAccount();
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(durationMs, `response took ${durationMs}ms`).toBeLessThan(env.apiSlaMs);
  });

  test('account payload matches expected contract @smoke', async ({ workable }) => {
    const { response } = await workable.getAccount();
    const body = (await response.json()) as WorkableAccount;
    expect(body.name).toBe('Side');
    expect(Array.isArray(body.jobs)).toBe(true);
    expect(body.jobs.length).toBeGreaterThan(0);

    const problems = body.jobs.flatMap((job, i) =>
      validateShape(job as unknown as Record<string, unknown>, {
        title: 'string',
        shortcode: 'string',
        employment_type: 'string?', // nullable: some freelance LQA postings omit it
        telecommuting: 'boolean',
        url: 'string',
        application_url: 'string',
        published_on: 'string',
        country: 'string',
        locations: 'array',
      }).map((p) => `jobs[${i}] (${job.title}): ${p}`),
    );
    expect(problems, problems.slice(0, 10).join('\n')).toEqual([]);
  });

  test('data integrity: multi-location postings share one shortcode per city @regression', async ({ workable }) => {
    const jobs = await workable.getJobs();

    // The widget flattens multi-location jobs (e.g. talent pools) into one entry per city,
    // so shortcode alone is NOT unique. shortcode + city + country must be.
    const keys = jobs.map((j) => `${j.shortcode}|${j.city}|${j.country}`);
    expect(new Set(keys).size, 'duplicate shortcode+location entries').toBe(keys.length);

    // Every entry sharing a shortcode must describe the same job (same title).
    const titlesByCode = new Map<string, Set<string>>();
    for (const j of jobs) titlesByCode.set(j.shortcode, (titlesByCode.get(j.shortcode) ?? new Set()).add(j.title));
    const conflicting = [...titlesByCode].filter(([, t]) => t.size > 1).map(([code]) => code);
    expect(conflicting).toEqual([]);

    for (const job of jobs) {
      expect(job.url).toBe(`https://apply.workable.com/j/${job.shortcode}`);
      expect(job.application_url).toContain(job.shortcode);
      expect(Number.isNaN(Date.parse(job.published_on))).toBe(false);
      expect(job.title.trim().length).toBeGreaterThan(0);
    }
  });

  test('data quality report: postings missing employment_type @regression', async ({ workable }, testInfo) => {
    const jobs = await workable.getJobs();
    const missing = jobs.filter((j) => j.employment_type === null).map((j) => j.title);
    testInfo.annotations.push({
      type: 'data-quality',
      description: `${missing.length}/${jobs.length} postings have no employment_type: ${missing.join(', ')}`,
    });
    // Soft threshold: flag only if the gap grows beyond 5% of postings.
    expect(missing.length / jobs.length).toBeLessThan(0.05);
  });

  test('the Quality Engineering contract role is published for Bengaluru @smoke', async ({ workable }) => {
    const jobs = await workable.getJobs({ details: true });
    const role = jobs.find((j) => /quality engineering/i.test(j.title) && j.city === 'Bengaluru');
    expect(role, 'Quality Engineering role not found').toBeDefined();
    expect(role!.employment_type).toBe('Contract');
    expect(role!.country).toBe('India');
    expect(role!.description).toMatch(/Playwright/);
  });

  test('India jobs are tagged with country code IN @regression', async ({ workable }) => {
    const jobs = await workable.getJobs();
    const india = jobs.filter((j) => j.country === 'India');
    expect(india.length).toBeGreaterThan(0);
    for (const job of india) {
      expect(job.locations.some((l) => l.countryCode === 'IN'), job.title).toBe(true);
    }
  });

  test('unknown account returns a client error, not a 5xx @regression', async ({ request }) => {
    const res = await request.get('/api/v1/widget/accounts/this-account-does-not-exist-qa');
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
