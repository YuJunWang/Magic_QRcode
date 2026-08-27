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

// Simple deterministic string/data hash
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function VoxelSystem({ qrData, viewMode, themeColors, elevation = 1.35 }: VoxelSystemProps) {
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

    // 1. Content Hash & Archetype Selection
    // Generates completely different organic forms depending on URL text & theme
    const matrixHash = hashString(matrix.map(row => row.map(b => (b ? '1' : '0')).join('')).join(''));
    const contentSeed = matrixHash % 10000;

    // Archetypes:
    // 0: 'banyan' (Broad umbrella, rounded top, low pointiness, lush spreading shelves)
    // 1: 'oak' (Asymmetric cloud lobes, billowing crowns, balanced height)
    // 2: 'pine' (Pagoda tiered conifer, stately tapered crown)
    // 3: 'acacia' (Savanna style, high flat spreading canopy, tall clear stem)
    const archetypes = ['banyan', 'oak', 'pine', 'acacia'] as const;
    let archetype = archetypes[contentSeed % archetypes.length];

    if (themeColors.id === 'summer' || themeColors.id === 'winter') {
      archetype = 'pine';
    } else if (themeColors.id === 'zen') {
      archetype = 'banyan';
    }

    // Archetype-specific geometric constants
    let heightRatio = 0.62;
    let domePower = 1.8;
    let trunkClearanceRatio = 0.38;
    let maxRadiusRatio = 0.70;

    if (archetype === 'banyan') {
      heightRatio = 0.52;
      domePower = 2.6; // Flat rounded top
      trunkClearanceRatio = 0.32;
      maxRadiusRatio = 0.76;
    } else if (archetype === 'oak') {
      heightRatio = 0.64;
      domePower = 1.7;
      trunkClearanceRatio = 0.38;
      maxRadiusRatio = 0.70;
    } else if (archetype === 'pine') {
      heightRatio = 0.78;
      domePower = 1.0; // Conical
      trunkClearanceRatio = 0.28;
      maxRadiusRatio = 0.64;
    } else if (archetype === 'acacia') {
      heightRatio = 0.58;
      domePower = 3.0; // Very flat high umbrella
      trunkClearanceRatio = 0.48; // Tall trunk
      maxRadiusRatio = 0.78;
    }

    const baseTreeHeight = Math.max(22, size * heightRatio) * (elevation || 1.35);
    const trunkClearanceY = baseTreeHeight * trunkClearanceRatio;
    const maxCanopyRadius = halfSize * maxRadiusRatio;

    // 2. Guaranteed Trunk Anchors: Search central core for closest dark module
    const centralDarkModules: { x: number; z: number; dist: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] && !isFinderPattern(r, c)) {
          const x = c - halfSize;
          const z = r - halfSize;
          const dist = Math.hypot(x, z);
          if (dist <= 3.8) {
            centralDarkModules.push({ x, z, dist });
          }
        }
      }
    }
    centralDarkModules.sort((a, b) => a.dist - b.dist);

    const primaryTrunkAnchors = new Set<string>();
    const branchCandidateModules: { x: number; z: number; dist: number }[] = [];

    if (centralDarkModules.length > 0) {
      // Guaranteed primary trunk anchor
      primaryTrunkAnchors.add(`${centralDarkModules[0].x},${centralDarkModules[0].z}`);

      // Candidates for high-altitude branches (dist between 1.2 and 3.5)
      for (let i = 1; i < centralDarkModules.length; i++) {
        if (centralDarkModules[i].dist <= 3.2) {
          branchCandidateModules.push(centralDarkModules[i]);
        }
      }
    }

    // Select 2-4 guaranteed high-altitude branch support anchors
    const highBranchAnchors = new Set<string>();
    branchCandidateModules.slice(0, 3).forEach((b) => {
      highBranchAnchors.add(`${b.x},${b.z}`);
    });

    // 3. Ground Plaza Base: 2-tile Quiet Zone around the entire QR matrix
    const quietZone = 2;
    const minGrid = -quietZone;
    const maxGrid = size + quietZone;

    for (let r = minGrid; r < maxGrid; r++) {
      for (let c = minGrid; c < maxGrid; c++) {
        const x = c - halfSize;
        const z = r - halfSize;

        // Alternating checkerboard paving stones
        const isAlternate = (Math.abs(r) + Math.abs(c)) % 2 === 0;
        const stoneColor = isAlternate ? '#f5f4ed' : '#eae7df';

        ground.push({
          x,
          y: -0.05,
          z,
          color: stoneColor,
          height: 0.1,
        });

        // Skip non-QR modules for foliage
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

        // B. Data Modules -> Procedural Foliage & Trunk Architecture
        const dist = Math.hypot(x, z);
        const angle = Math.atan2(z, x);

        // Deterministic pseudo-random seed per coordinate + contentSeed
        const coordSeed = Math.abs(Math.sin(x * 12.9898 + z * 78.233 + contentSeed * 0.1) * 43758.5453);
        const rand1 = coordSeed % 1;
        const rand2 = (coordSeed * 10) % 1;
        const rand3 = (coordSeed * 100) % 1;

        // Multi-Lobe Organic Variation: 3 sub-canopy centers based on contentSeed
        const lobeAngle1 = ((contentSeed % 360) * Math.PI) / 180;
        const lobeDist1 = halfSize * 0.35;
        const l1x = Math.cos(lobeAngle1) * lobeDist1;
        const l1z = Math.sin(lobeAngle1) * lobeDist1;

        const lobeAngle2 = lobeAngle1 + 2.1;
        const l2x = Math.cos(lobeAngle2) * (halfSize * 0.38);
        const l2z = Math.sin(lobeAngle2) * (halfSize * 0.38);

        const lobe1 = Math.exp(-Math.pow(Math.hypot(x - l1x, z - l1z) / (halfSize * 0.42), 2)) * 0.85;
        const lobe2 = Math.exp(-Math.pow(Math.hypot(x - l2x, z - l2z) / (halfSize * 0.40), 2)) * 0.75;
        const organicLobeBonus = (lobe1 + lobe2) * (baseTreeHeight * 0.30);

        // Sinusoidal harmonics for natural wind-swept contour
        const harmonicWave = (Math.sin(angle * 3 + 1.2) * 0.12 + Math.cos(angle * 2 - 0.8) * 0.14) * (1 - dist / maxCanopyRadius);

        const coordKey = `${x},${z}`;
        const isAnchorTrunk = primaryTrunkAnchors.has(coordKey);
        const isHighBranch = highBranchAnchors.has(coordKey);

        if (isAnchorTrunk) {
          // --- 1. GUARANTEED ROBUST CENTRAL TRUNK ---
          const trunkH = baseTreeHeight * 0.65;
          trunk.push({
            x,
            y: trunkH / 2,
            z,
            color: trunkColor,
            height: trunkH,
          });

          // Dense summit foliage capping the top of trunk
          foliage.push({
            x,
            y: baseTreeHeight * 0.95 + rand1 * 2.0,
            z,
            color: secondaryLeaf,
            height: 0.16,
          });
        } else if (dist <= maxCanopyRadius) {
          // --- 2. MAIN CANOPY (Zoned Foliage & Layer Repetition) ---
          const normalizedDist = Math.min(1, dist / maxCanopyRadius);
          const radialFalloff = Math.pow(Math.max(0, 1 - Math.pow(normalizedDist, domePower)), 0.85);
          
          // Peak canopy height at this coordinate
          const domeBase = trunkClearanceY + radialFalloff * (baseTreeHeight - trunkClearanceY);
          const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * (archetype === 'banyan' ? 1.5 : 2.5);
          const peakY = Math.max(trunkClearanceY + 1.2, domeBase + organicLobeBonus + harmonicWave * baseTreeHeight + noise);

          // Spatial Zoning for Layer Density & Repeatability:
          // Core Zone (dist < 0.35 * R): High repetition (4-6 layers)
          // Mid Zone (0.35 * R to 0.7 * R): Medium repetition (3-5 layers, organic gaps)
          // Outer Zone (0.7 * R to R): Delicate outer fringe (2-3 layers, lower density)
          let minL = 2;
          let maxL = 4;
          if (normalizedDist < 0.35) {
            minL = 4;
            maxL = 6;
          } else if (normalizedDist < 0.70) {
            minL = 3;
            maxL = 5;
          }

          const numLayers = Math.floor(rand2 * (maxL - minL + 1)) + minL;

          for (let i = 0; i < numLayers; i++) {
            // Distribute layers vertically between trunkClearanceY and peakY
            const layerY = i === 0 ? peakY : Math.max(trunkClearanceY, peakY - i * (2.2 + rand3 * 1.2));
            
            // Color variation: lighter near top & sun-exposed edges, deeper inside
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

          // --- 3. GUARANTEED HIGH-ELEVATION BRANCHES ---
          // Radiate from near the trunk to support canopy lobes, starting at y >= trunkClearanceY * 0.8
          if (isHighBranch || (dist <= 3.2 && rand1 > 0.75)) {
            const branchH = 1.4 + rand2 * 1.0;
            trunk.push({
              x,
              y: trunkClearanceY + 0.4,
              z,
              color: trunkColor,
              height: branchH,
            });
          }
        } else {
          // --- 4. PERIPHERAL GROUND GRASS & FLOWERBEDS ---
          const grassHeight = 0.25 + rand1 * 0.35;
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
    <group key={`voxel-tree-${size}`}>
      {/* 1. Ground Plaza Paving Stones */}
      <Instances limit={10000} range={groundVoxels.length} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
        {groundVoxels.map((v, i) => (
          <TreeVoxel key={`g-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>

      {/* 2. Procedural Central Trunk & High-Elevation Branches */}
      {trunkVoxels.length > 0 && (
        <Instances limit={10000} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.85} metalness={0.1} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Lush Multi-Tiered Foliage Canopy & Hedges */}
      <Instances limit={10000} range={foliageVoxels.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.65} metalness={0.1} />
        {foliageVoxels.map((v, i) => (
          <TreeVoxel key={`f-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>
    </group>
  );
}
