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
  // Simple pulse effect
  const scale = 1 + 0.1 * Math.sin(noise);
  sphere.scale.set(scale, scale, scale);
  noise += 0.05;
  renderer.render(scene, camera);
}

document.getElementById("submit").addEventListener("click", async () => {
  const text = document.getElementById("poem").value;
  const res = await fetch("https://vispo.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  console.log(data);

  // Mood-based color
  if (data.mood === "positive") {
    sphere.material.color.set(0x88ff88);
  } else if (data.mood === "negative") {
    sphere.material.color.set(0xff8888);
  } else {
    sphere.material.color.set(0x7fc8ff);
  }

  // Line count affects pulse speed
  noise = 0.02 * data.line_count;
});

init();
