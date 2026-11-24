const search = document.querySelector('[data-site-search]');
const searchToggle = document.querySelector('[data-search-toggle]');
const input = search.querySelector('[data-search-input]');
const results = search.querySelector('[data-search-results]');
const status = search.querySelector('[data-search-status]');
const items = JSON.parse(search.dataset.searchItems || '[]');
let previousFocus;
let composing = false;
let selectedCategory = '';
let selectedType = '';
const categories = search.querySelector('[data-search-categories]');
const categoryButtons = Array.from(search.querySelectorAll('[data-search-filter]'));
const typeButtons = Array.from(search.querySelectorAll('[data-search-type]'));
const shortcut = document.querySelector('[data-search-shortcut]');
if (shortcut) shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';

function renderSearch() {
  const query = input.value.trim().toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const filtered = terms.length || selectedType || selectedCategory;
  const matches = filtered
    ? items.filter((item) => (selectedCategory === '视觉实验室' || item.category !== '视觉实验室')
      && (!selectedType || item.type === selectedType)
      && (!selectedCategory || item.category === selectedCategory)
      && terms.every((term) => [item.type, item.title, item.description, ...item.keywords].join(' ').toLocaleLowerCase().includes(term)))
    : items.filter((item) => item.type === '文章' && item.category !== '视觉实验室').slice(0, 6);
  if (terms.length) {
    const titlePriority = (item) => {
      const title = item.title.toLocaleLowerCase();
      if (title === query) return 3;
      if (terms.every((term) => title.includes(term))) return 2;
      return terms.some((term) => title.includes(term)) ? 1 : 0;
    };
    matches.sort((a, b) => titlePriority(b) - titlePriority(a));
  }
  status.textContent = filtered ? `找到 ${matches.length} 条相关内容` : '最近更新的文章';
  results.replaceChildren();
  categories.hidden = selectedType !== '文章';
  typeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.searchType === selectedType)));
  categoryButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.searchFilter === selectedCategory)));
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = '没有找到相关内容。试试更短的关键词，或切换到「全部」。';
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
  document.dispatchEvent(new Event('site-search-open'));
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
typeButtons.forEach((button) => button.addEventListener('click', () => {
  selectedType = button.dataset.searchType;
  selectedCategory = '';
  renderSearch();
}));
categoryButtons.forEach((filter) => filter.addEventListener('click', () => {
  selectedCategory = selectedCategory === filter.dataset.searchFilter ? '' : filter.dataset.searchFilter;
  renderSearch();
}));
search.addEventListener('keydown', (event) => {
  if (event.isComposing || composing) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    search.close();
    return;
  }
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
  if (!event.isComposing && !composing && !event.altKey && !event.shiftKey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (search.open) search.close(); else openSearch();
  }
});
