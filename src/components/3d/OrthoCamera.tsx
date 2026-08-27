import { useRef } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

interface OrthoCameraProps {
  viewMode: '2d' | '3d';
  gridSize: number;
}

export function OrthoCamera({ viewMode, gridSize }: OrthoCameraProps) {
  const cameraRef = useRef<any>(null);
  const { size } = useThree();

  // Screen-responsive zoom calculation
  const padding = 1.85;
  const targetUnits = gridSize * padding;
  const minDimension = Math.min(size.width, size.height);
  const baseZoom = minDimension / targetUnits;
  const treeMidY = Math.max(8, gridSize * 0.25);

  // Spherical Orbit State
  const radius = 160;
  const phi3D = 0.95; // ~54.4 degrees polar angle
  const phi2D = 0.0001; // ~0 degrees (straight top-down singularity prevention)
  const theta = Math.PI / 4; // 45 degrees azimuth

  const orbitState = useRef({
    phi: viewMode === '2d' ? phi2D : phi3D,
    theta: theta,
    radius: radius,
    targetX: 0,
    targetY: viewMode === '2d' ? 0 : treeMidY,
    targetZ: 0,
    zoom: viewMode === '2d' ? baseZoom : baseZoom * 0.72,
  });

  useGSAP(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const state = orbitState.current;

    const is2D = viewMode === '2d';
    const targetPhi = is2D ? phi2D : phi3D;
    const targetY = is2D ? 0 : treeMidY;
    const targetZoom = is2D ? baseZoom : baseZoom * 0.72;

    // Cinematic GSAP Timeline for continuous spherical arc camera motion
    gsap.killTweensOf(state);

    gsap.to(state, {
      phi: targetPhi,
      targetY: targetY,
      zoom: targetZoom,
      duration: 1.5,
      ease: 'power4.inOut',
      onUpdate: () => {
        const sinPhi = Math.sin(state.phi);
        const cosPhi = Math.cos(state.phi);
        const sinTheta = Math.sin(state.theta);
        const cosTheta = Math.cos(state.theta);

        // Continuous spherical dome coordinates
        camera.position.set(
          state.radius * sinPhi * cosTheta,
          state.radius * cosPhi,
          state.radius * sinPhi * sinTheta
        );
        camera.lookAt(state.targetX, state.targetY, state.targetZ);
        camera.zoom = state.zoom;
        camera.updateProjectionMatrix();
      },
    });
  }, { dependencies: [viewMode, baseZoom, gridSize, treeMidY] });

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={[
        radius * Math.sin(viewMode === '2d' ? phi2D : phi3D) * Math.cos(theta),
        radius * Math.cos(viewMode === '2d' ? phi2D : phi3D),
        radius * Math.sin(viewMode === '2d' ? phi2D : phi3D) * Math.sin(theta),
      ]}
      zoom={viewMode === '2d' ? baseZoom : baseZoom * 0.72}
      near={0.1}
      far={1000}
      onUpdate={(c) => c.lookAt(0, viewMode === '2d' ? 0 : treeMidY, 0)}
    />
  );
}
