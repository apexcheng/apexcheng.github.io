let disposeArticleOverflow;

const updateArticleOverflow = () => {
  disposeArticleOverflow?.();
  // Direct prose blocks only; custom visual components manage their own scrolling.
  const scrollers = Array.from(document.querySelectorAll(
    '.article-content > pre, .article-content > .expressive-code pre, .article-content > table'
  ));
  if (!scrollers.length) return;

  const hosts = new Map();
  const entries = scrollers.map((element) => {
    const host = element.closest('.expressive-code') || element;
    if (!hosts.has(host)) hosts.set(host, { hint: null });
    return { element, host, originalTabindex: element.getAttribute('tabindex') };
  });
  let frame = 0;
  let disposed = false;
  const setDescription = (element, id, enabled) => {
    const ids = new Set((element.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    if (enabled) ids.add(id);
    else ids.delete(id);
    if (ids.size) element.setAttribute('aria-describedby', [...ids].join(' '));
    else element.removeAttribute('aria-describedby');
  };
  const measure = () => {
    // Read all widths before updating the DOM to avoid interleaved layout work.
    const overflowing = entries.map(({ element }) => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1);
    const activeHosts = new Set(entries.filter((_, index) => overflowing[index]).map(({ host }) => host));
    let index = 0;
    hosts.forEach((state, host) => {
      index++;
      if (activeHosts.has(host) && !state.hint) {
        const hint = document.createElement('span');
        hint.id = `article-overflow-hint-${index}`;
        hint.className = 'article-overflow-hint';
        hint.textContent = '左右滑动查看更多';
        host.after(hint);
        state.hint = hint;
      }
      if (state.hint) state.hint.hidden = !activeHosts.has(host);
    });
    entries.forEach(({ element, host, originalTabindex }, index) => {
      const active = overflowing[index];
      element.classList.toggle('has-horizontal-overflow', active);
      const hint = hosts.get(host).hint;
      if (hint) setDescription(element, hint.id, active);
      if (originalTabindex === null) {
        if (active) element.setAttribute('tabindex', '0');
        else element.removeAttribute('tabindex');
      }
    });
  };
  const schedule = () => {
    if (disposed || frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  };
  const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
  entries.forEach(({ element }) => {
    observer?.observe(element);
    if (element.firstElementChild) observer?.observe(element.firstElementChild);
  });
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);
  schedule();

  disposeArticleOverflow = () => {
    disposed = true;
    window.cancelAnimationFrame(frame);
    window.removeEventListener('resize', schedule);
    observer?.disconnect();
    entries.forEach(({ element, host, originalTabindex }) => {
      element.classList.remove('has-horizontal-overflow');
      const hint = hosts.get(host).hint;
      if (hint) setDescription(element, hint.id, false);
      if (originalTabindex === null) element.removeAttribute('tabindex');
    });
    hosts.forEach(({ hint }) => hint?.remove());
  };
};

document.addEventListener('DOMContentLoaded', updateArticleOverflow);
document.addEventListener('astro:page-load', updateArticleOverflow);
