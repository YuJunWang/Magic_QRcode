import { useMemo } from 'react';
import { Instances } from '@react-three/drei';
import { TreeVoxel, type VoxelData } from './TreeVoxel';
import type { QRMatrixData } from '../../types';
import type { ExtendedThemeColors } from '../../utils/themeConfig';

interface VoxelSystemProps {
  qrData: QRMatrixData;
  viewMode: '2d' | '3d';
  themeColors: ExtendedThemeColors;
  elevation?: number;
}

/**
 * Deterministic pseudo-random function from original repository (Enzo Manuel Mangano)
 */
function pseudoRandom(col: number, row: number, seed: number = 0): number {
  const s = Math.sin(col * 127.1 + row * 311.7 + seed * 43.7) * 43758.5;
  return s - Math.floor(s);
}

// Simple string hash
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
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
    const MAX_CANOPY_LAYERS = Math.max(11, Math.round(size * 0.50));
    const CANOPY_OUTER_RADIUS_FACTOR = 0.45;

    const canopyBaseHeight = TRUNK_LAYERS * CUBE_HEIGHT;
    const canopyOuterRadius = size * CANOPY_OUTER_RADIUS_FACTOR;

    // --- Theme High-Contrast Color Palettes ---
    const trunkBarkBase = themeColors.trunkColor || '#38220f';
    const trunkBarkDark = themeColors.trunkBarkDark || '#201308';

    const leafPrimary = themeColors.foliagePrimary || '#701a45';
    const leafSecondary = themeColors.foliageSecondary || '#4a0e2e';
    const leafAccent = themeColors.foliageAccent || '#9d174d';
    const leafRich = themeColors.foliageRich || '#2b051a';

    const grassBase = themeColors.grassBase || '#1b4329';
    const grassDark = themeColors.grassDark || '#0e2b19';

    // 1. Guaranteed Trunk Anchor Discovery
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

        // Ground paving tile (High luminance stone)
        const isAlternate = (Math.abs(r) + Math.abs(c)) % 2 === 0;
        const dirtColor = isAlternate ? (themeColors.groundColor || '#fffdf7') : (themeColors.lightModuleColor || '#f5f0e3');

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

        // Finder patterns -> deep decorative box
        if (isFinderPattern(r, c)) {
          foliage.push({
            x,
            y: 0.4,
            z,
            color: themeColors.finderPatternColor || leafSecondary,
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
          const petalColor = noise > 0.6 ? leafPrimary : (noise > 0.3 ? leafSecondary : leafRich);
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
    // STAGE 3: FLUFFY MULTI-LOBE BILLOWING CANOPY PASS
    // ----------------------------------------------------
    const matrixHash = hashString(matrix.map(row => row.map(b => (b ? '1' : '0')).join('')).join(''));
    const contentSeed = matrixHash % 10000;

    // 4 Procedural Lobe Centers based on URL/Content Hash
    const baseAngle = ((contentSeed % 360) * Math.PI) / 180;
    
    interface CanopyLobe {
      cx: number;
      cz: number;
      radius: number;
      maxLayers: number;
      weight: number;
    }

    const lobes: CanopyLobe[] = [
      // Central Crown Lobe
      {
        cx: 0,
        cz: 0,
        radius: canopyOuterRadius * 0.88,
        maxLayers: MAX_CANOPY_LAYERS * 1.05,
        weight: 1.0,
      },
      // First Billowing Satellite Lobe
      {
        cx: Math.cos(baseAngle) * (canopyOuterRadius * 0.40),
        cz: Math.sin(baseAngle) * (canopyOuterRadius * 0.40),
        radius: canopyOuterRadius * 0.65,
        maxLayers: MAX_CANOPY_LAYERS * 0.95,
        weight: 0.95,
      },
      // Second Billowing Satellite Lobe (Offset ~125 deg)
      {
        cx: Math.cos(baseAngle + 2.18) * (canopyOuterRadius * 0.44),
        cz: Math.sin(baseAngle + 2.18) * (canopyOuterRadius * 0.44),
        radius: canopyOuterRadius * 0.62,
        maxLayers: MAX_CANOPY_LAYERS * 0.90,
        weight: 0.90,
      },
      // Third Billowing Satellite Lobe (Offset ~240 deg)
      {
        cx: Math.cos(baseAngle + 4.15) * (canopyOuterRadius * 0.38),
        cz: Math.sin(baseAngle + 4.15) * (canopyOuterRadius * 0.38),
        radius: canopyOuterRadius * 0.58,
        maxLayers: MAX_CANOPY_LAYERS * 0.88,
        weight: 0.88,
      },
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c] || isFinderPattern(r, c)) continue;

        const x = c - halfSize;
        const z = r - halfSize;
        const distToCenter = Math.hypot(x, z);

        if (distToCenter < canopyOuterRadius) {
          // Calculate influence of all 4 lobes
          let maxLobeHeight = 0;
          let dominantT = 0;
          let secondDominantT = 0;

          lobes.forEach((lobe) => {
            const d = Math.hypot(x - lobe.cx, z - lobe.cz);
            if (d < lobe.radius) {
              const t = 1 - d / lobe.radius;
              // Billowing curvature (soft top with puffy drop)
              const lobeH = lobe.maxLayers * (0.22 + 0.78 * Math.pow(t, 1.8));
              if (lobeH > maxLobeHeight) {
                secondDominantT = dominantT;
                maxLobeHeight = lobeH;
                dominantT = t;
              } else if (t > secondDominantT) {
                secondDominantT = t;
              }
            }
          });

          // Fallback if near outer boundary
          if (maxLobeHeight === 0) {
            const t = Math.max(0, 1 - distToCenter / canopyOuterRadius);
            maxLobeHeight = MAX_CANOPY_LAYERS * (0.20 + 0.80 * t * t);
            dominantT = t;
          }

          const layersHere = Math.max(3, Math.round(maxLobeHeight));
          const domeOffset = Math.floor(dominantT * 3.6) * CUBE_HEIGHT;

          // Under-canopy slight droop for puffy volumetric cloud feel
          const baseDroop = dominantT > 0.25 && dominantT < 0.75 ? -Math.floor(pseudoRandom(c, r, 300) * 1.5) : 0;

          // Stack cubic foliage blocks vertically
          for (let layer = baseDroop; layer < layersHere; layer++) {
            const layerY = canopyBaseHeight + layer * CUBE_HEIGHT + domeOffset;

            // Lobe-aware Highlighting & Crevice Shading
            const layerT = (layer + 1) / layersHere;
            const isValley = dominantT > 0.4 && secondDominantT > 0.35 && Math.abs(dominantT - secondDominantT) < 0.15;

            let leafColor = leafPrimary;
            if (layerT > 0.80 && dominantT > 0.55) {
              // Lobe summit highlight
              leafColor = leafAccent;
            } else if (isValley || layerT < 0.30) {
              // Valley crevice shadow
              leafColor = leafRich;
            } else if (layerT < 0.55) {
              leafColor = leafSecondary;
            } else {
              leafColor = leafPrimary;
            }

            foliage.push({
              x,
              y: layerY + 0.5,
              z,
              color: leafColor,
              height: 1.0,
            });
          }

          // Add pseudo-random extra blocks on top of lobes for fluffy stepped texture
          const extraCount = Math.floor(pseudoRandom(c, r, 500) * (dominantT > 0.6 ? 4 : 2));
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

      {/* 2. Vertical Trunk Columns (100% Preserved) */}
      {trunkVoxels.length > 0 && (
        <Instances limit={10000} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.85} metalness={0.1} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Fluffy Multi-Lobe Billowing Foliage Canopy
          — emissive glow is per-theme and disabled in 2D scan mode
            so QR contrast is never affected */}
      <Instances limit={10000} range={foliageVoxels.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.65}
          metalness={0.1}
          emissive={themeColors.foliageEmissive ?? '#000000'}
          emissiveIntensity={viewMode === '3d' ? (themeColors.foliageEmissiveIntensity ?? 0) : 0}
        />
        {foliageVoxels.map((v, i) => (
          <TreeVoxel key={`f-${i}`} {...v} viewMode={viewMode} />
        ))}
      </Instances>
    </group>
  );
}
