const updateTocActiveState = () => {
  const links = Array.from(document.querySelectorAll('.toc-link'));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const activate = (id) => {
    const activeHref = '#' + id;

    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === activeHref);
    });

    const activeLink = links.find((link) => link.getAttribute('href') === activeHref);
    const tocPanel = activeLink && activeLink.closest('.toc-panel');
    if (!activeLink || !tocPanel || tocPanel.scrollHeight <= tocPanel.clientHeight) return;

    const linkRect = activeLink.getBoundingClientRect();
    const panelRect = tocPanel.getBoundingClientRect();
    if (linkRect.top < panelRect.top || linkRect.bottom > panelRect.bottom) {
      activeLink.scrollIntoView({ block: 'nearest' });
    }
  };

  const activateByScrollPosition = () => {
    const markerTop = Math.max(120, window.innerHeight * 0.3);
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= markerTop) {
        activeSection = section;
      }
    });

    activate(activeSection.id);
  };

  let ticking = false;
  const requestActiveUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      activateByScrollPosition();
      ticking = false;
    });
  };

  activateByScrollPosition();
  window.addEventListener('scroll', requestActiveUpdate, { passive: true });
  window.addEventListener('resize', requestActiveUpdate);

  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (activeEntry) activate(activeEntry.target.id);
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
};

document.addEventListener('DOMContentLoaded', updateTocActiveState);
document.addEventListener('astro:page-load', updateTocActiveState);
