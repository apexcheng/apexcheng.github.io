const header = document.querySelector('[data-site-header]');
const navigation = document.querySelector('[data-site-navigation]');
const navigationToggle = navigation?.querySelector('summary');
const utilities = Array.from(document.querySelectorAll('[data-utility-menu]'));
const desktop = window.matchMedia('(min-width: 1060px)');

function closeUtilities(except) {
  utilities.forEach((menu) => { if (menu !== except) menu.open = false; });
}

function syncNavigation() {
  navigation.open = desktop.matches;
  closeUtilities();
}
syncNavigation();
desktop.addEventListener('change', syncNavigation);
navigation.addEventListener('toggle', () => {
  navigationToggle.setAttribute('aria-label', navigation.open ? '关闭主导航' : '打开主导航');
  if (!navigation.open) closeUtilities();
});
navigation.addEventListener('focusout', (event) => {
  if (!desktop.matches && !navigation.contains(event.relatedTarget)) navigation.open = false;
});

utilities.forEach((menu) => {
  menu.addEventListener('toggle', () => { if (menu.open) closeUtilities(menu); });
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });
  menu.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const options = Array.from(menu.querySelectorAll('button, a'));
    const index = options.indexOf(document.activeElement);
    const direction = event.key === 'ArrowUp' ? -1 : 1;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
      : index < 0 ? (direction === 1 ? 0 : options.length - 1)
      : (index + direction + options.length) % options.length;
    event.preventDefault();
    menu.open = true;
    options[next]?.focus();
  });
});

document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) {
    closeUtilities();
    if (!desktop.matches) navigation.open = false;
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openUtility = utilities.find((menu) => menu.open);
  if (openUtility) {
    openUtility.open = false;
    openUtility.querySelector('summary').focus();
  } else if (!desktop.matches && navigation.open) {
    navigation.open = false;
    navigationToggle.focus();
  }
});

const themeOptions = Array.from(document.querySelectorAll('[data-theme-option]'));
function syncTheme() {
  const style = document.documentElement.dataset.styleTheme;
  const selected = themeOptions.find((option) => option.dataset.styleThemeValue === style);
  themeOptions.forEach((option) => option.setAttribute('aria-pressed', String(option === selected)));
  const summary = document.querySelector('[data-utility-menu="theme"] > summary');
  summary.setAttribute('aria-label', `选择主题，当前${selected?.querySelector('span')?.firstChild.textContent || '纸张手记'}`);
  document.querySelector('meta[name="theme-color"]').content = style === 'classic' ? '#18201e' : style === 'clarity' ? '#f6f8fc' : '#f5f4ef';
}
syncTheme();
themeOptions.forEach((option) => option.addEventListener('click', () => {
  const currentStyle = document.documentElement.dataset.styleTheme;
  const homeStyle = option.dataset.homeStyleValue;
  document.documentElement.dataset.theme = option.dataset.themeValue;
  document.documentElement.dataset.styleTheme = option.dataset.styleThemeValue;
  try {
    if (homeStyle) {
      localStorage.setItem('homeStyle', homeStyle);
    } else if (!localStorage.getItem('homeStyle')) {
      localStorage.setItem('homeStyle', currentStyle === 'clarity' ? 'visual-blue' : 'paper-notes');
    }
    localStorage.setItem('theme', option.dataset.themeValue);
    localStorage.setItem('styleTheme', option.dataset.styleThemeValue);
  } catch (error) {}
  syncTheme();
  option.closest('details').open = false;
  option.closest('details').querySelector('summary').focus();
  const homeUrl = option.dataset.homeUrl;
  if (homeStyle && homeUrl && window.location.pathname !== homeUrl) {
    window.location.assign(homeUrl);
  }
}));

document.querySelectorAll('[data-intro-link]').forEach((link) => {
  function updateReturnPath() {
    const current = window.location.pathname + window.location.search + window.location.hash;
    const target = new URL(link.href);
    target.searchParams.set('return', current);
    link.href = target.href;
    return current;
  }
  updateReturnPath();
  link.addEventListener('focus', updateReturnPath);
  link.addEventListener('pointerdown', updateReturnPath);
  link.addEventListener('click', (event) => {
    const current = updateReturnPath();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      localStorage.setItem('site-intro-seen-v1', '1');
      sessionStorage.setItem('site-intro-return-v1', current);
    } catch (error) {}
  });
});

document.addEventListener('site-search-open', () => {
  closeUtilities();
  if (!desktop.matches) navigation.open = false;
});
