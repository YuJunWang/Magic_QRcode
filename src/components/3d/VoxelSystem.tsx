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

    // 1. Determine Tree Archetype from theme & content hash
    // Archetypes: 'round' (Banyan/Tropical umbrella), 'cloud' (Ancient Oak/Sakura), 'conifer' (Layered Pine)
    const contentSeed = size + matrix.flat().filter(Boolean).length;
    let archetype: 'round' | 'cloud' | 'conifer' = 'cloud';

    if (themeColors.id === 'summer' || themeColors.id === 'winter') {
      archetype = 'conifer';
    } else if (themeColors.id === 'zen' || themeColors.id === 'crystal') {
      archetype = 'round';
    } else {
      const types: ('round' | 'cloud' | 'conifer')[] = ['round', 'cloud', 'cloud', 'conifer'];
      archetype = types[contentSeed % types.length];
    }

    // Archetype-specific height & canopy proportions
    let heightMultiplier = 0.65;
    let domeExponent = 1.6;
    let crownRoundness = 0.8;

    if (archetype === 'round') {
      // Broad, rounded umbrella/banyan crown - soft flat top
      heightMultiplier = 0.52;
      domeExponent = 2.4;
      crownRoundness = 1.2;
    } else if (archetype === 'cloud') {
      // Billowing organic multi-lobed deciduous tree
      heightMultiplier = 0.65;
      domeExponent = 1.6;
      crownRoundness = 0.9;
    } else {
      // Stately pagoda pine / conifer
      heightMultiplier = 0.82;
      domeExponent = 1.0;
      crownRoundness = 0.5;
    }

    const baseTreeHeight = Math.max(20, size * heightMultiplier) * elevation;
    const trunkClearanceY = baseTreeHeight * 0.38; // 38% height is clear trunk space
    const maxCanopyRadius = halfSize * (archetype === 'round' ? 0.74 : 0.68);

    // 2. Trunk Anchor Discovery: Guaranteed central trunk anchor points
    // Find all dark modules in the central region and sort by distance to (0,0)
    const centralDarkModules: { x: number; z: number; dist: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] && !isFinderPattern(r, c)) {
          const x = c - halfSize;
          const z = r - halfSize;
          const dist = Math.hypot(x, z);
          if (dist <= 3.2) {
            centralDarkModules.push({ x, z, dist });
          }
        }
      }
    }
    centralDarkModules.sort((a, b) => a.dist - b.dist);

    // Select 1 to 2 closest dark modules as guaranteed primary trunk anchors
    const primaryTrunkAnchors = new Set<string>();
    if (centralDarkModules.length > 0) {
      primaryTrunkAnchors.add(`${centralDarkModules[0].x},${centralDarkModules[0].z}`);
      // If the second closest is also very close (e.g. twin stem), anchor it too
      if (centralDarkModules.length > 1 && centralDarkModules[1].dist <= 1.8 && (contentSeed % 2 === 0)) {
        primaryTrunkAnchors.add(`${centralDarkModules[1].x},${centralDarkModules[1].z}`);
      }
    }

    // 3. Ground Plaza Base: 2-tile Quiet Zone around the entire QR matrix
    const quietZone = 2;
    const minGrid = -quietZone;
    const maxGrid = size + quietZone;

    for (let r = minGrid; r < maxGrid; r++) {
      for (let c = minGrid; c < maxGrid; c++) {
        const x = c - halfSize;
        const z = r - halfSize;

        // Checkerboard paving stones
        const isAlternate = (Math.abs(r) + Math.abs(c)) % 2 === 0;
        const stoneColor = isAlternate ? '#f5f4ed' : '#eae7df';

        ground.push({
          x,
          y: -0.05,
          z,
          color: stoneColor,
          height: 0.1,
        });

        // If outside QR matrix, skip foliage
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

        // B. Data Modules -> Procedural Foliage & Trunk
        const dist = Math.hypot(x, z);
        const angle = Math.atan2(z, x);

        // Deterministic pseudo-random seed per coordinate
        const seed = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
        const rand1 = seed % 1;
        const rand2 = (seed * 10) % 1;
        const rand3 = (seed * 100) % 1;

        // Multi-Lobe Asymmetry: 3 organic sub-clusters across the crown
        const lobe1 = Math.exp(-Math.pow(Math.hypot(x - 3.5, z - 2.5) / (halfSize * 0.45), 2)) * 0.75;
        const lobe2 = Math.exp(-Math.pow(Math.hypot(x + 4.0, z - 3.0) / (halfSize * 0.42), 2)) * 0.65;
        const lobe3 = Math.exp(-Math.pow(Math.hypot(x + 1.0, z + 4.5) / (halfSize * 0.48), 2)) * 0.80;
        const organicLobeBonus = (lobe1 + lobe2 + lobe3) * (baseTreeHeight * 0.25 * crownRoundness);

        // Sinusoidal harmonics for natural wind-swept contour
        const harmonicWave = (Math.sin(angle * 3 + 1.2) * 0.12 + Math.cos(angle * 2 - 0.8) * 0.15) * (1 - dist / maxCanopyRadius);

        const isAnchorTrunk = primaryTrunkAnchors.has(`${x},${z}`);

        if (isAnchorTrunk) {
          // --- 1. GUARANTEED ROBUST CENTRAL TRUNK ---
          const trunkH = baseTreeHeight * 0.68;
          trunk.push({
            x,
            y: trunkH / 2,
            z,
            color: trunkColor,
            height: trunkH,
          });

          // Dense crown foliage capping top of trunk
          foliage.push({
            x,
            y: baseTreeHeight * 0.95 + rand1 * 2.0,
            z,
            color: secondaryLeaf,
            height: 0.16,
          });
        } else if (dist <= maxCanopyRadius) {
          // --- 2. MAIN CANOPY (Archetype Dome Envelope) ---
          const normalizedDist = Math.min(1, dist / maxCanopyRadius);
          const radialFalloff = Math.pow(Math.max(0, 1 - Math.pow(normalizedDist, domeExponent)), 0.85);
          
          // Peak canopy height at this coordinate
          const domeBase = trunkClearanceY + radialFalloff * (baseTreeHeight - trunkClearanceY);
          const noise = Math.sin(x * 0.5) * Math.cos(z * 0.5) * (archetype === 'round' ? 1.5 : 2.5);
          const peakY = Math.max(trunkClearanceY + 1.2, domeBase + organicLobeBonus + harmonicWave * baseTreeHeight + noise);

          // Tiered horizontal leaf layers (3 to 6 layers depending on archetype)
          const maxLayers = archetype === 'round' ? 4 : 6;
          const numLayers = Math.floor(rand2 * (maxLayers - 2)) + 3;

          for (let i = 0; i < numLayers; i++) {
            // Distribute layers vertically between trunkClearanceY and peakY
            const layerY = i === 0 ? peakY : Math.max(trunkClearanceY, peakY - i * (2.2 + rand3 * 1.0));
            
            // Color variation: lighter near peak, deeper in interior
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

          // Occasional high-altitude branch support directly under dense lobes
          if (dist <= 3.0 && (rand1 > 0.72 || isAnchorTrunk)) {
            trunk.push({
              x,
              y: trunkClearanceY + 0.5,
              z,
              color: trunkColor,
              height: 1.0,
            });
          }
        } else {
          // --- 3. PERIPHERAL GROUND GRASS & FLOWERBEDS ---
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
    <group>
      {/* 1. Ground Plaza Paving Stones */}
      <Instances limit={Math.max(1000, groundVoxels.length)} range={groundVoxels.length} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
        {groundVoxels.map((v, i) => (
          <TreeVoxel key={`g-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>

      {/* 2. Procedural Central Trunk */}
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
