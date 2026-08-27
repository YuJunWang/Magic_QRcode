import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { QRMatrixData, ThemeColors } from '../../../types';
import { SandPlate } from './SandPlate';
import { StoneLantern } from './StoneLantern';
import { ZenParticles } from './ZenParticles';

interface MossGardenProps {
  qrData: QRMatrixData;
  colors: ThemeColors;
  elevation: number;
  blockDensity: number;
  particlesEnabled: boolean;
}

export function MossGarden({
  qrData,
  colors,
  elevation,
  blockDensity,
  particlesEnabled,
}: MossGardenProps) {
  const { size, matrix, isFinderPattern, isFinderCenter } = qrData;
  const halfSize = (size - 1) / 2;

  const mossRef = useRef<THREE.InstancedMesh>(null);
  const stoneRef = useRef<THREE.InstancedMesh>(null);
  const finderRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate positions and attributes for instances
  const { mossData, stoneData, finderData } = useMemo(() => {
    const moss = [];
    const stone = [];
    const finder = [];

    const primaryColor = new THREE.Color(colors.darkModulePrimary);
    const secondaryColor = new THREE.Color(colors.darkModuleSecondary);
    const stoneColor = new THREE.Color(colors.darkModuleTertiary);
    const finderColor = new THREE.Color(colors.finderPatternColor);
    const finderCenterColor = new THREE.Color(colors.finderAccentColor);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c]) continue;

        const x = c - halfSize;
        const z = r - halfSize;

        if (isFinderPattern(r, c)) {
          const isCenter = isFinderCenter(r, c);
          finder.push({
            x,
            z,
            isCenter,
            color: isCenter ? finderCenterColor : finderColor,
            height: isCenter ? 0.9 * elevation : 0.65 * elevation,
          });
        } else {
          // Pseudo-random deterministic hash based on coordinates
          const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
          const rand = hash - Math.floor(hash);

          if (rand > 0.3) {
            // 70% Moss Balls with slight height & color variation
            const colorVariation = rand > 0.65 ? primaryColor : secondaryColor;
            moss.push({
              x,
              z,
              radius: (0.42 + (rand * 0.1 - 0.05)) * blockDensity,
              heightScale: (0.6 + rand * 0.5) * elevation,
              rotY: rand * Math.PI * 2,
              color: colorVariation,
            });
          } else {
            // 30% Smooth River Stones
            stone.push({
              x,
              z,
              scaleX: (0.38 + rand * 0.1) * blockDensity,
              scaleZ: (0.38 + rand * 0.1) * blockDensity,
              heightScale: (0.4 + rand * 0.3) * elevation,
              rotY: rand * Math.PI * 2,
              color: stoneColor,
            });
          }
        }
      }
    }

    return { mossData: moss, stoneData: stone, finderData: finder };
  }, [matrix, size, halfSize, isFinderPattern, isFinderCenter, colors, elevation, blockDensity]);

  // Update instanced meshes transformation and colors
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    // 1. Moss Instances
    if (mossRef.current) {
      mossData.forEach((m, idx) => {
        dummy.position.set(m.x, (m.radius * m.heightScale) / 2 + 0.1, m.z);
        dummy.rotation.set(0, m.rotY, 0);
        dummy.scale.set(m.radius, m.radius * m.heightScale, m.radius);
        dummy.updateMatrix();

        mossRef.current?.setMatrixAt(idx, dummy.matrix);
        mossRef.current?.setColorAt(idx, m.color);
      });
      mossRef.current.instanceMatrix.needsUpdate = true;
      if (mossRef.current.instanceColor) mossRef.current.instanceColor.needsUpdate = true;
    }

    // 2. River Stone Instances
    if (stoneRef.current) {
      stoneData.forEach((s, idx) => {
        dummy.position.set(s.x, s.heightScale / 2 + 0.1, s.z);
        dummy.rotation.set(0, s.rotY, 0);
        dummy.scale.set(s.scaleX, s.heightScale, s.scaleZ);
        dummy.updateMatrix();

        stoneRef.current?.setMatrixAt(idx, dummy.matrix);
        stoneRef.current?.setColorAt(idx, s.color);
      });
      stoneRef.current.instanceMatrix.needsUpdate = true;
      if (stoneRef.current.instanceColor) stoneRef.current.instanceColor.needsUpdate = true;
    }

    // 3. Finder Pattern Pillars
    if (finderRef.current) {
      finderData.forEach((f, idx) => {
        dummy.position.set(f.x, f.height / 2 + 0.1, f.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.92 * blockDensity, f.height, 0.92 * blockDensity);
        dummy.updateMatrix();

        finderRef.current?.setMatrixAt(idx, dummy.matrix);
        finderRef.current?.setColorAt(idx, f.color);
      });
      finderRef.current.instanceMatrix.needsUpdate = true;
      if (finderRef.current.instanceColor) finderRef.current.instanceColor.needsUpdate = true;
    }
  }, [mossData, stoneData, finderData, blockDensity]);

  return (
    <group>
      {/* 1. Sand bed with wooden/stone frame */}
      <SandPlate size={size} colors={colors} />

      {/* 2. Instanced Moss Spheres */}
      {mossData.length > 0 && (
        <instancedMesh
          ref={mossRef}
          args={[undefined, undefined, mossData.length]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial roughness={0.9} metalness={0.05} />
        </instancedMesh>
      )}

      {/* 3. Instanced River Stones */}
      {stoneData.length > 0 && (
        <instancedMesh
          ref={stoneRef}
          args={[undefined, undefined, stoneData.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.6} metalness={0.15} />
        </instancedMesh>
      )}

      {/* 4. Instanced Finder Corner Stones */}
      {finderData.length > 0 && (
        <instancedMesh
          ref={finderRef}
          args={[undefined, undefined, finderData.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.75} metalness={0.1} />
        </instancedMesh>
      )}

      {/* 5. Center Miniature Japanese Stone Lantern */}
      <StoneLantern
        colors={colors}
        position={[0, 0.15, 0]}
        scale={0.75}
      />

      {/* 6. Falling Zen leaves/petals */}
      {particlesEnabled && <ZenParticles colors={colors} areaSize={size} />}
    </group>
  );
}
