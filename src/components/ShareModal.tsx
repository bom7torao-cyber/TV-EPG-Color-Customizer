import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Smartphone, Monitor, Bookmark, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Dedicated app URL (pre/shared URL is persistent and accessible from any browser)
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('#')[0].split('?')[0]
      : 'https://ais-pre-2d62sg4rvmkghmf7p6judl-3564911409.asia-northeast1.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base">単独Webページとしていつでも開く方法</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed">
            <strong className="block text-emerald-800 text-sm mb-1">
              🎉 AI Studio を開く必要はありません！
            </strong>
            このカラー番組表は通常の独立したWebサイトとして一般公開されています。
            普段お使いのブラウザ（Chrome、Safari、Edgeなど）やスマートフォンから直接開くことができます。
          </div>

          {/* URL Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              この番組表の専用URL:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 select-all outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>コピー済！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>URLをコピー</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Access Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* PC */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
              <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-800 mb-1.5">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span>パソコン（PC）で使う</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                上のURLを開き、ブラウザで <kbd className="bg-white border px-1 rounded font-mono">Ctrl + D</kbd> を押して「ブックマーク（お気に入り）」に保存してください。次回から1クリックで番組表が開きます。
              </p>
            </div>

            {/* Smartphone */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-800 mb-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>スマホで使う（ホーム画面追加）</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  iPhone（Safari）またはAndroid（Chrome）で開き、メニューから<strong>「ホーム画面に追加」</strong>を選ぶと、専用アプリのように使えます。
                </p>
              </div>

              {/* QR Code */}
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">スマホのカメラで読取:</span>
                <img
                  src={qrUrl}
                  alt="QR Code"
                  className="w-14 h-14 rounded border border-slate-300 bg-white p-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white text-xs font-bold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
