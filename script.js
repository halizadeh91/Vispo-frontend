let scene, camera, renderer, sphere, noise = 0;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-container").appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({ color: 0x7fc8ff, flatShading: true });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,5,5).normalize();
  scene.add(light);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;

  const positions = sphere.geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const ix = positions.getX(i);
    const iy = positions.getY(i);
    const iz = positions.getZ(i);

    const normal = new THREE.Vector3(ix, iy, iz).normalize();
    const noise = simplex.noise3D(ix + time, iy + time, iz + time);
    const scale = 1 + 0.2 * noise;

    positions.setXYZ(i, normal.x * scale, normal.y * scale, normal.z * scale);
  }
  positions.needsUpdate = true;

  renderer.render(scene, camera);
}