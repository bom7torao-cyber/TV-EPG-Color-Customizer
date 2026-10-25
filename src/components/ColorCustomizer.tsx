import React from 'react';
import { Palette, RotateCcw, Check, Sparkles, Sliders, Eye } from 'lucide-react';
import { UserColorConfig } from '../utils/bookmarkletGenerator';
import { GENRE_DEFINITIONS, COLOR_SCHEMES } from '../data/genres';
import { GenreId } from '../types/epg';

interface ColorCustomizerProps {
  colorConfig: UserColorConfig;
  onUpdateConfig: (newConfig: UserColorConfig) => void;
  onResetToDefault: () => void;
  onNavigateToEpg: () => void;
}

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  colorConfig,
  onUpdateConfig,
  onResetToDefault,
  onNavigateToEpg,
}) => {
  const handleSelectScheme = (schemeId: string) => {
    const found = COLOR_SCHEMES.find((s) => s.id === schemeId);
    if (found) {
      onUpdateConfig({
        ...colorConfig,
        colors: { ...found.colors },
      });
    }
  };

  const handleColorChange = (genreId: GenreId, field: 'bg' | 'border' | 'text', val: string) => {
    onUpdateConfig({
      ...colorConfig,
      colors: {
        ...colorConfig.colors,
        [genreId]: {
          ...colorConfig.colors[genreId],
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-orange-500" />
            <span>番組表の配色・デザイン設定</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            アニメ、音楽、スポーツ、ドラマなど各ジャンルの背景色・境界線色をお好みに調整できます。
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onResetToDefault}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>初期配色に戻す</span>
          </button>
          <button
            onClick={onNavigateToEpg}
            className="flex items-center space-x-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>番組表で確認</span>
          </button>
        </div>
      </div>

      {/* Preset Schemes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>プリセット配色テーマから選ぶ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COLOR_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => handleSelectScheme(scheme.id)}
              className="border border-slate-200 hover:border-orange-400 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md bg-slate-50 hover:bg-orange-50/20 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-800 group-hover:text-orange-600">
                  {scheme.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5 line-clamp-2">
                {scheme.description}
              </p>

              {/* Swatches preview */}
              <div className="flex items-center gap-1">
                {(['anime', 'sports', 'music', 'drama', 'movie'] as GenreId[]).map((gid) => {
                  const c = scheme.colors[gid];
                  return (
                    <span
                      key={gid}
                      className="w-5 h-5 rounded-md border shadow-2xs"
                      style={{ backgroundColor: c.bg, borderColor: c.border }}
                      title={gid}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Style Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-slate-600" />
          <span>共通スタイル設定</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Border Width */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">左アクセント線の太さ</span>
              <span className="text-[11px] text-slate-500">番組カード左側のジャンル表示バー</span>
            </div>
            <div className="flex space-x-1">
              {[2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => onUpdateConfig({ ...colorConfig, borderWidth: w })}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    colorConfig.borderWidth === w
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white border text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          {/* Show Badge Toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">ジャンルタグの表示</span>
              <span className="text-[11px] text-slate-500">番組名の前に「[アニメ]」等のバッジを表示</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={colorConfig.showBadge}
                onChange={(e) => onUpdateConfig({ ...colorConfig, showBadge: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Individual Genre Palette Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
          <span>ジャンル別の詳細カラーピッカー</span>
          <span className="text-xs font-normal text-slate-500">カラーピッカーまたはカラーコード直接入力</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GENRE_DEFINITIONS.map((genre) => {
            const currentColors = colorConfig.colors[genre.id] || {
              bg: genre.defaultBg,
              border: genre.defaultBorder,
              text: genre.defaultText,
            };

            return (
              <div
                key={genre.id}
                className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                {/* Preview Badge */}
                <div className="flex items-center space-x-3 min-w-[130px]">
                  <div
                    style={{
                      backgroundColor: currentColors.bg,
                      borderLeftWidth: `${colorConfig.borderWidth}px`,
                      borderLeftColor: currentColors.border,
                      borderLeftStyle: 'solid',
                    }}
                    className="w-10 h-10 rounded-r flex items-center justify-center border border-slate-200 shadow-2xs"
                  >
                    <span
                      style={{ color: currentColors.text }}
                      className="text-[10px] font-bold"
                    >
                      EPG
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      {genre.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ID: {genre.id}
                    </span>
                  </div>
                </div>

                {/* Inputs for BG and Border */}
                <div className="flex items-center space-x-3">
                  {/* Background Color Picker */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 mb-1">背景色</span>
                    <div className="flex items-center space-x-1">
                      <input
                        type="color"
                        value={currentColors.bg}
                        onChange={(e) => handleColorChange(genre.id, 'bg', e.target.value)}
                        className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={currentColors.bg}
                        onChange={(e) => handleColorChange(genre.id, 'bg', e.target.value)}
                        className="w-16 text-[10px] font-mono border border-slate-300 rounded px-1 py-0.5 bg-white uppercase"
                      />
                    </div>
                  </div>

                  {/* Border Color Picker */}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-500 mb-1">枠・線色</span>
                    <div className="flex items-center space-x-1">
                      <input
                        type="color"
                        value={currentColors.border}
                        onChange={(e) => handleColorChange(genre.id, 'border', e.target.value)}
                        className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={currentColors.border}
                        onChange={(e) => handleColorChange(genre.id, 'border', e.target.value)}
                        className="w-16 text-[10px] font-mono border border-slate-300 rounded px-1 py-0.5 bg-white uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
