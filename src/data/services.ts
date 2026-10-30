/** Test data for data-driven service page checks. */
export const services = [
  { slug: 'game-development', footerLabel: 'GAME DEVELOPMENT', heading: /GAME\s*DEVELOPMENT/ },
  { slug: 'quality-assurance', footerLabel: 'QUALITY ASSURANCE', heading: /QUALITY\s*ASSURANCE/ },
  { slug: 'art-production', footerLabel: 'ART PRODUCTION', heading: /ART\s*PRODUCTION/ },
  { slug: 'localization', footerLabel: 'LOCALIZATION', heading: /^LOCALIZATION$/ },
  { slug: 'audio-production', footerLabel: 'AUDIO PRODUCTION', heading: /AUDIO\s*PRODUCTION/ },
  { slug: 'player-support', footerLabel: 'PLAYER SUPPORT', heading: /PLAYER\s*SUPPORT/ },
  { slug: 'localization-qa', footerLabel: 'LOCALIZATION QA', heading: /LOCALIZATION\s*QA/ },
  { slug: 'datasets', footerLabel: 'DATASETS', heading: /DATASETS/ },
  { slug: 'it-services', footerLabel: 'IT', heading: /IT\s*SERVICES/ },
] as const;

export const primaryNav = [
  { name: 'PROJECTS', path: '/projects' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CAREERS', path: '/careers' },
  { name: 'NEWS & EVENTS', path: '/news' },
  { name: 'LAB', path: '/lab' },
] as const;
