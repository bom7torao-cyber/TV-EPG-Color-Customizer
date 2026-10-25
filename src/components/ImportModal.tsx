import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { parseBangumiHtml } from '../utils/htmlParser';
import { Program, Channel } from '../types/epg';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onImportPrograms: (programs: Program[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  channels,
  onImportPrograms,
}) => {
  const [targetChannelId, setTargetChannelId] = useState<string>(channels[0]?.id || 'ch1');
  const [inputText, setInputText] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!inputText.trim()) return;
    const parsed = parseBangumiHtml(inputText, targetChannelId);
    setParsedCount(parsed.length);
    if (parsed.length > 0) {
      onImportPrograms(parsed);
      setTimeout(() => {
        onClose();
        setParsedCount(null);
        setInputText('');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base">bangumi.org データの取り込み</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
            <strong>使い方:</strong> bangumi.orgの番組表ページ（
            <a
              href="https://bangumi.org/epg/td?ggm_group_id=73"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-bold underline"
            >
              https://bangumi.org/epg/td?ggm_group_id=73
            </a>
            ）でページのソース（Ctrl+U）またはテキストをコピーし、下の枠に貼り付けると、自動で解析してこのカラー番組表に反映できます。
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              割り当て先のチャンネル:
            </label>
            <select
              value={targetChannelId}
              onChange={(e) => setTargetChannelId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500"
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.channelNumber}ch {ch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              HTMLコードまたは番組テキストを貼り付け:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="bangumi.orgのHTMLソースコード（#program_area周辺）や番組リストテキストをここに貼り付けてください..."
              rows={8}
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {parsedCount !== null && (
            <div
              className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
                parsedCount > 0
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {parsedCount > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{parsedCount} 件の番組を読み込みました！反映しています...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>番組を検出できませんでした。HTMLまたはテキスト形式をご確認ください。</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg"
          >
            キャンセル
          </button>
          <button
            onClick={handleParse}
            disabled={!inputText.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            解析してカラー番組表に反映する
          </button>
        </div>
      </div>
    </div>
  );
};
