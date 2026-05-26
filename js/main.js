import * as THREE from 'three';
import { initBackground, initReveal } from './shared.js';

/* Hero scene — an interactive icosahedron with a wireframe halo.
   Only loaded on the homepage. */
function initHero() {
  const container = document.getElementById('hero-3d');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    metalness: 0.6,
    roughness: 0.25,
    flatShading: true,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.35,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const shellGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  scene.add(shell);

  const dotsGeo = new THREE.BufferGeometry();
  const dotCount = 220;
  const dotPositions = new Float32Array(dotCount * 3);
  for (let i = 0; i < dotCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = 2.0 + Math.random() * 0.4;
    const y = (Math.random() - 0.5) * 2.2;
    dotPositions[i * 3] = Math.cos(t) * r;
    dotPositions[i * 3 + 1] = y;
    dotPositions[i * 3 + 2] = Math.sin(t) * r;
  }
  dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
  const dotsMat = new THREE.PointsMaterial({
    color: 0xf472b6,
    size: 0.025,
    transparent: true,
    opacity: 0.85,
  });
  const dots = new THREE.Points(dotsGeo, dotsMat);
  scene.add(dots);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa78bfa, 0.9);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  const extraRot = { x: 0, y: 0 };

  container.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
    target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
  });
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    container.style.cursor = 'grabbing';
  });
  window.addEventListener('pointerup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    extraRot.y += (e.clientX - lastX) * 0.005;
    extraRot.x += (e.clientY - lastY) * 0.005;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  container.style.cursor = 'grab';

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  const clock = new THREE.Clock();
  (function animate() {
    const t = clock.getElapsedTime();
    current.x += (target.x - current.x) * 0.06;
    current.y += (target.y - current.y) * 0.06;
    core.rotation.x = current.y + extraRot.x + t * 0.15;
    core.rotation.y = current.x + extraRot.y + t * 0.2;
    shell.rotation.x = -current.y * 0.5 - t * 0.1;
    shell.rotation.y = -current.x * 0.5 + t * 0.08;
    dots.rotation.y = t * 0.05;
    dots.rotation.x = Math.sin(t * 0.3) * 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
}

document.addEventListener('DOMContentLoaded', () => {
  initBackground();
  initHero();
  initReveal();
});
