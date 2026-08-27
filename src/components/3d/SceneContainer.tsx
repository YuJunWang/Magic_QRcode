import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { QRMatrixData, AppSettings } from '../../types';
import { getThemeConfig } from '../../utils/themeConfig';
import { OrthoCamera } from './OrthoCamera';
import { VoxelSystem } from './VoxelSystem';
import { TreeParticles } from './TreeParticles';

export interface SceneHandle {
  captureScreenshot: () => string | null;
}

interface SceneContainerProps {
  qrData: QRMatrixData;
  settings: AppSettings;
  onToggleMode?: () => void;
}

function SceneContent({
  qrData,
  settings,
  colors,
  onToggleMode,
}: {
  qrData: QRMatrixData;
  settings: AppSettings;
  colors: any;
  onToggleMode?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isScanMode = settings.cameraMode === 'scan';

  // Smoothly reset group rotation to 0 when entering scan mode
  useEffect(() => {
    if (!groupRef.current) return;
    if (isScanMode) {
      // Find closest 0 rotation
      const currentY = groupRef.current.rotation.y;
      const targetY = Math.round(currentY / (Math.PI * 2)) * (Math.PI * 2);
      gsap.to(groupRef.current.rotation, {
        y: targetY,
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }
  }, [isScanMode]);

  // Slow auto-rotation in 3D mode
  useFrame((_, delta) => {
    if (groupRef.current && settings.autoRotate && !isScanMode) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} onClick={onToggleMode}>
      <VoxelSystem 
        qrData={qrData} 
        viewMode={isScanMode ? '2d' : '3d'} 
        themeColors={colors}
        elevation={settings.elevation}
      />

      {/* Floating / Falling Seasonal Petals */}
      <TreeParticles
        enabled={settings.particlesEnabled}
        color={colors.foliagePrimary || '#ff758c'}
        count={120}
        bounds={qrData.size * 0.9}
        height={Math.max(25, qrData.size * 0.75)}
        viewMode={isScanMode ? '2d' : '3d'}
      />
    </group>
  );
}

export const SceneContainer = forwardRef<SceneHandle, SceneContainerProps>(
  function SceneContainer({ qrData, settings, onToggleMode }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const colors = getThemeConfig(settings.theme);
    const isScanMode = settings.cameraMode === 'scan';

    // Expose captureScreenshot function via ref
    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (!canvasRef.current) return null;
        return canvasRef.current.toDataURL('image/png');
      },
    }));

    return (
      <div
        className="relative w-full h-full select-none cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: colors.background }}
      >
        <Canvas
          ref={canvasRef}
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={[colors.background]} />
          
          {/* OrthoCamera handles smooth 2D/3D camera transitions */}
          <OrthoCamera 
            viewMode={settings.cameraMode === 'scan' ? '2d' : '3d'} 
            gridSize={qrData.size} 
          />

          {/* Dynamic Lighting Rig */}
          <ambientLight
            color={isScanMode ? '#ffffff' : colors.ambientLightColor}
            intensity={isScanMode ? 2.5 : 0.85}
          />

          {/* Main Key Sun Light */}
          <directionalLight
            position={isScanMode ? [0, 80, 0] : [24, 38, 20]}
            color={isScanMode ? '#ffffff' : colors.directionalLightColor}
            intensity={isScanMode ? 1.5 : 1.8}
            castShadow={!isScanMode}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-28}
            shadow-camera-right={28}
            shadow-camera-top={28}
            shadow-camera-bottom={-28}
            shadow-bias={-0.0001}
          />

          {/* Fill Light for 3D depth */}
          {!isScanMode && (
            <>
              <directionalLight
                position={[-18, 16, -18]}
                color={colors.accentColor}
                intensity={0.6}
              />
              <pointLight
                position={[0, 8, 0]}
                color={colors.foliagePrimary}
                intensity={0.5}
                distance={30}
              />
            </>
          )}

          {/* Scene Content with Auto-Rotate and Falling Petals */}
          <SceneContent
            qrData={qrData}
            settings={settings}
            colors={colors}
            onToggleMode={onToggleMode}
          />
        </Canvas>
      </div>
    );
  }
);
