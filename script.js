const simplex = new SimplexNoise();
let scene, camera, renderer, sphere, noise = 0;


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("three-container").appendChild(renderer.domElement);

let geometry = new THREE.SphereGeometry(1, 64, 64).toNonIndexed(); // deformable
const positionAttr = geometry.attributes.position;

const material = new THREE.MeshStandardMaterial({ color: 0x7fc8ff, flatShading: true });
sphere = new THREE.Mesh(geometry, material);
sphere.userData.originalPositions = new Float32Array(positionAttr.array); // snapshot
scene.add(sphere);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,5,5).normalize();
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040, 1)); // soft fill light

  animate();
}



function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;

  const pos = sphere.geometry.attributes.position;
  const orig = sphere.userData.originalPositions;

  for (let i = 0; i < pos.count; i++) {
    const ox = orig[i * 3 + 0];
    const oy = orig[i * 3 + 1];
    const oz = orig[i * 3 + 2];

    const normal = new THREE.Vector3(ox, oy, oz).normalize();
    const noiseVal = simplex.noise3D(normal.x + time, normal.y + time, normal.z + time);
    const scale = 1 + 0.2 * noiseVal;

    pos.setXYZ(i, normal.x * scale, normal.y * scale, normal.z * scale);
  }

  pos.needsUpdate = true;
  sphere.geometry.computeVertexNormals();

  renderer.render(scene, camera);
}


let moodScale = 0.2;

document.getElementById("submit").addEventListener("click", async () => {
  const text = document.getElementById("poem").value;
  const res = await fetch("https://vispo.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  console.log(data);

  // Set color and scale based on mood
  switch (data.mood) {
    case "joy":
    case "love":
      sphere.material.color.set(0x88ff88);
      moodScale = 0.3;
      document.body.style.background = "linear-gradient(45deg, #fbd786, #f7797d)";
      break;
    case "anger":
    case "fear":
      sphere.material.color.set(0xff4444);
      moodScale = 0.4;
      document.body.style.background = "linear-gradient(45deg, #232526, #414345)";
      break;
    case "sadness":
      sphere.material.color.set(0x7777ff);
      moodScale = 0.1;
      document.body.style.background = "linear-gradient(45deg, #2b5876, #4e4376)";
      break;
    default:
      sphere.material.color.set(0x7fc8ff);
      moodScale = 0.2;
      document.body.style.background = "#111";
  }

  noise = 0.02 * data.line_count;
});

init();

