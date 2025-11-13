import { BULLET_SYMBOLS, bulletLines, startsWithStrongVerb } from './utils.js';

export function generateImprovements({ resumeText, parsed, scores, jobDescription }) {
  const issues = [];
  const suggestions = [];
  const formattingTips = [];

  // Missing sections
  const required = ['experience', 'skills', 'education'];
  for (const r of required) {
    if (!parsed.sections[r]) {
      issues.push(`Missing “${capitalize(r)}” section`);
      suggestions.push(`Add a clear “${capitalize(r)}” section with bullet points and recent details.`);
    }
  }
  if (!parsed.sections['projects']) {
    suggestions.push('Include a “Projects” section highlighting 2–3 relevant projects with impact.');
  }

  // Strong verbs
  const bullets = bulletLines(resumeText);
  const strongStarts = bullets.filter(b => startsWithStrongVerb(b)).length;
  const strongRatio = strongStarts / Math.max(1, bullets.length);
  if (strongRatio < 0.4) {
    issues.push('Weak action verbs in bullet points');
    suggestions.push('Start bullets with strong verbs (e.g., Built, Led, Optimized, Automated).');
  }

  // Quantified achievements
  const quantified = (resumeText.match(/\b(\d+%?|\$\d+[\d,]*|\d+\s+(users|customers|clients|projects))\b/gi) || []).length;
  if (quantified < Math.max(3, Math.round(bullets.length * 0.15))) {
    issues.push('Few quantified achievements');
    suggestions.push('Add measurable metrics (e.g., “Reduced costs by 15%”, “Served 2,000+ users”).');
  }

  // Formatting consistency
  const bulletSymbolsUsed = new Set(bullets.map(b => b.trim()[0]).filter(Boolean));
  if (bulletSymbolsUsed.size > 1) {
    issues.push('Inconsistent bullet symbols');
    formattingTips.push('Use one bullet style throughout (e.g., “•” or “-”).');
  }

  // Spacing guidance
  formattingTips.push('Ensure 0.5–1 inch margins and consistent spacing (8–12px).');
  formattingTips.push('Keep section headings clear and consistent (e.g., H2 style).');
  formattingTips.push('Prefer a single professional font; keep sizes consistent.');

  // Keyword coverage hint
  if (scores.keywordMatch < 70 && jobDescription?.trim()) {
    suggestions.push('Improve keyword coverage: mirror critical skills from the job description.');
  }

  // Section order
  const likelyOrderOk = hasOrder(parsed, ['experience','projects','education','skills']) || hasOrder(parsed, ['summary','experience','education','skills']);
  if (!likelyOrderOk) {
    formattingTips.push('Use a standard order: Summary → Experience → Projects → Education → Skills.');
  }

  return { issues, suggestions, formattingTips };
}

function hasOrder(parsed, order) {
  const textKeys = Object.keys(parsed.sections);
  const positions = order.map(k => textKeys.indexOf(k)).filter(p => p >= 0);
  for (let i = 1; i < positions.length; i++) if (positions[i] < positions[i-1]) return false;
  return positions.length >= 2; // basic signal
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
