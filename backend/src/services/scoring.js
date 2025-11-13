import { bulletLines, passiveVoiceRatio, startsWithStrongVerb, keywordsFromText } from './utils.js';

export function computeScores({ resumeText, parsed, jobDescription }) {
  const subScores = {
    keywords: scoreKeywords({ resumeText, parsed, jobDescription }),
    structure: scoreStructure(parsed),
    formatting: scoreFormatting(resumeText),
    language: scoreLanguage(resumeText),
  };

  const total = Math.round(
    0.4 * subScores.keywords +
    0.2 * subScores.structure +
    0.2 * subScores.formatting +
    0.2 * subScores.language
  );

  const keywordMatch = subScores.keywords; // expose as separate for UI

  return { total, keywordMatch, subScores };
}

function scoreKeywords({ resumeText, parsed, jobDescription }) {
  if (!jobDescription || jobDescription.trim().length < 5) {
    // Fallback: measure coverage of resume's own top keywords (self-consistency)
    const k = keywordsFromText(resumeText, 30);
    const hit = k.filter(Boolean).length;
    return clamp(Math.round((hit / 30) * 100));
  }
  const jdKeywords = keywordsFromText(jobDescription, 40);
  const resumeTokens = new Set(keywordsFromText(resumeText, 200));
  const hits = jdKeywords.filter(k => resumeTokens.has(k)).length;
  const coverage = hits / Math.max(1, jdKeywords.length);
  return clamp(Math.round(coverage * 100));
}

function scoreStructure(parsed) {
  const required = ['experience', 'skills', 'education'];
  const optional = ['projects'];
  let score = 0;
  for (const r of required) if (parsed.sections[r]) score += 25; // 75 max
  for (const o of optional) if (parsed.sections[o]) score += 10; // +10
  // header/contact presence
  if (parsed.contacts?.email) score += 10;
  if (parsed.contacts?.phone) score += 5;
  return clamp(score);
}

function scoreFormatting(text) {
  const lines = text.split(/\n/).filter(l => l.trim());
  const bullets = bulletLines(text);
  const bulletRatio = bullets.length / Math.max(1, lines.length);
  let score = 0;
  // bullet usage 40
  score += Math.min(40, Math.round(bulletRatio * 100));
  // line length consistency: punish very long lines
  const longLines = lines.filter(l => l.length > 140).length;
  const longRatio = longLines / Math.max(1, lines.length);
  score += Math.max(0, 30 - Math.round(longRatio * 60));
  // whitespace density reasonable
  const blankLines = text.match(/\n\s*\n/g)?.length || 0;
  const blankRatio = blankLines / Math.max(1, lines.length);
  score += Math.max(0, 30 - Math.round(Math.abs(blankRatio - 0.1) * 300));
  return clamp(score);
}

function scoreLanguage(text) {
  const pvr = passiveVoiceRatio(text); // lower better
  const bullets = bulletLines(text);
  const strongStarts = bullets.filter(b => startsWithStrongVerb(b)).length;
  const strongRatio = strongStarts / Math.max(1, bullets.length);
  let score = 100;
  // penalize passive voice
  score -= Math.min(60, Math.round(pvr * 100));
  // reward strong verbs
  score += Math.round(strongRatio * 40);
  score = Math.min(100, score);
  return clamp(score);
}

function clamp(n) {
  return Math.max(0, Math.min(100, n));
}
