import React from 'react';
import { Tv, Sparkles, Palette, HelpCircle, Bookmark, Share2 } from 'lucide-react';

export type ActiveTab = 'epg' | 'tools' | 'customizer' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  onOpenFavorites,
  onOpenShareModal,
}) => {
  return (
    <header className="bg-slate-950/95 backdrop-blur-xs text-slate-300 border-b border-slate-800/80 sticky top-0 z-40 select-none shrink-0">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4">
        {/* Desktop / Tablet: Single sleek, low-profile 40px bar */}
        {/* Mobile: Two compact rows (32px + 26px) that never clutter the screen */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 sm:py-0 sm:h-10 gap-1 sm:gap-2">
          {/* Left: Subtle Brand & Region */}
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-5.5 h-5.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Tv className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <h1 className="font-semibold text-xs sm:text-sm text-slate-200 tracking-tight whitespace-nowrap">
                カラー番組表
              </h1>
              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-normal shrink-0">
                東海・中京(73)
              </span>
            </div>

            {/* Mobile Only: Right Actions positioned on top row to conserve vertical space */}
            <div className="flex items-center space-x-1 sm:hidden">
              <button
                onClick={onOpenShareModal}
                className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] h-6.5 px-2 rounded transition-colors whitespace-nowrap"
                title="この番組表を単独でいつでも開くURL"
              >
                <Share2 className="w-3 h-3 text-slate-400" />
                <span>開く</span>
              </button>

              <button
                onClick={onOpenFavorites}
                className="relative p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors h-6.5 w-6.5 flex items-center justify-center"
                title="気になる番組クリップ"
              >
                <Bookmark className="w-3.5 h-3.5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center Navigation Tabs (Discreet, low-contrast, compact pills) */}
          <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5 sm:py-0">
            <button
              onClick={() => onTabChange('epg')}
              className={`flex items-center space-x-1 px-2.5 h-6.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'epg'
                  ? 'bg-slate-800 text-white font-medium border border-slate-700/70 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-normal'
              }`}
            >
              <Tv className="w-3 h-3 opacity-70" />
              <span>番組表</span>
            </button>

            <button
              onClick={() => onTabChange('customizer')}
              className={`flex items-center space-x-1 px-2.5 h-6.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'customizer'
                  ? 'bg-slate-800 text-white font-medium border border-slate-700/70 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-normal'
              }`}
              title="ジャンル別の背景色や枠線の設定"
            >
              <Palette className="w-3 h-3 opacity-70" />
              <span>配色設定</span>
            </button>

            <button
              onClick={() => onTabChange('tools')}
              className={`flex items-center space-x-1 px-2.5 h-6.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tools'
                  ? 'bg-slate-800 text-white font-medium border border-slate-700/70 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-normal'
              }`}
              title="bangumi.orgの公式ページを色分けするブックマークレット"
            >
              <Sparkles className="w-3 h-3 opacity-70" />
              <span>彩色ツール</span>
            </button>

            <button
              onClick={() => onTabChange('guide')}
              className={`flex items-center space-x-1 px-2.5 h-6.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'guide'
                  ? 'bg-slate-800 text-white font-medium border border-slate-700/70 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-normal'
              }`}
              title="ブックマーク登録やスマホでの使い方の解説"
            >
              <HelpCircle className="w-3 h-3 opacity-70" />
              <span>使い方</span>
            </button>
          </nav>

          {/* Desktop Right Actions: Quiet, discreet buttons */}
          <div className="hidden sm:flex items-center space-x-1.5 shrink-0">
            <button
              onClick={onOpenShareModal}
              className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800/90 hover:border-slate-700 text-xs h-7 px-2 rounded transition-colors whitespace-nowrap"
              title="この番組表を単独でいつでも開くURL"
            >
              <Share2 className="w-3 h-3 text-slate-400" />
              <span>いつでも開く</span>
            </button>

            <button
              onClick={onOpenFavorites}
              className="relative p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors h-7 w-7 flex items-center justify-center"
              title="気になる番組クリップ"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
