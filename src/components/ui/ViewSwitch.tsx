import React from 'react';
import { Eye, QrCode, ScanLine, Sparkles } from 'lucide-react';
import type { CameraMode } from '../../types';

interface ViewSwitchProps {
  mode: CameraMode;
  onModeChange: (mode: CameraMode) => void;
}

export const ViewSwitch: React.FC<ViewSwitchProps> = ({ mode, onModeChange }) => {
  const isScan = mode === 'scan';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
      {/* Floating Bottom Center Pill */}
      <div className="glass-pill p-1.5 rounded-full flex items-center gap-1.5 pointer-events-auto shadow-2xl border border-white/20">
        <button
          onClick={() => onModeChange('orbit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
            !isScan
              ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>3D 魔法樹欣賞</span>
        </button>

        <button
          onClick={() => onModeChange('scan')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
            isScan
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>俯視掃描 QR 碼</span>
        </button>
      </div>

      {/* Dynamic Interactive Hint */}
      {isScan ? (
        <div className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 text-[11px] text-emerald-300 border-emerald-500/30 animate-pulse shadow-lg">
          <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
          <span>已切換為頂部俯視角！請拿起手機相機對準螢幕直接掃描</span>
        </div>
      ) : (
        <div className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] text-pink-300 border-pink-500/30 shadow-lg">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>提示：點擊畫面中央的樹木亦可在 3D 樹景與俯視 QR 碼之間切換</span>
        </div>
      )}
    </div>
  );
};
