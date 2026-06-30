const updateTocActiveState = () => {
  const links = Array.from(document.querySelectorAll('.toc-link'));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const activate = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  };

  activate(sections[0].id);

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
