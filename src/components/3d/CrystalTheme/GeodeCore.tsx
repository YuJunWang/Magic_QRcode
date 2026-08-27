import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors } from '../../../types';

interface GeodeCoreProps {
  colors: ThemeColors;
  position?: [number, number, number];
}

/**
 * Floating, slowly rotating multi-faceted core crystal geode at the center of the scene.
 */
export function GeodeCore({ colors, position = [0, 1.8, 0] }: GeodeCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerCoreRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating levitation
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.25;
    }

    if (outerCoreRef.current) {
      outerCoreRef.current.rotation.y = t * 0.35;
      outerCoreRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.6;
      innerCoreRef.current.rotation.z = t * 0.4;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 2.0 + Math.sin(t * 3.0) * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Outer Translucent Faceted Crystal Shell */}
      <mesh ref={outerCoreRef} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          color={colors.darkModulePrimary}
          emissive={colors.darkModuleSecondary}
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* 2. Inner Glowing Core Shard */}
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={colors.finderPatternColor}
          emissiveIntensity={3.0}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Radiant Point Light */}
      <pointLight
        ref={lightRef}
        color={colors.darkModulePrimary}
        intensity={2.2}
        distance={10}
        decay={2}
      />
    </group>
  );
}
