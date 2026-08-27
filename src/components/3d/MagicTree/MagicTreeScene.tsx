import type { QRMatrixData, ThemeColors, CameraMode, ThemeType } from '../../../types';
import { TreePot } from './TreePot';
import { TreeTrunk } from './TreeTrunk';
import { TreeFoliageMorph } from './TreeFoliageMorph';
import { TreeParticles } from './TreeParticles';

interface MagicTreeSceneProps {
  qrData: QRMatrixData;
  colors: ThemeColors;
  elevation: number;
  blockDensity: number;
  cameraMode: CameraMode;
  particlesEnabled: boolean;
  theme: ThemeType;
  onTreeClick?: () => void;
}

export function MagicTreeScene({
  qrData,
  colors,
  elevation,
  blockDensity,
  cameraMode,
  particlesEnabled,
  theme,
  onTreeClick,
}: MagicTreeSceneProps) {
  const isCrystal = theme === 'crystal';
  const isScan = cameraMode === 'scan';

  return (
    <group onClick={onTreeClick}>
      {/* 1. Base Planter Pot / Foundation */}
      <TreePot
        size={qrData.size}
        colors={colors}
      />

      {/* 2. 3D Tree Trunk & Branches (Shown in 3D Orbit mode) */}
      {!isCrystal && !isScan && (
        <TreeTrunk
          colors={colors}
        />
      )}

      {/* 3. Static 3D Canopy Foliage (Projects to 2D QR Code when viewed from top) */}
      <TreeFoliageMorph
        qrData={qrData}
        colors={colors}
        elevation={elevation}
        blockDensity={blockDensity}
        themeType={theme}
      />

      {/* 4. Ambient Falling Petals */}
      {particlesEnabled && !isScan && (
        <TreeParticles
          colors={colors}
          areaSize={qrData.size}
        />
      )}
    </group>
  );
}
