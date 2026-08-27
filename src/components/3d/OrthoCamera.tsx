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

  // Calculate zoom so the QR code fits the screen with ample quiet zone and UI clearance
  const padding = 1.85; // Generous quiet zone to guarantee scanner detection and clear UI panels
  const targetUnits = gridSize * padding;
  const minDimension = Math.min(size.width, size.height);
  const baseZoom = minDimension / targetUnits;

  useEffect(() => {
    if (!cameraRef.current) return;

    if (viewMode === '2d') {
      // Top-down Orthographic Scan Mode
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 120,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
      });
      gsap.to(cameraRef.current, {
        zoom: baseZoom,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.updateProjectionMatrix(),
      });
    } else {
      // Isometric 3D Tree View (Centered on the volumetric tree)
      gsap.to(cameraRef.current.position, {
        x: 70,
        y: 65,
        z: 70,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.lookAt(0, 4.0, 0),
      });
      gsap.to(cameraRef.current, {
        zoom: baseZoom * 0.95,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => cameraRef.current.updateProjectionMatrix(),
      });
    }
  }, [viewMode, baseZoom]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={viewMode === '2d' ? [0, 100, 0] : [60, 60, 60]}
      zoom={viewMode === '2d' ? baseZoom : baseZoom * 0.82}
      near={0.1}
      far={1000}
      onUpdate={(c) => c.lookAt(0, viewMode === '2d' ? 0 : 2.5, 0)}
    />
  );
}
