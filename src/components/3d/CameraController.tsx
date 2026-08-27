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

  const plateSize = qrSize + 6;
  const orbitDistance = Math.max(qrSize * 0.95, 25);

  // Orbit mode perspective values
  const orbitPos = useRef(new THREE.Vector3(0, orbitDistance * 0.72, orbitDistance * 0.96));
  const orbitLookAt = useRef(new THREE.Vector3(0, 2.8, 0));

  // Scan mode orthographic-like values:
  // Using ultra-telephoto high distance (H = 300, FOV = 6 deg) mathematically eliminates perspective parallax (error < 0.3%)
  const scanFov = 6;
  const scanDistance = (plateSize / 2) / Math.tan((scanFov / 2) * (Math.PI / 180)) * 1.15;
  const scanPos = useRef(new THREE.Vector3(0, scanDistance, 0.0001));
  const scanLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (mode === 'scan' && controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [mode]);

  useFrame(() => {
    const isScan = mode === 'scan';
    const targetPos = isScan ? scanPos.current : orbitPos.current;
    const targetLook = isScan ? scanLookAt.current : orbitLookAt.current;
    const targetFov = isScan ? scanFov : 45;

    const lerpFactor = 0.08;

    // Smooth camera position interpolation
    camera.position.lerp(targetPos, lerpFactor);

    // Smooth FOV interpolation
    const persCamera = camera as THREE.PerspectiveCamera;
    if (persCamera.isPerspectiveCamera) {
      persCamera.fov = THREE.MathUtils.lerp(persCamera.fov, targetFov, lerpFactor);
      persCamera.updateProjectionMatrix();
    }

    if (isScan) {
      camera.up.set(0, 0, -1);
      camera.lookAt(targetLook);
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    } else {
      camera.up.set(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.target.lerp(targetLook, lerpFactor);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={12}
      maxDistance={65}
      maxPolarAngle={Math.PI / 2.05}
      autoRotate={autoRotate && mode === 'orbit'}
      autoRotateSpeed={0.8}
      enabled={mode === 'orbit'}
    />
  );
}
