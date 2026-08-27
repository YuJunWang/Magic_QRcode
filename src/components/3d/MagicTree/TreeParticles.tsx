import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors } from '../../../types';

interface TreeParticlesProps {
  colors: ThemeColors;
  count?: number;
  areaSize: number;
}

export function TreeParticles({ colors, count = 80, areaSize }: TreeParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const data = [];
    const colorChoices = colors.particleColors.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * areaSize * 1.6,
        y: Math.random() * 14 + 1,
        z: (Math.random() - 0.5) * areaSize * 1.6,
        vy: 0.02 + Math.random() * 0.025,
        vx: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.015,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.03,
        scale: 0.18 + Math.random() * 0.22,
        color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
      });
    }
    return data;
  }, [count, areaSize, colors.particleColors]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.y * 1.2) * 0.012;
      p.z += p.vz + Math.cos(p.y * 1.1) * 0.012;

      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      if (p.y < 0.1) {
        p.y = 13 + Math.random() * 3;
        p.x = (Math.random() - 0.5) * areaSize * 1.6;
        p.z = (Math.random() - 0.5) * areaSize * 1.6;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale * 1.3, p.scale * 0.25, p.scale * 0.8);
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
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial roughness={0.7} metalness={0.1} />
    </instancedMesh>
  );
}
