import type { ThemeColors } from '../../../types';

interface TreePotProps {
  size: number;
  colors: ThemeColors;
  morphProgress: number; // 0 = 3D Bonsai Pot, 1 = Flat QR Plate
}

/**
 * Ceramic Bonsai Planter Pot / Floating Island Base
 */
export function TreePot({ size, colors }: TreePotProps) {
  const plateSize = size + 4;
  const radius = plateSize / 2;

  return (
    <group position={[0, -0.1, 0]}>
      {/* 1. Main Ground Base (Sand / Soil Bed) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[plateSize, 0.2, plateSize]} />
        <meshStandardMaterial
          color={colors.groundColor}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Ceramic Pot Walls */}
      {/* North */}
      <mesh position={[0, -0.4, radius + 0.25]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.2, 0.9, 0.5]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.7} />
      </mesh>
      {/* South */}
      <mesh position={[0, -0.4, -radius - 0.25]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.2, 0.9, 0.5]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.7} />
      </mesh>
      {/* East */}
      <mesh position={[radius + 0.25, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.9, plateSize]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.7} />
      </mesh>
      {/* West */}
      <mesh position={[-radius - 0.25, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.9, plateSize]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.7} />
      </mesh>

      {/* 3. Gold/Glaze Decorative Pot Rim */}
      {/* North Rim */}
      <mesh position={[0, 0.08, radius + 0.25]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.4, 0.16, 0.6]} />
        <meshStandardMaterial color={colors.potRimColor} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* South Rim */}
      <mesh position={[0, 0.08, -radius - 0.25]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.4, 0.16, 0.6]} />
        <meshStandardMaterial color={colors.potRimColor} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* East Rim */}
      <mesh position={[radius + 0.25, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.16, plateSize + 0.2]} />
        <meshStandardMaterial color={colors.potRimColor} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* West Rim */}
      <mesh position={[-radius - 0.25, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.16, plateSize + 0.2]} />
        <meshStandardMaterial color={colors.potRimColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* 4. Four Elegant Pot Feet (腳座) */}
      <mesh position={[radius - 0.6, -0.95, radius - 0.6]} castShadow>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.8} />
      </mesh>
      <mesh position={[-radius + 0.6, -0.95, radius - 0.6]} castShadow>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.8} />
      </mesh>
      <mesh position={[radius - 0.6, -0.95, -radius + 0.6]} castShadow>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.8} />
      </mesh>
      <mesh position={[-radius + 0.6, -0.95, -radius + 0.6]} castShadow>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color={colors.potColor} roughness={0.8} />
      </mesh>
    </group>
  );
}
