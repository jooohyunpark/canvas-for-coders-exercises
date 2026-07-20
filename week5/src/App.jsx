import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import * as THREE from "three";
import "./styles.css";
import { Door } from "./components/Door";

const COLORS = [
  "#ff4d4d",
  "#ff9f1c",
  "#ffe14d",
  "#9bde4d",
  "#3ddc84",
  "#2ec4b6",
  "#4dabff",
  "#6b6bff",
  "#b45cff",
  "#ff5cc8",
];

const RADIUS = 5;

// args are constructor arguments, so animating them would rebuild the
// color rather than ease it — spring the r/g/b channels in place instead
function Background({ color }) {
  const { r, g, b } = new THREE.Color(color);
  const spring = useSpring({
    r,
    g,
    b,
    config: { duration: 500, easing: easings.easeOutCubic },
  });

  return (
    <animated.color
      attach="background"
      r={spring.r}
      g={spring.g}
      b={spring.b}
    />
  );
}

function Scene() {
  const [background, setBackground] = useState("black");

  return (
    <>
      <Background color={background} />

      {COLORS.map((color, index) => {
        const angle = (index / COLORS.length) * Math.PI * 2;

        return (
          <Door
            key={color}
            color={color}
            position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
            rotation={[0, angle, 0]}
            onSelect={() => setBackground(color)}
          />
        );
      })}
    </>
  );
}

export default function App() {
  return (
    <div id="app">
      <Canvas flat>
        <OrthographicCamera
          makeDefault
          position={[-10, 5, 10]}
          zoom={24}
          near={-100}
          far={100}
        />
        <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
