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

  return (
    <group onClick={onTreeClick}>
      {/* 1. Base Planter Pot / Foundation */}
      <TreePot
        size={qrData.size}
        colors={colors}
        morphProgress={cameraMode === 'scan' ? 1 : 0}
      />

      {/* 2. 3D Tree Trunk & Branches */}
      {!isCrystal && (
        <TreeTrunk
          colors={colors}
          cameraMode={cameraMode}
        />
      )}

      {/* 3. Morphing Foliage / Crystal Canopy -> Flat QR Code */}
      <TreeFoliageMorph
        qrData={qrData}
        colors={colors}
        elevation={elevation}
        blockDensity={blockDensity}
        cameraMode={cameraMode}
        themeType={theme}
      />

      {/* 4. Ambient Falling Petals */}
      {particlesEnabled && cameraMode !== 'scan' && (
        <TreeParticles
          colors={colors}
          areaSize={qrData.size}
        />
      )}
    </group>
  );
}
