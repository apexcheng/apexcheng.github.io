import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const source = readFileSync('public/scripts/active-toc.js', 'utf8');

function setup({ hash = '', observer = true, empty = false } = {}) {
  let focused: any;
  const node = (attributes: Record<string, string> = {}) => {
    const classes = new Set<string>();
    const listeners: Record<string, { callback: (event: any) => void; signal?: AbortSignal }[]> = {};
    const element = {
      attributes, classes, open: false, tagName: 'DETAILS',
      classList: { toggle: (name: string, on: boolean) => on ? classes.add(name) : classes.delete(name) },
      getAttribute: (name: string) => attributes[name] ?? null,
      hasAttribute: (name: string) => name in attributes,
      setAttribute: (name: string, value: string) => { attributes[name] = value; },
      removeAttribute: (name: string) => { delete attributes[name]; },
      addEventListener: (type: string, callback: (event: any) => void, options: { signal?: AbortSignal } = {}) => {
        (listeners[type] ??= []).push({ callback, signal: options.signal });
      },
      dispatch(type: string, values = {}) {
        const event = { target: element, button: 0, preventDefault: vi.fn(), ...values };
        listeners[type]?.filter(({ signal }) => !signal?.aborted).forEach(({ callback }) => callback(event));
        return event;
      },
      focus: vi.fn(function (this: any) { focused = this; }),
    };
    return element;
  };
  const summary = node();
  const mobile = { ...node(), querySelector: () => summary };
  const desktop = {
    style: { maxHeight: '' }, scrollTop: 0, clientHeight: 100, scrollHeight: 600,
    getClientRects: () => [{}], getBoundingClientRect: () => ({ top: 100, bottom: 200 }),
  };
  const groups = [0, 1].map(() => ({ ...node(), contains: (_element: any) => false }));
  // Each group owns two headings, and desktop/mobile links share those headings.
  const sections = ['intro', '安装', 'run', 'finish'].map((id, i) => ({
    ...node(), id, top: [-100, 100, 700, 1200][i], getBoundingClientRect() { return { top: this.top }; },
  }));
  const makeLinks = (isMobile: boolean) => sections.map((section, i) => ({
    ...node({ href: '#' + encodeURIComponent(section.id) }),
    getBoundingClientRect: () => ({ top: 100 + i * 120, bottom: 130 + i * 120 }),
    closest(selector: string): any {
      if (selector === 'a.toc-link') return this;
      if (selector === '.toc-panel') return isMobile ? null : desktop;
      if (selector === '.mobile-toc-panel') return isMobile ? mobile : null;
      if (selector === '[data-toc-group]') return isMobile ? groups[Math.floor(i / 2)] : null;
      return null;
    },
  }));
  const desktopLinks = makeLinks(false);
  const mobileLinks = makeLinks(true);
  function groupFor(element: any) { return element?.closest?.('[data-toc-group]'); }
  groups.forEach((group) => { group.contains = (element: any) => groupFor(element) === group; });
  const observed: any[] = [];
  const disconnect = vi.fn();
  class IntersectionObserver {
    constructor(public callback: () => void) {}
    observe(element: any) { observed.push(element); }
    disconnect = disconnect;
  }
  const frames = new Map<number, () => void>();
  let nextFrame = 0;
  const window = {
    ...node(), innerHeight: 800, location: { hash },
    requestAnimationFrame: (callback: () => void) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
    ...(observer ? { IntersectionObserver } : {}),
  };
  const document = {
    ...node(), get activeElement() { return focused; },
    getElementById: (id: string) => sections.find((section) => section.id === id),
    querySelectorAll: (selector: string) => empty ? [] : selector === '.toc-link' ? [...desktopLinks, ...mobileLinks] : groups,
    querySelector: (selector: string) => selector === '.mobile-toc-panel' ? mobile : desktop,
  };
  vm.runInNewContext(source, { document, window, IntersectionObserver, AbortController });
  document.dispatch('DOMContentLoaded');
  const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); };
  return { document, window, mobile, summary, desktop, groups, sections, desktopLinks, mobileLinks, observed, disconnect, frames, flush, focused: () => focused };
}

describe('active toc script', () => {
  it('fits the desktop panel to the remaining viewport and reveals the active link', () => {
    const s = setup();
    expect(s.desktop.style.maxHeight).toBe('684px');
    expect(s.desktop.scrollTop).toBeGreaterThan(0);
    expect(s.desktopLinks[1].classes.has('is-active')).toBe(true);
    expect(s.mobileLinks[1].attributes['aria-current']).toBe('location');
    expect(s.observed).toHaveLength(4);
  });

  it('changes the current mobile group without opening the outer details', () => {
    const s = setup();
    expect(s.groups.map((group) => group.open)).toEqual([true, false]);
    s.sections[2].top = 150;
    s.window.dispatch('scroll'); s.window.dispatch('scroll');
    expect(s.frames.size).toBe(1);
    s.flush();
    expect(s.mobile.open).toBe(false);
    expect(s.groups.map((group) => group.open)).toEqual([false, true]);
    expect(s.mobileLinks[2].classes.has('is-active')).toBe(true);
    expect(s.mobileLinks[1].attributes['aria-current']).toBeUndefined();
  });

  it('allows manual groups to stay open within a chapter and never hides a focused link', () => {
    const s = setup();
    s.groups[1].open = true;
    s.window.dispatch('scroll'); s.flush();
    expect(s.groups[1].open).toBe(true);
    s.mobileLinks[1].focus(); s.sections[2].top = 150;
    s.window.dispatch('scroll'); s.flush();
    expect(s.groups[0].open).toBe(true);
    expect(s.groups[1].open).toBe(true);
  });

  it('closes on a heading link, focuses the destination and preserves native URL navigation', () => {
    const s = setup(); s.mobile.open = true;
    const event = s.mobile.dispatch('click', { target: s.mobileLinks[1] });
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(s.mobile.open).toBe(false);
    expect(s.sections[1].focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(s.focused()).toBe(s.sections[1]);
    expect(s.sections[1].attributes.tabindex).toBe('-1');
    s.sections[1].dispatch('blur');
    expect(s.sections[1].attributes.tabindex).toBeUndefined();
  });

  it('leaves modified links alone and restores focus on Escape', () => {
    const s = setup(); s.mobile.open = true;
    s.mobile.dispatch('click', { target: s.mobileLinks[1], ctrlKey: true });
    expect(s.mobile.open).toBe(true);
    expect(s.sections[1].focus).not.toHaveBeenCalled();
    s.mobile.dispatch('keydown', { key: 'Escape' });
    expect(s.mobile.open).toBe(false);
    expect(s.focused()).toBe(s.summary);
  });

  it('supports initial encoded hashes and back/forward hash changes without IntersectionObserver', () => {
    const s = setup({ hash: '#run', observer: false });
    expect(s.mobileLinks[2].attributes['aria-current']).toBe('location');
    s.window.location.hash = '#%E5%AE%89%E8%A3%85'; s.window.dispatch('hashchange');
    expect(s.mobileLinks[1].attributes['aria-current']).toBe('location');
    expect(s.mobile.open).toBe(false);
    s.window.location.hash = '#%broken';
    expect(() => { s.window.dispatch('hashchange'); s.flush(); }).not.toThrow();
  });

  it('cleans up old observers and listeners on a repeated page load', () => {
    const s = setup(); s.document.dispatch('astro:page-load');
    expect(s.disconnect).toHaveBeenCalledTimes(1);
    s.mobile.dispatch('click', { target: s.mobileLinks[0] });
    expect(s.sections[0].focus).toHaveBeenCalledTimes(1);
  });

  it('does nothing on an article without a public TOC', () => {
    const s = setup({ empty: true });
    expect(s.observed).toHaveLength(0);
    expect(s.desktop.style.maxHeight).toBe('');
  });
});
