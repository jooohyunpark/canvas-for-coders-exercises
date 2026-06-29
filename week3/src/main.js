import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

const app = document.querySelector("#app");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const light = new THREE.DirectionalLight("white", 10);
light.position.set(1, 1, -1);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(15, 10, 15);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

// --- Voyager ---

const loader = new GLTFLoader();
loader.load("/Voyager.glb", (gltf) => {
  gltf.scene.rotation.y = Math.PI / 2;
  scene.add(gltf.scene);
});

const points = {
  overview: {
    position: { x: 15, y: 10, z: 15 },
    controlTarget: { x: 0, y: 0, z: 0 },
  },
  antenna: {
    position: { x: -3, y: 5, z: 6 },
    controlTarget: { x: 0, y: 1.5, z: 0 },
  },
  "golden-record": {
    position: { x: 0, y: 0, z: -3 },
    controlTarget: { x: 0, y: 0, z: 0 },
  },
};

document.querySelectorAll("[data-point]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { position, controlTarget } = points[btn.dataset.point];

    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(controls.target, {
      x: controlTarget.x,
      y: controlTarget.y,
      z: controlTarget.z,
      duration: 1,
      ease: "power2.out",
    });
  });
});

// --- Orbiting moon ---

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

const moonTexture = new THREE.TextureLoader().load("/moon-texture.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture }),
);
moon.position.z = -30;
orbitGroup.add(moon);

// --- Loop ---

renderer.setAnimationLoop(() => {
  orbitGroup.rotation.y += 0.0005;
  controls.update();
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
