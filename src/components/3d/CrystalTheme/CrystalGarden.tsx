import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { QRMatrixData, ThemeColors } from '../../../types';
import { GeodeCore } from './GeodeCore';
import { GemSparkles } from './GemSparkles';

interface CrystalGardenProps {
  qrData: QRMatrixData;
  colors: ThemeColors;
  elevation: number;
  blockDensity: number;
  particlesEnabled: boolean;
}

export function CrystalGarden({
  qrData,
  colors,
  elevation,
  blockDensity,
  particlesEnabled,
}: CrystalGardenProps) {
  const { size, matrix, isFinderPattern, isFinderCenter } = qrData;
  const halfSize = (size - 1) / 2;

  const crystalRef = useRef<THREE.InstancedMesh>(null);
  const secondaryCrystalRef = useRef<THREE.InstancedMesh>(null);
  const finderRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate positions and attributes for instances
  const { primaryData, secondaryData, finderData } = useMemo(() => {
    const primary = [];
    const secondary = [];
    const finder = [];

    const primaryColor = new THREE.Color(colors.darkModulePrimary);
    const secondaryColor = new THREE.Color(colors.darkModuleSecondary);
    const accentColor = new THREE.Color(colors.darkModuleTertiary);
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
            height: (isCenter ? 1.4 : 0.9) * elevation,
            width: 0.95 * blockDensity,
          });
        } else {
          const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
          const rand = hash - Math.floor(hash);

          // 75% Main Hexagonal Crystal
          const h = (0.7 + rand * 0.6) * elevation;
          const colChoice = rand > 0.6 ? accentColor : (rand > 0.3 ? primaryColor : secondaryColor);

          primary.push({
            x,
            z,
            height: h,
            radius: (0.42 + rand * 0.08) * blockDensity,
            rotY: rand * Math.PI * 2,
            tiltX: (rand - 0.5) * 0.18,
            tiltZ: ((rand * 1.7) % 1 - 0.5) * 0.18,
            color: colChoice,
          });

          // 25% Sub-crystal shard beside it for organic cluster density
          if (rand > 0.75) {
            secondary.push({
              x: x + (rand - 0.5) * 0.25,
              z: z + ((rand * 2.3) % 1 - 0.5) * 0.25,
              height: h * 0.6,
              radius: 0.25 * blockDensity,
              rotY: rand * Math.PI,
              tiltX: (rand - 0.5) * 0.35,
              tiltZ: ((rand * 3.1) % 1 - 0.5) * 0.35,
              color: accentColor,
            });
          }
        }
      }
    }

    return { primaryData: primary, secondaryData: secondary, finderData: finder };
  }, [matrix, size, halfSize, isFinderPattern, isFinderCenter, colors, elevation, blockDensity]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    // 1. Primary Hexagonal Crystals
    if (crystalRef.current) {
      primaryData.forEach((p, idx) => {
        dummy.position.set(p.x, p.height / 2 + 0.05, p.z);
        dummy.rotation.set(p.tiltX, p.rotY, p.tiltZ);
        dummy.scale.set(p.radius, p.height, p.radius);
        dummy.updateMatrix();

        crystalRef.current?.setMatrixAt(idx, dummy.matrix);
        crystalRef.current?.setColorAt(idx, p.color);
      });
      crystalRef.current.instanceMatrix.needsUpdate = true;
      if (crystalRef.current.instanceColor) crystalRef.current.instanceColor.needsUpdate = true;
    }

    // 2. Secondary Mini Shards
    if (secondaryCrystalRef.current) {
      secondaryData.forEach((s, idx) => {
        dummy.position.set(s.x, s.height / 2 + 0.05, s.z);
        dummy.rotation.set(s.tiltX, s.rotY, s.tiltZ);
        dummy.scale.set(s.radius, s.height, s.radius);
        dummy.updateMatrix();

        secondaryCrystalRef.current?.setMatrixAt(idx, dummy.matrix);
        secondaryCrystalRef.current?.setColorAt(idx, s.color);
      });
      secondaryCrystalRef.current.instanceMatrix.needsUpdate = true;
      if (secondaryCrystalRef.current.instanceColor) secondaryCrystalRef.current.instanceColor.needsUpdate = true;
    }

    // 3. Finder Obelisk Pillars
    if (finderRef.current) {
      finderData.forEach((f, idx) => {
        dummy.position.set(f.x, f.height / 2 + 0.05, f.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(f.width, f.height, f.width);
        dummy.updateMatrix();

        finderRef.current?.setMatrixAt(idx, dummy.matrix);
        finderRef.current?.setColorAt(idx, f.color);
      });
      finderRef.current.instanceMatrix.needsUpdate = true;
      if (finderRef.current.instanceColor) finderRef.current.instanceColor.needsUpdate = true;
    }
  }, [primaryData, secondaryData, finderData, blockDensity]);

  const plateSize = size + 4;

  return (
    <group>
      {/* 1. Dark Obsidian Bedrock Platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[plateSize, 0.25, plateSize]} />
        <meshStandardMaterial
          color={colors.groundColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Decorative Outer Metal Trim */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[plateSize + 0.8, 0.05, plateSize + 0.8]} />
        <meshStandardMaterial
          color={colors.lightModuleColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Primary Hexagonal Crystal Prisms */}
      {primaryData.length > 0 && (
        <instancedMesh
          ref={crystalRef}
          args={[undefined, undefined, primaryData.length]}
          castShadow
          receiveShadow
        >
          {/* 6-sided cylinder with sharp pyramid tip */}
          <cylinderGeometry args={[0, 1, 1, 6]} />
          <meshPhysicalMaterial
            roughness={0.1}
            metalness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            emissive={colors.darkModulePrimary}
            emissiveIntensity={0.2}
            transparent
            opacity={0.92}
          />
        </instancedMesh>
      )}

      {/* 3. Secondary Mini Crystal Shards */}
      {secondaryData.length > 0 && (
        <instancedMesh
          ref={secondaryCrystalRef}
          args={[undefined, undefined, secondaryData.length]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[1, 1, 6]} />
          <meshPhysicalMaterial
            roughness={0.1}
            metalness={0.1}
            emissive={colors.darkModuleTertiary}
            emissiveIntensity={0.35}
            transparent
            opacity={0.88}
          />
        </instancedMesh>
      )}

      {/* 4. Finder Obelisks */}
      {finderData.length > 0 && (
        <instancedMesh
          ref={finderRef}
          args={[undefined, undefined, finderData.length]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.3, 0.7, 1, 6]} />
          <meshPhysicalMaterial
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.9}
            emissive={colors.finderPatternColor}
            emissiveIntensity={0.4}
          />
        </instancedMesh>
      )}

      {/* 5. Center Floating Rotating Geode Core */}
      <GeodeCore colors={colors} position={[0, 1.8, 0]} />

      {/* 6. Floating Sparkles */}
      {particlesEnabled && <GemSparkles colors={colors} areaSize={size} />}
    </group>
  );
}
