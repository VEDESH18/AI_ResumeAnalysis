import { keywordsFromText, tokenize } from './utils.js';

const SECTION_HEADERS = [
  { key: 'summary', patterns: [/^summary$/i, /^profile$/i, /^objective$/i] },
  { key: 'experience', patterns: [/^experience$/i, /^(work|professional)\s+experience$/i, /^employment$/i] },
  { key: 'skills', patterns: [/^skills$/i, /^technical\s+skills$/i, /^core\s+skills$/i] },
  { key: 'education', patterns: [/^education$/i, /^academics?$/i] },
  { key: 'projects', patterns: [/^projects?$/i, /^selected\s+projects$/i] },
  { key: 'certifications', patterns: [/^certifications?$/i, /^licenses?$/i] },
];

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_REGEX = /\b(\+?\d[\d\s\-()]{7,}\d)\b/;
const LINKEDIN_REGEX = /linkedin\.com\/[A-Za-z0-9\-_/]+/i;
const GITHUB_REGEX = /github\.com\/[A-Za-z0-9\-_/]+/i;

function isHeader(line) {
  const txt = line.trim();
  return SECTION_HEADERS.find(h => h.patterns.some(p => p.test(txt)));
}

export function parseResume(text) {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Contacts from first 10 lines
  const top = lines.slice(0, 10).join(' \n ');
  const contacts = {
    name: guessNameFromTop(lines.slice(0, 3)),
    email: (top.match(EMAIL_REGEX) || [null])[0],
    phone: (top.match(PHONE_REGEX) || [null])[0],
    linkedin: (top.match(LINKEDIN_REGEX) || [null])[0],
    github: (top.match(GITHUB_REGEX) || [null])[0],
  };

  // Section splitting
  const indices = [];
  lines.forEach((ln, idx) => {
    const h = isHeader(ln);
    if (h) indices.push({ idx, key: h.key, title: ln });
  });

  const sections = {};
  if (indices.length === 0) {
    sections.body = text;
  } else {
    for (let i = 0; i < indices.length; i++) {
      const start = indices[i].idx + 1;
      const end = i + 1 < indices.length ? indices[i + 1].idx : lines.length;
      const key = indices[i].key;
      sections[key] = lines.slice(start, end).join('\n');
    }
  }

  // Skills list
  const skillsBlock = sections.skills || '';
  const skills = extractSkills(skillsBlock);

  // Keywords (top tokens)
  const keywords = keywordsFromText(text, 50);

  return { sections, contacts, skills, keywords };
}

function guessNameFromTop(lines) {
  const first = (lines[0] || '').trim();
  if (first && first.split(' ').length <= 6 && !first.match(EMAIL_REGEX)) {
    const hasLetters = /[A-Za-z]/.test(first);
    if (hasLetters) return first;
  }
  const second = (lines[1] || '').trim();
  if (second && second.split(' ').length <= 6 && !second.match(EMAIL_REGEX)) {
    const hasLetters = /[A-Za-z]/.test(second);
    if (hasLetters) return second;
  }
  return null;
}

function extractSkills(block) {
  if (!block) return [];
  const candidates = block
    .split(/\n|,|;|\u2022|\u2023|\-|\•/)
    .map(s => s.trim())
    .filter(Boolean);
  const out = new Set();
  for (const c of candidates) {
    const words = tokenize(c).join(' ');
    if (words.length > 1) out.add(capitalizeWords(words));
  }
  return [...out].slice(0, 100);
}

function capitalizeWords(s) {
  return s.replace(/\b([a-z])/g, (_, ch) => ch.toUpperCase());
}
