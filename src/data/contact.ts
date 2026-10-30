export const contactValidation = {
  name: 'Please enter a name consisting of three or more characters.',
  email: 'Please enter a valid email address.',
  message: 'Please enter a message consisting of twenty or more characters.',
  consent: 'Please agree to the Privacy Policy.',
  captcha: 'Please Validate CAPTCHA',
};

/** Labels keep "@" out of test titles (Playwright treats "@word" in a title as a tag). */
export const invalidEmails = [
  { label: 'plain text, no at-sign', value: 'plainaddress' },
  { label: 'domain only, no at-sign', value: 'missing-at.com' },
  { label: 'missing domain', value: 'user@' },
  { label: 'missing local part', value: '@no-user.com' },
];
