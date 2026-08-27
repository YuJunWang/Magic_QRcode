import { useMemo } from 'react';
import { Instances } from '@react-three/drei';
import { TreeVoxel, type VoxelData } from './TreeVoxel';
import type { QRMatrixData } from '../../types';

interface VoxelSystemProps {
  qrData: QRMatrixData;
  viewMode: '2d' | '3d';
  themeColors: any;
}

export function VoxelSystem({ qrData, viewMode, themeColors }: VoxelSystemProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const voxels = useMemo(() => {
    const data: VoxelData[] = [];

    // Colors
    const colorWhite = '#f3f4f6'; // Light ground
    const colorBlack = '#111827'; // Finder pattern
    const colorTrunk = themeColors.trunkColor || '#78350f'; 
    const colorLeaf1 = themeColors.foliagePrimary || '#22c55e';
    const colorLeaf2 = themeColors.foliageSecondary || '#16a34a';
    const colorGrass = themeColors.foliagePrimary || '#4ade80';

    let darkIndex = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.sqrt(x * x + z * z);

        if (!matrix[r][c]) {
          // White Modules - Solid Ground
          data.push({
            x,
            y: -0.05,
            z,
            color: colorWhite,
            isMorphable: false,
            baseScaleY: 0.1,
          });
          continue;
        }

        // --- Black Modules ---
        // Always spawn a solid dark base tile to guarantee QR contrast in 2D
        data.push({
          x,
          y: -0.01,
          z,
          color: colorBlack,
          isMorphable: false,
          baseScaleY: 0.12,
        });

        if (isFinderPattern(r, c)) {
          // Finder Pattern Corners (just the base is enough, or maybe make it a slightly raised box)
          data.push({
            x,
            y: 0.2,
            z,
            color: colorBlack,
            isMorphable: false,
            baseScaleY: 0.4,
          });
          continue;
        }

        // Procedural Generation for Tree/Grass on top of the black base
        darkIndex++;
        const seed = (darkIndex * 9301 + 49297) % 233280;
        const rand1 = seed / 233280.0;
        const rand2 = ((seed * 9301 + 49297) % 233280) / 233280.0;
        const rand3 = ((seed * 12345 + 6789) % 233280) / 233280.0;

        // Ensure trunk is centered, canopy is grouped around it
        const isTrunk = Math.abs(x) <= 1 && Math.abs(z) <= 1;

        if (isTrunk) {
          // Trunk pillar
          data.push({
            x,
            y: 1.5,
            z,
            color: colorTrunk,
            isMorphable: false,
            baseScaleY: 3,
          });
          // Canopy on top of trunk
          data.push({
            x,
            y: 3.5 + rand1 * 1,
            z,
            color: colorLeaf2,
            isMorphable: true,
          });
        } else if (dist < halfSize * 0.75) { 
          // Main Canopy (Denser in the middle, fading out)
          // Use absolute distance rather than normalized to avoid making a huge rectangle
          const maxRadius = halfSize * 0.75;
          const distFactor = Math.max(0, 1 - Math.pow(dist / maxRadius, 1.5));
          const domeHeight = distFactor * 6.5;
          const clumpNoise = Math.sin(x * 0.4) * Math.cos(z * 0.4) * 1.8;
          const maxH = Math.max(1.5, domeHeight + clumpNoise);

          const layers = Math.floor(rand3 * 2) + 2; // 2 to 3 layers

          for (let i = 0; i < layers; i++) {
            let y = maxH;
            if (i > 0) {
              y = Math.max(1, maxH - (i * 1.5 * rand1));
            }
            data.push({
              x,
              y,
              z,
              color: rand2 > 0.5 ? colorLeaf1 : colorLeaf2,
              isMorphable: true,
            });
          }
        } else {
          // Grass / Outer Edge Shrubs
          const maxH = 0.5 + rand1 * 1.0;
          data.push({
            x,
            y: maxH,
            z,
            color: colorGrass,
            isMorphable: true,
          });
        }
      }
    }

    return data;
  }, [matrix, size, halfSize, isFinderPattern, themeColors]);

  return (
    <Instances range={voxels.length} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.8} metalness={0.1} />
      {voxels.map((v, i) => (
        <TreeVoxel key={i} {...v} viewMode={viewMode} />
      ))}
    </Instances>
  );
}
