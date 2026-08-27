import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { QRMatrixData, AppSettings } from '../../types';
import { getThemeConfig } from '../../utils/themeConfig';
import { CameraController } from './CameraController';
import { MossGarden } from './ZenTheme/MossGarden';
import { CrystalGarden } from './CrystalTheme/CrystalGarden';

export interface SceneHandle {
  captureScreenshot: () => string | null;
}

interface SceneContainerProps {
  qrData: QRMatrixData;
  settings: AppSettings;
}

export const SceneContainer = forwardRef<SceneHandle, SceneContainerProps>(
  function SceneContainer({ qrData, settings }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const colors = getThemeConfig(
      settings.theme,
      settings.zenSubTheme,
      settings.crystalSubTheme
    );

    // Expose captureScreenshot function via ref
    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (!canvasRef.current) return null;
        return canvasRef.current.toDataURL('image/png');
      },
    }));

    const isScanMode = settings.cameraMode === 'scan';

    return (
      <div
        className="relative w-full h-full select-none"
        style={{ backgroundColor: colors.background }}
      >
        <Canvas
          ref={canvasRef}
          shadows
          gl={{
            preserveDrawingBuffer: true, // Enables canvas.toDataURL export
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: [0, 20, 24],
            fov: 45,
            near: 0.1,
            far: 150,
          }}
        >
          {/* Background color */}
          <color attach="background" args={[colors.background]} />

          {/* Camera Controller with smooth perspective / scan lerp */}
          <CameraController
            mode={settings.cameraMode}
            autoRotate={settings.autoRotate}
            qrSize={qrData.size}
          />

          {/* Lighting Rig */}
          <ambientLight
            color={colors.ambientLightColor}
            intensity={isScanMode ? 1.5 : 0.8}
          />

          {/* Main Key Sun Light with high-quality soft shadows */}
          <directionalLight
            position={isScanMode ? [0, 40, 0.01] : [15, 25, 15]}
            color={colors.directionalLightColor}
            intensity={isScanMode ? 2.8 : (settings.contrastBoost ? 2.5 : 1.8)}
            castShadow={!isScanMode}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-25}
            shadow-camera-right={25}
            shadow-camera-top={25}
            shadow-camera-bottom={-25}
            shadow-bias={-0.0002}
          />

          {/* Fill Light for subtle color tinting */}
          {!isScanMode && (
            <>
              <directionalLight
                position={[-15, 12, -15]}
                color={colors.accentColor}
                intensity={0.6}
              />
              <pointLight
                position={[0, 8, 0]}
                color={colors.darkModulePrimary}
                intensity={0.5}
                distance={30}
              />
            </>
          )}

          {/* 3D Gardens */}
          {settings.theme === 'zen' && (
            <MossGarden
              qrData={qrData}
              colors={colors}
              elevation={settings.elevation}
              blockDensity={settings.blockDensity}
              particlesEnabled={settings.particlesEnabled && !isScanMode}
            />
          )}

          {settings.theme === 'crystal' && (
            <CrystalGarden
              qrData={qrData}
              colors={colors}
              elevation={settings.elevation}
              blockDensity={settings.blockDensity}
              particlesEnabled={settings.particlesEnabled && !isScanMode}
            />
          )}
        </Canvas>
      </div>
    );
  }
);
