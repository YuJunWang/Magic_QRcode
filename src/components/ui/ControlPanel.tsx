import React, { useState } from 'react';
import {
  Link2,
  Sliders,
  Palette,
  RotateCw,
  Wind,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AppSettings, ZenSubTheme, CrystalSubTheme } from '../../types';
import { ZEN_THEMES, CRYSTAL_THEMES } from '../../utils/themeConfig';

interface ControlPanelProps {
  settings: AppSettings;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onUpdate }) => {
  const isScanMode = settings.cameraMode === 'scan';
  const [isExpanded, setIsExpanded] = useState(!isScanMode);

  const zenSubList = Object.entries(ZEN_THEMES) as [ZenSubTheme, (typeof ZEN_THEMES)[ZenSubTheme]][];
  const crystalSubList = Object.entries(CRYSTAL_THEMES) as [CrystalSubTheme, (typeof CRYSTAL_THEMES)[CrystalSubTheme]][];

  return (
    <div
      className={`absolute top-20 left-4 z-20 w-80 sm:w-88 max-h-[calc(100vh-6.5rem)] flex flex-col pointer-events-none transition-all duration-300 ${
        isScanMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="glass-panel rounded-2xl p-4 pointer-events-auto flex flex-col gap-4 overflow-y-auto max-h-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>參數與視覺設定</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 1. URL / Text Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>網址或文字內容</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">即時生成 3D</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.text}
              onChange={(e) => onUpdate('text', e.target.value)}
              placeholder="輸入 https://... 或任意文字"
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Expandable Options */}
        {isExpanded && (
          <div className="flex flex-col gap-4 pt-1">
            {/* 2. Sub-Theme Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  {settings.theme === 'zen' ? '枯山水色調 (Zen Palettes)' : '水晶寶石色調 (Gem Palettes)'}
                </span>
              </label>

              {settings.theme === 'zen' && (
                <div className="grid grid-cols-1 gap-1.5">
                  {zenSubList.map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => onUpdate('zenSubTheme', key)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition border text-left ${
                        settings.zenSubTheme === key
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="font-medium">{config.name}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: config.darkModulePrimary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: config.groundColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {settings.theme === 'crystal' && (
                <div className="grid grid-cols-1 gap-1.5">
                  {crystalSubList.map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => onUpdate('crystalSubTheme', key)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition border text-left ${
                        settings.crystalSubTheme === key
                          ? 'bg-purple-950/60 border-purple-500/50 text-white shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="font-medium">{config.name}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: config.darkModulePrimary }}
                        />
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: config.finderPatternColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. 3D Sliders */}
            <div className="flex flex-col gap-3 bg-slate-900/40 border border-slate-800/80 rounded-xl p-3">
              {/* Elevation */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium">3D 立體高度 (Elevation)</span>
                  <span className="text-slate-400 font-mono">{settings.elevation.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={settings.elevation}
                  onChange={(e) => onUpdate('elevation', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>

              {/* Block Density */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium">方塊飽滿度 (Density)</span>
                  <span className="text-slate-400 font-mono">{settings.blockDensity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.0"
                  step="0.05"
                  value={settings.blockDensity}
                  onChange={(e) => onUpdate('blockDensity', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* 4. Quick Toggles */}
            <div className="grid grid-cols-2 gap-2">
              {/* Auto Rotate */}
              <button
                onClick={() => onUpdate('autoRotate', !settings.autoRotate)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition border ${
                  settings.autoRotate
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>自動慢轉</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${settings.autoRotate ? 'bg-indigo-400' : 'bg-slate-600'}`} />
              </button>

              {/* Particles */}
              <button
                onClick={() => onUpdate('particlesEnabled', !settings.particlesEnabled)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition border ${
                  settings.particlesEnabled
                    ? 'bg-pink-950/60 border-pink-500/50 text-pink-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>環境落葉</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${settings.particlesEnabled ? 'bg-pink-400' : 'bg-slate-600'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
