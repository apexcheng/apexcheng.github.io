let disposeActiveToc;

const updateTocActiveState = () => {
  disposeActiveToc?.();
  const links = Array.from(document.querySelectorAll('.toc-link'));
  const sectionForHash = (hash) => {
    if (!hash || !hash.startsWith('#')) return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  };
  const sections = [...new Set(links.map((link) => sectionForHash(link.getAttribute('href'))).filter(Boolean))];
  if (!links.length || !sections.length) return;

  const controller = new AbortController();
  const { signal } = controller;
  const desktopToc = document.querySelector('.article-sidebar .toc-panel');
  const mobileToc = document.querySelector('.mobile-toc-panel');
  const groups = Array.from(document.querySelectorAll('[data-toc-group]'));
  let currentId;
  let currentGroup;
  let endFragment;
  let frame = 0;

  const fitTocToViewport = () => {
    if (!desktopToc || !desktopToc.getClientRects().length) return;
    const available = window.innerHeight - desktopToc.getBoundingClientRect().top - 16;
    desktopToc.style.maxHeight = `${Math.max(80, Math.floor(available))}px`;
  };

  const activate = (id) => {
    const activeLinks = links.filter((link) => sectionForHash(link.getAttribute('href'))?.id === id);
    if (id !== currentId) {
      currentId = id;
      links.forEach((link) => {
        const active = activeLinks.includes(link);
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      const activeGroup = activeLinks.find((link) => link.closest('.mobile-toc-panel'))?.closest('[data-toc-group]');
      if (activeGroup !== currentGroup) {
        currentGroup = activeGroup;
        groups.forEach((group) => {
          const active = group === activeGroup;
          group.classList.toggle('is-current', active);
          // Do not hide a keyboard user's focused link when the reading marker moves.
          if (group.tagName === 'DETAILS' && (active || !group.contains(document.activeElement))) {
            group.open = active;
          }
        });
      }
    }

    const activeLink = activeLinks.find((link) => link.closest('.toc-panel'));
    if (!activeLink || !desktopToc?.getClientRects().length || desktopToc.scrollHeight <= desktopToc.clientHeight) return;
    const visiblePadding = 12;
    const linkRect = activeLink.getBoundingClientRect();
    const panelRect = desktopToc.getBoundingClientRect();
    const headingHeight = desktopToc.querySelector('summary')?.getBoundingClientRect().height || 0;
    if (linkRect.top < panelRect.top + headingHeight + visiblePadding) {
      desktopToc.scrollTop += linkRect.top - panelRect.top - headingHeight - visiblePadding;
    } else if (linkRect.bottom > panelRect.bottom - visiblePadding) {
      desktopToc.scrollTop += linkRect.bottom - panelRect.bottom + visiblePadding;
    }
  };

  const activateByScrollPosition = () => {
    fitTocToViewport();
    // Use the native anchor landing line, including fractional scroll rounding.
    const markerTop = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 1;
    const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    if (atEnd) {
      const fragmentTop = endFragment?.getBoundingClientRect().top;
      const clamped = fragmentTop >= markerTop - 2 && fragmentTop < window.innerHeight;
      activate(clamped ? endFragment.id : sections[sections.length - 1].id);
      return;
    }
    endFragment = null;
    let activeSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= markerTop) activeSection = section;
    });
    activate(activeSection.id);
  };

  const requestActiveUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      activateByScrollPosition();
    });
  };

  const activateHash = () => {
    const section = sectionForHash(window.location.hash);
    endFragment = sections.includes(section) ? section : null;
    if (endFragment) activate(section.id);
    else requestActiveUpdate();
  };

  const onTocLinkClick = (event) => {
    const link = event.target.closest('a.toc-link');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = sectionForHash(link.getAttribute('href'));
    if (!section) return;
    endFragment = section;
    activate(section.id);
    if (!link.closest('.mobile-toc-panel')) return;
    mobileToc.open = false;
    if (!section.hasAttribute('tabindex')) {
      section.setAttribute('tabindex', '-1');
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }
    section.focus({ preventScroll: true });
    // Leave the native anchor action intact: URL history, back/forward and scroll margins.
  };
  desktopToc?.addEventListener('click', onTocLinkClick, { signal });
  mobileToc?.addEventListener('click', onTocLinkClick, { signal });

  mobileToc?.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobileToc.open) return;
    event.preventDefault();
    mobileToc.open = false;
    mobileToc.querySelector('summary').focus();
  }, { signal });

  activateByScrollPosition();
  if (window.location.hash) activateHash();
  window.addEventListener('scroll', requestActiveUpdate, { passive: true, signal });
  window.addEventListener('resize', requestActiveUpdate, { signal });
  window.addEventListener('hashchange', activateHash, { signal });
  window.addEventListener('pageshow', requestActiveUpdate, { signal });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(requestActiveUpdate, { rootMargin: '-20% 0px -70% 0px' })
    : null;
  sections.forEach((section) => observer?.observe(section));
  disposeActiveToc = () => {
    controller.abort();
    observer?.disconnect();
    window.cancelAnimationFrame(frame);
  };
};

document.addEventListener('DOMContentLoaded', updateTocActiveState);
document.addEventListener('astro:page-load', updateTocActiveState);
