import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CameraMode } from '../../types';

interface CameraControllerProps {
  mode: CameraMode;
  autoRotate: boolean;
  qrSize: number;
}

export function CameraController({ mode, autoRotate, qrSize }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Accurate FOV calculations for perfect framing
  // For FOV 45: tan(22.5 deg) = 0.4142 -> required height = (plateSize) / (2 * 0.4142) + margin
  const plateSize = qrSize + 6;
  const scanDistance = Math.max(plateSize * 1.45, 38);
  const orbitDistance = Math.max(qrSize * 0.95, 24);

  const orbitTargetPos = useRef(new THREE.Vector3(0, orbitDistance * 0.75, orbitDistance * 0.95));
  const scanTargetPos = useRef(new THREE.Vector3(0, scanDistance, 0.001));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // When switching to scan mode, reset orbit target and orientation
    if (mode === 'scan' && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [mode]);

  useFrame(() => {
    const isScan = mode === 'scan';
    const targetPos = isScan ? scanTargetPos.current : orbitTargetPos.current;
    
    // Smooth lerp speed
    const lerpFactor = isScan ? 0.1 : 0.05;

    if (isScan) {
      camera.up.set(0, 0, -1);
      camera.position.lerp(targetPos, lerpFactor);
      camera.lookAt(targetLookAt.current);
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    } else {
      camera.up.set(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={10}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.05} // Prevent camera from going under ground
      autoRotate={autoRotate && mode === 'orbit'}
      autoRotateSpeed={0.8}
      enabled={mode === 'orbit'}
    />
  );
}
