const form = document.getElementById('analyze-form');
const fileInput = document.getElementById('file');
const jdInput = document.getElementById('jd');
const formAlert = document.getElementById('form-alert');

const SAMPLE = {
  atsScore: 78,
  keywordMatch: 62,
  subScores: { keywords: 72, structure: 70, formatting: 68, language: 60 },
  sections: { experience: '• Built APIs...\n• Improved performance...'},
  contacts: { email: 'jane.doe@email.com' },
  skills: ['JavaScript','Node.js','Express','REST','Docker'],
  keywords: ['node','express','api'],
  issues: ['Weak action verbs','Missing “Skills” section','Few quantified achievements'],
  suggestions: ['Add measurable metrics','Use consistent bullet style','Include technical skills section'],
  formattingTips: ['Use one bullet style throughout','Keep section headings consistent']
};

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('fill-demo').addEventListener('click', () => {
  jdInput.value = `We are seeking a Senior Software Engineer experienced with Node.js, Express, REST APIs, and cloud deployments. The ideal candidate has built scalable services, optimized performance, and collaborated cross-functionally. Experience with CI/CD, Docker, monitoring, and metrics is a plus. Strong communication and ownership are required.`;
});

async function requireAuthIfEnabled() {
  try {
    const res = await fetch('/config/public');
    const cfg = await res.json();
    const key = cfg?.clerkPublishableKey;
    if (!key) return true; // auth disabled
    // Wait for Clerk script
    let tries = 0;
    while (!window.Clerk && tries < 20) {
      await new Promise(r => setTimeout(r, 100));
      tries++;
    }
    if (!window.Clerk) return true; // fail-open
    await window.Clerk.load({ publishableKey: key });
    // If not signed in, redirect to sign-in
    const isSignedIn = !!window.Clerk.user || !!window.Clerk.session || window.Clerk.isSignedIn;
    if (!isSignedIn) {
      const redirect = `/sign-in.html?redirect_url=${encodeURIComponent(location.pathname)}`;
      window.location.href = redirect;
      return false;
    }
    return true;
  } catch {
    return true; // fail-open if config not reachable
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formAlert.classList.add('d-none');
  // Gate with auth if enabled
  const ok = await requireAuthIfEnabled();
  if (!ok) return;
  const file = fileInput.files[0];
  if (!file) return showError('Please choose a PDF file.');
  if (file.type !== 'application/pdf') return showError('Only PDF files are supported.');

  const fd = new FormData();
  fd.append('file', file);
  if (jdInput.value) fd.append('job_description', jdInput.value);

  try {
    const res = await fetch('/analyze', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Backend not reachable');
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    // Demo fallback
    renderResults(SAMPLE);
  }
});

function showError(msg) {
  formAlert.textContent = msg;
  formAlert.classList.remove('d-none');
}

function setBar(id, v) { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0, Math.min(100, v))}%`; }
function setList(id, items) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = '';
  (items || []).forEach(i => { const li = document.createElement('li'); li.textContent = i; el.appendChild(li); });
}

function renderResults(data) {
  const safe = (n) => typeof n === 'number' ? n : 0;
  const score = document.getElementById('score'); if (score) score.textContent = `${safe(data.atsScore)}/100`;
  setBar('kw-bar', safe(data.keywordMatch));
  const kwl = document.getElementById('kw-label'); if (kwl) kwl.textContent = `Keyword Match: ${safe(data.keywordMatch)}%`;
  setBar('sub-keywords', safe(data.subScores?.keywords));
  setBar('sub-structure', safe(data.subScores?.structure));
  setBar('sub-formatting', safe(data.subScores?.formatting));
  setBar('sub-language', safe(data.subScores?.language));
  setList('out-issues', data.issues);
  setList('out-suggestions', data.suggestions);
  setList('out-formatting', data.formattingTips);
}
