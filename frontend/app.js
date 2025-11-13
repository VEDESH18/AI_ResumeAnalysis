document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Highlight active nav link based on path
  const path = location.pathname.toLowerCase();
  document.querySelectorAll('a.nav-link, a.btn-nav').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (!href) return;
    const isSame = (href.endsWith('/') && path.endsWith('/')) || path.endsWith(href);
    if (isSame) a.classList.add('active-link');
  });
});
