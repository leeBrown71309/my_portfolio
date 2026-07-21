import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const ACCENT = "#ff4d00";
const RADIUS = 1.45;

// Dakar, Senegal
const LAT = 14.7167;
const LON = -17.4677;

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * A pointillist wireframe globe with a vermillion marker on Dakar.
 */
function Globe({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Mesh>(null);

  const pointsGeometry = useMemo(() => {
    const count = 1100;
    const positions = new Float32Array(count * 3);
    // Fibonacci sphere distribution
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * r * RADIUS;
      positions[i * 3 + 1] = y * RADIUS;
      positions[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const markerPosition = useMemo(() => latLonToVec3(LAT, LON, RADIUS), []);

  // Start with Dakar facing the camera
  const initialRotationY = useMemo(() => {
    const theta = ((LON + 180) * Math.PI) / 180;
    return Math.PI / 2 - theta;
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
    }
    if (marker.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.25;
      marker.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} rotation={[0.28, initialRotationY, 0]}>
      <points geometry={pointsGeometry}>
        <pointsMaterial color={color} size={0.02} sizeAttenuation />
      </points>
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.995, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.07} />
      </mesh>
      <mesh ref={marker} position={markerPosition}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={ACCENT} />
      </mesh>
    </group>
  );
}

export default function GlobeScene({ color = "#141412" }: { color?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Globe color={color} />
    </Canvas>
  );
}
