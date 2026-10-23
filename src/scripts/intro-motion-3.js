const DURATION = 7600;
const SEEN_KEY = 'celestial-prologue-seen-v2';
const TAU = Math.PI * 2;
const TRACE_START = -2.85;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => { const t = clamp(value); return t * t * t * (t * (t * 6 - 15) + 10); };
const phase = (time, from, to) => smooth((time - from) / (to - from));

export function resolveReturnUrl(value, home, origin, currentPath) {
  try {
    const target = new URL(value || home, origin);
    // A return link must not leave the site or loop into this opening again.
    if (target.origin !== origin || target.pathname.replace(/\/+$/, '') === currentPath.replace(/\/+$/, '')) return home;
    return target.pathname + target.search + target.hash;
  } catch { return home; }
}

export function sequencePose(time) {
  const pullback = phase(time, 450, 6500);
  return {
    scale: 1.85 - pullback * .85,
    rotation: -9 * (1 - pullback),
    tilt: .12 + .23 * phase(time, 1900, 6100),
    yaw: .14 * phase(time, 2500, 6600),
    trace: phase(time, 1000, 5600),
    guides: phase(time, 2200, 5700),
    first: 1 - phase(time, 2100, 2700),
    second: phase(time, 2700, 3250) * (1 - phase(time, 4650, 5250)),
    finale: phase(time, 5350, 7100),
  };
}

export function orbitPoint(angle, radius, tilt, yaw) {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * Math.sin(tilt) * radius;
  const z = Math.sin(angle) * Math.cos(tilt) * radius;
  const turnedX = x * Math.cos(yaw) + z * Math.sin(yaw);
  const roll = -.43;
  return {
    x: turnedX * Math.cos(roll) - y * Math.sin(roll),
    y: turnedX * Math.sin(roll) + y * Math.cos(roll),
    z: -x * Math.sin(yaw) + z * Math.cos(yaw),
  };
}

// Split at the viewing plane so the sphere naturally occludes the rear arc.
export function orbitPaths(radius, tilt, yaw, reveal = 1) {
  const paths = ['', ''];
  const steps = Math.max(1, Math.ceil(160 * reveal));
  let previous = null;
  let previousSide = -1;
  for (let i = 0; i <= steps; i++) {
    const point = orbitPoint(TRACE_START + TAU * reveal * i / steps, radius, tilt, yaw);
    const side = point.z >= 0 ? 1 : 0;
    const xy = `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    if (previous && side !== previousSide) {
      const fraction = previous.z / (previous.z - point.z);
      const crossing = `${(previous.x + (point.x - previous.x) * fraction).toFixed(2)},${(previous.y + (point.y - previous.y) * fraction).toFixed(2)}`;
      paths[previousSide] += `L${crossing}`;
      paths[side] += `M${crossing}L${xy}`;
    } else {
      paths[side] += `${previous ? 'L' : 'M'}${xy}`;
    }
    previous = point;
    previousSide = side;
  }
  return paths;
}

export function startCosmicOpening(root) {
  const find = (selector) => root.querySelector(selector);
  const findAll = (selector) => [...root.querySelectorAll(selector)];
  const camera = find('[data-orbit-camera]');
  const observatory = find('[data-observatory]');
  const finale = find('[data-finale]');
  const narrative = find('[data-narrative]');
  const verses = findAll('[data-verse]');
  const chapters = findAll('[data-chapter]');
  const pause = find('[data-pause]');
  const replay = find('[data-replay]');
  const explore = find('[data-explore]');
  const exitExplore = find('[data-exit-explore]');
  const panel = find('[data-explore-panel]');
  const afterActions = find('[data-after-actions]');
  const timeline = find('[data-timeline]');
  const progress = find('[data-progress]');
  const timeLabel = find('[data-time]');
  const status = find('[data-status]');
  const enter = find('[data-primary-enter]');
  const skipLabel = find('[data-skip] span');
  if (!camera || !observatory || !finale || !pause || !enter) return;

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const listen = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: controller.signal });
  const links = findAll('[data-enter]');
  const returnUrl = resolveReturnUrl(new URLSearchParams(location.search).get('return'), root.dataset.homeUrl, location.origin, location.pathname);
  links.forEach((link) => { link.href = returnUrl; });

  const rings = findAll('[data-ring]').map((node) => ({ node, radius: Number(node.dataset.ring), side: Number(node.dataset.side) }));
  const traces = findAll('[data-trace]');
  const beacons = findAll('[data-beacon]');
  const guideLayers = findAll('[data-guides]');
  let state = 'still';
  let elapsed = DURATION;
  let previousTime = null;
  let frame = 0;
  let lastChapter = -1;
  let lastSecond = -1;
  let navigationTimer = 0;
  let pointer = null;
  let view = { yaw: .14, tilt: .35, zoom: 1 };
  let rendered = { ...view };

  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* Private mode is still navigable. */ }
    try { localStorage.setItem('site-intro-seen-v1', '1'); } catch { /* Optional visit memory. */ }
  }

  function layer(node, amount, distance = 18) {
    node.style.opacity = amount.toFixed(4);
    node.style.visibility = amount > .001 ? 'visible' : 'hidden';
    node.style.transform = `translateY(${((1 - amount) * distance).toFixed(2)}px)`;
  }

  function paintOrbit(tilt, yaw, reveal, guides) {
    const paths = new Map();
    rings.forEach(({ node, radius, side }) => {
      if (!paths.has(radius)) paths.set(radius, orbitPaths(radius, tilt, yaw));
      node.setAttribute('d', paths.get(radius)[side]);
    });
    const traceRadius = 195 + 155 * smooth(reveal / .55);
    const tracePaths = orbitPaths(traceRadius, tilt, yaw, reveal);
    traces.forEach((node) => node.setAttribute('d', tracePaths[Number(node.dataset.side)]));
    const point = orbitPoint(TRACE_START + TAU * reveal, traceRadius, tilt, yaw);
    beacons.forEach((node) => {
      node.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      node.style.opacity = (point.z >= 0 ? '1' : '0') === node.dataset.beacon ? '1' : '0';
    });
    guideLayers.forEach((node) => { node.style.opacity = guides.toFixed(4); });
  }

  function paintSequence() {
    const pose = sequencePose(elapsed);
    camera.setAttribute('transform', `scale(${pose.scale.toFixed(5)}) rotate(${pose.rotation.toFixed(4)})`);
    paintOrbit(pose.tilt, pose.yaw, pose.trace, pose.guides);
    layer(verses[0], pose.first);
    layer(verses[1], pose.second);
    layer(finale, pose.finale, 24);
    // The visual reveal never exposes a hidden keyboard target.
    finale.inert = pose.finale < .98;
    finale.setAttribute('aria-hidden', String(pose.finale < .98));
    progress.style.transform = `scaleX(${clamp(elapsed / DURATION).toFixed(4)})`;
    const second = Math.ceil((DURATION - elapsed) / 100) / 10;
    if (second !== lastSecond) {
      lastSecond = second;
      timeLabel.textContent = `${second.toFixed(1)} 秒`;
    }
    const chapter = elapsed < 2700 ? 0 : elapsed < 5350 ? 1 : 2;
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      chapters.forEach((node, index) => node.classList.toggle('is-current', index === chapter));
      status.textContent = ['见光。每一次探索，都从一点微光开始。', '循轨。让散落的发现，连成自己的宇宙。', '微光成章。可以进入博客。'][chapter];
    }
  }

  function stopFrame() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
  }

  function requestFrame() {
    if (!frame && !document.hidden && state !== 'leaving') frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    if (document.hidden) return;
    if (state === 'playing') {
      if (previousTime !== null) elapsed = Math.min(DURATION, elapsed + Math.max(0, now - previousTime));
      previousTime = now;
      paintSequence();
      if (elapsed >= DURATION) finish();
      else requestFrame();
    } else if (state === 'exploring') {
      const blend = preference.matches ? 1 : 1 - Math.exp(-Math.min(64, previousTime === null ? 16 : now - previousTime) / 65);
      previousTime = now;
      for (const key of ['yaw', 'tilt', 'zoom']) rendered[key] += (view[key] - rendered[key]) * blend;
      camera.setAttribute('transform', `scale(${rendered.zoom.toFixed(5)})`);
      paintOrbit(rendered.tilt, rendered.yaw, 1, 1);
      if (Object.keys(view).some((key) => Math.abs(view[key] - rendered[key]) > .0005)) requestFrame();
      else previousTime = null;
    }
  }

  function finish(announce = true) {
    const moveFocus = document.activeElement === pause || panel.contains(document.activeElement) || observatory.contains(document.activeElement);
    stopFrame();
    releasePointer();
    state = root.dataset.state = 'still';
    elapsed = DURATION;
    paintSequence();
    narrative.inert = false;
    finale.inert = false;
    pause.hidden = true;
    afterActions.hidden = false;
    timeline.hidden = true;
    panel.hidden = true;
    observatory.tabIndex = -1;
    replay.hidden = preference.matches;
    skipLabel.textContent = '进入博客';
    if (announce) status.textContent = '序章已落定。可以进入博客，也可以转动星环。';
    markSeen();
    if (moveFocus) enter.focus({ preventScroll: true });
  }

  function play() {
    if (preference.matches) { finish(); return; }
    stopFrame();
    releasePointer();
    const moveFocus = narrative.contains(document.activeElement) || document.activeElement === replay;
    state = root.dataset.state = 'playing';
    elapsed = 0;
    lastChapter = -1;
    lastSecond = -1;
    pause.hidden = false;
    if (moveFocus) pause.focus({ preventScroll: true });
    pause.textContent = '暂停';
    pause.setAttribute('aria-label', '暂停序章');
    afterActions.hidden = true;
    timeline.hidden = false;
    panel.hidden = true;
    narrative.inert = false;
    observatory.tabIndex = -1;
    skipLabel.textContent = '跳过序章';
    paintSequence();
    requestFrame();
  }

  function togglePause() {
    if (state === 'playing') {
      stopFrame();
      state = root.dataset.state = 'paused';
      pause.textContent = '继续';
      pause.setAttribute('aria-label', '继续播放序章');
      status.textContent = '序章已暂停。可以继续播放或直接进入博客。';
    } else if (state === 'paused') {
      state = root.dataset.state = 'playing';
      pause.textContent = '暂停';
      pause.setAttribute('aria-label', '暂停序章');
      status.textContent = '序章继续播放。';
      requestFrame();
    }
  }

  function enterExplore() {
    finish(false);
    state = root.dataset.state = 'exploring';
    view = { yaw: .14, tilt: .35, zoom: 1 };
    rendered = { ...view };
    narrative.inert = true;
    afterActions.hidden = true;
    panel.hidden = false;
    observatory.tabIndex = 0;
    observatory.focus({ preventScroll: true });
    status.textContent = '已进入星环观测台。拖动或用方向键转动，使用加减键缩放，Escape 返回。';
    requestFrame();
  }

  function releasePointer() {
    if (pointer && observatory.hasPointerCapture(pointer.id)) observatory.releasePointerCapture(pointer.id);
    pointer = null;
    observatory.classList.remove('is-dragging');
  }

  function zoomBy(amount) {
    if (state !== 'exploring') return;
    view.zoom = clamp(view.zoom + amount, .7, 1.35);
    requestFrame();
  }

  function resetView() {
    view = { yaw: .14, tilt: .35, zoom: 1 };
    status.textContent = '星环视角已复位。';
    requestFrame();
  }

  listen(pause, 'click', togglePause);
  listen(replay, 'click', play);
  listen(explore, 'click', enterExplore);
  listen(exitExplore, 'click', () => { finish(); explore.focus({ preventScroll: true }); });
  listen(find('[data-reset]'), 'click', resetView);
  listen(find('[data-zoom-in]'), 'click', () => zoomBy(.1));
  listen(find('[data-zoom-out]'), 'click', () => zoomBy(-.1));
  listen(observatory, 'pointerdown', (event) => {
    if (state !== 'exploring' || pointer || !event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    observatory.setPointerCapture(event.pointerId);
    observatory.classList.add('is-dragging');
    observatory.focus({ preventScroll: true });
  });
  listen(observatory, 'pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    view.yaw += (event.clientX - pointer.x) * .006;
    view.tilt = clamp(view.tilt + (event.clientY - pointer.y) * .004, -.9, .9);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    requestFrame();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    listen(observatory, type, (event) => {
      if (pointer?.id === event.pointerId) releasePointer();
    });
  }
  listen(observatory, 'wheel', (event) => {
    if (state !== 'exploring' || event.ctrlKey) return;
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 300 : 1);
    zoomBy(clamp(-delta * .001, -.12, .12));
  }, { passive: false });
  listen(observatory, 'keydown', (event) => {
    if (state !== 'exploring') return;
    if (event.key === 'ArrowLeft') view.yaw -= .12;
    else if (event.key === 'ArrowRight') view.yaw += .12;
    else if (event.key === 'ArrowUp') view.tilt = clamp(view.tilt - .08, -.9, .9);
    else if (event.key === 'ArrowDown') view.tilt = clamp(view.tilt + .08, -.9, .9);
    else if (event.key === '+' || event.key === '=') zoomBy(.1);
    else if (event.key === '-') zoomBy(-.1);
    else if (event.key === 'Home') resetView();
    else return;
    event.preventDefault();
    requestFrame();
  });
  listen(window, 'keydown', (event) => {
    if (event.key !== 'Escape' || state === 'leaving') return;
    if (state === 'exploring') { finish(); explore.focus({ preventScroll: true }); }
    else if (state === 'playing' || state === 'paused') finish();
  });
  listen(window, 'blur', releasePointer);
  listen(document, 'visibilitychange', () => {
    if (document.hidden) { releasePointer(); stopFrame(); }
    else if (state === 'playing' || state === 'exploring') requestFrame();
  });
  listen(preference, 'change', () => {
    if (preference.matches && state !== 'leaving') finish();
    replay.hidden = preference.matches;
  });

  links.forEach((link) => listen(link, 'click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    markSeen();
    try { sessionStorage.setItem('site-intro-return-v1', returnUrl); } catch { /* Native navigation still works. */ }
    if (preference.matches) return;
    event.preventDefault();
    if (state === 'leaving') return;
    stopFrame();
    releasePointer();
    state = root.dataset.state = 'leaving';
    try {
      const dark = localStorage.getItem('theme') === 'dark';
      document.body.style.setProperty('--destination-color', dark ? '#0b1120' : '#eef5fb');
    } catch { /* Match the site's default light theme. */ }
    document.body.classList.add('is-leaving');
    navigationTimer = window.setTimeout(() => { window.location.assign(returnUrl); }, 220);
  }));

  listen(window, 'pagehide', (event) => {
    stopFrame();
    releasePointer();
    clearTimeout(navigationTimer);
    if (!event.persisted) controller.abort();
  });
  listen(window, 'pageshow', (event) => {
    if (!event.persisted) return;
    document.body.classList.remove('is-leaving');
    // Back navigation returns to the entrance, never replays the entire sequence.
    finish(false);
  });

  const shouldPlay = document.documentElement.hasAttribute('data-intro-preparing') && !preference.matches;
  delete document.documentElement.dataset.introPreparing;
  if (shouldPlay) play();
  else finish(false);
}

if (typeof document !== 'undefined') {
  const opening = document.querySelector('[data-cosmic-opening]');
  if (opening) startCosmicOpening(opening);
}
