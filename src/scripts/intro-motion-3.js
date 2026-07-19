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
  let earthDragPointerId = null;
  let isDraggingEarth = false;
  let earthDragMoved = false;
  let earthDragStartX = 0;
  let earthDragStartY = 0;
  let earthDragLastX = 0;
  let earthDragLastY = 0;
  let earthDragLastAt = 0;
  let earthManualRotationX = 0;
  let earthManualRotationY = 0;
  let earthRotationVelocityX = 0;
  let earthRotationVelocityY = 0;
  let earthAutoRotationY = -1.58;
  let earthAutoRotationOffsetY = 0;
  let latestEarthSceneTime = 0;
  let viewDistanceScale = 1;
  let targetViewDistanceScale = 1;
  let lastRenderAt = 0;
  let suppressDoubleClickUntil = 0;
  let randomSeed = 20260717;

  const ripples = [];
  const celestialBodies = [];
  const celestialMaterials = [];
  const asteroids = [];
  const asteroidMaterials = [];
  const earthRaycaster = new THREE.Raycaster();
  const earthPointer = new THREE.Vector2();
  const cameraPosition = new THREE.Vector3();
  const cameraTarget = new THREE.Vector3();
  const cameraKeysDesktop = createKeys([
    [0, -1.8, 0.8, 16.8],
    [0.18, -0.8, 0.35, 11.8],
    [0.36, 2.7, 1.1, 7.9],
    [0.54, -3.1, 0.35, 7.4],
    [0.7, 1.1, -0.65, 9.2],
    [0.8, 0, 0, 17.2],
    [1, 0, 0.2, 10.3],
  ]);
  const targetKeysDesktop = createKeys([
    [0, -2.5, -0.35, 0],
    [0.18, -0.9, -0.1, 0],
    [0.36, 0, 0, 0],
    [0.54, 0, 0.08, 0],
    [0.7, 0, 0, 0],
    [0.8, -0.2, 0, 0],
    [1, -2.35, 0.28, 0],
  ]);
  const cameraKeysMobile = createKeys([
    [0, -0.5, 0.8, 18.5],
    [0.18, -0.3, 0.3, 13.8],
    [0.36, 1.5, 1.25, 10.4],
    [0.54, -1.6, 0.25, 10],
    [0.7, 0.5, -0.4, 12.2],
    [0.8, 0, 0, 19],
    [1, 0, 0.8, 12.7],
  ]);
  const targetKeysMobile = createKeys([
    [0, -0.85, 0.5, 0],
    [0.18, -0.35, 0.35, 0],
    [0.36, 0, 0.35, 0],
    [0.54, 0, 0.25, 0],
    [0.7, 0, 0.35, 0],
    [0.8, -0.1, 0.45, 0],
    [1, -0.75, 0.8, 0],
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

    camera = new THREE.PerspectiveCamera(43, width / height, 0.1, 260);
    scene.add(camera);

    const ambient = new THREE.HemisphereLight(0x29486c, 0x010207, 0.28);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff4df, 3.8);
    sun.position.set(-7.5, 4.5, 8);
    scene.add(sun);

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

  function createCosmicObjects() {
    const group = new THREE.Group();
    const bodyDefinitions = [
      { radius: 1.18, position: [-10.8, 4.3, -15.5], color: 0x8d5e4b, emissive: 0x130604 },
      { radius: 0.74, position: [9.4, -3.4, -17.5], color: 0x416e83, emissive: 0x041018 },
      { radius: 0.46, position: [-7.5, -4.5, -8.2], color: 0x857f73, emissive: 0x0d0c0a },
    ];

    bodyDefinitions.forEach((definition, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: definition.color,
        emissive: definition.emissive,
        shininess: index === 1 ? 18 : 5,
        transparent: true,
        opacity: 0,
      });
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(
          definition.radius,
          isMobile ? 24 : 40,
          isMobile ? 16 : 28
        ),
        material
      );
      body.position.set(...definition.position);
      body.rotation.set(index * 0.7, index * 1.1, index * 0.35);
      body.userData.rotationSpeed = 0.000004 + index * 0.0000015;
      celestialBodies.push(body);
      celestialMaterials.push(material);
      group.add(body);
    });

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

    const asteroidCount = isMobile ? 9 : 18;
    for (let index = 0; index < asteroidCount; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const foreground = index < (isMobile ? 2 : 4);
      const asteroid = new THREE.Mesh(
        geometries[index % geometries.length],
        asteroidMaterials[index % asteroidMaterials.length]
      );
      const baseScale = foreground
        ? 0.22 + random() * 0.34
        : 0.12 + random() * 0.3;
      asteroid.scale.set(
        baseScale * (0.72 + random() * 0.56),
        baseScale * (0.66 + random() * 0.62),
        baseScale * (0.72 + random() * 0.58)
      );
      asteroid.position.set(
        side * (foreground ? 5.8 + random() * 5.5 : 4.8 + random() * 9.5),
        (random() * 2 - 1) * (foreground ? 5.2 : 6.8),
        foreground ? 2.5 + random() * 5.2 : -2.5 - random() * 24
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
    scene.add(world);

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
          sunDirection: { value: new THREE.Vector3(-7.5, 4.5, 8).normalize() },
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

  function isEarthAtPointer(event) {
    if (!earthSurface || !camera || currentProgress < 0.035) return false;

    const bounds = canvas.getBoundingClientRect();
    if (
      event.clientX < bounds.left
      || event.clientX > bounds.right
      || event.clientY < bounds.top
      || event.clientY > bounds.bottom
    ) {
      return false;
    }

    earthPointer.set(
      (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2 + 1
    );
    earthRaycaster.setFromCamera(earthPointer, camera);
    return earthRaycaster.intersectObject(earthSurface, false).length > 0;
  }

  function updateEarthHover(event) {
    if (isDraggingEarth || reducedMotion.matches || event.pointerType === 'touch') return;
    root.classList.toggle('is-earth-hovered', isEarthAtPointer(event));
  }

  function beginEarthDrag(event) {
    isDraggingEarth = true;
    earthDragPointerId = event.pointerId;
    earthDragMoved = false;
    earthDragStartX = event.clientX;
    earthDragStartY = event.clientY;
    earthDragLastX = event.clientX;
    earthDragLastY = event.clientY;
    earthDragLastAt = performance.now();
    earthRotationVelocityX = 0;
    earthRotationVelocityY = 0;
    targetPointerInfluence = 0;
    root.classList.remove('is-earth-hovered');
    root.classList.add('is-earth-dragging');

    try {
      root.setPointerCapture(event.pointerId);
    } catch (error) {}
  }

  function moveEarthDrag(event) {
    if (!isDraggingEarth || event.pointerId !== earthDragPointerId) return false;

    const now = performance.now();
    const deltaTime = Math.max(8, now - earthDragLastAt);
    const deltaX = event.clientX - earthDragLastX;
    const deltaY = event.clientY - earthDragLastY;
    const horizontalRotation = deltaX * 0.0064;
    const verticalRotation = deltaY * 0.0054;

    earthManualRotationY += horizontalRotation;
    earthManualRotationX = clamp(
      earthManualRotationX + verticalRotation,
      -0.42,
      0.42
    );
    earthRotationVelocityY = clamp(
      earthRotationVelocityY * 0.35 + horizontalRotation / deltaTime * 0.65,
      -0.012,
      0.012
    );
    earthRotationVelocityX = clamp(
      earthRotationVelocityX * 0.35 + verticalRotation / deltaTime * 0.65,
      -0.01,
      0.01
    );
    earthDragLastX = event.clientX;
    earthDragLastY = event.clientY;
    earthDragLastAt = now;

    if (Math.hypot(event.clientX - earthDragStartX, event.clientY - earthDragStartY) > 4) {
      earthDragMoved = true;
    }

    renderScene(currentProgress, now);
    return true;
  }

  function endEarthDrag(event, cancelled) {
    if (!isDraggingEarth) return;
    if (event && event.pointerId !== earthDragPointerId) return;

    const pointerId = earthDragPointerId;
    const moved = earthDragMoved;
    isDraggingEarth = false;
    earthDragPointerId = null;
    earthAutoRotationOffsetY = earthAutoRotationY
      - (-1.58 + latestEarthSceneTime * 0.000032);

    if (cancelled || !moved) {
      earthRotationVelocityX = 0;
      earthRotationVelocityY = 0;
    }
    if (moved) suppressDoubleClickUntil = performance.now() + 480;

    root.classList.remove('is-earth-dragging');
    try {
      if (pointerId !== null && root.hasPointerCapture(pointerId)) {
        root.releasePointerCapture(pointerId);
      }
    } catch (error) {}

    if (event && event.pointerType !== 'touch') updateEarthHover(event);
    scheduleFrame();
  }

  function handleScenePointerDown(event) {
    if (event.target instanceof Element && event.target.closest('button, a')) return;

    const primaryPointer = event.pointerType !== 'mouse' || event.button === 0;
    if (
      primaryPointer
      && !reducedMotion.matches
      && isEarthAtPointer(event)
    ) {
      event.preventDefault();
      beginEarthDrag(event);
      return;
    }

    addRipple(event);
  }

  function handleEarthWheel(event) {
    if (reducedMotion.matches || !isEarthAtPointer(event)) return;

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
    root.classList.add('is-earth-hovered');
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

    camera.position.copy(cameraTarget).add(
      cameraPosition.sub(cameraTarget).multiplyScalar(viewDistanceScale)
    );
    camera.lookAt(cameraTarget);

    const idleTime = !isPlaying && finishedAt ? (time - finishedAt) * 0.12 : 0;
    const sceneTime = progress * duration + idleTime;
    const reveal = ease(phase(progress, 0.015, 0.11));
    const warp = band(progress, 0.54, 0.62, 0.74, 0.83);
    latestEarthSceneTime = sceneTime;

    if (!isDraggingEarth && frameDelta > 0) {
      earthManualRotationY += earthRotationVelocityY * frameDelta;
      const nextManualRotationX = earthManualRotationX + earthRotationVelocityX * frameDelta;
      earthManualRotationX = clamp(nextManualRotationX, -0.42, 0.42);
      if (earthManualRotationX !== nextManualRotationX) earthRotationVelocityX = 0;

      const inertiaDamping = Math.pow(0.84, frameDelta / 16.667);
      earthRotationVelocityX *= inertiaDamping;
      earthRotationVelocityY *= inertiaDamping;
      if (Math.abs(earthRotationVelocityX) < 0.00001) earthRotationVelocityX = 0;
      if (Math.abs(earthRotationVelocityY) < 0.00001) earthRotationVelocityY = 0;
    }

    if (earthSpin) {
      if (!isDraggingEarth) {
        earthAutoRotationY = -1.58 + sceneTime * 0.000032 + earthAutoRotationOffsetY;
      }
      earthSpin.rotation.y = earthAutoRotationY + earthManualRotationY;
      earthSpin.rotation.x = 0.08
        + (isDraggingEarth ? 0 : Math.sin(sceneTime * 0.00022) * 0.018)
        + earthManualRotationX;
      const cloudLayer = earthSpin.getObjectByName('cloud-layer');
      if (cloudLayer) cloudLayer.rotation.y = sceneTime * 0.000007;
    }

    if (earthMaterial) earthMaterial.opacity = reveal;
    if (cloudMaterial) cloudMaterial.opacity = reveal * 0.58;
    if (cityMaterial) cityMaterial.uniforms.opacity.value = reveal * 1.1;
    if (atmosphereMaterial) atmosphereMaterial.uniforms.opacity.value = reveal * 0.72;

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

    const cosmicReveal = ease(phase(progress, 0.055, 0.2));
    celestialMaterials.forEach((material, index) => {
      material.opacity = cosmicReveal * (index === 2 ? 0.42 : 0.56);
    });
    celestialBodies.forEach((body) => {
      body.rotation.y = sceneTime * body.userData.rotationSpeed;
    });
    asteroidMaterials.forEach((material) => {
      material.opacity = cosmicReveal * 0.78;
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

    renderer.toneMappingExposure = 1.08 + warp * 0.18;
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
    if (progress >= 0.3) chapter = '掠过昼夜线';
    if (progress >= 0.48) chapter = '加速航行';
    if (progress >= 0.68) chapter = '已经抵达';

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
    endEarthDrag(null, true);
    root.classList.add('is-playing');
    root.classList.remove('is-finished');
    skipButton.hidden = false;
    replayButton.hidden = true;
    currentProgress = 0;
    lastChapter = '';
    finishedAt = 0;
    isIdle = false;
    earthManualRotationX = 0;
    earthManualRotationY = 0;
    earthRotationVelocityX = 0;
    earthRotationVelocityY = 0;
    earthAutoRotationY = -1.58;
    earthAutoRotationOffsetY = 0;
    latestEarthSceneTime = 0;
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
    if (moveEarthDrag(event)) {
      event.preventDefault();
      return;
    }
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    targetPointerX = event.clientX / Math.max(1, width) - 0.5;
    targetPointerY = event.clientY / Math.max(1, height) - 0.5;
    targetPointerInfluence = 1;
    updateEarthHover(event);
  }, { passive: false });

  root.addEventListener('pointerleave', () => {
    targetPointerX = 0;
    targetPointerY = 0;
    targetPointerInfluence = 0;
    if (!isDraggingEarth) root.classList.remove('is-earth-hovered');
  }, { passive: true });

  root.addEventListener('pointerdown', handleScenePointerDown);
  root.addEventListener('wheel', handleEarthWheel, { passive: false });

  window.addEventListener('pointerup', (event) => {
    if (isDraggingEarth) event.preventDefault();
    endEarthDrag(event, false);
  }, { passive: false });

  window.addEventListener('pointercancel', (event) => {
    endEarthDrag(event, true);
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
      endEarthDrag(null, true);
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
      endEarthDrag(null, true);
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

