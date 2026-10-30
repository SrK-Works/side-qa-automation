import { test, expect } from '../../src/fixtures';
import { contactValidation, invalidEmails } from '../../src/data/contact';

/**
 * Negative / validation tests only. The form is reCAPTCHA protected and these tests
 * deliberately never complete a real submission against production.
 */
test.describe('Contact form validation', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.open();
  });

  test('empty submit shows all mandatory field errors @smoke @mobile', async ({ contactPage }) => {
    await contactPage.submit.click();
    await expect(contactPage.error(contactValidation.email)).toBeVisible();
    await expect(contactPage.error(contactValidation.message)).toBeVisible();
    await expect(contactPage.error(contactValidation.consent)).toBeVisible();
    await expect(contactPage.error(contactValidation.captcha)).toBeVisible();
    await expect(contactPage.firstName).toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.email).toHaveAttribute('aria-invalid', 'true');
  });

  for (const bad of invalidEmails) {
    test(`rejects invalid email: ${bad.label} @regression`, async ({ contactPage }) => {
      await contactPage.fill({ email: bad.value });
      await contactPage.submit.click();
      await expect(contactPage.email).toHaveAttribute('aria-invalid', 'true');
      await expect(contactPage.error(contactValidation.email)).toBeVisible();
    });
  }

  test('valid values clear field-level errors (boundary: 3-char name, 20-char message) @regression', async ({
    contactPage,
  }) => {
    await contactPage.submit.click();
    await contactPage.fill({
      firstName: 'Sam',
      lastName: 'Lee',
      email: 'qa.candidate@example.com',
      message: 'x'.repeat(20),
    });
    await contactPage.submit.click();
    await expect(contactPage.firstName).not.toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.email).not.toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.message).not.toHaveAttribute('aria-invalid', 'true');
    // CAPTCHA is still unsolved, so the form must still be blocked
    await expect(contactPage.error(contactValidation.captcha)).toBeVisible();
  });

  test('boundary: 2-char name and 19-char message are rejected @regression', async ({ contactPage }) => {
    await contactPage.fill({ firstName: 'Al', message: 'x'.repeat(19) });
    await contactPage.submit.click();
    await expect(contactPage.firstName).toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.message).toHaveAttribute('aria-invalid', 'true');
  });
});
