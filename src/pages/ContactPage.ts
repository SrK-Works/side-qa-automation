import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type ContactDetails = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}>;

/**
 * Contact form is protected by reCAPTCHA. Tests only exercise client-side
 * validation and NEVER submit a real enquiry to Side's production site.
 */
export class ContactPage extends BasePage {
  readonly path = '/contact';
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly company: Locator;
  readonly message: Locator;
  readonly consent: Locator;
  readonly submit: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('form').filter({ has: page.getByRole('button', { name: 'Submit' }) });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.email = page.getByRole('textbox', { name: 'Email Address' });
    this.phone = page.getByRole('textbox', { name: 'Telephone' });
    this.company = page.getByRole('textbox', { name: 'Company / Organization' });
    this.message = page.getByRole('textbox', { name: 'Message' });
    this.consent = page.getByRole('checkbox', { name: /I give consent/ });
    this.submit = page.getByRole('button', { name: 'Submit' });
  }

  async fill(details: ContactDetails): Promise<void> {
    const map: [Locator, string | undefined][] = [
      [this.firstName, details.firstName],
      [this.lastName, details.lastName],
      [this.email, details.email],
      [this.phone, details.phone],
      [this.company, details.company],
      [this.message, details.message],
    ];
    for (const [field, value] of map) if (value !== undefined) await field.fill(value);
  }

  /** Visible validation messages rendered under the fields. */
  errorMessages(): Locator {
    return this.form.getByText(/^Please /);
  }

  error(text: string | RegExp): Locator {
    return this.form.getByText(text).first();
  }
}
