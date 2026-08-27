import { useMemo } from 'react';
import { Instances } from '@react-three/drei';
import { TreeVoxel, type VoxelData } from './TreeVoxel';
import type { QRMatrixData } from '../../types';

interface VoxelSystemProps {
  qrData: QRMatrixData;
  viewMode: '2d' | '3d';
}

export function VoxelSystem({ qrData, viewMode }: VoxelSystemProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const voxels = useMemo(() => {
    const data: VoxelData[] = [];

    // Colors
    const colorWhite = '#f3f4f6'; // Light ground
    const colorBlack = '#111827'; // Finder pattern
    const colorTrunk = '#78350f'; // Brown
    const colorLeaf1 = '#22c55e'; // Green
    const colorLeaf2 = '#16a34a'; // Dark green
    const colorGrass = '#4ade80'; // Light green

    let darkIndex = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.sqrt(x * x + z * z);
        const normalizedDist = dist / Math.max(halfSize, 1);

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

        if (isFinderPattern(r, c)) {
          // Finder Pattern Corners
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

        // Black Modules - Procedural Generation
        darkIndex++;
        const seed = (darkIndex * 9301 + 49297) % 233280;
        const rand1 = seed / 233280.0;
        const rand2 = ((seed * 9301 + 49297) % 233280) / 233280.0;
        const rand3 = ((seed * 12345 + 6789) % 233280) / 233280.0;

        // Trunk Check (Central area)
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
        } else if (normalizedDist < 0.6) {
          // Main Canopy (Denser, taller)
          const domeHeight = Math.max(0, 1 - Math.pow(normalizedDist, 1.2)) * 6.5;
          const clumpNoise = Math.sin(x * 0.4) * Math.cos(z * 0.4) * 1.8;
          const maxH = Math.max(1, domeHeight + clumpNoise);

          const layers = Math.floor(rand3 * 3) + 2; // 2 to 4 layers

          for (let i = 0; i < layers; i++) {
            let y = maxH;
            if (i > 0) {
              y = Math.max(0.5, maxH - (i * 1.5 * rand1));
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
          // Grass / Outer Edge
          const layers = Math.floor(rand3 * 2) + 1; // 1 to 2 layers
          const maxH = 0.5 + rand1 * 1.5;

          for (let i = 0; i < layers; i++) {
            data.push({
              x,
              y: maxH - (i * 0.5),
              z,
              color: colorGrass,
              isMorphable: true,
            });
          }
        }
      }
    }

    return data;
  }, [matrix, size, halfSize, isFinderPattern]);

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
