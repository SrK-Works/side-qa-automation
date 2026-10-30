import 'dotenv/config';

/** Central place for environment config. Override any value via .env or CI variables. */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://side.inc',
  workableApiUrl: process.env.WORKABLE_API_URL ?? 'https://apply.workable.com',
  workableAccount: process.env.WORKABLE_ACCOUNT ?? 'sideinc',
  /** Max acceptable API response time in ms (simple performance guardrail). */
  apiSlaMs: Number(process.env.API_SLA_MS ?? 5000),
};
