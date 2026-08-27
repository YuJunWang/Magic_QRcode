import React from 'react';
import { Box, QrCode, RotateCw, Wind, ScanLine } from 'lucide-react';
import type { CameraMode } from '../../types';

interface ViewSwitchProps {
  mode: CameraMode;
  onModeChange: (mode: CameraMode) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  particlesEnabled: boolean;
  onToggleParticles: () => void;
  gridSize?: number;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({
  mode,
  onModeChange,
  autoRotate,
  onToggleAutoRotate,
  particlesEnabled,
  onToggleParticles,
  gridSize = 29,
}) => {
  const isScan = mode === 'scan';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-3">
      {/* 1. Precision Floating Control Dock */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-2xl border border-white/[0.1] shadow-2xl shadow-black/60 pointer-events-auto">
        {/* Mode Segmented Toggle */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/[0.04]">
          <button
            onClick={() => onModeChange('orbit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
              !isScan
                ? 'bg-white text-slate-950 shadow-md shadow-white/10 scale-102'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D 景觀</span>
          </button>

          <button
            onClick={() => onModeChange('scan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
              isScan
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20 scale-102'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2D 掃描</span>
          </button>
        </div>

        <div className="w-[1px] h-5 bg-white/[0.1] mx-1" />

        {/* Ambient Controls (Auto-Rotate & Seasonal Petals) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              autoRotate && !isScan
                ? 'bg-white/[0.12] text-white ring-1 ring-white/20'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
            }`}
            title="自動慢轉"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate && !isScan ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            onClick={onToggleParticles}
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              particlesEnabled
                ? 'bg-white/[0.12] text-white ring-1 ring-white/20'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
            }`}
            title="飄落花瓣"
          >
            <Wind className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Monospace Metadata */}
        <div className="hidden md:flex items-center px-2 text-[10px] font-mono text-white/30 tracking-wider">
          {gridSize}×{gridSize}
        </div>
      </div>

      {/* 2. Contextual Notification Bar */}
      {isScan ? (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 text-[11px] font-medium shadow-xl animate-fade-in pointer-events-auto">
          <ScanLine className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>垂直正交俯視模式已啟動，拿起手機相機對準螢幕即可秒解碼</span>
        </div>
      ) : (
        <div className="text-[11px] text-white/40 font-medium tracking-wide pointer-events-none drop-shadow">
          點擊樹木可直接在 3D 與 2D 視角間切換
        </div>
      )}
    </div>
  );
};
