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
  const { size } = useThree();

  // Calculate zoom so the QR code fits the screen
  const padding = 1.2;
  // Determine how many units need to fit horizontally and vertically
  const targetUnits = gridSize * padding;
  // Ortho zoom is (pixels / unit). 
  // If height is the limiting factor: zoom = size.height / targetUnits
  // If width is limiting: zoom = size.width / targetUnits
  const minDimension = Math.min(size.width, size.height);
  const baseZoom = minDimension / targetUnits;

  useEffect(() => {
    if (!cameraRef.current) return;

    if (viewMode === '2d') {
      // Top-down Orthographic
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 100,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
      });
      gsap.to(cameraRef.current, {
        zoom: baseZoom,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.updateProjectionMatrix(),
      });
    } else {
      // Isometric 3D
      gsap.to(cameraRef.current.position, {
        x: 100,
        y: 100,
        z: 100,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
      });
      gsap.to(cameraRef.current, {
        zoom: baseZoom * 1.2, // Slightly zoomed in for 3D
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.updateProjectionMatrix(),
      });
    }
  }, [viewMode, baseZoom]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={viewMode === '2d' ? [0, 100, 0] : [100, 100, 100]}
      zoom={baseZoom}
      near={0.1}
      far={1000}
      onUpdate={(c) => c.lookAt(0, 0, 0)}
    />
  );
}
