import { useState } from "react"
import { GradientTexture } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/three"
import * as THREE from "three"

const WIDTH = 1
const HEIGHT = WIDTH * 1.618
const SPILL_LENGTH = HEIGHT * 2.5

export function Door({ color, position, rotation, onSelect }) {
  const [hovered, setHovered] = useState(false)

  const { doorScale, spill, opacity } = useSpring({
    doorScale: hovered ? 1.08 : 1,
    spill: hovered ? 1.35 : 1,
    opacity: hovered ? 0.85 : 0.5,
    config: { tension: 220, friction: 26 },
  })

  const hover = (isHovered) => (event) => {
    event.stopPropagation()
    setHovered(isHovered)
    document.body.style.cursor = isHovered ? "pointer" : "auto"
  }

  const handleClick = (event) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
      onClick={handleClick}
    >
      {/* x only — the plane is centred at HEIGHT / 2, so scaling y would
          push its base below the floor and off the spill */}
      <animated.mesh position={[0, HEIGHT / 2, 0]} scale-x={doorScale}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </animated.mesh>

      {/* the spill grows out from the door, so it scales along its
          length and shifts by half of whatever it grew */}
      <animated.mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position-z={spill.to((s) => (SPILL_LENGTH * s) / 2)}
        scale-x={doorScale}
        scale-y={spill}
      >
        <planeGeometry args={[WIDTH, SPILL_LENGTH]} />
        <animated.meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
        >
          {/* alphaMap: GradientTexture runs colors through
              THREE.Color, which strips alpha */}
          <GradientTexture
            attach="alphaMap"
            stops={[0, 1]}
            colors={["white", "black"]}
          />
        </animated.meshBasicMaterial>
      </animated.mesh>
    </group>
  )
}
