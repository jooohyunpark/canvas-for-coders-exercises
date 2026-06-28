import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";

const app = document.querySelector("#app");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
pmrem.dispose();

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

scene.add(new THREE.AxesHelper(5));

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
    position: { x: -3, y: 5, z: 5 },
    controlTarget: { x: 0, y: 1.5, z: 0 },
  },
  "golden-record": {
    position: { x: -3, y: 2, z: 6 },
    controlTarget: { x: 0, y: 1, z: 0 },
  },
};

document.querySelectorAll("#ui button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { position, controlTarget } = points[btn.dataset.point];

    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 1,
      ease: "power3.out",
      onUpdate: () => controls.update(),
    });

    gsap.to(controls.target, {
      x: controlTarget.x,
      y: controlTarget.y,
      z: controlTarget.z,
      duration: 1,
      ease: "power3.out",
      onUpdate: () => controls.update(),
    });
  });
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
