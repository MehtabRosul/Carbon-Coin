
// Local SDG icon URLs - most reliable for PDF generation
const LOCAL_SDG_URLS = [
  "/images/sdg/sdg-1.png", // SDG 1 - No Poverty
  "/images/sdg/sdg-2.png", // SDG 2 - Zero Hunger
  "/images/sdg/sdg-3.png", // SDG 3 - Good Health
  "/images/sdg/sdg-4.png", // SDG 4 - Quality Education
  "/images/sdg/sdg-5.png", // SDG 5 - Gender Equality
  "/images/sdg/sdg-6.png", // SDG 6 - Clean Water
  "/images/sdg/sdg-7.png", // SDG 7 - Clean Energy
  "/images/sdg/sdg-8.png", // SDG 8 - Decent Work
  "/images/sdg/sdg-9.png", // SDG 9 - Industry
  "/images/sdg/sdg-10.png", // SDG 10 - Reduced Inequalities
  "/images/sdg/sdg-11.png", // SDG 11 - Sustainable Cities
  "/images/sdg/sdg-12.png", // SDG 12 - Responsible Consumption
  "/images/sdg/sdg-13.png", // SDG 13 - Climate Action
  "/images/sdg/sdg-14.png", // SDG 14 - Life Below Water
  "/images/sdg/sdg-15.png", // SDG 15 - Life on Land
  "/images/sdg/sdg-16.png", // SDG 16 - Peace & Justice
  "/images/sdg/sdg-17.png", // SDG 17 - Partnerships
];

// Fallback URLs with proper SDG colors (in case local icons fail)
const FALLBACK_URLS = [
  "https://via.placeholder.com/48x48/1f4e79/ffffff?text=SDG+1", // SDG 1 - No Poverty
  "https://via.placeholder.com/48x48/bf8b2e/ffffff?text=SDG+2", // SDG 2 - Zero Hunger
  "https://via.placeholder.com/48x48/279b48/ffffff?text=SDG+3", // SDG 3 - Good Health
  "https://via.placeholder.com/48x48/c5192d/ffffff?text=SDG+4", // SDG 4 - Quality Education
  "https://via.placeholder.com/48x48/ff3a21/ffffff?text=SDG+5", // SDG 5 - Gender Equality
  "https://via.placeholder.com/48x48/26bde2/ffffff?text=SDG+6", // SDG 6 - Clean Water
  "https://via.placeholder.com/48x48/fcc30b/ffffff?text=SDG+7", // SDG 7 - Clean Energy
  "https://via.placeholder.com/48x48/a21942/ffffff?text=SDG+8", // SDG 8 - Decent Work
  "https://via.placeholder.com/48x48/fd6925/ffffff?text=SDG+9", // SDG 9 - Industry
  "https://via.placeholder.com/48x48/dd1367/ffffff?text=SDG+10", // SDG 10 - Reduced Inequalities
  "https://via.placeholder.com/48x48/fd9d24/ffffff?text=SDG+11", // SDG 11 - Sustainable Cities
  "https://via.placeholder.com/48x48/bf8b2e/ffffff?text=SDG+12", // SDG 12 - Responsible Consumption
  "https://via.placeholder.com/48x48/3f7e44/ffffff?text=SDG+13", // SDG 13 - Climate Action
  "https://via.placeholder.com/48x48/0a97d9/ffffff?text=SDG+14", // SDG 14 - Life Below Water
  "https://via.placeholder.com/48x48/56c02b/ffffff?text=SDG+15", // SDG 15 - Life on Land
  "https://via.placeholder.com/48x48/00689d/ffffff?text=SDG+16", // SDG 16 - Peace & Justice
  "https://via.placeholder.com/48x48/19486a/ffffff?text=SDG+17", // SDG 17 - Partnerships
];

// Use local URLs as primary, with fallbacks
export const SDG_ICON_URLS = LOCAL_SDG_URLS;

// Export both arrays for future use if needed
export { LOCAL_SDG_URLS, FALLBACK_URLS };
