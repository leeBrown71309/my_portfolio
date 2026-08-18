import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { createL8Geometries } from "./l8Geometry";

const ACCENT = "#ff4d00";

// Shared material for every part of the monogram — kept identical to the
// previous asterisk so only the shape changes, not the "texture".
function MonogramMaterial({ color }: { color: string }) {
  return (
    <meshStandardMaterial color={color} roughness={0.38} metalness={0.05} flatShading />
  );
}

function L8Monogram({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const geometries = useMemo(() => createL8Geometries(), []);
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
      <group ref={group} scale={0.78}>
        {geometries.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <MonogramMaterial color={color} />
          </mesh>
        ))}
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
      // Stops the scroll-driven transform on our container from reallocating
      // the drawing buffer mid-scroll.
      //
      // R3F measures its container with react-use-measure, which reads
      // getBoundingClientRect() — a *transform-inclusive* box. Our container is
      // scaled as the page scrolls, so the reported width/height changed on
      // every scroll, and R3F resizes the renderer whenever those differ
      // (see its `size.width !== oldSize.width` guard). The result was a
      // framebuffer reallocation roughly every 50ms, which read as stuttering
      // exactly while the mark grew or shrank.
      //
      // `offsetSize: true` takes width/height from offsetWidth/offsetHeight
      // instead: layout values, immune to the transform. R3F still re-measures
      // on scroll, but the dimensions no longer change, so its guard holds and
      // setSize is never called again.
      //
      // Deliberately the only override: it changes *what* is measured, never
      // *when*. Disabling the scroll trigger as well would leave the initial
      // measurement resting solely on the ResizeObserver, and that is not worth
      // the risk for a per-scroll cost that is already just a no-op guard.
      resize={{ offsetSize: true }}
      // R3F sets `pointerEvents: 'auto'` on its wrapper div by default, which
      // re-enables hit-testing inside our pointer-events-none container and
      // blocks hover/click/selection on elements beneath the canvas.
      // The style prop is spread after the defaults, so this wins.
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -4, -3]} intensity={1.1} color={ACCENT} />
      <L8Monogram color={color} />
    </Canvas>
  );
}
