import React, { useState } from 'react';
import {
  X,
  Clock,
  Tv,
  Bookmark,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Users
} from 'lucide-react';
import { Program, Channel } from '../types/epg';
import { GENRE_DEFINITIONS } from '../data/genres';
import { UserColorConfig } from '../utils/bookmarkletGenerator';

interface ProgramDetailModalProps {
  program: Program | null;
  channel: Channel | null;
  isFavorite: boolean;
  onToggleFavorite: (program: Program) => void;
  onClose: () => void;
  colorConfig: UserColorConfig;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  channel,
  isFavorite,
  onToggleFavorite,
  onClose,
  colorConfig,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!program || !channel) return null;

  const gDef = GENRE_DEFINITIONS.find((g) => g.id === program.genre);
  const gColors = colorConfig.colors[program.genre] || colorConfig.colors.other;

  const startHourStr = String(
    program.startHour >= 24 ? program.startHour - 24 : program.startHour
  ).padStart(2, '0');
  const startMinStr = String(program.startMinute).padStart(2, '0');

  const endTotalMinutes =
    program.startHour * 60 + program.startMinute + program.durationMinutes;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMin = endTotalMinutes % 60;
  const endHourStr = String(endHour >= 24 ? endHour - 24 : endHour).padStart(2, '0');
  const endMinStr = String(endMin).padStart(2, '0');

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(program.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bangumiSearchUrl = `https://bangumi.org/epg/td?keyword=${encodeURIComponent(
    program.title.split(' ')[0]
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color accent header stripe */}
        <div
          style={{ backgroundColor: gColors.border }}
          className="h-2.5 w-full"
        />

        {/* Modal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              {/* Channel and Time */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1.5">
                <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-mono text-[11px]">
                  {channel.channelNumber}ch {channel.name}
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {startHourStr}:{startMinStr} ～ {endHourStr}:{endMinStr} ({program.durationMinutes}分)
                </span>
              </div>

              {/* Genre badge & tags */}
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mb-2">
                <span
                  style={{ backgroundColor: gColors.bg, color: gColors.text, borderColor: gColors.border }}
                  className="px-2 py-0.5 rounded text-xs font-bold border"
                >
                  {gDef?.name || program.genre}
                </span>

                {program.subGenre && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                    {program.subGenre}
                  </span>
                )}

                {program.flags?.map((f) => (
                  <span
                    key={f}
                    className="bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  >
                    [{f}]
                  </span>
                ))}
              </div>

              {/* Program Title */}
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {program.title}
              </h3>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-2 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              番組内容・解説
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          {/* Cast */}
          {program.cast && program.cast.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                主な出演者・キャスト
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {program.cast.map((c, i) => (
                  <span
                    key={i}
                    className="bg-white border border-slate-200 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Actions */}
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(program)}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'クリップ済み' : '見たい番組に登録'}</span>
            </button>

            <button
              onClick={handleCopyTitle}
              className="flex items-center space-x-1.5 text-xs text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">コピー済</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>番組名をコピー</span>
                </>
              )}
            </button>
          </div>

          <a
            href={bangumiSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-700 font-bold hover:underline"
          >
            <span>bangumi.orgで番組を検索</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
