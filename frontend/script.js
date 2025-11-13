const form = document.getElementById('analyze-form');
const fileInput = document.getElementById('file');
const jdInput = document.getElementById('jd');
const formAlert = document.getElementById('form-alert');

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('fill-demo').addEventListener('click', async () => {
  // Always fill a reasonable JD example
  jdInput.value = `We are seeking a Senior Software Engineer experienced with Node.js, Express, REST APIs, and cloud deployments. The ideal candidate has built scalable services, optimized performance, and collaborated cross-functionally. Experience with CI/CD, Docker, monitoring, and metrics is a plus. Strong communication and ownership are required.`;

  // Demo results (no backend required)
  const demo = {
    atsScore: 78,
    keywordMatch: 62,
    subScores: { keywords: 72, structure: 70, formatting: 68, language: 60 },
    issues: [
      'Weak action verbs',
      'Missing “Skills” section',
      'Few quantified achievements'
    ],
    suggestions: [
      'Add measurable metrics (e.g., +15% performance, -10% costs)',
      'Use consistent bullet symbols throughout',
      'Include technical skills section with relevant tools'
    ],
    formattingTips: [
      'Keep a single professional font across the document',
      'Balance white space; aim for consistent margins and spacing',
      'Standard order: Summary → Experience → Projects → Education → Skills'
    ]
  };
  renderResults(demo);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formAlert.classList.add('d-none');
  const file = fileInput.files[0];
  if (!file) {
    return showError('Please choose a PDF file.');
  }
  if (file.type !== 'application/pdf') {
    return showError('Only PDF files are supported.');
  }
  const fd = new FormData();
  fd.append('file', file);
  if (jdInput.value) fd.append('job_description', jdInput.value);

  try {
    const res = await fetch('/analyze', { method: 'POST', body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed (${res.status})`);
    }
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    showError(err.message || String(err));
  }
});

function showError(msg) {
  formAlert.textContent = msg;
  formAlert.classList.remove('d-none');
}

function setBar(id, v) {
  const el = document.getElementById(id);
  el.style.width = `${Math.max(0, Math.min(100, v))}%`;
}

function setList(id, items) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  (items || []).forEach(i => {
    const li = document.createElement('li');
    li.textContent = i;
    el.appendChild(li);
  });
}

function renderResults(data) {
  // Upload results panel
  document.getElementById('score').textContent = `${data.atsScore}/100`;
  setBar('kw-bar', data.keywordMatch);
  document.getElementById('kw-label').textContent = `Keyword Match: ${data.keywordMatch}%`;
  setBar('sub-keywords', data.subScores.keywords);
  setBar('sub-structure', data.subScores.structure);
  setBar('sub-formatting', data.subScores.formatting);
  setBar('sub-language', data.subScores.language);
  setList('out-issues', data.issues);
  setList('out-suggestions', data.suggestions);
  setList('out-formatting', data.formattingTips);

  // Demo panel
  document.getElementById('demo-score').textContent = `${data.atsScore}/100`;
  document.getElementById('demo-keywords').textContent = `Keyword Match: ${data.keywordMatch}%`;
  setBar('demo-keywords-bar', data.keywordMatch);
  setBar('bar-keywords', data.subScores.keywords);
  setBar('bar-structure', data.subScores.structure);
  setBar('bar-formatting', data.subScores.formatting);
  setBar('bar-language', data.subScores.language);

  // Scroll to demo/results
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}
