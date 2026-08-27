import type { ThemeColors } from '../../../types';

interface TreeTrunkProps {
  colors: ThemeColors;
}

/**
 * Stylized organic low-poly Bonsai Tree Trunk with centered branches
 */
export function TreeTrunk({ colors }: TreeTrunkProps) {
  const trunkColor = colors.trunkColor;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Base Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 1.2, 2.4, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 2. Middle Trunk */}
      <mesh position={[0.1, 2.7, -0.05]} rotation={[0.1, 0.15, -0.08]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.7, 1.8, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 3. Upper Main Trunk */}
      <mesh position={[0.2, 3.8, -0.1]} rotation={[0.08, -0.15, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.5, 1.5, 7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 4. Branch Left */}
      <mesh position={[-0.6, 3.5, -0.5]} rotation={[-0.4, -0.3, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 1.6, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 5. Branch Right */}
      <mesh position={[0.7, 3.6, 0.4]} rotation={[0.3, 0.4, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.32, 1.7, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* 6. Root Base */}
      <mesh position={[0.4, 0.2, 0.3]} rotation={[0.2, 0.3, 0.4]}>
        <cylinderGeometry args={[0.15, 0.45, 0.8, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 0.2, -0.3]} rotation={[-0.2, -0.3, -0.4]}>
        <cylinderGeometry args={[0.15, 0.4, 0.8, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
    </group>
  );
}
