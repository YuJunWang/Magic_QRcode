import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { QRMatrixData, ThemeColors, CameraMode } from '../../../types';

interface TreeFoliageMorphProps {
  qrData: QRMatrixData;
  colors: ThemeColors;
  elevation: number;
  blockDensity: number;
  cameraMode: CameraMode;
  themeType: string;
}

export function TreeFoliageMorph({
  qrData,
  colors,
  elevation,
  blockDensity,
  cameraMode,
  themeType,
}: TreeFoliageMorphProps) {
  const { size, matrix, isFinderPattern, isFinderCenter } = qrData;
  const halfSize = (size - 1) / 2;

  const foliageMeshRef = useRef<THREE.InstancedMesh>(null);
  const finderMeshRef = useRef<THREE.InstancedMesh>(null);
  const morphProgressRef = useRef(cameraMode === 'scan' ? 1 : 0);

  // Define high-contrast scan colors for each theme to guarantee 100% camera scan success
  const deepScanColor = useMemo(() => {
    switch (themeType) {
      case 'sakura':
        return new THREE.Color('#2d0a1e'); // Deep Plum
      case 'summer':
        return new THREE.Color('#082613'); // Deep Pine
      case 'autumn':
        return new THREE.Color('#2e0b04'); // Deep Mahogany
      case 'winter':
        return new THREE.Color('#071629'); // Deep Navy
      case 'crystal':
        return new THREE.Color('#16062b'); // Deep Amethyst
      case 'zen':
      default:
        return new THREE.Color('#102213'); // Deep Moss
    }
  }, [themeType]);

  const pureBlack = useMemo(() => new THREE.Color('#000000'), []);

  // Calculate 3D Tree Crown positions (compact lush crown) vs 2D Flat QR positions
  const { foliageData, finderData } = useMemo(() => {
    const foliage = [];
    const finder = [];

    const primaryColor = new THREE.Color(colors.foliagePrimary);
    const secondaryColor = new THREE.Color(colors.foliageSecondary);
    const accentColor = new THREE.Color(colors.foliageAccent);
    const finderColor = new THREE.Color(colors.finderPatternColor);
    const finderCenterColor = new THREE.Color(colors.finderAccentColor);

    let darkIndex = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!matrix[r][c]) continue;

        const xFlat = c - halfSize;
        const zFlat = r - halfSize;

        const seed = (darkIndex * 9301 + 49297) % 233280;
        const rand1 = seed / 233280.0;
        const rand2 = ((seed * 9301 + 49297) % 233280) / 233280.0;
        const rand3 = ((seed * 12345 + 6789) % 233280) / 233280.0;
        darkIndex++;

        if (isFinderPattern(r, c)) {
          const isCenter = isFinderCenter(r, c);
          const x3D = xFlat * 0.95;
          const z3D = zFlat * 0.95;
          const y3D = (isCenter ? 1.2 : 0.6) * elevation;

          finder.push({
            xFlat,
            zFlat,
            x3D,
            z3D,
            y3D,
            yFlat: 0.1,
            color3D: isCenter ? finderCenterColor : finderColor,
          });
        } else {
          // 3D Tree Mode: Golden ratio spherical spiral canopy
          const phi = Math.acos(1 - 2 * rand1);
          const theta = rand2 * Math.PI * 2;
          const radiusSpread = Math.cbrt(0.2 + rand3 * 0.8) * 4.8 * elevation;

          // Tree Crown center at [0, 5.2, 0]
          const x3D = radiusSpread * Math.sin(phi) * Math.cos(theta) * 1.35;
          const y3D = 5.2 * elevation + radiusSpread * Math.cos(phi) * 0.9;
          const z3D = radiusSpread * Math.sin(phi) * Math.sin(theta) * 1.35;

          let col = primaryColor;
          if (rand1 > 0.6) col = secondaryColor;
          else if (rand1 > 0.35) col = accentColor;

          foliage.push({
            xFlat,
            zFlat,
            x3D,
            y3D,
            z3D,
            yFlat: 0.08,
            randScale3D: 0.75 + rand2 * 0.45,
            rotY: rand1 * Math.PI * 2,
            rotX: (rand2 - 0.5) * 0.5,
            rotZ: (rand3 - 0.5) * 0.5,
            color3D: col,
          });
        }
      }
    }

    return { foliageData: foliage, finderData: finder };
  }, [matrix, size, halfSize, isFinderPattern, isFinderCenter, colors, elevation]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Update instance transformations and contrast colors smoothly every frame
  useFrame(() => {
    const target = cameraMode === 'scan' ? 1 : 0;
    morphProgressRef.current = THREE.MathUtils.lerp(morphProgressRef.current, target, 0.08);
    const p = morphProgressRef.current;

    // 1. Foliage Leaves / Flower Buds -> Solid Gapless QR Tiles
    if (foliageMeshRef.current) {
      foliageData.forEach((f, idx) => {
        const curX = THREE.MathUtils.lerp(f.x3D, f.xFlat, p);
        const curY = THREE.MathUtils.lerp(f.y3D, f.yFlat, p);
        const curZ = THREE.MathUtils.lerp(f.z3D, f.zFlat, p);
        dummy.position.set(curX, curY, curZ);

        dummy.rotation.set(
          THREE.MathUtils.lerp(f.rotX, 0, p),
          THREE.MathUtils.lerp(f.rotY, 0, p),
          THREE.MathUtils.lerp(f.rotZ, 0, p)
        );

        // In 3D: Puffy cloud-like scale
        // In Flat 2D: Perfect gapless square tile (scale 1.0 for seamless QR code)
        const scale3D = f.randScale3D * 1.15;
        const scaleFlat_XZ = 1.0 * blockDensity;
        const scaleFlat_Y = 0.14;

        dummy.scale.set(
          THREE.MathUtils.lerp(scale3D, scaleFlat_XZ, p),
          THREE.MathUtils.lerp(scale3D * 0.88, scaleFlat_Y, p),
          THREE.MathUtils.lerp(scale3D, scaleFlat_XZ, p)
        );

        dummy.updateMatrix();
        foliageMeshRef.current?.setMatrixAt(idx, dummy.matrix);

        // Interpolate color from 3D colorful petal to high-contrast deep dark tone in scan mode
        tempColor.lerpColors(f.color3D, deepScanColor, Math.min(1, p * 1.2));
        foliageMeshRef.current?.setColorAt(idx, tempColor);
      });

      foliageMeshRef.current.instanceMatrix.needsUpdate = true;
      if (foliageMeshRef.current.instanceColor) {
        foliageMeshRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 2. Finder Pattern Corner Pillars -> Pitch Dark Corner Blocks
    if (finderMeshRef.current) {
      finderData.forEach((f, idx) => {
        const curX = THREE.MathUtils.lerp(f.x3D, f.xFlat, p);
        const curY = THREE.MathUtils.lerp(f.y3D / 2, f.yFlat, p);
        const curZ = THREE.MathUtils.lerp(f.z3D, f.zFlat, p);
        dummy.position.set(curX, curY, curZ);
        dummy.rotation.set(0, 0, 0);

        const curHeight = THREE.MathUtils.lerp(f.y3D, 0.22, p);
        dummy.scale.set(1.0 * blockDensity, curHeight, 1.0 * blockDensity);

        dummy.updateMatrix();
        finderMeshRef.current?.setMatrixAt(idx, dummy.matrix);

        // Interpolate finder patterns to pitch black for 100% scanner detection
        tempColor.lerpColors(f.color3D, pureBlack, Math.min(1, p * 1.2));
        finderMeshRef.current?.setColorAt(idx, tempColor);
      });

      finderMeshRef.current.instanceMatrix.needsUpdate = true;
      if (finderMeshRef.current.instanceColor) {
        finderMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* 1. Instanced Foliage / Flower Buds with boxGeometry for gapless flat QR rendering */}
      {foliageData.length > 0 && (
        <instancedMesh
          ref={foliageMeshRef}
          args={[undefined, undefined, foliageData.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            roughness={0.6}
            metalness={0.05}
          />
        </instancedMesh>
      )}

      {/* 2. Instanced Finder Corner Pillars */}
      {finderData.length > 0 && (
        <instancedMesh
          ref={finderMeshRef}
          args={[undefined, undefined, finderData.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.6} metalness={0.05} />
        </instancedMesh>
      )}
    </group>
  );
}
