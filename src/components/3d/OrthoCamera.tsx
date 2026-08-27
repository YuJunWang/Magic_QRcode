import { useEffect, useRef } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

interface OrthoCameraProps {
  viewMode: '2d' | '3d';
  gridSize: number;
}

export function OrthoCamera({ viewMode, gridSize }: OrthoCameraProps) {
  const cameraRef = useRef<any>(null);
  const targetRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const { size } = useThree();

  // Calculate zoom so the QR code fits the screen with ample quiet zone and UI clearance
  const padding = 1.85;
  const targetUnits = gridSize * padding;
  const minDimension = Math.min(size.width, size.height);
  const baseZoom = minDimension / targetUnits;

  const treeMidY = Math.max(8, gridSize * 0.25);

  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const target = targetRef.current;

    // Kill any ongoing tweens on camera and target to avoid conflicts
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera);
    gsap.killTweensOf(target);

    if (viewMode === '2d') {
      // Smooth Transition: 3D Tree -> 2D QR Code
      // Notice: z = 0.001 prevents the mathematical gimbal lock singularity at (0, Y, 0)
      gsap.to(camera.position, {
        x: 0,
        y: 140,
        z: 0.001,
        duration: 1.4,
        ease: 'power3.inOut',
      });

      gsap.to(target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.lookAt(target.x, target.y, target.z);
        },
      });

      gsap.to(camera, {
        zoom: baseZoom,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    } else {
      // Smooth Transition: 2D QR Code -> 3D Tree
      gsap.to(camera.position, {
        x: 95,
        y: 85,
        z: 95,
        duration: 1.4,
        ease: 'power3.inOut',
      });

      gsap.to(target, {
        x: 0,
        y: treeMidY,
        z: 0,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.lookAt(target.x, target.y, target.z);
        },
      });

      gsap.to(camera, {
        zoom: baseZoom * 0.72,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [viewMode, baseZoom, gridSize, treeMidY]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={viewMode === '2d' ? [0, 140, 0.001] : [95, 85, 95]}
      zoom={viewMode === '2d' ? baseZoom : baseZoom * 0.72}
      near={0.1}
      far={1000}
      onUpdate={(c) => c.lookAt(0, viewMode === '2d' ? 0 : treeMidY, 0)}
    />
  );
}
