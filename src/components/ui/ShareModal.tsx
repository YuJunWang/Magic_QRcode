import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  onDownloadPNG: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  onDownloadPNG,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Trigger festive celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 relative border border-white/20 shadow-2xl flex flex-col gap-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              分享你的 3D QR 景觀
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </h3>
            <p className="text-xs text-slate-400">免資料庫！參數已完全封裝至網址中</p>
          </div>
        </div>

        {/* Share Link Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">專屬分享連結</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 active:scale-95'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製！' : '複製'}</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>朋友點開網址將立即重現你所配置的 3D 景觀</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>支援一鍵切換俯視掃描模式，手機秒識別</span>
          </div>
        </div>

        {/* Download Action */}
        <button
          onClick={() => {
            onDownloadPNG();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white py-3 rounded-2xl text-xs font-bold transition border border-white/10 shadow-lg active:scale-98"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>下載當前視角高畫質 PNG 圖檔</span>
        </button>
      </div>
    </div>
  );
};
