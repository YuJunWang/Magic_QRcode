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
  const clampedT = Math.max(0, Math.min(1, t));
  const n1 = parseInt(c1.replace('#', ''), 16);
  const n2 = parseInt(c2.replace('#', ''), 16);
  const r1 = (n1 >> 16) & 255;
  const g1 = (n1 >> 8) & 255;
  const b1 = n1 & 255;
  const r2 = (n2 >> 16) & 255;
  const g2 = (n2 >> 8) & 255;
  const b2 = n2 & 255;

  const r = Math.round(r1 + (r2 - r1) * clampedT);
  const g = Math.round(g1 + (g2 - g1) * clampedT);
  const b = Math.round(b1 + (b2 - b1) * clampedT);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Multi-stop continuous color ramp evaluator for lush, organic shading
 */
function sampleCanopyColor(
  v: number,
  cRich: string,
  cSecondary: string,
  cPrimary: string,
  cAccent: string,
  cHighlight: string
): string {
  const t = Math.max(0, Math.min(1, v));
  if (t < 0.22) {
    return lerpColor(cRich, cSecondary, t / 0.22);
  } else if (t < 0.48) {
    return lerpColor(cSecondary, cPrimary, (t - 0.22) / 0.26);
  } else if (t < 0.76) {
    return lerpColor(cPrimary, cAccent, (t - 0.48) / 0.28);
  } else {
    return lerpColor(cAccent, cHighlight, (t - 0.76) / 0.24);
  }
}

export function VoxelSystem({ qrData, viewMode, themeColors }: VoxelSystemProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const { groundVoxels, trunkVoxels, foliageVoxels } = useMemo(() => {
    const ground: VoxelData[] = [];
    const trunk: VoxelData[] = [];
    const foliage: VoxelData[] = [];

    // --- Dynamic Scaling of Constants for Arbitrary QR Grid Sizes ---
    const CUBE_HEIGHT = 1.0;
    const TRUNK_RADIUS = Math.max(2.5, size * 0.08);
    const ROOT_FLARE_RADIUS = TRUNK_RADIUS * 1.85; // Buttress root flare boundary
    const TRUNK_LAYERS = Math.max(10, Math.round(size * 0.45));
    const MAX_CANOPY_LAYERS = Math.max(12, Math.round(size * 0.58)); // Increased stacking
    const CANOPY_OUTER_RADIUS_FACTOR = 0.46;

    const canopyBaseHeight = TRUNK_LAYERS * CUBE_HEIGHT;
    const canopyOuterRadius = size * CANOPY_OUTER_RADIUS_FACTOR;

    // --- Theme High-Contrast Color Palettes ---
    const trunkBarkBase = themeColors.trunkColor || '#38220f';
    const trunkBarkDark = themeColors.trunkBarkDark || '#201308';

    const leafPrimary = themeColors.foliagePrimary || '#701a45';
    const leafSecondary = themeColors.foliageSecondary || '#4a0e2e';
    const leafAccent = themeColors.foliageAccent || '#9d174d';
    const leafHighlight = themeColors.foliageHighlight || themeColors.accentColor || '#be185d';
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

        const isCoreTrunk = dist < TRUNK_RADIUS || guaranteedTrunkCoords.has(`${c},${r}`);
        const isRootFlare = !isCoreTrunk && dist < ROOT_FLARE_RADIUS;

        if (isCoreTrunk || isRootFlare) {
          // Deep weathered bark base touching soil
          trunk.push({
            x,
            y: 0.5,
            z,
            color: trunkBarkDark,
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
          // Fallen petals on forest floor (guarantees non-empty base for QR)
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
    // STAGE 2: TRUNK & BUTTRESS ROOT FLARE PASS
    // ----------------------------------------------------
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c] || isFinderPattern(r, c)) continue;

        const x = c - halfSize;
        const z = r - halfSize;
        const dist = Math.hypot(x, z);
        const isCoreTrunk = dist < TRUNK_RADIUS || guaranteedTrunkCoords.has(`${c},${r}`);
        const isRootFlare = !isCoreTrunk && dist < ROOT_FLARE_RADIUS;

        if (isCoreTrunk) {
          // Full-height main trunk columns climbing to canopy
          for (let layer = 1; layer < TRUNK_LAYERS; layer++) {
            const heightT = layer / TRUNK_LAYERS;
            const barkNoise = (pseudoRandom(c, r, layer * 13) - 0.5) * 0.12;
            const barkColor = lerpColor(trunkBarkDark, trunkBarkBase, Math.max(0, Math.min(1, heightT * 0.85 + barkNoise)));
            trunk.push({
              x,
              y: layer * CUBE_HEIGHT + 0.5,
              z,
              color: barkColor,
              height: 1.0,
            });
          }
        } else if (isRootFlare) {
          // Buttress roots: outward flare tapering smoothly towards the ground
          const flareT = 1.0 - (dist - TRUNK_RADIUS) / (ROOT_FLARE_RADIUS - TRUNK_RADIUS);
          const rootMaxLayers = Math.max(1, Math.round(TRUNK_LAYERS * 0.36 * Math.pow(flareT, 1.4)));

          for (let layer = 1; layer <= rootMaxLayers; layer++) {
            const rootLayerT = layer / rootMaxLayers;
            const rootBarkColor = lerpColor(trunkBarkDark, trunkBarkBase, rootLayerT * 0.5);
            trunk.push({
              x,
              y: layer * CUBE_HEIGHT + 0.5,
              z,
              color: rootBarkColor,
              height: 1.0,
            });
          }
        }
      }
    }

    // ----------------------------------------------------
    // STAGE 3: FLUFFY 5-LOBE BILLOWING CANOPY WITH DROPOUT & MULTI-STOP SHADING
    // ----------------------------------------------------
    const matrixHash = hashString(matrix.map(row => row.map(b => (b ? '1' : '0')).join('')).join(''));
    const contentSeed = matrixHash % 10000;

    // 5 Procedural Lobe Centers based on URL/Content Hash (Golden Angle Spacing)
    const baseAngle = ((contentSeed % 360) * Math.PI) / 180;

    interface CanopyLobe {
      cx: number;
      cz: number;
      radius: number;
      maxLayers: number;
      weight: number;
    }

    const lobes: CanopyLobe[] = [
      // Central High Crown Lobe
      {
        cx: 0,
        cz: 0,
        radius: canopyOuterRadius * 0.85,
        maxLayers: MAX_CANOPY_LAYERS * 1.05,
        weight: 1.0,
      },
      // 4 Satellite Billowing Cloud Lobes
      {
        cx: Math.cos(baseAngle) * (canopyOuterRadius * 0.42),
        cz: Math.sin(baseAngle) * (canopyOuterRadius * 0.42),
        radius: canopyOuterRadius * 0.64,
        maxLayers: MAX_CANOPY_LAYERS * 0.94,
        weight: 0.94,
      },
      {
        cx: Math.cos(baseAngle + 1.57) * (canopyOuterRadius * 0.46),
        cz: Math.sin(baseAngle + 1.57) * (canopyOuterRadius * 0.46),
        radius: canopyOuterRadius * 0.60,
        maxLayers: MAX_CANOPY_LAYERS * 0.90,
        weight: 0.90,
      },
      {
        cx: Math.cos(baseAngle + 3.14) * (canopyOuterRadius * 0.40),
        cz: Math.sin(baseAngle + 3.14) * (canopyOuterRadius * 0.40),
        radius: canopyOuterRadius * 0.62,
        maxLayers: MAX_CANOPY_LAYERS * 0.88,
        weight: 0.88,
      },
      {
        cx: Math.cos(baseAngle + 4.71) * (canopyOuterRadius * 0.38),
        cz: Math.sin(baseAngle + 4.71) * (canopyOuterRadius * 0.38),
        radius: canopyOuterRadius * 0.58,
        maxLayers: MAX_CANOPY_LAYERS * 0.86,
        weight: 0.86,
      },
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c] || isFinderPattern(r, c)) continue;

        const x = c - halfSize;
        const z = r - halfSize;
        const distToCenter = Math.hypot(x, z);

        if (distToCenter < canopyOuterRadius) {
          // Calculate influence of all 5 lobes
          let maxLobeHeight = 0;
          let dominantT = 0;
          let secondDominantT = 0;

          lobes.forEach((lobe) => {
            const d = Math.hypot(x - lobe.cx, z - lobe.cz);
            if (d < lobe.radius) {
              const t = 1 - d / lobe.radius;
              // Smooth cosine billowing cloud puff profile
              const lobeH = lobe.maxLayers * (0.20 + 0.80 * Math.sin(t * Math.PI * 0.5));
              if (lobeH > maxLobeHeight) {
                secondDominantT = dominantT;
                maxLobeHeight = lobeH;
                dominantT = t;
              } else if (t > secondDominantT) {
                secondDominantT = t;
              }
            }
          });

          // Fallback near outer perimeter
          if (maxLobeHeight === 0) {
            const t = Math.max(0, 1 - distToCenter / canopyOuterRadius);
            maxLobeHeight = MAX_CANOPY_LAYERS * (0.18 + 0.82 * t * t);
            dominantT = t;
          }

          const layersHere = Math.max(3, Math.round(maxLobeHeight));
          const domeOffset = Math.floor(dominantT * 3.8) * CUBE_HEIGHT;

          // Under-canopy slight droop for volumetric cloud underside
          const baseDroop = dominantT > 0.25 && dominantT < 0.75 ? -Math.floor(pseudoRandom(c, r, 300) * 1.5) : 0;

          // Sunlight alignment factor (Sun position ~ top-right +X, +Z)
          const sunFactor = 0.5 + 0.5 * ((x + z) / (Math.SQRT2 * canopyOuterRadius));

          // Valley crevice shadow detection between competing lobes
          const isValley = dominantT > 0.35 && secondDominantT > 0.30 && Math.abs(dominantT - secondDominantT) < 0.16;

          // Stack cubic foliage blocks vertically
          for (let layer = baseDroop; layer < layersHere; layer++) {
            // Airiness / Subtle Voxel Dropout (0.015 ~ 0.035)
            // SAFETY: Always preserve baseDroop layer so 2D QR top-down projection is 100% solid!
            if (layer > baseDroop) {
              const dropoutNoise = pseudoRandom(c, r, layer * 37 + contentSeed);
              const isPorousZone = layer / layersHere > 0.70 || dominantT < 0.32;
              const dropoutRate = isPorousZone ? 0.032 : 0.016;
              if (dropoutNoise < dropoutRate) {
                continue; // Create airy negative space and natural leaf gaps
              }
            }

            const layerY = canopyBaseHeight + layer * CUBE_HEIGHT + domeOffset;
            const heightNorm = (layer - baseDroop + 1) / (layersHere - baseDroop + 1);

            // Multi-Factor Depth & Lighting Shading Value (V in [0, 1])
            const microNoise = (pseudoRandom(c, r, layer * 7 + 101) - 0.5) * 0.08;
            let shadeV = 0.48 * heightNorm + 0.34 * dominantT + 0.18 * sunFactor + microNoise;

            if (isValley) {
              shadeV = Math.max(0.05, shadeV - 0.22); // Deep crevice shadow
            }

            const leafColor = sampleCanopyColor(
              shadeV,
              leafRich,
              leafSecondary,
              leafPrimary,
              leafAccent,
              leafHighlight
            );

            foliage.push({
              x,
              y: layerY + 0.5,
              z,
              color: leafColor,
              height: 1.0,
            });
          }

          // Extra stepped crown tufts for fluffy top texture
          const extraCount = Math.floor(pseudoRandom(c, r, 500) * (dominantT > 0.62 ? 3 : 1));
          for (let e = 0; e < extraCount; e++) {
            const extraLayer = layersHere + e;
            const extraY = canopyBaseHeight + extraLayer * CUBE_HEIGHT + domeOffset;

            // Tufts receive bright sunlit/highlight blossom tint
            foliage.push({
              x,
              y: extraY + 0.5,
              z,
              color: leafHighlight,
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

      {/* 2. Vertical Trunk Columns & Buttress Roots */}
      {trunkVoxels.length > 0 && (
        <Instances limit={10000} range={trunkVoxels.length} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.88} metalness={0.08} />
          {trunkVoxels.map((v, i) => (
            <TreeVoxel key={`t-${i}`} {...v} viewMode={viewMode} />
          ))}
        </Instances>
      )}

      {/* 3. Fluffy 5-Lobe Billowing Foliage Canopy with Subtle Radiance */}
      <Instances limit={10000} range={foliageVoxels.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.62}
          metalness={0.08}
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
