import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors } from '../../../types';

interface StoneLanternProps {
  colors: ThemeColors;
  position?: [number, number, number];
  scale?: number;
}

/**
 * Procedural low-poly Japanese Stone Lantern (Tōrō / 石燈籠)
 */
export function StoneLantern({ colors, position = [0, 0, 0], scale = 1.0 }: StoneLanternProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  // Subtle breathing flicker for the lantern's inner flame
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 1.2 + Math.sin(t * 4.5) * 0.2 + Math.cos(t * 9.2) * 0.1;
    }
  });

  const stoneColor = colors.finderPatternColor;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* 1. Base Pedestal (Kiso / 基礎) */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.3, 0.4, 6]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* 2. Central Pillar (Sao / 竿) */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.55, 1.0, 6]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 3. Middle Platform (Chūdai / 中台) */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.7, 0.3, 6]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* 4. Fire Box / Light Chamber (Hibukuro / 火袋) */}
      <group position={[0, 1.95, 0]}>
        {/* Stone posts */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.6, 6, 1, true]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} wireframe={false} />
        </mesh>
        {/* Inner Glowing Warm Core */}
        <mesh>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial
            color="#ff9933"
            emissive="#ff7700"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
        {/* Soft Warm Point Light */}
        <pointLight
          ref={lightRef}
          color="#ffaa33"
          intensity={1.5}
          distance={8}
          decay={2}
          castShadow={false}
        />
      </group>

      {/* 5. Umbrella Roof (Kasa / 笠) */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 0.6, 6]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 6. Top Jewel / Finial (Hōju / 宝珠) */}
      <mesh position={[0, 2.85, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color={colors.finderAccentColor} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}
