import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors } from '../../../types';

interface GemSparklesProps {
  colors: ThemeColors;
  count?: number;
  areaSize: number;
}

export function GemSparkles({ colors, count = 75, areaSize }: GemSparklesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const data = [];
    const colorChoices = colors.particleColors.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * areaSize * 1.3,
        y: Math.random() * 8 + 0.2,
        z: (Math.random() - 0.5) * areaSize * 1.3,
        vy: 0.02 + Math.random() * 0.03, // Float upwards
        vx: (Math.random() - 0.5) * 0.008,
        vz: (Math.random() - 0.5) * 0.008,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        baseScale: 0.08 + Math.random() * 0.12,
        twinkleSpeed: 2 + Math.random() * 4,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
      });
    }
    return data;
  }, [count, areaSize, colors.particleColors]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      p.z += p.vz;

      // Reset when floating too high
      if (p.y > 10) {
        p.y = 0.2;
        p.x = (Math.random() - 0.5) * areaSize * 1.3;
        p.z = (Math.random() - 0.5) * areaSize * 1.3;
      }

      const twinkle = Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * 0.5 + 0.5;
      const currentScale = p.baseScale * (0.4 + twinkle * 0.9);

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 1.2, 0);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
      meshRef.current?.setColorAt(i, p.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={colors.darkModulePrimary}
        emissiveIntensity={2.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
