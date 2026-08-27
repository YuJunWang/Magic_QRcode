import { useLayoutEffect, useRef, useMemo } from 'react';
import { Instance } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export interface VoxelData {
  x: number;
  y: number;
  z: number;
  color: string;
  isMorphable: boolean;
  baseScaleY?: number;
}

interface TreeVoxelProps extends VoxelData {
  viewMode: '2d' | '3d';
}

export function TreeVoxel({ x, y, z, color, isMorphable, baseScaleY = 1, viewMode }: TreeVoxelProps) {
  const ref = useRef<any>(null);

  // Pre-calculate the organic 3D state for this voxel
  const organicState = useMemo(() => {
    if (!isMorphable) {
      return {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scaleX: 1,
        scaleY: baseScaleY,
        scaleZ: 1,
      };
    }

    // Pseudo-random based on coordinates to keep it deterministic
    const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453);
    const rand1 = (seed % 1);
    const rand2 = ((seed * 10) % 1);
    const rand3 = ((seed * 100) % 1);

    return {
      rotX: (rand1 - 0.5) * 0.4, // slight tilt
      rotY: rand2 * Math.PI * 2, // random rotation
      rotZ: (rand3 - 0.5) * 0.4,
      scaleX: 0.8 + rand1 * 0.4,
      scaleY: 0.5 + rand2 * 1.5, // taller or shorter leaves
      scaleZ: 0.8 + rand3 * 0.4,
    };
  }, [x, y, z, isMorphable, baseScaleY]);

  const originalColor = useMemo(() => new THREE.Color(color), [color]);
  // Use a very dark grey/black for the 2D QR scan mode to guarantee contrast
  const qrBlackColor = useMemo(() => new THREE.Color('#0f172a'), []);

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (viewMode === '2d') {
      // Flatten to QR Code Mode
      gsap.to(ref.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      gsap.to(ref.current.scale, {
        x: 1, // Strictly 1 to fill the grid
        y: 0.1, // Flatten
        z: 1,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      // Morph black modules to pure black for 100% scan rate
      if (color !== '#f3f4f6') { // Don't morph the white ground
        gsap.to(ref.current.color, {
          r: qrBlackColor.r,
          g: qrBlackColor.g,
          b: qrBlackColor.b,
          duration: 1.2,
          ease: 'power3.inOut',
        });
      }
    } else {
      // Expand to Organic 3D Tree Mode
      gsap.to(ref.current.rotation, {
        x: organicState.rotX,
        y: organicState.rotY,
        z: organicState.rotZ,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      gsap.to(ref.current.scale, {
        x: organicState.scaleX,
        y: organicState.scaleY,
        z: organicState.scaleZ,
        duration: 1.2,
        ease: 'power3.inOut',
      });
      if (color !== '#f3f4f6') {
        gsap.to(ref.current.color, {
          r: originalColor.r,
          g: originalColor.g,
          b: originalColor.b,
          duration: 1.2,
          ease: 'power3.inOut',
        });
      }
    }
  }, [viewMode, organicState, color, originalColor, qrBlackColor]);

  const initialScale = viewMode === '2d' ? [1, 0.1, 1] : [organicState.scaleX, organicState.scaleY, organicState.scaleZ];
  const initialRot = viewMode === '2d' ? [0, 0, 0] : [organicState.rotX, organicState.rotY, organicState.rotZ];
  const initialColor = viewMode === '2d' && color !== '#f3f4f6' ? qrBlackColor : originalColor;

  return (
    <Instance
      ref={ref}
      position={[x, y, z]}
      // @ts-ignore
      scale={initialScale}
      // @ts-ignore
      rotation={initialRot}
      color={initialColor}
    />
  );
}
