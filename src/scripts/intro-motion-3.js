import * as THREE from 'three';

const opening = document.querySelector('[data-cosmic-opening]');

if (opening instanceof HTMLElement) {
  startCosmicOpening(opening);
}

function startCosmicOpening(root) {
  const canvas = root.querySelector('[data-cosmic-canvas]');
  const skipButton = root.querySelector('[data-skip]');
  const replayButton = root.querySelector('[data-replay]');
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

  const duration = 20000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(window.location.search);
  const returnKey = 'site-intro-return-v1';
  const textureRoot = (root.dataset.textureRoot || '/images/intro-motion-3').replace(/\/$/, '');

  let width = Math.max(1, window.innerWidth);
  let height = Math.max(1, window.innerHeight);
  let isMobile = width < 720;
  let renderer = null;
  let scene = null;
  let camera = null;
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
  let asteroidBelt = null;
  let asteroidBeltMaterial = null;
  let warpLines = null;
  let warpMaterial = null;
  let animationFrame = 0;
  let startedAt = 0;
  let finishedAt = 0;
  let currentProgress = 0;
  let isPlaying = false;
  let isIdle = false;
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
  let cameraOrbitPitch = 0;
  let cameraOrbitYaw = 0;
  let cameraOrbitVelocityPitch = 0;
  let cameraOrbitVelocityYaw = 0;
  let viewDistanceScale = 1;
  let targetViewDistanceScale = 1;
  let lastRenderAt = 0;
  let suppressDoubleClickUntil = 0;
  let randomSeed = 20260717;

  const ripples = [];
  const celestialBodies = [];
  const celestialMaterials = [];
  const planetRingMaterials = [];
  const orbitMaterials = [];
  const sunGlowSprites = [];
  const asteroids = [];
  const asteroidMaterials = [];
  const solarCenter = new THREE.Vector3(-12, 0, 0);
  const cameraPosition = new THREE.Vector3();
  const cameraTarget = new THREE.Vector3();
  const cameraOrbitOffset = new THREE.Vector3();
  const cameraOrbitSpherical = new THREE.Spherical();
  const sunWorldPosition = new THREE.Vector3();
  const earthWorldPosition = new THREE.Vector3();
  const earthToSunDirection = new THREE.Vector3();
  const cameraKeysDesktop = createKeys([
    [0, -1.8, 0.8, 16.8],
    [0.18, -0.8, 0.35, 11.8],
    [0.34, 3.4, 1.4, 14.5],
    [0.5, 6.4, 2.8, 23],
    [0.66, 9.2, 5.8, 34],
    [0.8, -4, 15, 55],
    [0.9, -12, 32, 94],
    [1, -12, 27, 86],
  ]);
  const targetKeysDesktop = createKeys([
    [0, -2.5, -0.35, 0],
    [0.18, -0.5, -0.1, 0],
    [0.34, -3, 0, 0],
    [0.5, -8, 0, -0.8],
    [0.66, -14, 0, -0.5],
    [0.8, -12, 0, 0],
    [1, -12, 0, 0],
  ]);
  const cameraKeysMobile = createKeys([
    [0, -0.5, 0.8, 18.5],
    [0.18, -0.3, 0.3, 13.8],
    [0.34, 2.2, 1.4, 17.5],
    [0.5, 4.6, 3.4, 28],
    [0.66, 6.2, 8.5, 43],
    [0.8, -7, 25, 78],
    [0.9, -12, 46, 128],
    [1, -12, 40, 116],
  ]);
  const targetKeysMobile = createKeys([
    [0, -0.85, 0.5, 0],
    [0.18, -0.35, 0.35, 0],
    [0.34, -3, 0.35, 0],
    [0.5, -8, 0.25, -0.8],
    [0.66, -14, 0.35, -0.5],
    [0.8, -12, 0.45, 0],
    [1, -12, 0.8, 0],
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

  function band(progress, enterStart, enterEnd, exitStart, exitEnd) {
    return ease(phase(progress, enterStart, enterEnd))
      * (1 - ease(phase(progress, exitStart, exitEnd)));
  }

  function sampleVector(keys, progress, target) {
    if (progress <= keys[0].at) return target.copy(keys[0].value);

    for (let index = 0; index < keys.length - 1; index += 1) {
      const from = keys[index];
      const to = keys[index + 1];
      if (progress <= to.at) {
        const localProgress = ease((progress - from.at) / (to.at - from.at));
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
    scene.fog = new THREE.FogExp2(0x01030a, 0.003);

    camera = new THREE.PerspectiveCamera(43, width / height, 0.1, 360);
    scene.add(camera);

    const ambient = new THREE.HemisphereLight(0x29486c, 0x010207, 0.28);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff4df, 2.5);
    keyLight.position.set(-7.5, 4.5, 8);
    scene.add(keyLight);

    const rim = new THREE.PointLight(0x5bbdd8, 17, 34, 2);
    rim.position.set(5.5, -2.6, 5);
    scene.add(rim);

    stars = createStarField(isMobile ? 950 : 1850);
    scene.add(stars);

    cosmicObjects = createCosmicObjects();
    scene.add(cosmicObjects);

    const warp = createWarpField(isMobile ? 110 : 220);
    warpLines = warp.lines;
    warpMaterial = warp.material;
    camera.add(warpLines);

    resizeRenderer();
    return true;
  }

  function createStarField(count) {
    randomSeed = 20260717;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const radius = 20 + random() * 118;
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
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        opacity: { value: 0.86 },
        pointScale: { value: isMobile ? 44 : 62 },
      },
      vertexShader: [
        'attribute float aSize;',
        'attribute vec3 color;',
        'uniform float pointScale;',
        'varying vec3 vColor;',
        'void main() {',
        '  vColor = color;',
        '  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);',
        '  gl_PointSize = aSize * pointScale / max(1.0, -viewPosition.z);',
        '  gl_Position = projectionMatrix * viewPosition;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float opacity;',
        'varying vec3 vColor;',
        'void main() {',
        '  float distanceToCenter = length(gl_PointCoord - vec2(0.5));',
        '  float alpha = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);',
        '  gl_FragColor = vec4(vColor, alpha * opacity);',
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
        + Math.sin((index + 1) * (1.37 + variant * 0.23)) * 0.13
        + Math.cos((index + 3) * (0.73 + variant * 0.17)) * 0.08;
      positions.setXYZ(index, x * distortion, y * distortion, z * distortion);
    }

    geometry.computeVertexNormals();
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

  function createOrbit(radius) {
    const points = [];
    const segments = isMobile ? 96 : 160;
    for (let index = 0; index < segments; index += 1) {
      const angle = index / segments * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius * 0.96
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
    sunSurface.visible = false;
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

    sunLight = new THREE.PointLight(0xffbd72, 0, 112, 1.35);
    group.add(sunLight);

    const jupiterTexture = createBandTexture([
      '#5b3827', '#c79a72', '#ead0a7', '#8b5940', '#d9b88c', '#70432f', '#caa077',
    ], true);
    const saturnTexture = createBandTexture([
      '#8e7550', '#d8c38f', '#b7a16e', '#eee0ae', '#9e865b', '#d4bd86',
    ], false);
    const bodyDefinitions = [
      { name: 'mercury', radius: 0.34, orbit: 4.2, color: 0x8d8379, phase: 0.4, speed: 0.000007, incline: 0.12 },
      { name: 'venus', radius: 0.52, orbit: 7.1, color: 0xc89358, phase: 2.1, speed: 0.0000052, incline: 0.18 },
      { name: 'mars', radius: 0.43, orbit: 15.2, color: 0xa9482c, phase: -0.85, speed: 0.0000032, incline: 0.22 },
      { name: 'jupiter', radius: 2.25, orbit: 21.2, color: 0xffffff, map: jupiterTexture, phase: 0.92, speed: 0.00000135, incline: 0.28 },
      { name: 'saturn', radius: 1.9, orbit: 26.6, color: 0xffffff, map: saturnTexture, phase: 2.65, speed: 0.000001, incline: 0.32, ring: true },
      { name: 'uranus', radius: 1.02, orbit: 32.4, color: 0x8fd2d2, phase: -0.42, speed: 0.00000072, incline: 0.38 },
      { name: 'neptune', radius: 1, orbit: 38.2, color: 0x315dbe, phase: 1.72, speed: 0.00000055, incline: 0.42 },
    ];

    [4.2, 7.1, 12, 15.2, 21.2, 26.6, 32.4, 38.2].forEach((radius) => {
      group.add(createOrbit(radius));
    });

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
      body.userData.orbitPhase = definition.phase;
      body.userData.orbitSpeed = definition.speed;
      body.userData.orbitIncline = definition.incline;
      body.userData.rotationSpeed = 0.000014 - index * 0.0000012;
      body.userData.revealIndex = index;

      if (definition.ring) {
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xcbb982,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(2.45, 4.05, isMobile ? 64 : 104),
          ringMaterial
        );
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = -0.18;
        body.rotation.z = 0.28;
        body.add(ring);
        planetRingMaterials.push(ringMaterial);
      }

      celestialBodies.push(body);
      celestialMaterials.push(material);
      group.add(body);
    });

    const beltCount = isMobile ? 110 : 260;
    const beltPositions = new Float32Array(beltCount * 3);
    for (let index = 0; index < beltCount; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 17.2 + random() * 2.1;
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
      asteroids.push(asteroid);
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
    world.rotation.z = -0.13;
    world.position.set(12, 0, 0);
    if (cosmicObjects) {
      cosmicObjects.add(world);
    } else {
      scene.add(world);
    }

    earthSpin = new THREE.Group();
    earthSpin.rotation.x = 0.08;
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
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec3 vViewDirection;',
        'void main() {',
        '  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);',
        '  vNormal = normalize(normalMatrix * normal);',
        '  vViewDirection = normalize(-viewPosition.xyz);',
        '  gl_Position = projectionMatrix * viewPosition;',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform float opacity;',
        'varying vec3 vNormal;',
        'varying vec3 vViewDirection;',
        'void main() {',
        '  float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.7);',
        '  vec3 atmosphere = vec3(0.16, 0.56, 0.96) * fresnel * 1.45;',
        '  gl_FragColor = vec4(atmosphere, fresnel * opacity);',
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
      moon.position.set(5.6, 1.4, -4.3);
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
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (stars && stars.material && stars.material.uniforms) {
      stars.material.uniforms.pointScale.value = isMobile ? 44 : 62;
    }
  }

  function beginSceneDrag(event) {
    isDraggingScene = true;
    sceneDragPointerId = event.pointerId;
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
    const yawDelta = -deltaX * 0.0048;
    const pitchDelta = -deltaY * 0.0042;

    cameraOrbitYaw += yawDelta;
    cameraOrbitPitch = clamp(
      cameraOrbitPitch + pitchDelta,
      -0.78,
      0.78
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
    isDraggingScene = false;
    sceneDragPointerId = null;

    if (cancelled || !moved) {
      cameraOrbitVelocityPitch = 0;
      cameraOrbitVelocityYaw = 0;
    }
    if (moved) suppressDoubleClickUntil = performance.now() + 480;
    if (!cancelled && !moved && event) addRipple(event);

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

    const primaryPointer = event.pointerType !== 'mouse' || event.button === 0;
    if (!primaryPointer || reducedMotion.matches) return;

    event.preventDefault();
    beginSceneDrag(event);
  }

  function handleSceneWheel(event) {
    if (reducedMotion.matches) return;
    if (event.target instanceof Element && event.target.closest('button, a')) return;

    event.preventDefault();
    const deltaMultiplier = event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? height
        : 1;
    const normalizedDelta = event.deltaY * deltaMultiplier;
    targetViewDistanceScale = clamp(
      targetViewDistanceScale * Math.exp(normalizedDelta * 0.00105),
      0.62,
      1.55
    );
    scheduleFrame();
  }

  function addRipple(event) {
    if (!scene || !camera || reducedMotion.matches) return;
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

    const cameraKeys = isMobile ? cameraKeysMobile : cameraKeysDesktop;
    const targetKeys = isMobile ? targetKeysMobile : targetKeysDesktop;
    sampleVector(cameraKeys, progress, cameraPosition);
    sampleVector(targetKeys, progress, cameraTarget);

    cameraPosition.x += pointerX * 0.52 * pointerInfluence;
    cameraPosition.y -= pointerY * 0.34 * pointerInfluence;
    cameraTarget.x += pointerX * 0.22 * pointerInfluence;
    cameraTarget.y -= pointerY * 0.16 * pointerInfluence;

    const zoomEasing = frameDelta > 0
      ? 1 - Math.pow(0.76, frameDelta / 16.667)
      : 1;
    viewDistanceScale += (targetViewDistanceScale - viewDistanceScale) * zoomEasing;
    if (Math.abs(targetViewDistanceScale - viewDistanceScale) < 0.0001) {
      viewDistanceScale = targetViewDistanceScale;
    }

    if (!isDraggingScene && frameDelta > 0) {
      cameraOrbitYaw += cameraOrbitVelocityYaw * frameDelta;
      const nextOrbitPitch = cameraOrbitPitch + cameraOrbitVelocityPitch * frameDelta;
      cameraOrbitPitch = clamp(nextOrbitPitch, -0.78, 0.78);
      if (cameraOrbitPitch !== nextOrbitPitch) cameraOrbitVelocityPitch = 0;

      const inertiaDamping = Math.pow(0.84, frameDelta / 16.667);
      cameraOrbitVelocityPitch *= inertiaDamping;
      cameraOrbitVelocityYaw *= inertiaDamping;
      if (Math.abs(cameraOrbitVelocityPitch) < 0.00001) cameraOrbitVelocityPitch = 0;
      if (Math.abs(cameraOrbitVelocityYaw) < 0.00001) cameraOrbitVelocityYaw = 0;
    }

    cameraOrbitOffset.copy(cameraPosition).sub(cameraTarget);
    cameraOrbitSpherical.setFromVector3(cameraOrbitOffset);
    cameraOrbitSpherical.theta += cameraOrbitYaw;
    cameraOrbitSpherical.phi = clamp(
      cameraOrbitSpherical.phi + cameraOrbitPitch,
      0.22,
      Math.PI - 0.22
    );
    cameraOrbitOffset
      .setFromSpherical(cameraOrbitSpherical)
      .multiplyScalar(viewDistanceScale);
    camera.position.copy(cameraTarget).add(cameraOrbitOffset);
    camera.lookAt(cameraTarget);

    const idleTime = !isPlaying && finishedAt ? (time - finishedAt) * 0.12 : 0;
    const sceneTime = progress * duration + idleTime;
    const reveal = ease(phase(progress, 0.015, 0.11));
    const sunReveal = ease(phase(progress, 0.2, 0.4));
    const systemReveal = ease(phase(progress, 0.28, 0.7));
    const orbitReveal = ease(phase(progress, 0.6, 0.82));
    const warp = band(progress, 0.48, 0.57, 0.7, 0.8);

    if (world) {
      const earthOrbitAngle = sceneTime * 0.0000022;
      world.position.set(
        Math.cos(earthOrbitAngle) * 12,
        Math.sin(earthOrbitAngle * 0.7) * 0.16,
        Math.sin(earthOrbitAngle) * 11.52
      );
    }

    if (earthSpin) {
      earthSpin.rotation.y = -1.58 + sceneTime * 0.000032;
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
      sunLight.intensity = sunReveal * (isMobile ? 310 : 440);
    }

    if (cityMaterial && earthSurface && sunSurface) {
      sunSurface.getWorldPosition(sunWorldPosition);
      earthSurface.getWorldPosition(earthWorldPosition);
      earthToSunDirection
        .copy(sunWorldPosition)
        .sub(earthWorldPosition)
        .normalize();
      cityMaterial.uniforms.sunDirection.value.copy(earthToSunDirection);
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
      const bodyReveal = ease(phase(
        progress,
        0.25 + body.userData.revealIndex * 0.025,
        0.4 + body.userData.revealIndex * 0.03
      ));
      const orbitAngle = body.userData.orbitPhase + sceneTime * body.userData.orbitSpeed;
      body.position.set(
        Math.cos(orbitAngle) * body.userData.orbitRadius,
        Math.sin(orbitAngle * 1.4) * body.userData.orbitIncline,
        Math.sin(orbitAngle) * body.userData.orbitRadius * 0.96
      );
      body.visible = bodyReveal > 0.002;
      body.rotation.y = sceneTime * body.userData.rotationSpeed;
      celestialMaterials[index].opacity = bodyReveal * 0.96;
    });
    planetRingMaterials.forEach((material) => {
      material.opacity = ease(phase(progress, 0.35, 0.56)) * 0.74;
    });
    orbitMaterials.forEach((material, index) => {
      material.opacity = orbitReveal * (index === 2 ? 0.25 : 0.13);
    });
    if (asteroidBelt && asteroidBeltMaterial) {
      asteroidBelt.rotation.y = sceneTime * 0.0000018;
      asteroidBeltMaterial.opacity = systemReveal * 0.62;
    }
    asteroidMaterials.forEach((material) => {
      material.opacity = systemReveal * 0.78;
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
    }

    if (warpLines && warpMaterial) {
      warpLines.rotation.z = sceneTime * 0.000015;
      warpLines.scale.z = 1 + warp * 3.2;
      warpMaterial.opacity = warp * 0.46;
    }

    renderer.toneMappingExposure = 1.08 + sunReveal * 0.06 + warp * 0.18;
    updateRipples(time);
    renderer.render(scene, camera);
  }

  function renderInterface(progress) {
    const one = band(progress, 0.02, 0.07, 0.13, 0.18);
    const two = band(progress, 0.15, 0.21, 0.28, 0.34);
    const three = band(progress, 0.31, 0.37, 0.47, 0.53);
    const four = band(progress, 0.5, 0.56, 0.65, 0.72);
    const finaleAmount = ease(phase(progress, 0.69, 0.86));

    setLayer(prologues.one, one, (1 - one) * 28, 0.992 + one * 0.008);
    setLayer(prologues.two, two, (1 - two) * 28, 0.992 + two * 0.008);
    setLayer(prologues.three, three, (1 - three) * 28, 0.992 + three * 0.008);
    setLayer(prologues.four, four, (1 - four) * 28, 0.992 + four * 0.008);
    setLayer(finale, finaleAmount, (1 - finaleAmount) * 34, 0.985 + finaleAmount * 0.015);

    finale.style.pointerEvents = finaleAmount > 0.96 ? 'auto' : 'none';
    progressFill.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    timeLeft.textContent =
      Math.max(0, Math.ceil((1 - progress) * duration / 1000)) + ' 秒';

    let chapter = '正在唤醒';
    if (progress >= 0.14) chapter = '进入近地轨道';
    if (progress >= 0.3) chapter = '迎向太阳光';
    if (progress >= 0.48) chapter = '穿越行星轨道';
    if (progress >= 0.68) chapter = '展开太阳系';
    if (progress >= 0.86) chapter = '已经抵达';

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
    isPlaying = false;
    isIdle = initialized && !reducedMotion.matches;
    currentProgress = 1;
    finishedAt = now;
    renderInterface(1);
    renderScene(1, now);
    root.classList.remove('is-playing');
    root.classList.add('is-finished');
    interactionHint.classList.remove('is-visible');
    skipButton.hidden = true;
    replayButton.hidden = reducedMotion.matches;
    status.textContent = '天体序章播放完成，可以进入博客';
    scheduleFrame();
  }

  function tick(time) {
    animationFrame = 0;

    if (isPlaying) {
      currentProgress = clamp((time - startedAt) / duration, 0, 1);
      renderInterface(currentProgress);
      if (currentProgress >= 1) finishSequence(time);
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
    skipButton.hidden = false;
    replayButton.hidden = true;
    currentProgress = 0;
    lastChapter = '';
    finishedAt = 0;
    isIdle = false;
    cameraOrbitPitch = 0;
    cameraOrbitYaw = 0;
    cameraOrbitVelocityPitch = 0;
    cameraOrbitVelocityYaw = 0;
    viewDistanceScale = 1;
    targetViewDistanceScale = 1;
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
    finishSequence();
  });

  replayButton.addEventListener('click', () => {
    skipRequested = false;
    playSequence();
  });

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
    resizeRenderer();
    renderScene(currentProgress, performance.now());
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isPlaying) finishSequence();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      endSceneDrag(null, true);
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
      endSceneDrag(null, true);
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      finishSequence();
      return;
    }

    replayButton.hidden = false;
    isIdle = root.classList.contains('is-finished');
    scheduleFrame();
  });

  initialize();
}

