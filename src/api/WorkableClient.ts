import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface WorkableJob {
  title: string;
  shortcode: string;
  employment_type: string;
  telecommuting: boolean;
  department: string;
  url: string;
  shortlink: string;
  application_url: string;
  published_on: string;
  created_at: string;
  country: string;
  city: string;
  state: string;
  locations: { country: string; countryCode: string; city: string; region: string; hidden: boolean }[];
  description?: string;
}

export interface WorkableAccount {
  name: string;
  description: string | null;
  jobs: WorkableJob[];
}

/** Thin API client: keeps endpoints in one place and returns timing for SLA checks. */
export class WorkableClient {
  constructor(private readonly request: APIRequestContext, private readonly account: string) {}

  async getAccount(opts: { details?: boolean } = {}): Promise<{ response: APIResponse; durationMs: number }> {
    const started = Date.now();
    const response = await this.request.get(`/api/v1/widget/accounts/${this.account}`, {
      params: opts.details ? { details: 'true' } : undefined,
    });
    return { response, durationMs: Date.now() - started };
  }

  async getJobs(opts: { details?: boolean } = {}): Promise<WorkableJob[]> {
    const { response } = await this.getAccount(opts);
    if (!response.ok()) throw new Error(`Workable API returned ${response.status()}`);
    return ((await response.json()) as WorkableAccount).jobs;
  }
}
