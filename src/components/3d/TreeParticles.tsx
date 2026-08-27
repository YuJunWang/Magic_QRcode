import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreeParticlesProps {
  enabled: boolean;
  color: string;
  count?: number;
  bounds?: number;
  height?: number;
  viewMode: '2d' | '3d';
}

export function TreeParticles({
  enabled,
  color,
  count = 120,
  bounds = 24,
  height = 35,
  viewMode,
}: TreeParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize particle states (positions, velocities, rotations, flutter phases)
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * bounds * 1.5,
        y: Math.random() * height + 5,
        z: (Math.random() - 0.5) * bounds * 1.5,
        speedY: 0.03 + Math.random() * 0.04,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.03,
        scale: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count, bounds, height]);

  useFrame((state) => {
    if (!meshRef.current || !enabled || viewMode === '2d') return;

    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Fluttering downward motion
      p.y -= p.speedY;
      p.x += Math.sin(time * 1.5 + p.phase) * 0.02;
      p.z += Math.cos(time * 1.2 + p.phase) * 0.02;

      // Respawn at top when hitting bottom
      if (p.y < 0.2) {
        p.y = height + Math.random() * 5;
        p.x = (Math.random() - 0.5) * bounds * 1.4;
        p.z = (Math.random() - 0.5) * bounds * 1.4;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(
        time * p.rotSpeedX * 20 + p.phase,
        time * p.rotSpeedY * 20 + p.phase,
        time * p.rotSpeedZ * 20 + p.phase
      );
      dummy.scale.set(p.scale, p.scale * 0.4, p.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!enabled || viewMode === '2d') return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  );
}
