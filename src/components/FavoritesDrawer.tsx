import React from 'react';
import { X, Trash2, Clock, Tv, ExternalLink, BookmarkCheck } from 'lucide-react';
import { Program } from '../types/epg';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Program[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <BookmarkCheck className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm">気になる番組クリップ</h3>
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {favorites.length}件
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <BookmarkCheck className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-sm font-bold text-slate-600 mb-1">
                クリップされた番組はありません
              </p>
              <p className="text-xs text-slate-400">
                番組表ビューアで番組をクリックして「見たい番組に登録」を押すと、ここに一覧表示されます。
              </p>
            </div>
          ) : (
            favorites.map((p) => {
              const startHourStr = String(p.startHour >= 24 ? p.startHour - 24 : p.startHour).padStart(2, '0');
              const startMinStr = String(p.startMinute).padStart(2, '0');

              return (
                <div
                  key={p.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 relative group hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-mono font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {startHourStr}:{startMinStr} ({p.durationMinutes}分)
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(p.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="リストから削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug mb-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>すべて削除</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
