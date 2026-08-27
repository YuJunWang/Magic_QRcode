import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import type { QRMatrixData, ThemeColors } from '../../../types';

interface TreeFoliageMorphProps {
  qrData: QRMatrixData;
  colors: ThemeColors;
  elevation: number;
  blockDensity: number;
  themeType: string;
}

/**
 * v3.0 Pure Perspective Viewpoint Magic
 * - Side View: Lush organic 3D bonsai tree canopy
 * - Top View: 100% scannable QR Code (横看成岭侧成峰)
 */
export function TreeFoliageMorph({
  qrData,
  colors,
  elevation,
  themeType,
}: TreeFoliageMorphProps) {
  const { size, matrix, isFinderPattern } = qrData;
  const halfSize = (size - 1) / 2;

  const foliageMeshRef = useRef<THREE.InstancedMesh>(null);
  const finderMeshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate fixed 3D canopy coordinates for every dark module
  const { foliageData, finderData } = useMemo(() => {
    const foliage = [];
    const finder = [];

    const primaryColor = new THREE.Color(colors.foliagePrimary);
    const secondaryColor = new THREE.Color(colors.foliageSecondary);
    const accentColor = new THREE.Color(colors.foliageAccent);
    const finderColor = new THREE.Color('#0a0408');

    let darkIndex = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c]) continue;

        // Exact QR grid coordinate (NEVER moves)
        const x = c - halfSize;
        const z = r - halfSize;

        // Normalized radial distance from center
        const dist = Math.sqrt(x * x + z * z) / Math.max(halfSize, 1);

        const seed = (darkIndex * 9301 + 49297) % 233280;
        const rand2 = ((seed * 9301 + 49297) % 233280) / 233280.0;
        const rand3 = ((seed * 12345 + 6789) % 233280) / 233280.0;
        darkIndex++;

        if (isFinderPattern(r, c)) {
          // 7x7 corner modules - solid seamless flat tiles for 100% QR recognition
          finder.push({
            x,
            y: 0.18,
            z,
            color: finderColor,
          });
        } else {
          // Organic Base Height (Envelope)
          // 1. Base Dome
          const domeHeight = Math.max(0, 1 - Math.pow(dist, 1.2)) * 6.5 * elevation;
          
          // 2. Low-frequency Clump Noise (creates branches/clusters)
          const clumpNoise = Math.sin(x * 0.4) * Math.cos(z * 0.4) * 1.8 * elevation;
          
          // 3. High-frequency Jitter
          const detailNoise = (Math.sin(x * 3.7 + z * 5.3) * 0.35 + (rand2 - 0.5) * 0.6) * elevation;
          
          const maxH = Math.max(0.22, 0.22 + domeHeight + clumpNoise + detailNoise);

          // Determine number of layers based on distance and random (denser at center)
          const maxLayers = dist < 0.5 ? 4 : (dist < 0.8 ? 3 : 2);
          const layers = Math.floor(rand3 * maxLayers) + 1; // 1 to 4 layers

          let layerSeed = darkIndex * 12345;

          for (let i = 0; i < layers; i++) {
            layerSeed = (layerSeed * 9301 + 49297) % 233280;
            const lRand1 = layerSeed / 233280.0;
            layerSeed = (layerSeed * 9301 + 49297) % 233280;
            const lRand2 = layerSeed / 233280.0;
            layerSeed = (layerSeed * 9301 + 49297) % 233280;
            const lRand3 = layerSeed / 233280.0;

            // Height distribution: 
            // - Top layer (i=0) is exactly at maxH (forms the canopy envelope)
            // - Lower layers are scattered vertically down to 50-70% of maxH
            let y = maxH;
            if (i > 0) {
              const drop = lRand1 * (maxH * 0.6); // Drop up to 60%
              y = Math.max(0.25, maxH - drop);
            }

            // Color palette distribution
            let col = primaryColor;
            if (lRand2 > 0.65) col = secondaryColor;
            else if (lRand2 > 0.35) col = accentColor;

            foliage.push({
              x,
              y,
              z,
              // Top layer strictly fills the cell, lower layers vary in size for organic look
              scale: (i === 0 ? 1.04 : 0.5 + lRand3 * 0.5),
              color: col,
            });
          }
        }
      }
    }

    return { foliageData: foliage, finderData: finder };
  }, [matrix, size, halfSize, isFinderPattern, colors, elevation]);

  // Apply instance matrices once
  useEffect(() => {
    const dummy = new THREE.Object3D();

    // 1. Foliage Leaves / Blossom Canopy
    if (foliageMeshRef.current && foliageData.length > 0) {
      foliageData.forEach((f, idx) => {
        dummy.position.set(f.x, f.y, f.z);
        
        // STRICTLY Axis-aligned (0 rotation) to perfectly match QR grid and create voxel/papercraft look
        dummy.rotation.set(0, 0, 0);

        // Apply scale only to X and Z, keeping Y (thickness) constant
        dummy.scale.set(f.scale, 1, f.scale);

        dummy.updateMatrix();
        foliageMeshRef.current?.setMatrixAt(idx, dummy.matrix);
        foliageMeshRef.current?.setColorAt(idx, f.color);
      });

      foliageMeshRef.current.instanceMatrix.needsUpdate = true;
      if (foliageMeshRef.current.instanceColor) {
        foliageMeshRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 2. Finder Corner Solid Blocks (Scale 1.04 ensures zero gaps between adjacent cells)
    if (finderMeshRef.current && finderData.length > 0) {
      finderData.forEach((f, idx) => {
        dummy.position.set(f.x, f.y, f.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1.04, 0.35, 1.04);

        dummy.updateMatrix();
        finderMeshRef.current?.setMatrixAt(idx, dummy.matrix);
        finderMeshRef.current?.setColorAt(idx, f.color);
      });

      finderMeshRef.current.instanceMatrix.needsUpdate = true;
      if (finderMeshRef.current.instanceColor) {
        finderMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [foliageData, finderData]);

  const isCrystal = themeType === 'crystal';

  return (
    <group>
      {/* 1. Instanced Foliage (Cylinder or rounded box for organic 3D tree + solid 2D QR cells) */}
      {foliageData.length > 0 && (
        <instancedMesh
          ref={foliageMeshRef}
          args={[undefined, undefined, foliageData.length]}
          castShadow
          receiveShadow
        >
          {isCrystal ? (
            <octahedronGeometry args={[0.55, 0]} />
          ) : (
            // Thin horizontal slice to create the voxel/papercraft flat leaf look
            <boxGeometry args={[1, 0.08, 1]} />
          )}
          <meshStandardMaterial
            roughness={isCrystal ? 0.2 : 0.65}
            metalness={isCrystal ? 0.35 : 0.05}
          />
        </instancedMesh>
      )}

      {/* 2. Instanced 7x7 Finder Corner Blocks */}
      {finderData.length > 0 && (
        <instancedMesh
          ref={finderMeshRef}
          args={[undefined, undefined, finderData.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.7} metalness={0.05} />
        </instancedMesh>
      )}
    </group>
  );
}
