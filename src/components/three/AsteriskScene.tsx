import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

const ACCENT = "#ff4d00";

/**
 * Extruded six-spoke asterisk — the brand dingbat, sculpted in ink.
 */
function useAsteriskGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const spikes = 6;
    const outer = 1.28;
    const inner = 0.68;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.12,
      bevelSegments: 3,
    });
    geo.center();
    return geo;
  }, []);
}

function Asterisk({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useAsteriskGeometry();
  const pointer = useRef({ x: 0, y: 0 });

  // Track the pointer at window level so parallax works even though
  // the canvas is pointer-events: none (it floats under the headline).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Slow perpetual spin + soft pointer parallax
    group.current.rotation.z += delta * 0.18;
    const targetX = pointer.current.y * 0.35;
    const targetY = pointer.current.x * 0.55;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.045,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.045,
    );
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={1.4}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.05} flatShading />
        </mesh>
      </group>
    </Float>
  );
}

export default function AsteriskScene({ color = "#141412" }: { color?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      // R3F sets `pointerEvents: 'auto'` on its wrapper div by default, which
      // re-enables hit-testing inside our pointer-events-none container and
      // blocks hover/click/selection on elements beneath the canvas.
      // The style prop is spread after the defaults, so this wins.
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -4, -3]} intensity={1.1} color={ACCENT} />
      <Asterisk color={color} />
    </Canvas>
  );
}
