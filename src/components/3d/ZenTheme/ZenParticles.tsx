import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThemeColors } from '../../../types';

interface ZenParticlesProps {
  colors: ThemeColors;
  count?: number;
  areaSize: number;
}

export function ZenParticles({ colors, count = 60, areaSize }: ZenParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize particle states (position, velocity, rotation speed, scale)
  const particles = useMemo(() => {
    const data = [];
    const colorChoices = colors.particleColors.map((hex) => new THREE.Color(hex));

    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * areaSize * 1.5,
        y: Math.random() * 12 + 1,
        z: (Math.random() - 0.5) * areaSize * 1.5,
        vy: 0.015 + Math.random() * 0.02,
        vx: (Math.random() - 0.5) * 0.01,
        vz: (Math.random() - 0.5) * 0.01,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        scale: 0.15 + Math.random() * 0.2,
        color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
      });
    }
    return data;
  }, [count, areaSize, colors.particleColors]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      // Move downward with gentle sway
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.y * 1.5) * 0.008;
      p.z += p.vz + Math.cos(p.y * 1.2) * 0.008;

      // Rotate leaf
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      // Reset when touching the ground
      if (p.y < 0.1) {
        p.y = 12 + Math.random() * 2;
        p.x = (Math.random() - 0.5) * areaSize * 1.5;
        p.z = (Math.random() - 0.5) * areaSize * 1.5;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale * 1.4, p.scale * 0.2, p.scale * 0.7);
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
