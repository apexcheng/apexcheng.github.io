import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

const opening = document.querySelector('[data-cosmic-opening]');

if (opening instanceof HTMLElement) {
  startCosmicOpening(opening);
}

function startCosmicOpening(root) {
  const canvas = root.querySelector('[data-cosmic-canvas]');
  const skipButton = root.querySelector('[data-skip]');
  const replayButton = root.querySelector('[data-replay]');
  const exploreButton = root.querySelector('[data-explore]');
  const exitExploreButton = root.querySelector('[data-exit-explore]');
  const enterButton = root.querySelector('[data-enter]');
  const finale = root.querySelector('[data-finale]');
  const progressFill = root.querySelector('[data-progress]');
  const timeLeft = root.querySelector('[data-time]');
  const chapterName = root.querySelector('[data-chapter]');
  const status = root.querySelector('[data-status]');
  const interactionHint = root.querySelector('[data-interaction-hint]');
  const prologues = {
    one: root.querySelector('[data-prologue="one"]'),
    two: root.querySelector('[data-prologue="two"]'),
    three: root.querySelector('[data-prologue="three"]'),
    four: root.querySelector('[data-prologue="four"]'),
  };

  if (
    !(canvas instanceof HTMLCanvasElement)
    || !(skipButton instanceof HTMLButtonElement)
    || !(replayButton instanceof HTMLButtonElement)
    || !(exploreButton instanceof HTMLButtonElement)
    || !(exitExploreButton instanceof HTMLButtonElement)
    || !(enterButton instanceof HTMLAnchorElement)
    || !(finale instanceof HTMLElement)
    || !(progressFill instanceof HTMLElement)
    || !(timeLeft instanceof HTMLElement)
    || !(chapterName instanceof HTMLElement)
    || !(status instanceof HTMLElement)
    || !(interactionHint instanceof HTMLElement)
    || Object.values(prologues).some((item) => !(item instanceof HTMLElement))
  ) {
    return;
  }

  const duration = 12000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(window.location.search);
  const returnKey = 'site-intro-return-v1';
  const textureRoot = (root.dataset.textureRoot || '/images/intro-motion-3').replace(/\/$/, '');

  let width = Math.max(1, window.innerWidth);
  let height = Math.max(1, window.innerHeight);
  let isMobile = width < 720;
  let renderer = null;
  let composer = null;
  let bloomPass = null;
  let scene = null;
  let camera = null;
  let ambientLight = null;
  let keyLight = null;
  let rimLight = null;
  let world = null;
  let earthSpin = null;
  let earthSurface = null;
  let atmosphere = null;
  let earthMaterial = null;
  let cloudMaterial = null;
  let cityMaterial = null;
  let atmosphereMaterial = null;
  let moon = null;
  let moonMaterial = null;
  let stars = null;
  let cosmicObjects = null;
  let sunSurface = null;
  let sunMaterial = null;
  let sunLight = null;
  let sunLensflare = null;
  let asteroidBelt = null;
  let asteroidBeltMaterial = null;
  let zodiacalDust = null;
  let zodiacalDustMaterial = null;
  let warpLines = null;
  let warpMaterial = null;
  let animationFrame = 0;
  let startedAt = 0;
  let finishedAt = 0;
  let currentProgress = 0;
  let isPlaying = false;
  let isIdle = false;
  let isExploring = false;
  let initialized = false;
  let skipRequested = false;
  let lastChapter = '';
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let pointerInfluence = 0;
  let targetPointerInfluence = 0;
  let sceneDragPointerId = null;
  let isDraggingScene = false;
  let sceneDragMoved = false;
  let sceneDragStartX = 0;
  let sceneDragStartY = 0;
  let sceneDragLastX = 0;
  let sceneDragLastY = 0;
  let sceneDragLastAt = 0;
  let sceneDragMode = 'look';
  let cameraOrbitPitch = 0;
  let cameraOrbitYaw = 0;
  let cameraOrbitVelocityPitch = 0;
  let cameraOrbitVelocityYaw = 0;
  let freeCameraActive = false;
  let lastRenderAt = 0;
  let suppressDoubleClickUntil = 0;
  let randomSeed = 20260717;

  const initialOrbitAngle = 0.36;
  const orbitMotionDelay = 1800;
  const maximumFreeCameraDistance = 720;
  const wheelTravelSensitivity = 0.024;
  const zoomAnchorLockDuration = 220;
  const earthOrbitDefinition = {
    name: 'earth',
    orbit: 18,
    eccentricity: 0.0167,
    inclination: 0,
    speed: 0.000112,
  };

  const ripples = [];
  const celestialBodies = [];
  const celestialMaterials = [];
  const planetRingMaterials = [];
  const orbitMaterials = [];
  const sunGlowSprites = [];
  const asteroids = [];
  const asteroidMaterials = [];
  const zoomTargets = [];
  const pressedMoveKeys = new Set();
  const moveKeyCodes = new Set([
    'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ShiftLeft', 'ShiftRight',
  ]);
  const solarCenter = new THREE.Vector3(-18, 0, 0);
  const cameraPosition = new THREE.Vector3();
  const cameraTarget = new THREE.Vector3();
  const cameraBasePosition = new THREE.Vector3();
  const cameraBaseTarget = new THREE.Vector3();
  const systemCameraPosition = new THREE.Vector3();
  const systemCameraTarget = new THREE.Vector3();
  const freeCameraPosition = new THREE.Vector3();
  const targetFreeCameraPosition = new THREE.Vector3();
  const freeCameraBaseForward = new THREE.Vector3(0, 0, -1);
  const cameraForward = new THREE.Vector3(0, 0, -1);
  const cameraRight = new THREE.Vector3(1, 0, 0);
  const cameraUp = new THREE.Vector3(0, 1, 0);
  const cameraLocalUp = new THREE.Vector3(0, 1, 0);
  const cameraMove = new THREE.Vector3();
  const cameraLookTarget = new THREE.Vector3();
  const zoomPointer = new THREE.Vector2();
  const zoomRaycaster = new THREE.Raycaster();
  const zoomAnchorWorld = new THREE.Vector3();
  const zoomAnchorLocal = new THREE.Vector3();
  const zoomObjectCenter = new THREE.Vector3();
  const zoomDirection = new THREE.Vector3();
  const zoomProposedPosition = new THREE.Vector3();
  const zoomWorldScale = new THREE.Vector3();
  const sunWorldPosition = new THREE.Vector3();
  const earthWorldPosition = new THREE.Vector3();
  const earthToSunDirection = new THREE.Vector3();
  let zoomAnchorObject = null;
  let zoomAnchorRadius = 0;
  let zoomAnchorLockedUntil = 0;
  const cameraKeysDesktop = createKeys([
    [0, -1.8, 0.8, 16.8],
    [0.18, -0.8, 0.35, 11.8],
    [0.34, 3.8, 1.6, 16.5],
    [0.5, 8.5, 3.2, 23.5],
    [0.66, 14.5, 6.5, 31],
    [0.8, 13.5, 8.5, 37],
    [1, 12, 8, 34],
  ]);
  const targetKeysDesktop = createKeys([
    [0, -2.5, -0.35, 0],
    [0.18, -0.5, -0.1, 0],
    [0.34, -2.8, 0, 0],
    [0.5, -5.5, 0, -0.8],
    [0.66, -7.5, 0, -0.6],
    [0.8, -7, 0, 0],
    [1, -6, 0, 0],
  ]);
  const systemCameraKeysDesktop = createKeys([
    [0.54, 32, 8, 46],
    [0.68, 52, 18, 76],
    [0.82, 88, 42, 126],
    [1, 132, 72, 170],
  ]);
  const systemTargetKeysDesktop = createKeys([
    [0.54, 10, 0.8, 0],
    [0.72, 5, 0.3, 0],
    [1, 0, 0, 0],
  ]);
  const cameraKeysMobile = createKeys([
    [0, -0.5, 0.8, 18.5],
    [0.18, -0.3, 0.3, 13.8],
    [0.34, 3, 1.8, 20],
    [0.5, 7, 4.2, 29],
    [0.66, 11, 8.5, 39],
    [0.8, 10, 11, 47],
    [1, 9, 10, 43],
  ]);
  const targetKeysMobile = createKeys([
    [0, -0.85, 0.5, 0],
    [0.18, -0.35, 0.35, 0],
    [0.34, -2.8, 0.35, 0],
    [0.5, -5.5, 0.25, -0.8],
    [0.66, -7.5, 0.35, -0.5],
    [0.8, -7, 0.45, 0],
    [1, -6, 0.8, 0],
  ]);
  const systemCameraKeysMobile = createKeys([
    [0.54, 34, 18, 60],
    [0.7, 62, 44, 112],
    [0.84, 90, 88, 178],
    [1, 112, 146, 248],
  ]);
  const systemTargetKeysMobile = createKeys([
    [0.54, 8, 0.8, 0],
    [0.72, 4, 0.4, 0],
    [1, 0, 0, 0],
  ]);

  function resolveReturnUrl(value) {
    try {
      const target = new URL(value || root.dataset.homeUrl, window.location.origin);
      if (target.origin !== window.location.origin) return root.dataset.homeUrl;
      return target.pathname + target.search + target.hash;
    } catch (error) {
      return root.dataset.homeUrl;
    }
  }

  const returnUrl = resolveReturnUrl(params.get('return'));
  enterButton.href = returnUrl;

  function textureUrl(name) {
    return textureRoot + '/' + name;
  }

  function createKeys(values) {
    return values.map((item) => ({
      at: item[0],
      value: new THREE.Vector3(item[1], item[2], item[3]),
    }));
  }

  function random() {
    randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
    return randomSeed / 4294967296;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function phase(progress, start, end) {
    return clamp((progress - start) / (end - start), 0, 1);
  }

  function ease(value) {
    return value * value * (3 - 2 * value);
  }

  function cinematicEase(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function easeOutQuint(value) {
    return 1 - Math.pow(1 - value, 5);
  }

  function band(progress, enterStart, enterEnd, exitStart, exitEnd) {
    return ease(phase(progress, enterStart, enterEnd))
      * (1 - ease(phase(progress, exitStart, exitEnd)));
  }

  function sampleVector(keys, progress, target, easing = ease) {
    if (progress <= keys[0].at) return target.copy(keys[0].value);

    for (let index = 0; index < keys.length - 1; index += 1) {
      const from = keys[index];
      const to = keys[index + 1];
      if (progress <= to.at) {
        const localProgress = easing((progress - from.at) / (to.at - from.at));
        return target.lerpVectors(from.value, to.value, localProgress);
      }
    }

    return target.copy(keys[keys.length - 1].value);
  }

  function setLayer(element, opacity, y, scale) {
    element.style.opacity = opacity.toFixed(3);
    element.style.transform =
      'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';
    element.style.visibility = opacity > 0.002 ? 'visible' : 'hidden';
  }

  function createScene() {
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      root.classList.add('is-webgl-fallback');
      return false;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01030a);
    scene.fog = new THREE.FogExp2(0x01030a, 0.0018);

    camera = new THREE.PerspectiveCamera(43, width / height, 0.1, 900);
    scene.add(camera);

    ambientLight = new THREE.HemisphereLight(0x29486c, 0x010207, 0.12);
    scene.add(ambientLight);

    keyLight = new THREE.DirectionalLight(0xfff4df, 0.48);
    keyLight.position.set(-7.5, 4.5, 8);
    scene.add(keyLight);

    rimLight = new THREE.PointLight(0x5bbdd8, 3.8, 42, 2);
    rimLight.position.set(5.5, -2.6, 5);
    scene.add(rimLight);

    stars = createStarField(isMobile ? 950 : 1850);
    scene.add(stars);

    cosmicObjects = createCosmicObjects();
    scene.add(cosmicObjects);

    const warp = createWarpField(isMobile ? 110 : 220);
    warpLines = warp.lines;
    warpMaterial = warp.material;
    camera.add(warpLines);

    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.72,
        0.42,
        0.82
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    resizeRenderer();
    return true;
  }

  function createStarField(count) {
    randomSeed = 20260717;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkles = new Float32Array(count);
    const color = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const radius = 35 + random() * 265;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const offset = index * 3;

      positions[offset] = radius * Math.sin(phi) * Math.cos(theta);
      positions[offset + 1] = radius * Math.cos(phi);
      positions[offset + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const warm = random() > 0.84;
      color.setRGB(
        warm ? 0.96 : 0.7 + random() * 0.24,
        warm ? 0.78 + random() * 0.16 : 0.8 + random() * 0.18,
        warm ? 0.65 + random() * 0.2 : 0.94 + random() * 0.06
      );
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
      sizes[index] = 0.55 + random() * 1.65;
      twinkles[index] = random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        opacity: { value: 0.86 },
        pointScale: { value: isMobile ? 44 : 62 },
        time: { value: 0 },
      },
      vertexShader: [
        'attribute float aSize;',
        'attribute float aTwinkle;',
        'attribute vec3 color;',
        'uniform float pointScale;',
        'uniform float time;',
        'varying vec3 vColor;',
        'varying float vTwinkle;',
        'void main() {',
        '  vColor = color;',
        '  vTwinkle = 0.68 + 0.32 * sin(time * (0.8 + aTwinkle * 1.8) + aTwinkle * 19.0);',
        '  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = aSize * pointScale / max(1.0, -viewPosition.z);',
        '  gl_Position = projectionMatrix * viewPosition;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float opacity;',
        'varying vec3 vColor;',
        'varying float vTwinkle;',
        'void main() {',
        '  float distanceToCenter = length(gl_PointCoord - vec2(0.5));',
        '  float alpha = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);',
        '  gl_FragColor = vec4(vColor * (0.82 + vTwinkle * 0.35), alpha * opacity * vTwinkle);',
        '}',
      ].join('\n'),
    });

    return new THREE.Points(geometry, material);
  }

  function createWarpField(count) {
    const positions = new Float32Array(count * 6);

    for (let index = 0; index < count; index += 1) {
      const depth = 7 + random() * 68;
      const spread = 2 + depth * 0.2;
      const x = (random() * 2 - 1) * spread;
      const y = (random() * 2 - 1) * spread * 0.62;
      const length = 0.5 + random() * 2.2;
      const offset = index * 6;

      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = -depth;
      positions[offset + 3] = x;
      positions[offset + 4] = y;
      positions[offset + 5] = -depth - length;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x9bdbea,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      lines: new THREE.LineSegments(geometry, material),
      material,
    };
  }

  function createAsteroidGeometry(variant) {
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const positions = geometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      const distortion = 1
        + Math.sin(
          x * (3.7 + variant * 0.41)
          + y * (5.1 + variant * 0.29)
          + z * (4.3 + variant * 0.37)
        ) * 0.13
        + Math.cos(
          x * (7.3 + variant * 0.31)
          - y * (3.9 + variant * 0.43)
          + z * (5.7 + variant * 0.23)
        ) * 0.08;
      positions.setXYZ(index, x * distortion, y * distortion, z * distortion);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  }

  function createGlowTexture() {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const context = glowCanvas.getContext('2d');
    if (!context) return null;

    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 236, 1)');
    gradient.addColorStop(0.08, 'rgba(255, 222, 145, 0.96)');
    gradient.addColorStop(0.28, 'rgba(255, 142, 61, 0.44)');
    gradient.addColorStop(0.62, 'rgba(255, 92, 28, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 70, 18, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(glowCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createBandTexture(colors, withStorm) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 256;
    const context = textureCanvas.getContext('2d');
    if (!context) return null;

    const gradient = context.createLinearGradient(0, 0, 0, textureCanvas.height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / Math.max(1, colors.length - 1), color);
    });
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    for (let index = 0; index < 18; index += 1) {
      context.fillStyle = index % 2 === 0
        ? 'rgba(255,255,255,0.055)'
        : 'rgba(64,31,18,0.06)';
      context.fillRect(0, index * 15, textureCanvas.width, 5 + index % 4);
    }

    if (withStorm) {
      context.save();
      context.translate(365, 157);
      context.scale(1.9, 0.72);
      context.fillStyle = 'rgba(132, 47, 25, 0.62)';
      context.beginPath();
      context.arc(0, 0, 23, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  function getOrbitDistance(radius, eccentricity, angle) {
    return radius * (1 - eccentricity * eccentricity)
      / (1 + eccentricity * Math.cos(angle));
  }

  function getOrbitHeight(radius, inclination, angle) {
    return Math.sin(angle - initialOrbitAngle)
      * Math.sin(THREE.MathUtils.degToRad(inclination))
      * radius;
  }

  function createOrbit(definition) {
    const points = [];
    const segments = isMobile ? 96 : 160;
    for (let index = 0; index < segments; index += 1) {
      const angle = index / segments * Math.PI * 2;
      const distance = getOrbitDistance(
        definition.orbit,
        definition.eccentricity,
        angle
      );
      points.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        getOrbitHeight(definition.orbit, definition.inclination, angle),
        Math.sin(angle) * distance * 0.96
      ));
    }

    const material = new THREE.LineBasicMaterial({
      color: 0x7bacc1,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    orbitMaterials.push(material);
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
  }

  function createZodiacalDust(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 8 + Math.pow(random(), 0.72) * 108;
      const offset = index * 3;
      positions[offset] = Math.cos(angle) * radius;
      positions[offset + 1] = (random() * 2 - 1) * (0.25 + radius * 0.018);
      positions[offset + 2] = Math.sin(angle) * radius * 0.96;

      color.setHSL(0.085 + random() * 0.045, 0.42, 0.54 + random() * 0.22);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    zodiacalDustMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: isMobile ? 0.075 : 0.1,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    zodiacalDust = new THREE.Points(geometry, zodiacalDustMaterial);
    return zodiacalDust;
  }

  function createCosmicObjects() {
    const group = new THREE.Group();
    group.position.copy(solarCenter);

    sunMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 },
      },
      vertexShader: [
        'varying vec3 vPosition;',
        'varying vec3 vNormal;',
        'void main() {',
        '  vPosition = position;',
        '  vNormal = normalize(normalMatrix * normal);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float time;',
        'uniform float opacity;',
        'varying vec3 vPosition;',
        'varying vec3 vNormal;',
        'void main() {',
        '  vec3 p = normalize(vPosition);',
        '  float flow = sin(p.x * 13.0 + time * 0.9)',
        '    + sin(p.y * 17.0 - time * 0.7)',
        '    + sin((p.x + p.z) * 21.0 + time * 0.52);',
        '  flow = flow / 6.0 + 0.5;',
        '  float limb = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 0.32);',
        '  vec3 deep = vec3(1.0, 0.16, 0.015);',
        '  vec3 hot = vec3(1.0, 0.94, 0.54);',
        '  vec3 color = mix(deep, hot, clamp(flow + limb * 0.38, 0.0, 1.0));',
        '  gl_FragColor = vec4(color * 1.35, opacity);',
        '}',
      ].join('\n'),
    });
    sunSurface = new THREE.Mesh(
      new THREE.SphereGeometry(3.3, isMobile ? 36 : 56, isMobile ? 24 : 38),
      sunMaterial
    );
    sunSurface.userData.zoomRadius = 3.3;
    sunSurface.visible = false;
    zoomTargets.push(sunSurface);
    group.add(sunSurface);

    const glowTexture = createGlowTexture();
    if (glowTexture) {
      [
        { scale: 13, opacity: 0.72, color: 0xffc169 },
        { scale: 23, opacity: 0.34, color: 0xff7a2f },
        { scale: 39, opacity: 0.14, color: 0xff4f1f },
      ].forEach((definition) => {
        const material = new THREE.SpriteMaterial({
          map: glowTexture,
          color: definition.color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(definition.scale, definition.scale, 1);
        sprite.userData.targetOpacity = definition.opacity;
        sunGlowSprites.push(sprite);
        group.add(sprite);
      });

      const flareMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffcf8c,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const flare = new THREE.Sprite(flareMaterial);
      flare.scale.set(36, 1.4, 1);
      flare.userData.targetOpacity = 0.2;
      sunGlowSprites.push(flare);
      group.add(flare);
    }

    sunLight = new THREE.PointLight(0xffbd72, 0, 280, 1.25);
    if (glowTexture) {
      sunLensflare = new Lensflare();
      sunLensflare.visible = false;
      sunLensflare.addElement(new LensflareElement(
        glowTexture,
        isMobile ? 260 : 460,
        0,
        new THREE.Color(0xffe5ad)
      ));
      sunLensflare.addElement(new LensflareElement(
        glowTexture,
        isMobile ? 64 : 110,
        0.36,
        new THREE.Color(0xffa64f)
      ));
      sunLensflare.addElement(new LensflareElement(
        glowTexture,
        isMobile ? 42 : 74,
        0.7,
        new THREE.Color(0x6fa6ff)
      ));
      sunLight.add(sunLensflare);
    }
    group.add(sunLight);

    const jupiterTexture = createBandTexture([
      '#5b3827', '#c79a72', '#ead0a7', '#8b5940', '#d9b88c', '#70432f', '#caa077',
    ], true);
    const saturnTexture = createBandTexture([
      '#8e7550', '#d8c38f', '#b7a16e', '#eee0ae', '#9e865b', '#d4bd86',
    ], false);
    const bodyDefinitions = [
      { name: 'mercury', radius: 0.5, orbit: 6, eccentricity: 0.2056, inclination: 7, color: 0x8d8379, speed: 0.00019, tilt: 0.03, rotationSpeed: 0.000018 },
      { name: 'venus', radius: 0.72, orbit: 11, eccentricity: 0.0068, inclination: 3.39, color: 0xc89358, speed: 0.000145, tilt: 177.3, rotationSpeed: -0.000012 },
      { name: 'mars', radius: 0.58, orbit: 27, eccentricity: 0.0934, inclination: 1.85, color: 0xa9482c, speed: 0.00009, tilt: 25.2, rotationSpeed: 0.000036 },
      { name: 'jupiter', radius: 2.35, orbit: 44, eccentricity: 0.0484, inclination: 1.304, color: 0xffffff, map: jupiterTexture, speed: 0.00006, tilt: 3.1, rotationSpeed: 0.000085 },
      { name: 'saturn', radius: 2, orbit: 60, eccentricity: 0.0539, inclination: 2.49, color: 0xffffff, map: saturnTexture, speed: 0.000048, tilt: 26.7, rotationSpeed: 0.000072, ring: { inner: 2.45, outer: 4.05, color: 0xcbb982, opacity: 0.74 } },
      { name: 'uranus', radius: 1.18, orbit: 80, eccentricity: 0.0473, inclination: 0.77, color: 0x8fd2d2, speed: 0.000038, tilt: 97.8, rotationSpeed: -0.000052, ring: { inner: 1.36, outer: 1.68, color: 0x91c9cf, opacity: 0.24 } },
      { name: 'neptune', radius: 1.16, orbit: 102, eccentricity: 0.0086, inclination: 1.77, color: 0x315dbe, speed: 0.000032, tilt: 28.3, rotationSpeed: 0.000058 },
    ];

    [
      bodyDefinitions[0],
      bodyDefinitions[1],
      earthOrbitDefinition,
      ...bodyDefinitions.slice(2),
    ].forEach((definition) => {
      group.add(createOrbit(definition));
    });

    group.add(createZodiacalDust(isMobile ? 360 : 980));

    bodyDefinitions.forEach((definition, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: definition.color,
        map: definition.map || null,
        emissive: definition.name === 'neptune' ? 0x07122d : 0x070402,
        roughness: definition.name === 'venus' ? 0.82 : 0.68,
        metalness: 0,
        transparent: true,
        opacity: 0,
      });
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(
          definition.radius,
          isMobile ? 26 : 44,
          isMobile ? 18 : 30
        ),
        material
      );
      body.name = definition.name;
      body.visible = false;
      body.userData.orbitRadius = definition.orbit;
      body.userData.orbitPhase = initialOrbitAngle;
      body.userData.orbitSpeed = definition.speed;
      body.userData.orbitEccentricity = definition.eccentricity;
      body.userData.orbitInclination = definition.inclination;
      body.userData.rotationSpeed = definition.rotationSpeed;
      body.userData.revealIndex = index;
      body.userData.zoomRadius = definition.radius;
      body.rotation.z = THREE.MathUtils.degToRad(definition.tilt);

      if (definition.ring) {
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: definition.ring.color,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(
            definition.ring.inner,
            definition.ring.outer,
            isMobile ? 64 : 104
          ),
          ringMaterial
        );
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = -0.18;
        ringMaterial.userData.targetOpacity = definition.ring.opacity;
        body.add(ring);
        planetRingMaterials.push(ringMaterial);
      }

      celestialBodies.push(body);
      celestialMaterials.push(material);
      zoomTargets.push(body);
      group.add(body);
    });

    const beltCount = isMobile ? 110 : 260;
    const beltPositions = new Float32Array(beltCount * 3);
    for (let index = 0; index < beltCount; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 34 + random() * 4.4;
      const offset = index * 3;
      beltPositions[offset] = Math.cos(angle) * radius;
      beltPositions[offset + 1] = (random() * 2 - 1) * 0.42;
      beltPositions[offset + 2] = Math.sin(angle) * radius * 0.96;
    }
    const beltGeometry = new THREE.BufferGeometry();
    beltGeometry.setAttribute('position', new THREE.BufferAttribute(beltPositions, 3));
    asteroidBeltMaterial = new THREE.PointsMaterial({
      color: 0xb6aa99,
      size: isMobile ? 0.09 : 0.12,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });
    asteroidBelt = new THREE.Points(beltGeometry, asteroidBeltMaterial);
    group.add(asteroidBelt);

    const geometries = [0, 1, 2].map(createAsteroidGeometry);
    [0x57524b, 0x6b6257, 0x484b4e].forEach((color) => {
      asteroidMaterials.push(new THREE.MeshPhongMaterial({
        color,
        specular: 0x262421,
        shininess: 3,
        flatShading: true,
        transparent: true,
        opacity: 0,
        side: THREE.FrontSide,
        depthTest: true,
        depthWrite: true,
      }));
    });

    const asteroidCount = isMobile ? 7 : 14;
    for (let index = 0; index < asteroidCount; index += 1) {
      const asteroid = new THREE.Mesh(
        geometries[index % geometries.length],
        asteroidMaterials[index % asteroidMaterials.length]
      );
      const baseScale = index < 3
        ? 0.24 + random() * 0.32
        : 0.1 + random() * 0.22;
      asteroid.scale.set(
        baseScale * (0.72 + random() * 0.56),
        baseScale * (0.66 + random() * 0.62),
        baseScale * (0.72 + random() * 0.58)
      );
      const angle = random() * Math.PI * 2;
      const radius = index < 3 ? 10 + random() * 8 : 17 + random() * 3.2;
      asteroid.position.set(
        Math.cos(angle) * radius,
        (random() * 2 - 1) * (index < 3 ? 3.4 : 1.4),
        Math.sin(angle) * radius * 0.96
      );
      asteroid.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
      asteroid.userData.basePosition = asteroid.position.clone();
      asteroid.userData.baseRotation = asteroid.rotation.clone();
      asteroid.userData.driftPhase = random() * Math.PI * 2;
      asteroid.userData.driftAmount = 0.12 + random() * 0.36;
      asteroid.userData.rotationSpeed = new THREE.Vector3(
        0.00001 + random() * 0.000025,
        0.000012 + random() * 0.00003,
        0.000008 + random() * 0.00002
      );
      asteroid.userData.zoomRadius = baseScale * 1.25;
      asteroids.push(asteroid);
      zoomTargets.push(asteroid);
      group.add(asteroid);
    }

    return group;
  }

  async function loadTexture(name, colorSpace) {
    if (!renderer) return null;

    try {
      const texture = await new THREE.TextureLoader().loadAsync(textureUrl(name));
      if (colorSpace) texture.colorSpace = colorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return texture;
    } catch (error) {
      return null;
    }
  }

  async function createWorld() {
    if (!scene || !renderer) return;

    const [day, normal, specular, clouds, lights, moonTexture] = await Promise.all([
      loadTexture('earth-day.jpg', THREE.SRGBColorSpace),
      loadTexture('earth-normal.jpg'),
      loadTexture('earth-specular.jpg'),
      loadTexture('earth-clouds.png', THREE.SRGBColorSpace),
      loadTexture('earth-lights.png', THREE.SRGBColorSpace),
      loadTexture('moon.jpg', THREE.SRGBColorSpace),
    ]);

    world = new THREE.Group();
    world.position.set(18, 0, 0);
    if (cosmicObjects) {
      cosmicObjects.add(world);
    } else {
      scene.add(world);
    }

    earthSpin = new THREE.Group();
    earthSpin.rotation.x = 0.08;
    earthSpin.rotation.z = THREE.MathUtils.degToRad(23.4393);
    world.add(earthSpin);

    const widthSegments = isMobile ? 72 : 112;
    const heightSegments = isMobile ? 48 : 72;
    const earthGeometry = new THREE.SphereGeometry(2, widthSegments, heightSegments);

    earthMaterial = new THREE.MeshPhongMaterial({
      color: day ? 0xffffff : 0x2d6682,
      map: day,
      normalMap: normal,
      normalScale: new THREE.Vector2(0.62, 0.62),
      specularMap: specular,
      specular: new THREE.Color(0x6f9fb4),
      shininess: 22,
      transparent: true,
      opacity: 0,
    });

    earthSurface = new THREE.Mesh(earthGeometry, earthMaterial);
    earthSurface.userData.zoomRadius = 2;
    zoomTargets.push(earthSurface);
    earthSpin.add(earthSurface);

    if (lights) {
      cityMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          lightsMap: { value: lights },
          sunDirection: { value: new THREE.Vector3(-1, 0, 0) },
          opacity: { value: 0 },
        },
        vertexShader: [
          'varying vec2 vUv;',
          'varying vec3 vWorldNormal;',
          'void main() {',
          '  vUv = uv;',
          '  vWorldNormal = normalize(mat3(modelMatrix) * normal);',
          '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
          '}',
        ].join('\n'),
        fragmentShader: [
          'uniform sampler2D lightsMap;',
          'uniform vec3 sunDirection;',
          'uniform float opacity;',
          'varying vec2 vUv;',
          'varying vec3 vWorldNormal;',
          'void main() {',
          '  vec3 lights = texture2D(lightsMap, vUv).rgb;',
          '  float facingSun = dot(normalize(vWorldNormal), normalize(sunDirection));',
          '  float night = 1.0 - smoothstep(-0.22, 0.18, facingSun);',
          '  float strength = max(max(lights.r, lights.g), lights.b);',
          '  vec3 warmLights = lights * vec3(1.34, 1.02, 0.72) * 2.15;',
          '  gl_FragColor = vec4(warmLights, strength * night * opacity);',
          '}',
        ].join('\n'),
      });

      const cityLights = new THREE.Mesh(
        new THREE.SphereGeometry(2.006, widthSegments, heightSegments),
        cityMaterial
      );
      cityLights.renderOrder = 2;
      earthSpin.add(cityLights);
    }

    if (clouds) {
      cloudMaterial = new THREE.MeshPhongMaterial({
        map: clouds,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        alphaTest: 0.012,
        color: 0xdcebf3,
      });
      const cloudLayer = new THREE.Mesh(
        new THREE.SphereGeometry(2.025, widthSegments, heightSegments),
        cloudMaterial
      );
      cloudLayer.name = 'cloud-layer';
      cloudLayer.renderOrder = 3;
      earthSpin.add(cloudLayer);
    }

    atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      uniforms: {
        opacity: { value: 0 },
        sunDirection: { value: new THREE.Vector3(-1, 0, 0) },
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec3 vWorldNormal;',
        'varying vec3 vViewDirection;',
        'void main() {',
        '  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);',
        '  vNormal = normalize(normalMatrix * normal);',
        '  vWorldNormal = normalize(mat3(modelMatrix) * normal);',
        '  vViewDirection = normalize(-viewPosition.xyz);',
        '  gl_Position = projectionMatrix * viewPosition;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float opacity;',
        'uniform vec3 sunDirection;',
        'varying vec3 vNormal;',
        'varying vec3 vWorldNormal;',
        'varying vec3 vViewDirection;',
        'void main() {',
        '  float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.7);',
        '  float daylight = smoothstep(-0.38, 0.42, dot(normalize(vWorldNormal), normalize(sunDirection)));',
        '  float horizon = mix(0.18, 1.0, daylight);',
        '  vec3 nightBlue = vec3(0.035, 0.18, 0.46);',
        '  vec3 dayBlue = vec3(0.18, 0.67, 1.0);',
        '  vec3 atmosphere = mix(nightBlue, dayBlue, daylight) * fresnel * 1.55;',
        '  gl_FragColor = vec4(atmosphere, fresnel * horizon * opacity);',
        '}',
      ].join('\n'),
    });

    atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.095, widthSegments, heightSegments),
      atmosphereMaterial
    );
    atmosphere.renderOrder = 4;
    world.add(atmosphere);

    if (moonTexture) {
      moonMaterial = new THREE.MeshPhongMaterial({
        map: moonTexture,
        color: 0xd8d4ca,
        transparent: true,
        opacity: 0,
        shininess: 2,
      });
      moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, isMobile ? 36 : 52, isMobile ? 24 : 36),
        moonMaterial
      );
      moon.userData.zoomRadius = 0.42;
      moon.position.set(5.6, 1.4, -4.3);
      zoomTargets.push(moon);
      world.add(moon);
    }
  }

  function resizeRenderer() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    isMobile = width < 720;

    if (!renderer || !camera) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.7));
    renderer.setSize(width, height, false);
    if (composer) composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (stars && stars.material && stars.material.uniforms) {
      stars.material.uniforms.pointScale.value = isMobile ? 44 : 62;
    }
  }

  function activateFreeCamera() {
    if (freeCameraActive || !camera) return;

    freeCameraActive = true;
    freeCameraPosition.copy(camera.position);
    targetFreeCameraPosition.copy(camera.position);
    camera.getWorldDirection(freeCameraBaseForward).normalize();
    cameraOrbitPitch = 0;
    cameraOrbitYaw = 0;
    cameraOrbitVelocityPitch = 0;
    cameraOrbitVelocityYaw = 0;
    targetPointerInfluence = 0;
  }

  function updateFreeCameraAxes() {
    cameraForward
      .copy(freeCameraBaseForward)
      .applyAxisAngle(cameraUp, cameraOrbitYaw)
      .normalize();
    cameraRight.crossVectors(cameraForward, cameraUp).normalize();
    cameraForward.applyAxisAngle(cameraRight, cameraOrbitPitch).normalize();
    cameraRight.crossVectors(cameraForward, cameraUp).normalize();
    cameraLocalUp.crossVectors(cameraRight, cameraForward).normalize();
  }

  function clampFreeCameraPosition() {
    cameraMove.copy(targetFreeCameraPosition).sub(solarCenter);
    if (cameraMove.lengthSq() <= maximumFreeCameraDistance * maximumFreeCameraDistance) return;
    cameraMove.setLength(maximumFreeCameraDistance);
    targetFreeCameraPosition.copy(solarCenter).add(cameraMove);
  }

  function clearZoomAnchor() {
    zoomAnchorObject = null;
    zoomAnchorRadius = 0;
    zoomAnchorLockedUntil = 0;
  }

  function isZoomTargetVisible(object) {
    let current = object;
    while (current) {
      if (!current.visible) return false;
      current = current.parent;
    }

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    return materials.some((material) => (
      material
      && (!material.transparent || typeof material.opacity !== 'number' || material.opacity > 0.04)
    ));
  }

  function getZoomTargetRadius(object) {
    object.getWorldScale(zoomWorldScale);
    const scale = Math.max(
      Math.abs(zoomWorldScale.x),
      Math.abs(zoomWorldScale.y),
      Math.abs(zoomWorldScale.z)
    );
    return Math.max(0.08, (object.userData.zoomRadius || 0.5) * scale);
  }

  function updateLockedZoomAnchor() {
    if (!zoomAnchorObject) return;
    zoomAnchorWorld.copy(zoomAnchorLocal);
    zoomAnchorObject.localToWorld(zoomAnchorWorld);
    zoomAnchorRadius = getZoomTargetRadius(zoomAnchorObject);
  }

  function resolveZoomAnchor(event, time) {
    if (time < zoomAnchorLockedUntil) {
      updateLockedZoomAnchor();
      zoomAnchorLockedUntil = time + zoomAnchorLockDuration;
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    zoomPointer.set(
      ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1,
      -((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 + 1
    );
    zoomRaycaster.setFromCamera(zoomPointer, camera);

    const hit = zoomRaycaster
      .intersectObjects(zoomTargets, false)
      .find((intersection) => isZoomTargetVisible(intersection.object));

    if (hit) {
      zoomAnchorObject = hit.object;
      zoomAnchorWorld.copy(hit.point);
      zoomAnchorLocal.copy(hit.point);
      zoomAnchorObject.worldToLocal(zoomAnchorLocal);
      zoomAnchorRadius = getZoomTargetRadius(zoomAnchorObject);
    } else {
      zoomAnchorObject = null;
      zoomAnchorRadius = 0;
      camera.getWorldDirection(cameraForward).normalize();
      const focusDistance = clamp(
        camera.position.distanceTo(solarCenter) * 0.48,
        12,
        128
      );
      const rayAlignment = Math.max(
        0.24,
        zoomRaycaster.ray.direction.dot(cameraForward)
      );
      zoomAnchorWorld
        .copy(zoomRaycaster.ray.origin)
        .addScaledVector(zoomRaycaster.ray.direction, focusDistance / rayAlignment);
    }

    zoomAnchorLockedUntil = time + zoomAnchorLockDuration;
  }

  function moveCameraTowardZoomAnchor(normalizedDelta) {
    updateLockedZoomAnchor();
    zoomDirection.copy(zoomAnchorWorld).sub(targetFreeCameraPosition);
    const distanceToAnchor = zoomDirection.length();
    if (distanceToAnchor < 0.001) return;

    const zoomingIn = normalizedDelta < 0;
    const distanceFactor = clamp(distanceToAnchor / 32, 0.22, 2.8);
    let travel = clamp(
      Math.abs(normalizedDelta) * wheelTravelSensitivity * distanceFactor,
      0.018,
      22
    );
    if (zoomingIn) {
      travel = Math.min(travel, distanceToAnchor * 0.82);
    } else {
      travel *= 0.88;
    }

    zoomDirection.multiplyScalar((zoomingIn ? 1 : -1) / distanceToAnchor);

    if (zoomingIn && zoomAnchorObject) {
      zoomAnchorObject.getWorldPosition(zoomObjectCenter);
      const safeDistance = zoomAnchorRadius * 1.42 + 0.28;
      cameraMove.copy(targetFreeCameraPosition).sub(zoomObjectCenter);
      const currentDistanceSquared = cameraMove.lengthSq();
      if (currentDistanceSquared <= safeDistance * safeDistance) return;

      const projection = cameraMove.dot(zoomDirection);
      const discriminant = projection * projection
        - (currentDistanceSquared - safeDistance * safeDistance);
      if (discriminant >= 0) {
        const distanceToSafetyBoundary = -projection - Math.sqrt(discriminant);
        if (distanceToSafetyBoundary <= 0) return;
        travel = Math.min(travel, distanceToSafetyBoundary * 0.985);
      }
    }

    zoomProposedPosition
      .copy(targetFreeCameraPosition)
      .addScaledVector(zoomDirection, travel);

    targetFreeCameraPosition.copy(zoomProposedPosition);
    clampFreeCameraPosition();
  }

  function updateKeyboardCameraMovement(frameDelta) {
    if (!isExploring || !freeCameraActive || frameDelta <= 0 || pressedMoveKeys.size === 0) return;

    updateFreeCameraAxes();
    cameraMove.set(0, 0, 0);
    if (pressedMoveKeys.has('KeyW')) cameraMove.add(cameraForward);
    if (pressedMoveKeys.has('KeyS')) cameraMove.sub(cameraForward);
    if (pressedMoveKeys.has('KeyD')) cameraMove.add(cameraRight);
    if (pressedMoveKeys.has('KeyA')) cameraMove.sub(cameraRight);
    if (pressedMoveKeys.has('KeyE')) cameraMove.add(cameraLocalUp);
    if (pressedMoveKeys.has('KeyQ')) cameraMove.sub(cameraLocalUp);
    if (cameraMove.lengthSq() === 0) return;

    const distanceFactor = 1 + Math.min(
      targetFreeCameraPosition.distanceTo(solarCenter) / 180,
      2.2
    );
    const speed = (pressedMoveKeys.has('ShiftLeft') || pressedMoveKeys.has('ShiftRight')
      ? 0.085
      : 0.034) * frameDelta * distanceFactor;
    targetFreeCameraPosition.addScaledVector(cameraMove.normalize(), speed);
    clampFreeCameraPosition();
  }

  function beginSceneDrag(event) {
    clearZoomAnchor();
    activateFreeCamera();
    isDraggingScene = true;
    sceneDragPointerId = event.pointerId;
    sceneDragMode = event.button === 2 || event.shiftKey || event.ctrlKey || event.metaKey
      ? 'move'
      : 'look';
    sceneDragMoved = false;
    sceneDragStartX = event.clientX;
    sceneDragStartY = event.clientY;
    sceneDragLastX = event.clientX;
    sceneDragLastY = event.clientY;
    sceneDragLastAt = performance.now();
    cameraOrbitVelocityPitch = 0;
    cameraOrbitVelocityYaw = 0;
    targetPointerInfluence = 0;
    root.classList.add('is-scene-dragging');

    try {
      root.setPointerCapture(event.pointerId);
    } catch (error) {}
  }

  function moveSceneDrag(event) {
    if (!isDraggingScene || event.pointerId !== sceneDragPointerId) return false;

    const now = performance.now();
    const deltaTime = Math.max(8, now - sceneDragLastAt);
    const deltaX = event.clientX - sceneDragLastX;
    const deltaY = event.clientY - sceneDragLastY;

    if (sceneDragMode === 'move') {
      updateFreeCameraAxes();
      const distanceFactor = 0.0038 * (
        1 + Math.min(camera.position.distanceTo(solarCenter) / 130, 3)
      );
      targetFreeCameraPosition.addScaledVector(cameraRight, -deltaX * distanceFactor);
      targetFreeCameraPosition.addScaledVector(cameraLocalUp, deltaY * distanceFactor);
      clampFreeCameraPosition();
      cameraOrbitVelocityPitch = 0;
      cameraOrbitVelocityYaw = 0;
    } else {
      const yawDelta = -deltaX * 0.0048;
      const pitchDelta = -deltaY * 0.0042;

      cameraOrbitYaw += yawDelta;
      cameraOrbitPitch = clamp(
        cameraOrbitPitch + pitchDelta,
        -1.36,
        1.36
      );
      cameraOrbitVelocityYaw = clamp(
        cameraOrbitVelocityYaw * 0.35 + yawDelta / deltaTime * 0.65,
        -0.009,
        0.009
      );
      cameraOrbitVelocityPitch = clamp(
        cameraOrbitVelocityPitch * 0.35 + pitchDelta / deltaTime * 0.65,
        -0.008,
        0.008
      );
    }
    sceneDragLastX = event.clientX;
    sceneDragLastY = event.clientY;
    sceneDragLastAt = now;

    if (Math.hypot(event.clientX - sceneDragStartX, event.clientY - sceneDragStartY) > 4) {
      sceneDragMoved = true;
    }

    renderScene(currentProgress, now);
    return true;
  }

  function endSceneDrag(event, cancelled) {
    if (!isDraggingScene) return;
    if (event && event.pointerId !== sceneDragPointerId) return;

    const pointerId = sceneDragPointerId;
    const moved = sceneDragMoved;
    const dragMode = sceneDragMode;
    isDraggingScene = false;
    sceneDragPointerId = null;
    sceneDragMode = 'look';

    if (cancelled || !moved) {
      cameraOrbitVelocityPitch = 0;
      cameraOrbitVelocityYaw = 0;
    }
    if (moved) suppressDoubleClickUntil = performance.now() + 480;
    if (!cancelled && !moved && event && dragMode === 'look') addRipple(event);

    root.classList.remove('is-scene-dragging');
    try {
      if (pointerId !== null && root.hasPointerCapture(pointerId)) {
        root.releasePointerCapture(pointerId);
      }
    } catch (error) {}

    scheduleFrame();
  }

  function handleScenePointerDown(event) {
    if (event.target instanceof Element && event.target.closest('button, a')) return;

    const primaryPointer = event.pointerType !== 'mouse'
      || event.button === 0
      || event.button === 2;
    if (!primaryPointer || reducedMotion.matches) return;

    enterExploreMode(true);
    if (!isExploring) return;
    event.preventDefault();
    beginSceneDrag(event);
  }

  function handleSceneWheel(event) {
    if (reducedMotion.matches) return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;

    enterExploreMode(true);
    if (!isExploring) return;
    event.preventDefault();
    const deltaMultiplier = event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? height
        : 1;
    const normalizedDelta = event.deltaY * deltaMultiplier;
    activateFreeCamera();
    resolveZoomAnchor(event, performance.now());
    moveCameraTowardZoomAnchor(normalizedDelta);
    scheduleFrame();
  }

  function addRipple(event) {
    if (!isExploring || !scene || !camera || reducedMotion.matches) return;
    if (event.pointerType === 'touch') return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;

    const pointer = new THREE.Vector3(
      event.clientX / Math.max(1, width) * 2 - 1,
      -(event.clientY / Math.max(1, height)) * 2 + 1,
      0.2
    );
    pointer.unproject(camera);
    pointer.sub(camera.position).normalize();

    const material = new THREE.MeshBasicMaterial({
      color: 0x91e1e2,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.105, 64), material);
    ring.position.copy(camera.position).add(pointer.multiplyScalar(6.5));
    ring.quaternion.copy(camera.quaternion);
    scene.add(ring);
    ripples.push({ ring, material, startedAt: performance.now() });

    if (ripples.length > 3) disposeRipple(ripples.shift());
  }

  function disposeRipple(ripple) {
    if (!ripple || !scene) return;
    scene.remove(ripple.ring);
    ripple.ring.geometry.dispose();
    ripple.material.dispose();
  }

  function updateRipples(time) {
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      const progress = (time - ripple.startedAt) / 850;
      if (progress >= 1) {
        disposeRipple(ripple);
        ripples.splice(index, 1);
        continue;
      }

      const amount = ease(progress);
      ripple.ring.scale.setScalar(1 + amount * 9);
      ripple.material.opacity = (1 - amount) * 0.42;
    }
  }

  function renderScene(progress, time) {
    if (!renderer || !scene || !camera) return;

    const frameDelta = lastRenderAt
      ? clamp(time - lastRenderAt, 0, 34)
      : 0;
    lastRenderAt = time;

    pointerX += (targetPointerX - pointerX) * 0.035;
    pointerY += (targetPointerY - pointerY) * 0.035;
    pointerInfluence += (targetPointerInfluence - pointerInfluence) * 0.05;

    const idleTime = isExploring && finishedAt ? (time - finishedAt) * 0.12 : 0;
    const sceneTime = progress * duration + idleTime;
    const orbitMotionTime = Math.max(0, sceneTime - orbitMotionDelay);
    const systemShotBlend = cinematicEase(phase(progress, 0.54, 0.82));

    if (world) {
      const earthOrbitAngle = initialOrbitAngle
        + orbitMotionTime * earthOrbitDefinition.speed;
      const earthOrbitDistance = getOrbitDistance(
        earthOrbitDefinition.orbit,
        earthOrbitDefinition.eccentricity,
        earthOrbitAngle
      );
      world.position.set(
        Math.cos(earthOrbitAngle) * earthOrbitDistance,
        getOrbitHeight(
          earthOrbitDefinition.orbit,
          earthOrbitDefinition.inclination,
          earthOrbitAngle
        ),
        Math.sin(earthOrbitAngle) * earthOrbitDistance * 0.96
      );
      world.getWorldPosition(earthWorldPosition);
    } else {
      earthWorldPosition.set(0, 0, 0);
    }

    if (!isDraggingScene && frameDelta > 0) {
      cameraOrbitYaw += cameraOrbitVelocityYaw * frameDelta;
      const nextOrbitPitch = cameraOrbitPitch + cameraOrbitVelocityPitch * frameDelta;
      cameraOrbitPitch = clamp(nextOrbitPitch, -1.36, 1.36);
      if (cameraOrbitPitch !== nextOrbitPitch) cameraOrbitVelocityPitch = 0;

      const inertiaDamping = Math.pow(0.84, frameDelta / 16.667);
      cameraOrbitVelocityPitch *= inertiaDamping;
      cameraOrbitVelocityYaw *= inertiaDamping;
      if (Math.abs(cameraOrbitVelocityPitch) < 0.00001) cameraOrbitVelocityPitch = 0;
      if (Math.abs(cameraOrbitVelocityYaw) < 0.00001) cameraOrbitVelocityYaw = 0;
    }

    if (isExploring && freeCameraActive) {
      updateKeyboardCameraMovement(frameDelta);
      const movementEasing = frameDelta > 0
        ? 1 - Math.pow(0.66, frameDelta / 16.667)
        : 1;
      freeCameraPosition.lerp(targetFreeCameraPosition, movementEasing);
      updateFreeCameraAxes();
      camera.position.copy(freeCameraPosition);
      cameraLookTarget.copy(camera.position).addScaledVector(cameraForward, 120);
      camera.lookAt(cameraLookTarget);
    } else {
      const cameraKeys = isMobile ? cameraKeysMobile : cameraKeysDesktop;
      const targetKeys = isMobile ? targetKeysMobile : targetKeysDesktop;
      const systemCameraKeys = isMobile ? systemCameraKeysMobile : systemCameraKeysDesktop;
      const systemTargetKeys = isMobile ? systemTargetKeysMobile : systemTargetKeysDesktop;

      sampleVector(cameraKeys, progress, cameraBasePosition, cinematicEase);
      sampleVector(targetKeys, progress, cameraBaseTarget, cinematicEase);
      cameraPosition.copy(earthWorldPosition).add(cameraBasePosition);
      cameraTarget.copy(earthWorldPosition).add(cameraBaseTarget);

      const systemFramingScale = clamp(1.33 / Math.max(camera.aspect, 0.45), 1, 2.15);
      sampleVector(systemCameraKeys, progress, systemCameraPosition, cinematicEase)
        .multiplyScalar(systemFramingScale)
        .add(solarCenter);
      sampleVector(systemTargetKeys, progress, systemCameraTarget, cinematicEase)
        .add(solarCenter);
      cameraPosition.lerp(systemCameraPosition, systemShotBlend);
      cameraTarget.lerp(systemCameraTarget, systemShotBlend);

      const pointerWeight = 1 - systemShotBlend * 0.78;
      cameraPosition.x += pointerX * 0.52 * pointerInfluence * pointerWeight;
      cameraPosition.y -= pointerY * 0.34 * pointerInfluence * pointerWeight;
      cameraTarget.x += pointerX * 0.22 * pointerInfluence * pointerWeight;
      cameraTarget.y -= pointerY * 0.16 * pointerInfluence * pointerWeight;
      camera.position.copy(cameraPosition);
      camera.lookAt(cameraTarget);
      camera.rotation.z += band(progress, 0.34, 0.43, 0.56, 0.66) * -0.012;
    }

    const reveal = easeOutQuint(phase(progress, 0.015, 0.13));
    const sunReveal = easeOutQuint(phase(progress, 0.14, 0.31));
    const systemReveal = cinematicEase(phase(progress, 0.32, 0.72));
    const orbitReveal = cinematicEase(phase(progress, 0.57, 0.78));
    const warp = band(progress, 0.38, 0.46, 0.58, 0.68);
    const travelEnergy = band(progress, 0.32, 0.43, 0.64, 0.76);
    const finaleCalm = ease(phase(progress, 0.78, 0.98));

    const baseFov = isMobile ? 47 : 43;
    const finaleFov = isMobile ? 42 : 39;
    const desiredFov = isExploring
      ? baseFov
      : baseFov + warp * (isMobile ? 5 : 7) + (finaleFov - baseFov) * finaleCalm;
    if (Math.abs(camera.fov - desiredFov) > 0.01) {
      camera.fov = desiredFov;
      camera.updateProjectionMatrix();
    }

    if (earthSpin) {
      earthSpin.rotation.y = -1.58 + sceneTime * 0.000045;
      earthSpin.rotation.x = 0.08
        + Math.sin(sceneTime * 0.00022) * 0.018;
      const cloudLayer = earthSpin.getObjectByName('cloud-layer');
      if (cloudLayer) cloudLayer.rotation.y = sceneTime * 0.000007;
    }

    if (earthMaterial) earthMaterial.opacity = reveal;
    if (cloudMaterial) cloudMaterial.opacity = reveal * 0.58;
    if (cityMaterial) cityMaterial.uniforms.opacity.value = reveal * 1.1;
    if (atmosphereMaterial) atmosphereMaterial.uniforms.opacity.value = reveal * 0.72;

    if (sunSurface && sunMaterial) {
      sunSurface.visible = sunReveal > 0.002;
      sunSurface.rotation.y = sceneTime * 0.000006;
      sunSurface.rotation.z = sceneTime * 0.0000018;
      sunMaterial.uniforms.time.value = sceneTime * 0.001;
      sunMaterial.uniforms.opacity.value = sunReveal;
    }
    sunGlowSprites.forEach((sprite, index) => {
      const pulse = 0.94 + Math.sin(sceneTime * 0.00055 + index * 1.3) * 0.06;
      sprite.material.opacity = sunReveal * sprite.userData.targetOpacity * pulse;
      if (index === sunGlowSprites.length - 1) {
        sprite.material.rotation = Math.sin(sceneTime * 0.00008) * 0.08;
      }
    });
    if (sunLight) {
      sunLight.intensity = sunReveal * (isMobile ? 280 : 390);
    }
    if (sunLensflare) sunLensflare.visible = sunReveal > 0.08;

    if (ambientLight) {
      ambientLight.intensity = 0.06 + reveal * 0.05 + systemReveal * 0.035;
    }
    if (keyLight) {
      keyLight.intensity = 0.42 * (1 - sunReveal * 0.72) + finaleCalm * 0.05;
    }
    if (rimLight) {
      rimLight.intensity = 3.2 * reveal * (1 - systemReveal * 0.82);
    }

    if (cityMaterial && earthSurface && sunSurface) {
      sunSurface.getWorldPosition(sunWorldPosition);
      earthSurface.getWorldPosition(earthWorldPosition);
      earthToSunDirection
        .copy(sunWorldPosition)
        .sub(earthWorldPosition)
        .normalize();
      cityMaterial.uniforms.sunDirection.value.copy(earthToSunDirection);
      if (atmosphereMaterial) {
        atmosphereMaterial.uniforms.sunDirection.value.copy(earthToSunDirection);
      }
    }

    if (moon && moonMaterial) {
      const moonAmount = band(progress, 0.16, 0.24, 0.6, 0.75);
      const moonAngle = -0.32 + progress * 0.72;
      moon.position.set(
        Math.cos(moonAngle) * 6.2,
        1.15 + Math.sin(moonAngle * 1.7) * 0.65,
        -4.3 + Math.sin(moonAngle) * 1.8
      );
      moon.rotation.y = sceneTime * 0.000018;
      moonMaterial.opacity = moonAmount * 0.76;
    }

    celestialBodies.forEach((body, index) => {
      const revealStart = 0.34 + index * 0.027;
      const bodyReveal = easeOutQuint(phase(progress, revealStart, revealStart + 0.09));
      const orbitAngle = body.userData.orbitPhase
        + orbitMotionTime * body.userData.orbitSpeed;
      const orbitDistance = getOrbitDistance(
        body.userData.orbitRadius,
        body.userData.orbitEccentricity,
        orbitAngle
      );
      body.position.set(
        Math.cos(orbitAngle) * orbitDistance,
        getOrbitHeight(
          body.userData.orbitRadius,
          body.userData.orbitInclination,
          orbitAngle
        ),
        Math.sin(orbitAngle) * orbitDistance * 0.96
      );
      body.visible = bodyReveal > 0.002;
      body.rotation.y = sceneTime * body.userData.rotationSpeed;
      celestialMaterials[index].opacity = bodyReveal * 0.96;
    });
    planetRingMaterials.forEach((material) => {
      material.opacity = systemReveal
        * material.userData.targetOpacity;
    });
    const cameraSolarDistance = camera.position.distanceTo(solarCenter);
    const zoomedSystemReveal = ease(clamp((cameraSolarDistance - 38) / 128, 0, 1));
    orbitMaterials.forEach((material, index) => {
      material.opacity = orbitReveal * zoomedSystemReveal * (index === 2 ? 0.28 : 0.18);
    });
    if (asteroidBelt && asteroidBeltMaterial) {
      asteroidBelt.rotation.y = sceneTime * 0.0000018;
      asteroidBeltMaterial.opacity = systemReveal * zoomedSystemReveal * 0.62;
    }
    if (zodiacalDust && zodiacalDustMaterial) {
      zodiacalDust.rotation.y = sceneTime * 0.0000007;
      zodiacalDustMaterial.opacity = (0.07 + zoomedSystemReveal * 0.11) * systemReveal;
    }
    asteroidMaterials.forEach((material) => {
      material.opacity = isExploring
        ? 0.9
        : Math.min(0.92, travelEnergy + systemReveal * (1 - finaleCalm) * 0.22);
    });
    asteroids.forEach((asteroid) => {
      const phaseOffset = asteroid.userData.driftPhase;
      const driftAmount = asteroid.userData.driftAmount;
      const basePosition = asteroid.userData.basePosition;
      const baseRotation = asteroid.userData.baseRotation;
      const rotationSpeed = asteroid.userData.rotationSpeed;
      asteroid.position.set(
        basePosition.x + Math.sin(sceneTime * 0.00008 + phaseOffset) * driftAmount,
        basePosition.y + Math.cos(sceneTime * 0.000065 + phaseOffset) * driftAmount * 0.7,
        basePosition.z + Math.sin(sceneTime * 0.000045 + phaseOffset) * driftAmount * 0.45
      );
      asteroid.rotation.set(
        baseRotation.x + sceneTime * rotationSpeed.x,
        baseRotation.y + sceneTime * rotationSpeed.y,
        baseRotation.z + sceneTime * rotationSpeed.z
      );
    });

    if (stars) {
      stars.rotation.y = sceneTime * 0.0000028 + pointerX * 0.025 * pointerInfluence;
      stars.rotation.x = -0.08 + pointerY * 0.018 * pointerInfluence;
      stars.material.uniforms.time.value = sceneTime * 0.001;
    }

    if (warpLines && warpMaterial) {
      warpLines.rotation.z = sceneTime * 0.000015;
      warpLines.scale.z = 1 + warp * 3.6;
      warpMaterial.opacity = warp * 0.5;
    }

    renderer.toneMappingExposure = 0.98 + sunReveal * 0.1 + warp * 0.18 - finaleCalm * 0.04;
    if (bloomPass) {
      bloomPass.strength = 0.34 + sunReveal * 0.4 + warp * 0.22 - finaleCalm * 0.08;
      bloomPass.radius = 0.3 + sunReveal * 0.1;
    }
    updateRipples(time);
    if (composer) {
      composer.render(frameDelta / 1000);
    } else {
      renderer.render(scene, camera);
    }
  }

  function renderInterface(progress) {
    const one = band(progress, 0.035, 0.09, 0.155, 0.205);
    const two = band(progress, 0.19, 0.245, 0.315, 0.365);
    const three = band(progress, 0.37, 0.43, 0.545, 0.595);
    const four = band(progress, 0.59, 0.65, 0.755, 0.805);
    const finaleAmount = cinematicEase(phase(progress, 0.82, 0.965));
    const cinemaFrame = 1 - easeOutQuint(phase(progress, 0.74, 0.96));
    const finaleShade = cinematicEase(phase(progress, 0.78, 0.95));

    setLayer(prologues.one, one, (1 - one) * 28, 0.992 + one * 0.008);
    setLayer(prologues.two, two, (1 - two) * 28, 0.992 + two * 0.008);
    setLayer(prologues.three, three, (1 - three) * 28, 0.992 + three * 0.008);
    setLayer(prologues.four, four, (1 - four) * 28, 0.992 + four * 0.008);
    setLayer(finale, finaleAmount, (1 - finaleAmount) * 34, 0.985 + finaleAmount * 0.015);

    finale.style.pointerEvents = finaleAmount > 0.96 ? 'auto' : 'none';
    root.style.setProperty('--cinema-frame', Math.max(0.08, cinemaFrame).toFixed(3));
    root.style.setProperty('--finale-shade', finaleShade.toFixed(3));
    progressFill.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    timeLeft.textContent =
      Math.max(0, Math.ceil((1 - progress) * duration / 1000)) + ' 秒';

    let chapter = '地球微光';
    if (progress >= 0.19) chapter = '掠过昼夜';
    if (progress >= 0.37) chapter = '穿越内行星';
    if (progress >= 0.59) chapter = '太阳系展开';
    if (progress >= 0.82) chapter = '抵达知识宇宙';

    chapterName.textContent = chapter;
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      status.textContent = chapter;
    }
  }

  function scheduleFrame() {
    if (!animationFrame && (isPlaying || isIdle)) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  function finishSequence(time) {
    const now = typeof time === 'number' ? time : performance.now();
    const wasExploring = isExploring;

    isPlaying = false;
    isIdle = wasExploring && !reducedMotion.matches;
    currentProgress = 1;
    finishedAt = now;

    if (!wasExploring) {
      endSceneDrag(null, true);
      freeCameraActive = false;
      pressedMoveKeys.clear();
    }

    renderInterface(1);
    renderScene(1, now);
    root.classList.remove('is-playing');
    root.classList.add('is-finished');
    skipButton.hidden = true;

    if (wasExploring) {
      replayButton.hidden = true;
      exploreButton.hidden = true;
      exitExploreButton.hidden = false;
      exitExploreButton.textContent = '返回落版';
      status.textContent = '天体序章播放完成，继续自由探索太阳系';
      scheduleFrame();
      return;
    }

    root.classList.remove('is-exploring');
    interactionHint.classList.remove('is-visible');
    replayButton.hidden = reducedMotion.matches;
    exploreButton.hidden = reducedMotion.matches;
    exitExploreButton.hidden = true;
    status.textContent = '天体序章播放完成，可以进入博客或自由探索太阳系';
  }

  function tick(time) {
    animationFrame = 0;

    if (isPlaying) {
      currentProgress = clamp((time - startedAt) / duration, 0, 1);
      renderInterface(currentProgress);
      if (currentProgress >= 1) {
        finishSequence(time);
        return;
      }
    }

    renderScene(currentProgress, time);
    scheduleFrame();
  }

  function playSequence() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    endSceneDrag(null, true);
    root.classList.add('is-playing');
    root.classList.remove('is-finished');
    root.classList.remove('is-exploring');
    skipButton.hidden = false;
    replayButton.hidden = true;
    exploreButton.hidden = true;
    exitExploreButton.hidden = true;
    currentProgress = 0;
    lastChapter = '';
    finishedAt = 0;
    isIdle = false;
    isExploring = false;
    cameraOrbitPitch = 0;
    cameraOrbitYaw = 0;
    cameraOrbitVelocityPitch = 0;
    cameraOrbitVelocityYaw = 0;
    freeCameraActive = false;
    freeCameraPosition.set(0, 0, 0);
    targetFreeCameraPosition.set(0, 0, 0);
    freeCameraBaseForward.set(0, 0, -1);
    clearZoomAnchor();
    pressedMoveKeys.clear();
    lastRenderAt = 0;
    suppressDoubleClickUntil = 0;
    enterButton.style.removeProperty('--magnet-x');
    enterButton.style.removeProperty('--magnet-y');
    interactionHint.classList.remove('is-visible');
    void interactionHint.offsetWidth;
    interactionHint.classList.add('is-visible');
    startedAt = performance.now();
    isPlaying = true;
    renderInterface(0);
    renderScene(0, startedAt);
    status.textContent = '天体序章开始播放';
    scheduleFrame();
  }

  async function initialize() {
    const hasScene = createScene();
    if (hasScene) await createWorld();

    initialized = true;
    root.classList.add('is-scene-ready');
    resizeRenderer();

    if (skipRequested || reducedMotion.matches) {
      finishSequence();
    } else {
      playSequence();
    }
  }

  enterButton.addEventListener('click', () => {
    try {
      sessionStorage.setItem(returnKey, returnUrl);
    } catch (error) {}
  });

  skipButton.addEventListener('click', () => {
    skipRequested = true;
    try {
      sessionStorage.setItem(returnKey, returnUrl);
    } catch (error) {}
    window.location.assign(returnUrl);
  });

  replayButton.addEventListener('click', () => {
    skipRequested = false;
    playSequence();
  });

  function enterExploreMode(fromDirectInteraction = false) {
    if (!initialized || reducedMotion.matches || isExploring) return;

    const exploringDuringSequence = isPlaying && currentProgress < 1;
    isExploring = true;
    isIdle = !isPlaying;
    root.classList.add('is-exploring');
    exitExploreButton.hidden = false;
    exitExploreButton.textContent = exploringDuringSequence ? '返回自动镜头' : '返回落版';
    activateFreeCamera();
    interactionHint.classList.remove('is-visible');
    void interactionHint.offsetWidth;
    interactionHint.classList.add('is-visible');
    status.textContent = exploringDuringSequence
      ? '已接管镜头，天体序章继续播放'
      : '已进入太阳系自由探索模式';
    if (fromDirectInteraction && !isPlaying) {
      exploreButton.hidden = true;
      replayButton.hidden = true;
    }
    scheduleFrame();
  }

  function leaveExploreMode() {
    if (!isExploring) return;

    const sequenceStillPlaying = isPlaying && currentProgress < 1;
    endSceneDrag(null, true);
    isExploring = false;
    isIdle = false;
    freeCameraActive = false;
    pressedMoveKeys.clear();
    cameraOrbitPitch = 0;
    cameraOrbitYaw = 0;
    cameraOrbitVelocityPitch = 0;
    cameraOrbitVelocityYaw = 0;
    targetPointerInfluence = 0;
    clearZoomAnchor();
    root.classList.remove('is-exploring');
    exitExploreButton.hidden = true;
    exitExploreButton.textContent = '返回落版';
    interactionHint.classList.remove('is-visible');
    lastRenderAt = 0;

    if (sequenceStillPlaying) {
      renderInterface(currentProgress);
      renderScene(currentProgress, performance.now());
      status.textContent = '已返回自动镜头，天体序章继续播放';
      scheduleFrame();
      return;
    }

    renderInterface(1);
    renderScene(1, performance.now());
    replayButton.hidden = reducedMotion.matches;
    exploreButton.hidden = reducedMotion.matches;
    status.textContent = '已返回天体序章落版';
  }

  exploreButton.addEventListener('click', () => enterExploreMode(false));
  exitExploreButton.addEventListener('click', leaveExploreMode);

  window.addEventListener('pointermove', (event) => {
    if (moveSceneDrag(event)) {
      event.preventDefault();
      return;
    }
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    targetPointerX = event.clientX / Math.max(1, width) - 0.5;
    targetPointerY = event.clientY / Math.max(1, height) - 0.5;
    targetPointerInfluence = 1;
  }, { passive: false });

  root.addEventListener('pointerleave', () => {
    targetPointerX = 0;
    targetPointerY = 0;
    targetPointerInfluence = 0;
  }, { passive: true });

  root.addEventListener('pointerdown', handleScenePointerDown);
  root.addEventListener('wheel', handleSceneWheel, { passive: false });
  root.addEventListener('contextmenu', (event) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    event.preventDefault();
  });

  window.addEventListener('pointerup', (event) => {
    if (isDraggingScene) event.preventDefault();
    endSceneDrag(event, false);
  }, { passive: false });

  window.addEventListener('pointercancel', (event) => {
    endSceneDrag(event, true);
  });

  root.addEventListener('dblclick', (event) => {
    if (performance.now() < suppressDoubleClickUntil) return;
    if (!isPlaying && initialized) return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    event.preventDefault();
    try {
      sessionStorage.setItem(returnKey, returnUrl);
    } catch (error) {}
    window.location.assign(returnUrl);
  });

  enterButton.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const bounds = enterButton.getBoundingClientRect();
    const magnetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const magnetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    enterButton.style.setProperty('--magnet-x', (magnetX * 7).toFixed(2) + 'px');
    enterButton.style.setProperty('--magnet-y', (magnetY * 5).toFixed(2) + 'px');
  });

  enterButton.addEventListener('pointerleave', () => {
    enterButton.style.removeProperty('--magnet-x');
    enterButton.style.removeProperty('--magnet-y');
  });

  window.addEventListener('resize', () => {
    clearZoomAnchor();
    resizeRenderer();
    renderScene(currentProgress, performance.now());
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (isExploring) {
        leaveExploreMode();
        return;
      }
      if (isPlaying) {
        finishSequence();
        return;
      }
    }
    if (!moveKeyCodes.has(event.code) || reducedMotion.matches) {
      return;
    }
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea')) return;

    enterExploreMode(true);
    if (!isExploring) return;
    activateFreeCamera();
    clearZoomAnchor();
    pressedMoveKeys.add(event.code);
    event.preventDefault();
    scheduleFrame();
  });

  window.addEventListener('keyup', (event) => {
    if (!moveKeyCodes.has(event.code)) return;
    pressedMoveKeys.delete(event.code);
  });

  window.addEventListener('blur', () => {
    pressedMoveKeys.clear();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      endSceneDrag(null, true);
      pressedMoveKeys.clear();
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      return;
    }

    if (isPlaying) {
      startedAt = performance.now() - currentProgress * duration;
    }
    scheduleFrame();
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      leaveExploreMode();
      endSceneDrag(null, true);
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      finishSequence();
      return;
    }

    if (root.classList.contains('is-finished')) {
      replayButton.hidden = false;
      exploreButton.hidden = false;
    }
  });

  initialize();
}

