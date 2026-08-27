import React from 'react';
import { Sparkles, Share2, Download } from 'lucide-react';
import type { ThemeType } from '../../types';

interface HeaderProps {
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onOpenShare: () => void;
  onDownloadPNG: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenShare,
  onDownloadPNG,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Brand Title */}
      <div className="flex items-center gap-3 glass-pill px-4 py-2 pointer-events-auto shadow-xl">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
            Magic QR 3D
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">3D 互動式 QR Code 景觀產生器</p>
        </div>
      </div>

      {/* Main Theme Switcher */}
      <div className="glass-pill p-1 flex items-center gap-1 pointer-events-auto shadow-xl">
        <button
          onClick={() => onThemeChange('zen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            theme === 'zen'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <span>🪨</span>
          <span>枯山水苔玉</span>
        </button>
        <button
          onClick={() => onThemeChange('crystal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            theme === 'crystal'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-700/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <span>💎</span>
          <span>幾何水晶</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onDownloadPNG}
          className="flex items-center gap-1.5 glass-pill px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all shadow-lg active:scale-95"
          title="匯出高清 3D 圖片"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">下載寫真</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>分享此景觀</span>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="glass-pill p-2 rounded-full text-slate-400 hover:text-white transition-all shadow-lg hover:bg-slate-800/80"
          title="GitHub Repository"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>
    </header>
  );
};
