import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

const source = readFileSync('public/scripts/article-overflow.js', 'utf8');

function setup({ resizeObserver = true } = {}) {
  const node = (width: number, scrollWidth: number, attributes: Record<string, string> = {}) => {
    const classes = new Set<string>();
    return {
      clientWidth: width, scrollWidth, attributes, classes, firstElementChild: {},
      classList: {
        toggle: (name: string, enabled: boolean) => enabled ? classes.add(name) : classes.delete(name),
        remove: (name: string) => classes.delete(name),
      },
      getAttribute: (name: string) => attributes[name] ?? null,
      setAttribute: (name: string, value: string) => { attributes[name] = value; },
      removeAttribute: (name: string) => { delete attributes[name]; },
      closest: (_selector: string): any => null,
      after: vi.fn(),
    };
  };
  const pre = node(300, 600, { 'aria-describedby': 'existing-description' });
  const table = node(300, 300);
  const expressiveCode = node(300, 300);
  const expressivePre = node(300, 500, { tabindex: '-1' });
  const secondExpressivePre = node(300, 550);
  expressivePre.closest = secondExpressivePre.closest = () => expressiveCode;
  const scrollers = [pre, table, expressivePre, secondExpressivePre];
  const created: any[] = [];
  const listeners: Record<string, () => void> = {};
  const frames = new Map<number, () => void>();
  let id = 0;
  let resize: () => void;
  const observe = vi.fn(); const disconnect = vi.fn();
  class ResizeObserver {
    constructor(callback: () => void) { resize = callback; }
    observe = observe;
    disconnect = disconnect;
  }
  const document = {
    addEventListener: (type: string, callback: () => void) => { listeners[type] = callback; },
    querySelectorAll: vi.fn(() => scrollers),
    createElement: () => { const element = { id: '', hidden: false, textContent: '', remove: vi.fn() }; created.push(element); return element; },
  };
  const window = {
    ...(resizeObserver ? { ResizeObserver } : {}),
    requestAnimationFrame: (callback: () => void) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
    addEventListener: (type: string, callback: () => void) => { listeners[type] = callback; },
    removeEventListener: (type: string) => { delete listeners[type]; },
  };
  vm.runInNewContext(source, { document, window, ResizeObserver });
  const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); };
  listeners.DOMContentLoaded(); flush();
  return { pre, table, expressiveCode, expressivePre, scrollers, created, document, listeners, frames, flush, observe, disconnect, resize: () => resize() };
}

describe('article horizontal overflow hints', () => {
  it('marks only overflowing blocks and places one hint outside each code frame', () => {
    const s = setup();
    expect(s.pre.classes.has('has-horizontal-overflow')).toBe(true);
    expect(s.table.classes.has('has-horizontal-overflow')).toBe(false);
    expect(s.created).toHaveLength(2);
    expect(s.created[0].textContent).toBe('左右滑动查看更多');
    expect(s.pre.after).toHaveBeenCalledWith(s.created[0]);
    expect(s.expressiveCode.after).toHaveBeenCalledTimes(1);
    expect(s.expressivePre.after).not.toHaveBeenCalled();
    expect(s.pre.attributes.tabindex).toBe('0');
    expect(s.expressivePre.attributes.tabindex).toBe('-1');
    expect(s.pre.attributes['aria-describedby']).toBe('existing-description article-overflow-hint-1');
  });

  it('recomputes on resize in one frame and removes hints/focus stops once content fits', () => {
    const s = setup();
    s.pre.clientWidth = 700; s.table.scrollWidth = 800;
    s.resize(); s.resize(); s.listeners.resize();
    expect(s.frames.size).toBe(1);
    s.flush();
    expect(s.created[0].hidden).toBe(true);
    expect(s.pre.attributes.tabindex).toBeUndefined();
    expect(s.pre.attributes['aria-describedby']).toBe('existing-description');
    expect(s.table.attributes.tabindex).toBe('0');
    expect(s.created).toHaveLength(3);
    s.pre.clientWidth = 300; s.listeners.resize(); s.flush();
    expect(s.created).toHaveLength(3);
    expect(s.created[0].hidden).toBe(false);
  });

  it('ignores invisible elements and fractional rounding without requiring ResizeObserver', () => {
    const s = setup({ resizeObserver: false });
    s.pre.clientWidth = 0; s.table.scrollWidth = 301;
    s.listeners.resize(); s.flush();
    expect(s.created[0].hidden).toBe(true);
    expect(s.table.classes.has('has-horizontal-overflow')).toBe(false);
  });

  it('limits the selector to direct prose blocks and cleans up on repeat initialization', () => {
    const s = setup();
    expect(s.document.querySelectorAll.mock.calls[0][0]).toBe('.article-content > pre, .article-content > .expressive-code pre, .article-content > table');
    expect(s.observe).toHaveBeenCalledTimes(8);
    s.listeners['astro:page-load'](); s.flush();
    expect(s.disconnect).toHaveBeenCalledTimes(1);
    expect(s.created[0].remove).toHaveBeenCalled();
    expect(s.pre.attributes['aria-describedby']).toBe('existing-description article-overflow-hint-1');
  });
});
