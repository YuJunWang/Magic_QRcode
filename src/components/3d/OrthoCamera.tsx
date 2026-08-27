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

// Fixed spherical coordinates (degrees → radians)
const PHI_3D = 0.95;    // ~54° polar angle (isometric)
const PHI_2D = 0.0001;  // ~0° (directly above; tiny offset prevents gimbal lock)
const THETA  = Math.PI / 4; // 45° azimuth
const RADIUS = 160;

export function OrthoCamera({ viewMode, gridSize }: OrthoCameraProps) {
  const cameraRef = useRef<any>(null);
  const { size } = useThree();

  const padding      = 1.85;
  const baseZoom     = Math.min(size.width, size.height) / (gridSize * padding);
  const treeMidY     = Math.max(8, gridSize * 0.25);

  // animState tracks the CURRENT interpolated values driven by GSAP.
  // It is intentionally NOT pre-seeded from viewMode so that the ref
  // always reflects the camera's true live position at any given moment.
  const animState = useRef({
    phi:     PHI_3D,
    targetY: treeMidY,
    zoom:    baseZoom * 0.72,
  });

  useGSAP(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const state  = animState.current;

    const is2D      = viewMode === '2d';
    const toPhi     = is2D ? PHI_2D  : PHI_3D;
    const toTargetY = is2D ? 0       : treeMidY;
    const toZoom    = is2D ? baseZoom : baseZoom * 0.72;

    // Kill any in-flight tween on our state object, then start fresh FROM
    // the current live values (state.phi / state.targetY / state.zoom) to
    // the new targets. This prevents ghost-start jumps when gridSize changes.
    gsap.killTweensOf(state);

    gsap.to(state, {
      phi:     toPhi,
      targetY: toTargetY,
      zoom:    toZoom,
      duration: 1.5,
      ease: 'power4.inOut',
      onUpdate: () => {
        const sp = Math.sin(state.phi);
        const cp = Math.cos(state.phi);

        camera.position.set(
          RADIUS * sp * Math.cos(THETA),
          RADIUS * cp,
          RADIUS * sp * Math.sin(THETA)
        );
        camera.lookAt(0, state.targetY, 0);
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
        RADIUS * Math.sin(PHI_3D) * Math.cos(THETA),
        RADIUS * Math.cos(PHI_3D),
        RADIUS * Math.sin(PHI_3D) * Math.sin(THETA),
      ]}
      zoom={baseZoom * 0.72}
      near={0.1}
      far={1000}
      onUpdate={(c) => c.lookAt(0, treeMidY, 0)}
    />
  );
}
