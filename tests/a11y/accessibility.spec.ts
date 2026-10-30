import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../src/fixtures';
import { knownCriticalViolations } from '../../src/data/a11y-baseline';

const pages = ['/', '/careers', '/contact', '/services/quality-assurance'];

/**
 * Accessibility scan with axe-core (WCAG 2.1 A/AA). The full report is attached to the
 * HTML report. The gate fails only on NEW critical violations (not in the known baseline).
 */
test.describe('Accessibility (axe-core)', () => {
  for (const path of pages) {
    test(`${path} has no new critical WCAG violations @a11y`, async ({ page }, testInfo) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.getByRole('main').waitFor();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();

      await testInfo.attach('axe-violations.json', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });
      const summary = results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length} nodes)`);
      testInfo.annotations.push({ type: 'axe', description: summary.join(' | ') || 'no violations' });

            const newCritical = results.violations
        .filter((v) => v.impact === 'critical' && !knownCriticalViolations.includes(v.id))
        .map((v) => v.id);
      expect(newCritical, summary.join('\n')).toEqual([]);
    });
  }
});
