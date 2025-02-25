import "./style.css";
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { OrbitControls } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";

// Scene
const scene = new THREE.Scene();

// Heart shape
const heartShape = new THREE.Shape();
heartShape.moveTo(25, -25);
heartShape.bezierCurveTo(25, -25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, -35, -30, -35);
heartShape.bezierCurveTo(-30, -55, -10, -77, 25, -95);
heartShape.bezierCurveTo(60, -77, 80, -55, 80, -35);
heartShape.bezierCurveTo(80, -35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, -25, 25, -25);

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 10,
  steps: 12,
  bevelSize: 4,
  bevelThickness: 4,
};

const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
geometry.computeVertexNormals();
geometry.computeBoundingBox();
const center = new THREE.Vector3();
geometry.boundingBox.getCenter(center);
geometry.translate(-center.x, -center.y, -center.z);

const material = new THREE.MeshPhysicalMaterial({
  color: 0xffb6c1,
  flatShading: false,
  metalness: 0.1,
  roughness: 0.8,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Load external GLTF model
const loader = new GLTFLoader();
loader.load(
  "path/to/your/model.glb", // Replace with your actual model path
  (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    scene.add(gltf.scene);
  },
  (xhr) => console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`),
  (error) => console.error("Error loading GLTF model:", error)
);

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Lights
const light = new THREE.PointLight(0xffffff, 2000, 200);
light.position.set(0, 0, 50);
scene.add(light);

const backLight = new THREE.PointLight(0xffffff, 2000, 200);
backLight.position.set(0, 0, -50);
scene.add(backLight);

const bevelLight = new THREE.DirectionalLight(0xffffff, 1);
bevelLight.position.set(50, 50, 50);
scene.add(bevelLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  105,
  sizes.width / sizes.height,
  0.1,
  200
);
camera.position.set(0, 0, 100);
scene.add(camera);

// Renderer
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = false;

// Animation loop
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};
loop();

// Mouse interaction color change
let mouseDown = false;
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    const rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    const newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
