import React from 'react';
import { Share2, Download, Link2, Sparkles, X } from 'lucide-react';
import type { ThemeType } from '../../types';
import { THEME_CONFIGS } from '../../utils/themeConfig';

interface HeaderProps {
  text: string;
  onTextChange: (val: string) => void;
  theme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onOpenShare: () => void;
  onDownloadPNG: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  text,
  onTextChange,
  theme,
  onThemeChange,
  onOpenShare,
  onDownloadPNG,
}) => {
  const themeList = Object.entries(THEME_CONFIGS) as [ThemeType, (typeof THEME_CONFIGS)[ThemeType]][];

  return (
    <header className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between gap-4 pointer-events-none">
      {/* 1. Studio Brand Minimal Signature */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] px-3.5 py-2 rounded-xl shadow-2xl shadow-black/40">
          <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white/90 tracking-tight">Magic Tree</span>
            <span className="ml-1.5 font-mono text-[9px] text-white/40 uppercase tracking-wider">3D QR</span>
          </div>
        </div>
      </div>

      {/* 2. Unified Command Bar (Dynamic URL & Text Input) */}
      <div className="flex-1 max-w-md pointer-events-auto hidden sm:block">
        <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-1.5 shadow-2xl shadow-black/40 transition-all focus-within:border-white/20 focus-within:bg-slate-900/95">
          <Link2 className="w-3.5 h-3.5 text-white/40 shrink-0 mr-2" />
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="輸入網址或文字即刻生成..."
            className="w-full bg-transparent text-xs text-white/90 placeholder-white/30 outline-none font-medium"
          />
          {text && (
            <button
              onClick={() => onTextChange('')}
              className="p-1 text-white/30 hover:text-white/80 transition rounded-md"
              title="清除"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Aesthetic Actions & Theme Swatches */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Seasonal Theme Swatches Capsule */}
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] p-1 rounded-xl shadow-2xl shadow-black/40">
          {themeList.map(([key, config]) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                onClick={() => onThemeChange(key)}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-sm ring-1 ring-white/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
                title={config.name}
              >
                <span>{config.icon}</span>
                <span className="hidden lg:inline text-[11px]">{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Export & Share Minimalist Action Group */}
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xl border border-white/[0.08] p-1 rounded-xl shadow-2xl shadow-black/40">
          <button
            onClick={onDownloadPNG}
            className="p-2 text-white/60 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            title="下載寫真 (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/90 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] rounded-lg transition-all active:scale-95"
            title="分享此魔法樹"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">分享</span>
          </button>

          <a
            href="https://github.com/YuJunWang/Magic_QRcode"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white/40 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            title="GitHub Repository"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
