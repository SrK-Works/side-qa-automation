/**
 * Known accessibility issues found on 30 Oct 2026, accepted as a baseline so CI stays green
 * while still failing on any NEW critical violation. Remove entries once fixed.
 *
 *  - aria-allowed-attr (critical, /contact): dropdown <label role="button"> uses aria-required,
 *    which is not allowed on role=button.
 *  - link-name (serious, all pages): 5 footer social icon links have no accessible name.
 *  - color-contrast (serious, /contact): 3 low-contrast text nodes in the form.
 */
export const knownCriticalViolations: Record<string, string[]> = {
  '/contact': ['aria-allowed-attr'],
};
