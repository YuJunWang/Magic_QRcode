import { useMemo } from 'react';
import type { ThemeColors } from '../../../types';

interface SandPlateProps {
  size: number;
  colors: ThemeColors;
}

/**
 * Sand tray (枯山水白砂盆) with outer wood/stone frame and subtle ripple grooves.
 */
export function SandPlate({ size, colors }: SandPlateProps) {
  const plateSize = size + 4;
  const halfPlate = plateSize / 2;

  // Generate decorative sand ripple rings around the center and corners
  const rippleRings = useMemo(() => {
    const rings = [];
    const step = 1.2;
    for (let r = 2.5; r < halfPlate - 1; r += step) {
      rings.push(r);
    }
    return rings;
  }, [halfPlate]);

  return (
    <group position={[0, -0.05, 0]}>
      {/* 1. Main Sand Bed */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[plateSize, 0.3, plateSize]} />
        <meshStandardMaterial
          color={colors.groundColor}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Outer Wood/Stone Border Frame */}
      {/* North Border */}
      <mesh position={[0, 0.15, halfPlate + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.2, 0.45, 0.6]} />
        <meshStandardMaterial color={colors.finderPatternColor} roughness={0.7} />
      </mesh>
      {/* South Border */}
      <mesh position={[0, 0.15, -halfPlate - 0.3]} castShadow receiveShadow>
        <boxGeometry args={[plateSize + 1.2, 0.45, 0.6]} />
        <meshStandardMaterial color={colors.finderPatternColor} roughness={0.7} />
      </mesh>
      {/* East Border */}
      <mesh position={[halfPlate + 0.3, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.45, plateSize]} />
        <meshStandardMaterial color={colors.finderPatternColor} roughness={0.7} />
      </mesh>
      {/* West Border */}
      <mesh position={[-halfPlate - 0.3, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.45, plateSize]} />
        <meshStandardMaterial color={colors.finderPatternColor} roughness={0.7} />
      </mesh>

      {/* 3. Subtle Concentric Sand Ripples (Karesansui Rake Marks) */}
      {rippleRings.map((radius, idx) => (
        <mesh
          key={idx}
          position={[0, 0.152, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radius - 0.04, radius + 0.04, 64]} />
          <meshBasicMaterial
            color={colors.lightModuleColor}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}
