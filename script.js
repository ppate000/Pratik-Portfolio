const tabs = Array.from(document.querySelectorAll('.tab[data-target]'));
const panels = Array.from(document.querySelectorAll('.panel'));
const themeToggle = document.getElementById('theme-toggle');
const yearEl = document.getElementById('year');
const themeState = document.getElementById('theme-state');
const projectPageTabs = Array.from(document.querySelectorAll('.topbar .tab[href*="index.html#"]'));
const isProjectDetailPage = document.body.classList.contains('project-page') || document.querySelector('.detail-grid') !== null;

function isIndexPage() {
  return tabs.length > 0 && panels.length > 0;
}

function setActivePanel(targetId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.target === targetId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });

  if (window.location.hash !== `#${targetId}`) {
    history.replaceState(null, '', `#${targetId}`);
  }
}

function initTabs() {
  if (!isIndexPage()) return;

  document.querySelectorAll('[data-jump]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = link.getAttribute('data-jump');
      if (!target) return;
      setActivePanel(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      if (!target) return;
      setActivePanel(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const initial = (window.location.hash || '#about').replace('#', '');
  const targetExists = panels.some((panel) => panel.id === initial);
  setActivePanel(targetExists ? initial : 'about');

  window.addEventListener('hashchange', () => {
    const nextTarget = (window.location.hash || '#about').replace('#', '');
    if (panels.some((panel) => panel.id === nextTarget)) {
      setActivePanel(nextTarget);
    }
  });
}

function initProjectPageTabs() {
  if (isIndexPage() || projectPageTabs.length === 0 || !isProjectDetailPage) return;

  projectPageTabs.forEach((tab) => {
    const href = tab.getAttribute('href') || '';
    if (href.endsWith('index.html#projects')) {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (themeToggle) {
    const nextMode = theme === 'dark' ? 'Dark' : 'Light';
    themeToggle.setAttribute('aria-label', `Theme toggle: ${nextMode} mode`);
  }

  if (themeState) {
    themeState.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }
}

function initTheme() {
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

initTabs();
initProjectPageTabs();
initTheme();
