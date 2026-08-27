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

/**
 * Deterministic pseudo-random function from the original repository (Enzo Manuel Mangano)
 */
function pseudoRandom(col: number, row: number, seed: number = 0): number {
  const s = Math.sin(col * 127.1 + row * 311.7 + seed * 43.7) * 43758.5;
  return s - Math.floor(s);
}

// Color interpolation utility
function lerpColor(c1: string, c2: string, t: number): string {
  const n1 = parseInt(c1.replace('#', ''), 16);
  const n2 = parseInt(c2.replace('#', ''), 16);
  const r1 = (n1 >> 16) & 255;
  const g1 = (n1 >> 8) & 255;
  const b1 = n1 & 255;
  const r2 = (n2 >> 16) & 255;
  const g2 = (n2 >> 8) & 255;
  const b2 = n2 & 255;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function VoxelSystem({ qrData, viewMode, themeColors }: VoxelSystemProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const { groundVoxels, trunkVoxels, foliageVoxels } = useMemo(() => {
    const ground: VoxelData[] = [];
    const trunk: VoxelData[] = [];
    const foliage: VoxelData[] = [];

    // --- Dynamic Scaling of Original Constants for Any QR Grid Size ---
    const CUBE_HEIGHT = 1.0;
    const TRUNK_RADIUS = Math.max(2.5, size * 0.08);
    const TRUNK_LAYERS = Math.max(10, Math.round(size * 0.45));
    const MAX_CANOPY_LAYERS = Math.max(11, Math.round(size * 0.48));
    const CANOPY_OUTER_RADIUS_FACTOR = 0.44;

    const canopyBaseHeight = TRUNK_LAYERS * CUBE_HEIGHT;
    const canopyOuterRadius = size * CANOPY_OUTER_RADIUS_FACTOR;

    // --- Theme Color Palettes ---
    const trunkBarkBase = themeColors.trunkColor || '#42210d';
    const trunkBarkDark = '#2b1406';

    const leafPrimary = themeColors.foliagePrimary || '#942e4d';
    const leafSecondary = themeColors.foliageSecondary || '#751f3d';
    const leafAccent = themeColors.accentColor || '#b34061';
    const leafRich = '#5c122e';

    const grassBase = themeColors.accentColor || '#12470d';
    const grassDark = '#0d2e0a';

    // 1. Guaranteed Trunk Anchor Discovery
    // Search within center radius for black modules to ensure the trunk always spawns
    const centerDarkList: { r: number; c: number; dist: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] && !isFinderPattern(r, c)) {
          const dx = c - halfSize;
          const dz = r - halfSize;
          const dist = Math.hypot(dx, dz);
          if (dist <= TRUNK_RADIUS * 1.4) {
            centerDarkList.push({ r, c, dist });
          }
        }
      }
    }
    centerDarkList.sort((a, b) => a.dist - b.dist);

    // Set of guaranteed trunk coordinates
    const guaranteedTrunkCoords = new Set<string>();
    if (centerDarkList.length > 0) {
      guaranteedTrunkCoords.add(`${centerDarkList[0].c},${centerDarkList[0].r}`);
      for (let i = 1; i < Math.min(4, centerDarkList.length); i++) {
        if (centerDarkList[i].dist <= TRUNK_RADIUS) {
          guaranteedTrunkCoords.add(`${centerDarkList[i].c},${centerDarkList[i].r}`);
        }
      }
    }

    // ----------------------------------------------------
    // STAGE 1: GROUND PASS (Dirt, Base Trunk, Fallen Petals, Grass)
    // ----------------------------------------------------
    const quietZone = 2;
    const minGrid = -quietZone;
    const maxGrid = size + quietZone;

    for (let r = minGrid; r < maxGrid; r++) {
      for (let c = minGrid; c < maxGrid; c++) {
        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.hypot(x, z);

        const isInsideQR = r >= 0 && r < size && c >= 0 && c < size;
        const isQrDark = isInsideQR ? matrix[r][c] : false;

        // Ground paving tile (Dirt / Plaza stone)
        const isAlternate = (Math.abs(r) + Math.abs(c)) % 2 === 0;
        const dirtColor = isAlternate ? '#fffdf7' : '#f5f0e3';

        ground.push({
          x,
          y: -0.05,
          z,
          color: dirtColor,
          height: 0.1,
        });

        if (!isInsideQR || !isQrDark) {
          continue;
        }

        // Finder patterns -> decorative square hedge box
        if (isFinderPattern(r, c)) {
          foliage.push({
            x,
            y: 0.4,
            z,
            color: leafSecondary,
            height: 0.8,
          });
          continue;
        }

        const isTrunkModule = dist < TRUNK_RADIUS || guaranteedTrunkCoords.has(`${c},${r}`);

        if (isTrunkModule) {
          // Trunk base at ground
          trunk.push({
            x,
            y: 0.5,
            z,
            color: trunkBarkBase,
            height: 1.0,
          });
        } else if (dist >= canopyOuterRadius) {
          // Grass / Outer shrubs
          const noise = pseudoRandom(c, r, 100);
          const gColor = noise > 0.5 ? grassBase : grassDark;
          foliage.push({
            x,
            y: 0.25,
            z,
            color: gColor,
            height: 0.5,
          });
        } else {
          // Fallen petals on forest floor
          const noise = pseudoRandom(c, r, 200);
          const petalColor = noise > 0.6 ? leafPrimary : (noise > 0.3 ? '#856b4d' : '#617a47');
          foliage.push({
            x,
            y: 0.15,
            z,
            color: petalColor,
            height: 0.3,
          });
        }
      }
    }

    // ----------------------------------------------------
    // STAGE 2: TRUNK PASS (Vertical Columns)
    // ----------------------------------------------------
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c] || isFinderPattern(r, c)) continue;

        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.hypot(x, z);
        const isTrunk = dist < TRUNK_RADIUS || guaranteedTrunkCoords.has(`${c},${r}`);

        if (isTrunk) {
          for (let layer = 1; layer < TRUNK_LAYERS; layer++) {
            const heightT = layer / TRUNK_LAYERS;
            const barkColor = lerpColor(trunkBarkBase, trunkBarkDark, heightT * 0.4);
            trunk.push({
              x,
              y: layer * CUBE_HEIGHT + 0.5,
              z,
              color: barkColor,
              height: 1.0,
            });
          }
        }
      }
    }

    // ----------------------------------------------------
    // STAGE 3: CANOPY PASS (Quadratic Dome + Pseudo-random Foliage)
    // ----------------------------------------------------
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c] || isFinderPattern(r, c)) continue;

        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.hypot(x, z);

        if (dist < canopyOuterRadius) {
          // t = 1 at center, 0 at edge
          const t = 1 - dist / canopyOuterRadius;

          // Quadratic Dome formula: layersHere = max(3, round(MAX_CANOPY_LAYERS * (0.25 + 0.75 * t * t)))
          const layersHere = Math.max(
            3,
            Math.round(MAX_CANOPY_LAYERS * (0.25 + 0.75 * t * t))
          );

          const domeOffset = Math.floor(t * 3.5) * CUBE_HEIGHT;

          // Stack cubic foliage blocks vertically
          for (let layer = 0; layer < layersHere; layer++) {
            const layerY = canopyBaseHeight + layer * CUBE_HEIGHT + domeOffset;

            // Color gradations: lighter near crown and outer sun-lit surfaces
            const layerT = (layer + 1) / layersHere;
            let leafColor = leafPrimary;
            if (layerT > 0.75) {
              leafColor = leafAccent;
            } else if (layerT < 0.35) {
              leafColor = leafRich;
            } else {
              leafColor = leafSecondary;
            }

            foliage.push({
              x,
              y: layerY + 0.5,
              z,
              color: leafColor,
              height: 1.0,
            });
          }

          // Add pseudo-random extra blocks on top for organic variation
          const extraCount = Math.floor(pseudoRandom(c, r, 500) * 4);
          for (let e = 0; e < extraCount; e++) {
            const extraLayer = layersHere + e;
            const extraY = canopyBaseHeight + extraLayer * CUBE_HEIGHT + domeOffset;

            foliage.push({
              x,
              y: extraY + 0.5,
              z,
              color: leafAccent,
              height: 1.0,
            });
          }
        }
      }
    }

    return { groundVoxels: ground, trunkVoxels: trunk, foliageVoxels: foliage };
  }, [matrix, size, halfSize, isFinderPattern, themeColors]);

  return (
    <group key={`voxel-tree-${size}`}>
      {/* 1. Ground Base Stones */}
      <Instances limit={10000} range={groundVoxels.length} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
        {groundVoxels.map((v, i) => (
          <TreeVoxel key={`g-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>

      {/* 2. Vertical Trunk Columns */}
      {trunkVoxels.length > 0 && (
        <Instances limit={10000} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.85} metalness={0.1} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Elevated Quadratic Dome Foliage Canopy */}
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
