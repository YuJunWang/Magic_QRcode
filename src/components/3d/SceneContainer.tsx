import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { QRMatrixData, AppSettings } from '../../types';
import { getThemeConfig } from '../../utils/themeConfig';
import { CameraController } from './CameraController';
import { MagicTreeScene } from './MagicTree/MagicTreeScene';

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
          camera={{
            position: [0, 22, 26],
            fov: 45,
            near: 0.1,
            far: 800,
          }}
        >
          <color attach="background" args={[colors.background]} />

          {/* Camera Controller with smooth perspective / scan lerp */}
          <CameraController
            mode={settings.cameraMode}
            autoRotate={settings.autoRotate}
            qrSize={qrData.size}
          />

          {/* Dynamic Lighting Rig */}
          <ambientLight
            color={colors.ambientLightColor}
            intensity={isScanMode ? 2.0 : 0.9}
          />

          {/* Main Key Sun Light */}
          <directionalLight
            position={isScanMode ? [0, 80, 0.001] : [18, 28, 16]}
            color={colors.directionalLightColor}
            intensity={isScanMode ? 2.8 : 2.0}
            castShadow={!isScanMode}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-28}
            shadow-camera-right={28}
            shadow-camera-top={28}
            shadow-camera-bottom={-28}
            shadow-bias={-0.0002}
          />

          {/* Fill Light */}
          {!isScanMode && (
            <>
              <directionalLight
                position={[-16, 15, -16]}
                color={colors.accentColor}
                intensity={0.7}
              />
              <pointLight
                position={[0, 10, 0]}
                color={colors.foliagePrimary}
                intensity={0.6}
                distance={35}
              />
            </>
          )}

          {/* 3D Volumetric Magic Tree Scene */}
          <MagicTreeScene
            qrData={qrData}
            colors={colors}
            elevation={settings.elevation}
            blockDensity={settings.blockDensity}
            cameraMode={settings.cameraMode}
            particlesEnabled={settings.particlesEnabled}
            theme={settings.theme}
            onTreeClick={onToggleMode}
          />
        </Canvas>
      </div>
    );
  }
);
