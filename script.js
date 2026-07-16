const reveals = document.querySelectorAll('.reveal');
const heroVisual = document.querySelector('.hero-visual');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => observer.observe(element));

const updateParallax = () => {
  const offset = window.scrollY * 0.14;
  if (heroVisual) {
    heroVisual.style.setProperty('--parallax', `${offset}px`);
  }
};

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();

const canvas = document.getElementById('hero-canvas');

if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  camera.position.set(0, 0, 4.4);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.25, 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4fdcff,
    emissive: 0x103f54,
    metalness: 0.55,
    roughness: 0.24,
    wireframe: false,
  });

  const core = new THREE.Mesh(geometry, material);
  core.rotation.set(0.6, 0.6, 0);
  group.add(core);

  const pointsGeometry = new THREE.BufferGeometry();
  const pointCount = 140;
  const positions = [];
  const colors = [];

  for (let i = 0; i < pointCount; i += 1) {
    const radius = 1.7 + Math.random() * 1.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.12, 0.8, 0.6);
    colors.push(color.r, color.g, color.b);
  }

  pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.018,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(points);

  const ambientLight = new THREE.AmbientLight(0x6ee7f9, 1.1);
  const pointLight = new THREE.PointLight(0xffffff, 2.2, 10);
  pointLight.position.set(3, 2, 3);
  scene.add(ambientLight, pointLight);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', resize);
  resize();

  const animate = () => {
    requestAnimationFrame(animate);
    core.rotation.y += 0.004;
    core.rotation.x = 0.35 + Math.sin(Date.now() * 0.0004) * 0.15;
    points.rotation.y += 0.0015;
    renderer.render(scene, camera);
  };

  animate();
}
