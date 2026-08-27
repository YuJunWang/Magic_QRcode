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

    // 1. Ground Plaza Base: 2-tile Quiet Zone around the entire QR matrix
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

        // B. Data Modules -> Procedural Asymmetric Tree with Branching Architecture
        const dist = Math.sqrt(x * x + z * z);
        const angle = Math.atan2(z, x);

        // Deterministic pseudo-random seed per coordinate
        const seed = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        const rand1 = seed % 1;
        const rand2 = (seed * 10) % 1;
        const rand3 = (seed * 100) % 1;

        // Tree dimensions: TALL and STATELY
        const maxCanopyRadius = halfSize * 0.72;
        const baseTreeHeight = Math.max(28, size * 0.88) * elevation;
        const trunkClearanceY = baseTreeHeight * 0.40; // 40% height is clear trunk

        // Multi-Lobe Asymmetry: 3 organic sub-clusters (lobes) across the crown
        const lobe1 = Math.exp(-Math.pow(Math.hypot(x - 3.5, z - 2.5) / (halfSize * 0.45), 2)) * 0.85;
        const lobe2 = Math.exp(-Math.pow(Math.hypot(x + 4.0, z - 3.0) / (halfSize * 0.42), 2)) * 0.75;
        const lobe3 = Math.exp(-Math.pow(Math.hypot(x + 1.0, z + 4.5) / (halfSize * 0.48), 2)) * 0.90;
        const organicLobeBonus = (lobe1 + lobe2 + lobe3) * (baseTreeHeight * 0.35);

        // Sinusoidal harmonics for natural wind-swept contour
        const harmonicWave = (Math.sin(angle * 3 + 1.2) * 0.15 + Math.cos(angle * 2 - 0.8) * 0.2) * (1 - dist / maxCanopyRadius);

        // Strict single-column central trunk condition
        const isCenterTrunk = Math.abs(x) < 0.75 && Math.abs(z) < 0.75;

        if (isCenterTrunk) {
          // --- 1. SLENDER SINGLE CENTRAL TRUNK ---
          // Exactly 1 module wide, rises cleanly through the open space into the canopy
          const trunkH = baseTreeHeight * 0.70;
          trunk.push({
            x,
            y: trunkH / 2,
            z,
            color: trunkColor,
            height: trunkH,
          });

          // Dense summit foliage capping the top of the trunk
          foliage.push({
            x,
            y: baseTreeHeight * 0.96 + rand1 * 3.0,
            z,
            color: secondaryLeaf,
            height: 0.18,
          });
        } else if (dist <= maxCanopyRadius) {
          // --- 2. MAIN CANOPY (Asymmetric Organic Envelope) ---
          const normalizedDist = dist / maxCanopyRadius;
          const radialFalloff = Math.pow(Math.max(0, 1 - normalizedDist), 1.15);
          
          // Compute peak canopy height at this (x, z) coordinate
          const domeBase = trunkClearanceY + radialFalloff * (baseTreeHeight * 0.60);
          const noise = Math.sin(x * 0.45) * Math.cos(z * 0.45) * 3.0;
          const peakY = Math.max(trunkClearanceY + 1.5, domeBase + organicLobeBonus + harmonicWave * baseTreeHeight + noise);

          // Tiered horizontal leaf layers (4 to 7 layers for thick volume)
          const numLayers = Math.floor(rand2 * 4) + 4;

          for (let i = 0; i < numLayers; i++) {
            // Distribute layers from bottom of canopy up to peakY
            const layerY = i === 0 ? peakY : Math.max(trunkClearanceY, peakY - i * (2.8 + rand3 * 1.5));
            
            // Color variation: lighter near peak, deeper inside
            let leafColor = primaryLeaf;
            if (i === 0 && rand1 > 0.25) leafColor = accentLeaf;
            else if (i > 3 || rand1 > 0.65) leafColor = secondaryLeaf;

            foliage.push({
              x,
              y: layerY,
              z,
              color: leafColor,
              height: 0.16,
            });
          }

          // --- 3. SUBTLE HIGH-ALTITUDE BRANCH SUPPORTS ---
          // Only tiny branch nodes tucked directly under the canopy at high altitude, NEVER reaching low ground
          if (dist <= 2.8 && rand1 > 0.65) {
            trunk.push({
              x,
              y: trunkClearanceY + 0.6,
              z,
              color: trunkColor,
              height: 1.2,
            });
          }
        } else {
          // --- 4. PERIPHERAL GROUND GRASS & FLOWERBEDS ---
          const grassHeight = 0.25 + rand1 * 0.4;
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

      {/* 2. Natural Tree Trunk & Elevated Branches */}
      {trunkVoxels.length > 0 && (
        <Instances limit={Math.max(1000, trunkVoxels.length)} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.85} metalness={0.1} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Lush Multi-Tiered Foliage Canopy & Hedges */}
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
