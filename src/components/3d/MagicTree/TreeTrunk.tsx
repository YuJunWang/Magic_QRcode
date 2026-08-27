import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors, CameraMode } from '../../../types';

interface TreeTrunkProps {
  colors: ThemeColors;
  cameraMode: CameraMode;
}

/**
 * Stylized organic low-poly Bonsai Tree Trunk with branches
 */
export function TreeTrunk({ colors, cameraMode }: TreeTrunkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const morphProgressRef = useRef(cameraMode === 'scan' ? 1 : 0);

  useFrame(() => {
    const target = cameraMode === 'scan' ? 1 : 0;
    morphProgressRef.current = THREE.MathUtils.lerp(morphProgressRef.current, target, 0.08);
    const p = morphProgressRef.current;

    if (groupRef.current) {
      const visibleScale = Math.max(0.001, 1 - p * 1.05);
      groupRef.current.scale.set(visibleScale, visibleScale, visibleScale);
      groupRef.current.position.y = -p * 2.5;
    }
  });

  const trunkColor = colors.trunkColor;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Main Base Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.6, 2.4, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 2. Middle Trunk */}
      <mesh position={[0.2, 2.8, -0.1]} rotation={[0.15, 0.2, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.9, 1.8, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 3. Upper Main Trunk */}
      <mesh position={[0.4, 4.0, -0.2]} rotation={[0.1, -0.2, 0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.65, 1.5, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 4. Branch Left-North */}
      <mesh position={[-1.2, 3.8, -1.0]} rotation={[-0.6, -0.5, -0.7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.5, 2.4, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 5. Branch Right-East */}
      <mesh position={[1.4, 3.9, 0.8]} rotation={[0.5, 0.6, 0.7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.45, 2.6, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 6. Branch South-West */}
      <mesh position={[-1.0, 3.4, 1.2]} rotation={[0.6, -0.7, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 2.2, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 7. Branch North-East Upper */}
      <mesh position={[0.8, 4.7, -1.1]} rotation={[-0.4, 0.8, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.35, 2.0, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Root flares extending to ground */}
      <mesh position={[0.8, 0.3, 0.6]} rotation={[0.4, 0.5, 0.6]}>
        <cylinderGeometry args={[0.2, 0.6, 1.2, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.3, -0.5]} rotation={[-0.3, -0.4, -0.5]}>
        <cylinderGeometry args={[0.2, 0.5, 1.1, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
    </group>
  );
}
