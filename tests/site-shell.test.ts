import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const source = readFileSync('src/scripts/site-shell.js', 'utf8');

// A small DOM contract harness runs the production script. Native dialog focus
// containment and CSS layout still require acceptance in a real browser.
function setup({ mobile = false, blockedStorage = false } = {}) {
  let active: Element;
  class Element {
    tag: string;
    dataset: Record<string, string> = {};
    attributes: Record<string, string> = {};
    children: Element[] = [];
    parent: Element | null = null;
    listeners: Record<string, ((event: any) => void)[]> = {};
    classes = new Set<string>();
    classList = { add: (name: string) => this.classes.add(name), remove: (name: string) => this.classes.delete(name) };
    open = false;
    isConnected = true;
    value = '';
    href = '';
    content = '';
    scrollTop = 0;
    className = '';
    firstChild = { textContent: '' };
    clicks = 0;
    constructor(tag = 'div', dataset = {}) { this.tag = tag; this.dataset = dataset; }
    set textContent(value: string) { this.firstChild.textContent = value; }
    get textContent() { return this.firstChild.textContent; }
    setAttribute(name: string, value: string) { this.attributes[name] = value; }
    append(...nodes: Element[]) { nodes.forEach((node) => { node.parent = this; this.children.push(node); }); }
    replaceChildren(...nodes: Element[]) { this.children = []; this.append(...nodes); }
    matches(selector: string): boolean {
      if (selector.includes(',')) return selector.split(',').some((part) => this.matches(part.trim()));
      const data = selector.match(/^\[data-([\w-]+)(?:="([^"]+)")?\]$/);
      if (data) {
        const key = data[1].replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        return key in this.dataset && (data[2] === undefined || this.dataset[key] === data[2]);
      }
      return selector === this.tag;
    }
    querySelectorAll(selector: string): Element[] {
      return this.children.flatMap((child) => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
    }
    querySelector(selector: string): Element | null {
      if (selector.includes(' > ')) {
        const [parent, child] = selector.split(' > ');
        return this.querySelector(parent)?.children.find((item) => item.matches(child)) ?? null;
      }
      return this.querySelectorAll(selector)[0] ?? null;
    }
    contains(node: Element): boolean { return this === node || this.children.some((child) => child.contains(node)); }
    closest(selector: string): Element | null { return this.matches(selector) ? this : this.parent?.closest(selector) ?? null; }
    addEventListener(type: string, callback: (event: any) => void) { (this.listeners[type] ??= []).push(callback); }
    dispatch(type: string, values: Record<string, unknown> = {}) {
      const event = { target: this, button: 0, preventDefault: vi.fn(), ...values };
      this.listeners[type]?.forEach((callback) => callback(event));
      return event;
    }
    focus() { active = this; }
    click() { this.clicks++; this.dispatch('click'); }
    showModal() { this.open = true; }
    close() { this.open = false; this.dispatch('close'); }
    getBoundingClientRect() { return { left: 10, top: 10, right: 500, bottom: 500 }; }
    getClientRects() { return [this.getBoundingClientRect()]; }
  }
  const root = new Element('html');
  root.dataset = { theme: 'light', styleTheme: 'visual-system' };
  const header = new Element('header', { siteHeader: '' });
  const navigation = new Element('details', { siteNavigation: '' });
  const navToggle = new Element('summary');
  navigation.append(navToggle);
  const themeMenu = new Element('details', { utilityMenu: 'theme' });
  const themeSummary = new Element('summary');
  themeMenu.append(themeSummary);
  const themeOptions = ['visual-system', 'clarity', 'index-gradient', 'classic'].map((style, i) => {
    const option = new Element('button', { themeOption: '', styleThemeValue: style, themeValue: i === 3 ? 'dark' : 'light' });
    const label = new Element('span'); label.textContent = ['素纸', '清晰经典', '晨曦', '玄墨'][i]; option.append(label); themeMenu.append(option); return option;
  });
  const introMenu = new Element('details', { utilityMenu: 'intro' });
  const introSummary = new Element('summary');
  const introLink = new Element('a', { introLink: '' });
  introLink.href = 'https://example.test/intro-motion-3/?return=%2F';
  introMenu.append(introSummary, introLink);
  navigation.append(themeMenu, introMenu);
  const toggle = new Element('button', { searchToggle: '' });
  const shortcut = new Element('kbd', { searchShortcut: '' });
  toggle.append(shortcut);
  header.append(navigation, toggle);
  const search = new Element('dialog', { siteSearch: '', searchItems: JSON.stringify([
    { type: '文章', title: '分页查询的问题', description: 'total 变化', href: '/articles/pagination/', category: '实践', keywords: ['实践', 'API'] },
    { type: '文章', title: '<img src=x onerror=alert(1)>', description: '文本应原样显示', href: '/articles/text/', category: '生活', keywords: ['生活'] },
    { type: '项目', title: '订单处理', description: 'Python 自动化', href: '/projects/', category: '', keywords: ['Excel', 'RPA'] },
  ]) });
  const input = new Element('input', { searchInput: '' });
  const results = new Element('div', { searchResults: '' });
  const status = new Element('p', { searchStatus: '' });
  const close = new Element('button', { searchClose: '' });
  const filter = new Element('button', { searchFilter: '生活' });
  search.append(input, results, status, close, filter);
  const meta = new Element('meta');
  root.append(header, search, meta);
  active = toggle;
  const document = {
    documentElement: root,
    get activeElement() { return active; },
    querySelector: (selector: string) => selector === 'meta[name="theme-color"]' ? meta : root.querySelector(selector),
    querySelectorAll: (selector: string) => root.querySelectorAll(selector),
    createElement: (tag: string) => new Element(tag),
    addEventListener: root.addEventListener.bind(root),
  };
  const stored = new Map<string, string>();
  const storage = { setItem: (key: string, value: string) => { if (blockedStorage) throw new Error('Blocked'); stored.set(key, value); } };
  let viewportChange: () => void = () => {};
  const viewport = { matches: !mobile, addEventListener: (_type: string, callback: () => void) => { viewportChange = callback; } };
  const location = { pathname: '/articles/pagination/', search: '?from=home', hash: '#part-2' };
  vm.runInNewContext(source, {
    document, window: { matchMedia: () => viewport, location },
    navigator: { platform: 'MacIntel' }, localStorage: storage, sessionStorage: storage, URL,
  });
  return { root, header, navigation, navToggle, themeMenu, themeSummary, themeOptions, introMenu, introSummary, introLink, toggle, search, input, results, status, close, filter, stored, meta, viewport, viewportChange, location, focused: () => active };
}

describe('production shared-shell interactions', () => {
  it('opens recent notes and restores focus and scroll after closing', () => {
    const s = setup(); s.toggle.click();
    expect(s.search.open).toBe(true);
    expect(s.focused()).toBe(s.input);
    expect(s.results.children).toHaveLength(2);
    expect(s.root.classes.has('search-is-open')).toBe(true);
    expect(s.toggle.attributes['aria-expanded']).toBe('true');
    s.close.click();
    expect(s.search.open).toBe(false);
    expect(s.root.classes.has('search-is-open')).toBe(false);
    expect(s.focused()).toBe(s.toggle);
  });
  it('searches titles, descriptions and tags across articles and projects, and displays untrusted text literally', () => {
    const s = setup(); s.toggle.click();
    expect(s.results.children[1].children[1].textContent).toBe('<img src=x onerror=alert(1)>');
    s.input.value = 'eXCeL'; s.input.dispatch('input');
    expect(s.results.children).toHaveLength(1);
    expect(s.results.children[0].href).toBe('/projects/');
    s.input.value = 'nothing matches'; s.input.dispatch('input');
    expect(s.status.textContent).toBe('找到 0 条相关内容');
    expect(s.results.querySelectorAll('a')).toHaveLength(0);
    s.input.value = ''; s.input.dispatch('input');
    s.filter.click();
    expect(s.input.value).toBe('');
    expect(s.results.children[0].href).toBe('/articles/text/');
    expect(s.filter.attributes['aria-pressed']).toBe('true');
    s.input.value = '分页'; s.input.dispatch('input');
    expect(s.results.querySelectorAll('a')).toHaveLength(0);
    expect(s.input.value).toBe('分页');
    s.filter.click();
    expect(s.results.children[0].href).toBe('/articles/pagination/');
    expect(s.filter.attributes['aria-pressed']).toBe('false');
  });
  it('matches separate words and closes a populated search with a single Escape', () => {
    const s = setup(); s.toggle.click();
    s.input.value = '分页 API'; s.input.dispatch('input');
    expect(s.results.children).toHaveLength(1);
    expect(s.results.children[0].href).toBe('/articles/pagination/');
    const event = s.search.dispatch('keydown', { key: 'Escape', target: s.input });
    expect(event.preventDefault).toHaveBeenCalled();
    expect(s.search.open).toBe(false);
    expect(s.focused()).toBe(s.toggle);
  });
  it('defers search and Enter navigation until Chinese composition finishes', () => {
    const s = setup(); s.toggle.click();
    const first = s.results.children[0];
    s.input.dispatch('compositionstart'); s.input.value = '生活'; s.input.dispatch('input');
    expect(s.search.dispatch('cancel').preventDefault).toHaveBeenCalled();
    s.search.dispatch('keydown', { key: 'Enter', target: s.input, isComposing: true });
    expect(first.clicks).toBe(0);
    expect(s.results.children).toHaveLength(2);
    s.input.dispatch('compositionend');
    expect(s.results.children).toHaveLength(1);
    expect(s.results.children[0].href).toBe('/articles/text/');
    expect(s.search.dispatch('cancel').preventDefault).not.toHaveBeenCalled();
  });
  it('moves from the input to results and back, and supports a keyboard shortcut', () => {
    const s = setup();
    s.root.dispatch('keydown', { key: 'k', metaKey: true });
    expect(s.search.open).toBe(true);
    s.search.dispatch('keydown', { key: 'ArrowDown', target: s.input });
    expect(s.focused()).toBe(s.results.children[0]);
    s.search.dispatch('keydown', { key: 'ArrowDown', target: s.focused() });
    expect(s.focused()).toBe(s.results.children[1]);
    s.search.dispatch('keydown', { key: 'ArrowUp', target: s.focused() });
    s.search.dispatch('keydown', { key: 'ArrowUp', target: s.focused() });
    expect(s.focused()).toBe(s.input);
    s.root.dispatch('keydown', { key: 'k', ctrlKey: true });
    expect(s.search.open).toBe(false);
  });
  it('only dismisses a backdrop click if both pointerdown and click began outside the dialog content', () => {
    const s = setup(); s.toggle.click();
    s.search.dispatch('pointerdown', { target: s.input });
    s.search.dispatch('click', { clientX: 0, clientY: 0 });
    expect(s.search.open).toBe(true);
    s.search.dispatch('pointerdown'); s.search.dispatch('click', { clientX: 50, clientY: 50 });
    expect(s.search.open).toBe(true);
    s.search.dispatch('pointerdown'); s.search.dispatch('click', { clientX: 0, clientY: 0 });
    expect(s.search.open).toBe(false);
  });
  it('persists the selected theme and returns focus even with blocked storage', () => {
    for (const blockedStorage of [false, true]) {
      const s = setup({ blockedStorage });
      s.themeMenu.open = true; s.themeOptions[3].click();
      expect(s.root.dataset).toEqual({ theme: 'dark', styleTheme: 'classic' });
      expect(s.themeOptions[3].attributes['aria-pressed']).toBe('true');
      expect(s.themeOptions[0].attributes['aria-pressed']).toBe('false');
      expect(s.meta.content).toBe('#18201e');
      expect(s.themeMenu.open).toBe(false);
      expect(s.focused()).toBe(s.themeSummary);
      if (!blockedStorage) expect(s.stored.get('theme')).toBe('dark');
    }
  });
  it('switches to the cool clarity theme, remembers its selection and updates the browser color', () => {
    const s = setup();
    s.themeMenu.open = true;
    s.themeOptions[1].click();
    expect(s.root.dataset).toEqual({ theme: 'light', styleTheme: 'clarity' });
    expect(s.themeOptions[1].attributes['aria-pressed']).toBe('true');
    expect(s.meta.content).toBe('#f6f8fc');
    expect(s.stored.get('styleTheme')).toBe('clarity');
  });
  it('closes mobile navigation on Escape and search, and resets correctly at the desktop breakpoint', () => {
    const s = setup({ mobile: true });
    expect(s.navigation.open).toBe(false);
    s.navigation.open = true;
    s.root.dispatch('keydown', { key: 'Escape' });
    expect(s.navigation.open).toBe(false);
    expect(s.focused()).toBe(s.navToggle);
    s.navigation.open = true; s.toggle.click();
    expect(s.navigation.open).toBe(false);
    s.close.click();
    s.viewport.matches = true; s.viewportChange();
    expect(s.navigation.open).toBe(true);
  });
  it('keeps utility menus mutually exclusive and returns focus on Escape', () => {
    const s = setup(); s.themeMenu.open = true; s.introMenu.open = true;
    s.introMenu.dispatch('toggle');
    expect(s.themeMenu.open).toBe(false);
    s.root.dispatch('keydown', { key: 'Escape' });
    expect(s.introMenu.open).toBe(false);
    expect(s.focused()).toBe(s.introSummary);
  });
  it('opens the last theme with ArrowUp and wraps through the options', () => {
    const s = setup(); s.themeSummary.focus();
    s.themeMenu.dispatch('keydown', { key: 'ArrowUp' });
    expect(s.focused()).toBe(s.themeOptions[3]);
    s.themeMenu.dispatch('keydown', { key: 'ArrowDown' });
    expect(s.focused()).toBe(s.themeOptions[0]);
  });
  it('retains query and anchor when returning from an intro, without changing state on modified clicks', () => {
    const s = setup(); const path = '/articles/pagination/?from=home#part-2';
    expect(new URL(s.introLink.href).searchParams.get('return')).toBe(path);
    s.introLink.dispatch('click', { metaKey: true });
    expect(s.stored.has('site-intro-seen-v1')).toBe(false);
    s.introLink.click();
    expect(s.stored.get('site-intro-return-v1')).toBe(path);
    expect(s.stored.get('site-intro-seen-v1')).toBe('1');
    s.location.hash = '#part-3';
    s.location.search = '?from=series';
    s.introLink.click();
    expect(s.stored.get('site-intro-return-v1')).toBe('/articles/pagination/?from=series#part-3');
    expect(new URL(s.introLink.href).searchParams.get('return')).toBe('/articles/pagination/?from=series#part-3');
  });
});
