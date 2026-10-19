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
  summary.setAttribute('aria-label', `选择主题，当前${selected?.querySelector('span')?.firstChild.textContent || '素纸'}`);
  document.querySelector('meta[name="theme-color"]').content = style === 'classic' ? '#18201e' : style === 'index-gradient' ? '#f5eee2' : style === 'clarity' ? '#f6f8fc' : '#f5f4ef';
}
syncTheme();
themeOptions.forEach((option) => option.addEventListener('click', () => {
  document.documentElement.dataset.theme = option.dataset.themeValue;
  document.documentElement.dataset.styleTheme = option.dataset.styleThemeValue;
  try {
    localStorage.setItem('theme', option.dataset.themeValue);
    localStorage.setItem('styleTheme', option.dataset.styleThemeValue);
  } catch (error) {}
  syncTheme();
  option.closest('details').open = false;
  option.closest('details').querySelector('summary').focus();
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

const search = document.querySelector('[data-site-search]');
const searchToggle = document.querySelector('[data-search-toggle]');
const input = search.querySelector('[data-search-input]');
const results = search.querySelector('[data-search-results]');
const status = search.querySelector('[data-search-status]');
const items = JSON.parse(search.dataset.searchItems || '[]');
let previousFocus;
let composing = false;
const shortcut = document.querySelector('[data-search-shortcut]');
shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';

function renderSearch() {
  const query = input.value.trim().toLocaleLowerCase();
  const matches = query ? items.filter((item) => [item.title, item.description, ...item.keywords].join(' ').toLocaleLowerCase().includes(query)) : items.filter((item) => item.type === '文章').slice(0, 6);
  status.textContent = query ? `找到 ${matches.length} 条相关内容` : '最近更新';
  results.replaceChildren();
  search.querySelectorAll('[data-search-filter]').forEach((filter) => filter.setAttribute('aria-pressed', String(filter.dataset.searchFilter === input.value)));
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = '还没有找到这篇笔记。试试更短的关键词，或从分类开始。';
    results.append(empty);
  }
  matches.forEach((item) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = item.href;
    const type = document.createElement('span');
    type.textContent = item.type;
    const title = document.createElement('strong');
    title.textContent = item.title;
    const description = document.createElement('small');
    description.textContent = item.description;
    link.append(type, title, description);
    results.append(link);
  });
  results.scrollTop = 0;
}
function openSearch() {
  if (search.open) return;
  previousFocus = document.activeElement;
  closeUtilities();
  if (!desktop.matches) navigation.open = false;
  renderSearch();
  search.showModal();
  document.documentElement.classList.add('search-is-open');
  searchToggle.setAttribute('aria-expanded', 'true');
  input.focus();
}
searchToggle.addEventListener('click', openSearch);
search.querySelector('[data-search-close]').addEventListener('click', () => search.close());
search.addEventListener('close', () => {
  document.documentElement.classList.remove('search-is-open');
  searchToggle.setAttribute('aria-expanded', 'false');
  // A shortcut may have originated inside a menu that was closed to open search.
  if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus();
  else searchToggle.focus();
});
search.addEventListener('cancel', (event) => { if (composing) event.preventDefault(); });
let backdropPress = false;
search.addEventListener('pointerdown', (event) => { backdropPress = event.target === search; });
search.addEventListener('click', (event) => {
  if (event.target === search && backdropPress) {
    const rect = search.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) search.close();
  }
});
input.addEventListener('compositionstart', () => { composing = true; });
input.addEventListener('compositionend', () => { composing = false; renderSearch(); });
input.addEventListener('input', () => { if (!composing) renderSearch(); });
search.querySelectorAll('[data-search-filter]').forEach((filter) => filter.addEventListener('click', () => {
  input.value = filter.dataset.searchFilter;
  renderSearch();
  input.focus();
}));
search.addEventListener('keydown', (event) => {
  if (event.isComposing || composing) return;
  const links = Array.from(results.querySelectorAll('a'));
  const index = links.indexOf(document.activeElement);
  if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && (event.target === input || index >= 0)) {
    if (!links.length) return;
    event.preventDefault();
    if (event.key === 'ArrowUp' && index <= 0) input.focus();
    else links[Math.min(links.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))].focus();
  }
  if (event.key === 'Enter' && event.target === input && links.length) {
    event.preventDefault();
    links[0].click();
  }
});
document.addEventListener('keydown', (event) => {
  if (!event.isComposing && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (search.open) search.close(); else openSearch();
  }
});
