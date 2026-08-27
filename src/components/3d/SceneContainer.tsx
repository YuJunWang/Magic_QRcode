import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { QRMatrixData, AppSettings } from '../../types';
import { getThemeConfig } from '../../utils/themeConfig';
import { OrthoCamera } from './OrthoCamera';
import { VoxelSystem } from './VoxelSystem';

export interface SceneHandle {
  captureScreenshot: () => string | null;
}

interface SceneContainerProps {
  qrData: QRMatrixData;
  settings: AppSettings;
  onToggleMode?: () => void;
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
          {/* 
            OrthoCamera manages the GSAP animation between 2D (top-down) and 3D (isometric)
          */}
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
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
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

          <group onClick={onToggleMode}>
            <VoxelSystem 
              qrData={qrData} 
              viewMode={settings.cameraMode === 'scan' ? '2d' : '3d'} 
              themeColors={colors}
              elevation={settings.elevation}
            />
          </group>
        </Canvas>
      </div>
    );
  }
);
