import { useMemo } from 'react';
import { Instances } from '@react-three/drei';
import { TreeVoxel, type VoxelData } from './TreeVoxel';
import type { QRMatrixData } from '../../types';

interface VoxelSystemProps {
  qrData: QRMatrixData;
  viewMode: '2d' | '3d';
  themeColors: any;
  elevation?: number;
}

export function VoxelSystem({ qrData, viewMode, themeColors, elevation = 1.0 }: VoxelSystemProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const { groundVoxels, trunkVoxels, foliageVoxels } = useMemo(() => {
    const ground: VoxelData[] = [];
    const trunk: VoxelData[] = [];
    const foliage: VoxelData[] = [];

    // Theme Color Palettes
    const trunkColor = themeColors.trunkColor || '#5c3a21';
    const primaryLeaf = themeColors.foliagePrimary || '#38761d';
    const secondaryLeaf = themeColors.foliageSecondary || '#274e13';
    const accentLeaf = themeColors.accentColor || '#6aa84f';
    const grassColor = themeColors.accentColor || '#45811e';

    // 1. Ground Plaza: Render complete plaza with 2-tile Quiet Zone around the entire QR matrix
    const quietZone = 2;
    const minGrid = -quietZone;
    const maxGrid = size + quietZone;

    for (let r = minGrid; r < maxGrid; r++) {
      for (let c = minGrid; c < maxGrid; c++) {
        const x = c - halfSize;
        const z = r - halfSize;

        // Alternating subtle checkerboard paving stones
        const isAlternate = (Math.abs(r) + Math.abs(c)) % 2 === 0;
        const stoneColor = isAlternate ? '#f5f4ed' : '#eae7df';

        // Base ground paving tile
        ground.push({
          x,
          y: -0.05,
          z,
          color: stoneColor,
          height: 0.1,
        });

        // If outside the QR matrix, it's just the quiet zone plaza
        if (r < 0 || r >= size || c < 0 || c >= size) {
          continue;
        }

        const isDark = matrix[r][c];
        if (!isDark) {
          continue;
        }

        // --- Dark Module Handling ---

        // A. Corner Finder Patterns -> Square Garden Hedge Boxes
        if (isFinderPattern(r, c)) {
          foliage.push({
            x,
            y: 0.35,
            z,
            color: secondaryLeaf,
            height: 0.7,
          });
          continue;
        }

        // B. Data Modules -> Tree Trunk, Canopy, or Edge Grass
        const dist = Math.sqrt(x * x + z * z);
        const seed = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        const rand1 = seed % 1;
        const rand2 = (seed * 10) % 1;
        const rand3 = (seed * 100) % 1;

        // Tree canopy envelope scaled to grid size - much taller and distinctly elevated
        const maxCanopyRadius = halfSize * 0.65;
        const baseTreeHeight = Math.max(22, size * 0.68) * elevation;
        const bottomCanopyY = baseTreeHeight * 0.38; // Lift canopy well above ground plaza

        if (dist <= 2.2) {
          // Central Trunk Column (rises straight up into the canopy)
          const trunkH = baseTreeHeight * 0.65;
          trunk.push({
            x,
            y: trunkH / 2,
            z,
            color: trunkColor,
            height: trunkH,
          });

          // Dense top foliage over the center trunk
          foliage.push({
            x,
            y: baseTreeHeight * 0.95 + rand1 * 2.5,
            z,
            color: secondaryLeaf,
            height: 0.15,
          });
        } else if (dist <= maxCanopyRadius) {
          // Main Foliage Canopy (Tall, stately dome / umbrella crown)
          const normalizedDist = dist / maxCanopyRadius;
          const domeHeight = bottomCanopyY + Math.pow(1 - normalizedDist, 1.1) * (baseTreeHeight - bottomCanopyY);
          const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2.5;
          const peakY = Math.max(bottomCanopyY + 1.0, domeHeight + noise);

          // Number of tiered horizontal leaf layers (4 to 6 layers for maximum lushness)
          const numLayers = Math.floor(rand2 * 3) + 4;

          for (let i = 0; i < numLayers; i++) {
            // Distribute layers vertically between bottomCanopyY and peakY
            const layerY = i === 0 ? peakY : Math.max(bottomCanopyY, peakY - i * (2.4 + rand3 * 1.2));
            
            // Color variation across layers (lighter near top, deeper inside)
            let leafColor = primaryLeaf;
            if (i === 0 && rand1 > 0.3) leafColor = accentLeaf;
            else if (i > 2 || rand1 > 0.65) leafColor = secondaryLeaf;

            foliage.push({
              x,
              y: layerY,
              z,
              color: leafColor,
              height: 0.15,
            });
          }

          // Supporting wooden branches extending under thick foliage
          if (rand1 > 0.55 && dist < maxCanopyRadius * 0.65) {
            const branchH = bottomCanopyY * (0.6 + rand2 * 0.35);
            trunk.push({
              x,
              y: branchH / 2 + (bottomCanopyY - branchH),
              z,
              color: trunkColor,
              height: branchH,
            });
          }
        } else {
          // Edge Grass / Flower Bed Border
          const grassHeight = 0.2 + rand1 * 0.35;
          foliage.push({
            x,
            y: grassHeight / 2,
            z,
            color: grassColor,
            height: grassHeight,
          });
        }
      }
    }

    return { groundVoxels: ground, trunkVoxels: trunk, foliageVoxels: foliage };
  }, [matrix, size, halfSize, isFinderPattern, themeColors, elevation]);

  return (
    <group>
      {/* 1. Ground Plaza Paving Stones */}
      <Instances limit={Math.max(1000, groundVoxels.length)} range={groundVoxels.length} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
        {groundVoxels.map((v, i) => (
          <TreeVoxel key={`g-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>

      {/* 2. Tree Trunk & Branches */}
      {trunkVoxels.length > 0 && (
        <Instances limit={Math.max(1000, trunkVoxels.length)} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.85} metalness={0.1} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Lush Multi-Tiered Foliage & Hedges */}
      <Instances limit={Math.max(1000, foliageVoxels.length)} range={foliageVoxels.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.65} metalness={0.1} />
        {foliageVoxels.map((v, i) => (
          <TreeVoxel key={`f-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>
    </group>
  );
}
