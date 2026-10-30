/**
 * Test data for data-driven service page checks.
 * Headings are matched case-insensitively: the DOM text is mixed case and uppercased by CSS.
 */
export const services = [
  { slug: 'game-development', footerLabel: 'GAME DEVELOPMENT', heading: /GAME\s*DEVELOPMENT/i },
  { slug: 'quality-assurance', footerLabel: 'QUALITY ASSURANCE', heading: /QUALITY\s*ASSURANCE/i },
  { slug: 'art-production', footerLabel: 'ART PRODUCTION', heading: /ART\s*PRODUCTION/i },
  { slug: 'localization', footerLabel: 'LOCALIZATION', heading: /^LOCALIZATION$/i },
  { slug: 'audio-production', footerLabel: 'AUDIO PRODUCTION', heading: /AUDIO\s*PRODUCTION/i },
  { slug: 'player-support', footerLabel: 'PLAYER SUPPORT', heading: /PLAYER\s*SUPPORT/i },
  { slug: 'localization-qa', footerLabel: 'LOCALIZATION QA', heading: /LOCALIZATION\s*QA/i },
  { slug: 'datasets', footerLabel: 'DATASETS', heading: /DATASETS/i },
  { slug: 'it-services', footerLabel: 'IT', heading: /IT\s*SERVICES/i },
] as const;

export const primaryNav = [
  { name: 'PROJECTS', path: '/projects' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CAREERS', path: '/careers' },
  { name: 'NEWS & EVENTS', path: '/news' },
  { name: 'LAB', path: '/lab' },
] as const;
