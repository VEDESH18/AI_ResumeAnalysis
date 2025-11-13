export const STOPWORDS = new Set([
  'the','and','a','an','to','in','of','for','on','at','by','with','from','as','is','are','was','were','be','been','being',
  'this','that','these','those','it','its','or','not','but','if','than','then','so','such','into','through','over','under',
  'i','me','my','we','our','you','your','he','she','they','them','their','his','her','our','us',
  'summary','experience','skills','education','projects','certifications','work','professional','responsibilities','achievements'
]);

export const STRONG_ACTION_VERBS = [
  'led','built','delivered','designed','implemented','optimized','launched','migrated','automated','reduced','increased','improved',
  'developed','created','owned','spearheaded','streamlined','engineered','deployed','refactored','enhanced','analyzed','architected',
];

export const BULLET_SYMBOLS = ['-', '•', '*', '—', '–'];

export function cleanText(text) {
  return text
    .replace(/\x00/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function tokenize(text) {
  const lower = text.toLowerCase();
  const matches = lower.match(/[a-zA-Z][a-zA-Z\-\+\.]*|\d+%?/g) || [];
  return matches;
}

export function keywordsFromText(text, topK = 50) {
  const tokens = tokenize(text).filter(t => !STOPWORDS.has(t) && t.length > 2);
  const counts = new Map();
  for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0, topK).map(([w]) => w);
}

export function passiveVoiceRatio(text) {
  const matches = (text.toLowerCase().match(/\b(is|are|was|were|been|being|be|has been|have been)\s+[a-zA-Z]+ed\b/g) || []).length;
  const sentences = (text.split(/[\.!?]\s+/).filter(s => s.trim().length > 0)).length || 1;
  return Math.min(1, matches / sentences);
}

export function bulletLines(text) {
  const lines = text.split(/\n/);
  return lines.map(l => l.trim()).filter(l => BULLET_SYMBOLS.some(b => l.startsWith(b)));
}

export function startsWithStrongVerb(line) {
  const stripped = line.replace(/^[-•*—–\s]+/, '').trim().toLowerCase();
  const first = stripped.split(' ')[0];
  return STRONG_ACTION_VERBS.includes(first);
}
