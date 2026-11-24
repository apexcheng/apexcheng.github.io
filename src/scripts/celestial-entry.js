const sessionSeenKey = 'celestial-prologue-seen-v2';

function resolveDestination(homePath) {
  const home = new URL(homePath, location.origin);
  const route = (url) => url.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '');
  try {
    const value = new URLSearchParams(location.search).get('return');
    const target = new URL(value || home.href, home);
    if (target.origin === home.origin && target.protocol === home.protocol
      && target.pathname.startsWith(home.pathname) && route(target) !== route(location)) {
      return target;
    }
  } catch { /* A malformed return address falls back to the selected home. */ }
  return home;
}

function attachEntrance(root) {
  const destination = resolveDestination(root.dataset.homeUrl);
  const address = new URL(location.href);
  const playRequested = address.searchParams.get('play') === '1';
  if (playRequested) {
    address.searchParams.delete('play');
    history.replaceState(history.state, '', address.href);
  }
  const replay = root.querySelector('[data-replay]');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let seen = false;
  try { seen = sessionStorage.getItem(sessionSeenKey) === '1'; } catch { /* Optional visit memory. */ }

  function markSeen() {
    try { sessionStorage.setItem(sessionSeenKey, '1'); } catch { /* Storage can be disabled. */ }
    try { localStorage.setItem('site-intro-seen-v1', '1'); } catch { /* Native links still work. */ }
  }

  root.addEventListener('cosmic-finished', markSeen);
  for (const link of root.querySelectorAll('a[data-enter], a[data-skip]')) {
    link.href = destination.href;
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      markSeen();
      try {
        sessionStorage.setItem('site-intro-return-v1', destination.pathname + destination.search + destination.hash);
      } catch { /* The anchor already points at the destination. */ }
    });
  }

  function updateReplay() {
    replay.hidden = preference.matches;
  }

  async function loadScene() {
    root.classList.add('is-loading');
    if (document.activeElement === replay) root.querySelector('a[data-skip]').focus({ preventScroll: true });
    replay.hidden = true;
    replay.removeEventListener('click', loadScene);
    preference.removeEventListener('change', updateReplay);
    try {
      const { startCosmicOpening } = await import('./intro-motion-3.js');
      if (!preference.matches) {
        await startCosmicOpening(root);
        return;
      }
    } catch {
      root.classList.add('is-webgl-fallback');
      return;
    } finally {
      root.classList.remove('is-loading');
    }
    enableStaticEntrance();
  }

  function enableStaticEntrance() {
    markSeen();
    updateReplay();
    replay.addEventListener('click', loadScene);
    preference.addEventListener('change', updateReplay);
  }

  if (preference.matches || (seen && !playRequested)) enableStaticEntrance();
  else loadScene();
}

const opening = document.querySelector('[data-cosmic-opening]');
if (opening) attachEntrance(opening);
