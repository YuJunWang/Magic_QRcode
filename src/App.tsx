import { useRef, useState, useCallback } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { useQRMatrix } from './hooks/useQRMatrix';
import { SceneContainer, type SceneHandle } from './components/3d/SceneContainer';
import { Header } from './components/ui/Header';
import { ViewSwitch } from './components/ui/ViewSwitch';
import { ShareModal } from './components/ui/ShareModal';
import type { ThemeType } from './types';

export function App() {
  const { settings, updateSetting, getShareableUrl } = useUrlState();
  const qrData = useQRMatrix(settings.text);
  const sceneRef = useRef<SceneHandle>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleDownloadPNG = useCallback(() => {
    if (!sceneRef.current) return;
    const dataUrl = sceneRef.current.captureScreenshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `MagicTree_3D_${settings.theme}_${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  }, [settings.theme]);

  const handleThemeChange = useCallback(
    (theme: ThemeType) => {
      updateSetting('theme', theme);
    },
    [updateSetting]
  );

  const handleToggleMode = useCallback(() => {
    updateSetting('cameraMode', settings.cameraMode === 'orbit' ? 'scan' : 'orbit');
  }, [settings.cameraMode, updateSetting]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 font-sans text-slate-100 antialiased">
      {/* 1. Header Command Bar with Search, Theme Swatches & Actions */}
      <Header
        text={settings.text}
        onTextChange={(val) => updateSetting('text', val)}
        theme={settings.theme}
        onThemeChange={handleThemeChange}
        onOpenShare={() => setIsShareOpen(true)}
        onDownloadPNG={handleDownloadPNG}
      />

      {/* 2. Precision Floating Island Control Dock */}
      <ViewSwitch
        mode={settings.cameraMode}
        onModeChange={(mode) => updateSetting('cameraMode', mode)}
        autoRotate={settings.autoRotate}
        onToggleAutoRotate={() => updateSetting('autoRotate', !settings.autoRotate)}
        particlesEnabled={settings.particlesEnabled}
        onToggleParticles={() => updateSetting('particlesEnabled', !settings.particlesEnabled)}
        gridSize={qrData.size}
      />

      {/* 3. Main 3D Canvas Scene with tap-to-morph */}
      <SceneContainer
        ref={sceneRef}
        qrData={qrData}
        settings={settings}
        onToggleMode={handleToggleMode}
      />

      {/* 4. Share & Export Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={getShareableUrl()}
        onDownloadPNG={handleDownloadPNG}
      />
    </div>
  );
}

export default App;
