import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// scene
const scene = new THREE.Scene();

// sphere
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
  flatShading: false, // Prevents weird shading effects
  metalness: 0.1, // Slight metallic effect
  roughness: 0.8, // Softer light reflection
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// lights
const light = new THREE.PointLight(0xffffff, 2000, 200);
light.position.set(0, 0, 50);
scene.add(light);

const backLight = new THREE.PointLight(0xffffff, 2000, 200);
backLight.position.set(0, 0, -50); // Light from behind
scene.add(backLight);

const bevelLight = new THREE.DirectionalLight(0xffffff, 1);
bevelLight.position.set(50, 50, 50);
scene.add(bevelLight);

// camera
const camera = new THREE.PerspectiveCamera(
  105,
  sizes.width / sizes.height,
  0.1,
  200
);
camera.position.set(0, 0, 100);
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement); // Ensure canvas is added

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDampening = true;
controls.dampeningFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = false;

// Load the 3D model
const loader = new GLTFLoader();
loader.load(
  "models/heart.glb",
  (gltf) => {
    scene.add(gltf.scene);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    // animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
