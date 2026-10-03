/**
 * ARTIFLEX 3D SPATIAL STUDIO
 * Real-time WebGL Architecture & Fabrication Showcase using Three.js
 */

(function () {
  'use strict';

  const container = document.getElementById('webgl-canvas-wrap');
  if (!container || typeof THREE === 'undefined') return;

  // Scene & Renderer Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFAF7F2);
  scene.fog = new THREE.FogExp2(0xFAF7F2, 0.022);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(9, 6, 12);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
  sunLight.position.set(12, 18, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 45;
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xb4c8ff, 0.6);
  fillLight.position.set(-10, 8, -8);
  scene.add(fillLight);

  // Interior Architectural Accent Lights
  const warmCounterLight = new THREE.PointLight(0xff8c42, 2.0, 12);
  warmCounterLight.position.set(0, 2.8, 1);
  scene.add(warmCounterLight);

  const neonSignLight = new THREE.PointLight(0xff5500, 2.5, 14);
  neonSignLight.position.set(-3.5, 3.8, -4.5);
  scene.add(neonSignLight);

  // Materials Library
  const materials = {
    floor: new THREE.MeshStandardMaterial({
      color: 0xEAE3D8,
      roughness: 0.35,
      metalness: 0.05
    }),
    backWall: new THREE.MeshStandardMaterial({
      color: 0xF2ECE2,
      roughness: 0.75,
      metalness: 0.02
    }),
    featureWood: new THREE.MeshStandardMaterial({
      color: 0x6E472A,
      roughness: 0.45,
      metalness: 0.05
    }),
    marbleTop: new THREE.MeshStandardMaterial({
      color: 0xFDFDFD,
      roughness: 0.15,
      metalness: 0.1
    }),
    islandBase: new THREE.MeshStandardMaterial({
      color: 0x2A2624,
      roughness: 0.4,
      metalness: 0.2
    }),
    blackSteel: new THREE.MeshStandardMaterial({
      color: 0x1A1918,
      roughness: 0.35,
      metalness: 0.85
    }),
    brassGold: new THREE.MeshStandardMaterial({
      color: 0xE5B869,
      roughness: 0.25,
      metalness: 0.9
    }),
    flutedGlass: new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.2,
      ior: 1.5,
      thickness: 0.4
    }),
    signGlow: new THREE.MeshStandardMaterial({
      color: 0xFF5E1E,
      emissive: 0xFF3E00,
      emissiveIntensity: 0.8,
      roughness: 0.2
    })
  };

  // Group for the Architectural Studio
  const studioGroup = new THREE.Group();
  scene.add(studioGroup);

  // 1. Floor with Architectural Grid & Border
  const floorGeo = new THREE.PlaneGeometry(36, 36);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  studioGroup.add(floorMesh);

  // Grid helper overlay for minimalist blueprint aesthetic
  const gridHelper = new THREE.GridHelper(36, 36, 0x181615, 0xDAD2C5);
  gridHelper.position.y = 0.01;
  gridHelper.material.opacity = 0.25;
  gridHelper.material.transparent = true;
  studioGroup.add(gridHelper);

  // 2. Main Architectural Back Wall
  const wallGeo = new THREE.BoxGeometry(22, 10, 0.6);
  const backWall = new THREE.Mesh(wallGeo, materials.backWall);
  backWall.position.set(0, 5, -6);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  studioGroup.add(backWall);

  // Fluted Wooden Acoustic Accent Panel (Left side)
  const flutedPanelGroup = new THREE.Group();
  flutedPanelGroup.position.set(-6.5, 5, -5.6);
  const slatWidth = 0.08;
  const slatDepth = 0.08;
  const slatHeight = 8;
  const slatGeo = new THREE.BoxGeometry(slatWidth, slatHeight, slatDepth);

  for (let i = 0; i < 28; i++) {
    const slat = new THREE.Mesh(slatGeo, materials.featureWood);
    slat.position.x = (i - 14) * 0.16;
    slat.castShadow = true;
    slat.receiveShadow = true;
    flutedPanelGroup.add(slat);
  }
  studioGroup.add(flutedPanelGroup);

  // 3. Floating 3D Dimensional "ARTIFLEX" Architectural Signage
  const signGroup = new THREE.Group();
  signGroup.position.set(-3.5, 6.2, -5.65);

  const letterGeo = new THREE.BoxGeometry(0.35, 1.2, 0.15);
  const letterLetters = [
    { x: 0, w: 0.9, char: 'A' },
    { x: 1.1, w: 0.8, char: 'R' },
    { x: 2.1, w: 0.7, char: 'T' },
    { x: 3.0, w: 0.5, char: 'I' },
    { x: 3.7, w: 0.8, char: 'F' },
    { x: 4.7, w: 0.7, char: 'L' },
    { x: 5.6, w: 0.8, char: 'E' },
    { x: 6.6, w: 0.9, char: 'X' }
  ];

  letterLetters.forEach(l => {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(l.w, 1.1, 0.18),
      materials.signGlow
    );
    block.position.set(l.x, 0, 0);
    block.castShadow = true;
    signGroup.add(block);
  });
  signGroup.position.x = -3.2;
  studioGroup.add(signGroup);

  // Subtitle plaque underneath: "INTERIOR SOLUTIONS"
  const subPlate = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.35, 0.08),
    materials.blackSteel
  );
  subPlate.position.set(0.1, 5.2, -5.6);
  studioGroup.add(subPlate);

  // 4. Minimalist Luxury Modular Kitchen Island
  const islandGroup = new THREE.Group();
  islandGroup.position.set(-1.2, 0, 0.8);

  // Counter Base (Matte Fluted Charcoal)
  const baseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 1.85, 2.6),
    materials.islandBase
  );
  baseMesh.position.y = 0.925;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  islandGroup.add(baseMesh);

  // Cantilevered Calacatta Marble Waterfall Top
  const marbleTop = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.18, 2.9),
    materials.marbleTop
  );
  marbleTop.position.y = 1.94;
  marbleTop.castShadow = true;
  marbleTop.receiveShadow = true;
  islandGroup.add(marbleTop);

  // Brass Minimalist Arc Faucet
  const faucetGroup = new THREE.Group();
  faucetGroup.position.set(1.5, 2.03, 0);
  const faucetPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.7, 16),
    materials.brassGold
  );
  faucetPole.position.y = 0.35;
  faucetGroup.add(faucetPole);
  const faucetArc = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.035, 8, 24, Math.PI),
    materials.brassGold
  );
  faucetArc.rotation.z = Math.PI;
  faucetArc.position.set(-0.18, 0.7, 0);
  faucetGroup.add(faucetArc);
  islandGroup.add(faucetGroup);

  // 2 Sculptural Bar Stools
  [-1.4, 0.6].forEach(stX => {
    const stool = new THREE.Group();
    stool.position.set(stX, 0, 1.8);
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32),
      materials.featureWood
    );
    seat.position.y = 1.45;
    seat.castShadow = true;
    stool.add(seat);

    for (let leg = 0; leg < 3; leg++) {
      const angle = (leg / 3) * Math.PI * 2;
      const stoolLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.45, 12),
        materials.blackSteel
      );
      stoolLeg.position.set(Math.cos(angle) * 0.28, 0.725, Math.sin(angle) * 0.28);
      stoolLeg.castShadow = true;
      stool.add(stoolLeg);
    }
    islandGroup.add(stool);
  });

  studioGroup.add(islandGroup);

  // 5. Fluted Glass & Aluminium Architectural Partition
  const partitionGroup = new THREE.Group();
  partitionGroup.position.set(4.2, 3.5, 0);

  const glassPane = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 7.0, 5.5),
    materials.flutedGlass
  );
  glassPane.castShadow = false;
  glassPane.receiveShadow = true;
  partitionGroup.add(glassPane);

  // Metal Frame borders
  const frameMat = materials.blackSteel;
  const frameOuter = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 7.1, 0.12),
    frameMat
  );
  frameOuter.position.z = -2.75;
  partitionGroup.add(frameOuter);

  const frameOuter2 = frameOuter.clone();
  frameOuter2.position.z = 2.75;
  partitionGroup.add(frameOuter2);

  const frameTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 5.6),
    frameMat
  );
  frameTop.position.y = 3.5;
  partitionGroup.add(frameTop);

  studioGroup.add(partitionGroup);

  // 6. Floating Steel & Wood Staircase (Bespoke Metal Fabrication)
  const stairGroup = new THREE.Group();
  stairGroup.position.set(7.5, 0, -5.2);

  const numSteps = 10;
  for (let s = 0; s < numSteps; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 0.7),
      materials.featureWood
    );
    step.position.set(0, (s + 1) * 0.48, s * 0.52);
    step.castShadow = true;
    step.receiveShadow = true;
    stairGroup.add(step);

    // Cantilever steel bracket beneath
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.48, 0.1),
      materials.blackSteel
    );
    bracket.position.set(1.1, (s + 0.5) * 0.48, s * 0.52);
    bracket.castShadow = true;
    stairGroup.add(bracket);
  }
  studioGroup.add(stairGroup);

  // Ambient Floating Dust / Motes Particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 200;
  const posArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 24;
    posArray[i + 1] = Math.random() * 10;
    posArray[i + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xFFB020,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Camera Positions for Viewpoint Presets
  const viewpoints = {
    overview: { pos: new THREE.Vector3(9, 6, 12), target: new THREE.Vector3(0, 2.5, 0) },
    kitchen: { pos: new THREE.Vector3(0.5, 3.2, 5.5), target: new THREE.Vector3(-1.2, 1.8, 0.8) },
    signage: { pos: new THREE.Vector3(-2.8, 6.0, 0.5), target: new THREE.Vector3(-0.5, 5.5, -5.6) },
    staircase: { pos: new THREE.Vector3(8.5, 3.0, 3.0), target: new THREE.Vector3(7.5, 2.8, -3.0) }
  };

  let targetPos = viewpoints.overview.pos.clone();
  let targetLookAt = viewpoints.overview.target.clone();
  let currentLookAt = viewpoints.overview.target.clone();

  // Mouse Parallax & Interaction
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotVelocityX = 0;
  let rotVelocityY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      rotVelocityX += deltaX * 0.0006;
      rotVelocityY += deltaY * 0.0006;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    }
  });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support for mobile interaction
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevPointerX = e.touches[0].clientX;
      prevPointerY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevPointerX;
      const deltaY = e.touches[0].clientY - prevPointerY;
      rotVelocityX += deltaX * 0.0008;
      rotVelocityY += deltaY * 0.0008;
      prevPointerX = e.touches[0].clientX;
      prevPointerY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Lighting Environment Modes
  window.setArtiflexLighting = function (mode) {
    if (mode === 'day') {
      scene.background.set(0xFAF7F2);
      scene.fog.color.set(0xFAF7F2);
      ambientLight.color.set(0xfff5ea);
      ambientLight.intensity = 0.9;
      sunLight.color.set(0xfffaed);
      sunLight.intensity = 2.2;
      materials.signGlow.emissive.set(0xFF5E1E);
      materials.signGlow.emissiveIntensity = 0.7;
    } else if (mode === 'sunset') {
      scene.background.set(0x281B18);
      scene.fog.color.set(0x281B18);
      ambientLight.color.set(0x603222);
      ambientLight.intensity = 0.8;
      sunLight.color.set(0xff7722);
      sunLight.intensity = 3.0;
      sunLight.position.set(16, 6, 8);
      materials.signGlow.emissive.set(0xFFA000);
      materials.signGlow.emissiveIntensity = 1.2;
    } else if (mode === 'neon') {
      scene.background.set(0x0E0E12);
      scene.fog.color.set(0x0E0E12);
      ambientLight.color.set(0x1B1F38);
      ambientLight.intensity = 0.4;
      sunLight.color.set(0x3B64FF);
      sunLight.intensity = 1.0;
      materials.signGlow.emissive.set(0xFF0055);
      materials.signGlow.emissiveIntensity = 2.5;
    }
  };

  // Viewpoint Switcher
  window.setArtiflexView = function (viewName) {
    if (viewpoints[viewName]) {
      targetPos.copy(viewpoints[viewName].pos);
      targetLookAt.copy(viewpoints[viewName].target);
    }
  };

  // Material Inspect Switcher for Kitchen Top & Island
  window.setArtiflexMaterial = function (matName) {
    if (matName === 'marble') {
      marbleTop.material = materials.marbleTop;
    } else if (matName === 'gold') {
      marbleTop.material = materials.brassGold;
    } else if (matName === 'wood') {
      marbleTop.material = materials.featureWood;
    } else if (matName === 'steel') {
      marbleTop.material = materials.blackSteel;
    }
  };

  // Window Resize
  function onWindowResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle floating dust particles
    const positions = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      positions[i] += 0.004;
      if (positions[i] > 10) positions[i] = 0;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Apply inertia rotation
    studioGroup.rotation.y += rotVelocityX;
    rotVelocityX *= 0.92;
    rotVelocityY *= 0.92;

    // Subtle idle floating motion
    const idleY = Math.sin(elapsedTime * 0.8) * 0.15;
    const idleX = Math.cos(elapsedTime * 0.5) * 0.15;

    // Smooth camera interpolation towards target viewpoint
    const parallaxTargetX = targetPos.x + (mouseX * 1.2) + idleX;
    const parallaxTargetY = targetPos.y + (mouseY * 0.8) + idleY;
    const parallaxTargetZ = targetPos.z;

    camera.position.lerp(new THREE.Vector3(parallaxTargetX, parallaxTargetY, parallaxTargetZ), 0.04);
    currentLookAt.lerp(targetLookAt, 0.04);
    camera.lookAt(currentLookAt);

    renderer.render(scene, camera);
  }

  animate();
})();
