import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  Code,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  MousePointerClick,
  HelpCircle,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { UserColorConfig, generateBookmarkletCode, generateTampermonkeyScript, generateStylusCss } from '../utils/bookmarkletGenerator';
import { GENRE_DEFINITIONS } from '../data/genres';
import { GenreId } from '../types/epg';

interface BookmarkletGeneratorProps {
  colorConfig: UserColorConfig;
  onNavigateToCustomizer: () => void;
}

export const BookmarkletGenerator: React.FC<BookmarkletGeneratorProps> = ({
  colorConfig,
  onNavigateToCustomizer,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarklet' | 'tampermonkey' | 'stylus'>('bookmarklet');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [simulatedColored, setSimulatedColored] = useState<boolean>(false);

  const bookmarkletCode = generateBookmarkletCode(colorConfig);
  const tampermonkeyScript = generateTampermonkeyScript(colorConfig);
  const stylusCss = generateStylusCss(colorConfig);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Sample bangumi.org elements for the interactive simulator
  const sampleItems = [
    {
      id: 1,
      title: 'アニメ 葬送のフリーレン 第2期 第4話 [字][新]',
      desc: '勇者ヒンメルたちの旅立ちの足跡を辿る。北側諸国の交易都市で新たな魔法使いとの出会い。',
      channel: '中京テレビ (4ch)',
      time: '25:00 - 25:30',
      genre: 'anime',
    },
    {
      id: 2,
      title: 'プロ野球ナイター 巨人×中日ドラゴンズ 生中継 [デ]',
      desc: 'バンテリンドーム名古屋より生中継！エース投手の力投とクリーンナップの対決。',
      channel: '東海テレビ (1ch)',
      time: '19:00 - 20:54',
      genre: 'sports',
    },
    {
      id: 3,
      title: 'ミュージックステーション 2時間生放送SP [字][二]',
      desc: '豪華アーティスト集結！YOASOBI、Official髭男dism、最新ヒットチャート発表！',
      channel: 'メ～テレ (6ch)',
      time: '19:00 - 20:54',
      genre: 'music',
    },
    {
      id: 4,
      title: '金曜ドラマ 「海辺のレストラン」 第3話 [字]',
      desc: '港町で起きた不可解な事件。過去の記憶と交錯する人間ドラマ。',
      channel: 'CBCテレビ (5ch)',
      time: '22:00 - 22:54',
      genre: 'drama',
    },
    {
      id: 5,
      title: '金曜ロードショー 「トップガン マーヴェリック」 [映][字][二]',
      desc: 'トム・クルーズ主演！伝説のパイロットが挑む極限のスカイアクション。',
      channel: '中京テレビ (4ch)',
      time: '21:00 - 23:19',
      genre: 'movie',
    },
    {
      id: 6,
      title: 'NHKニュース7 今夜の動きをわかりやすく [字]',
      desc: 'きょうの出来事、国内外のニュースを映像と現地中継で詳しくお伝えします。',
      channel: 'NHK総合 名古屋 (3ch)',
      time: '19:00 - 19:30',
      genre: 'news',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Answer Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>bangumi.org 色分けの解決策</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            現在の bangumi.org でも、アニメ・音楽・スポーツをワンクリックで色分けできます！
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            「番組表.Gガイド (bangumi.org)」の近年のアップデートで背景の色分けが見づらくなりましたが、
            ブラウザの機能（<strong className="text-white">ブックマークレット</strong> または <strong className="text-white">ユーザースクリプト</strong>）
            を使えば、以前のようなカラフルで見やすい番組表がすぐに復活します。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://bangumi.org/epg/td?ggm_group_id=73"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              <span>対象サイト: bangumi.org (東海・中京73) を開く</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onNavigateToCustomizer}
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <span>🎨 配色・色合いを好みに調整する</span>
            </button>
          </div>
        </div>
      </div>

      {/* Method Selector Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('bookmarklet')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'bookmarklet'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4 text-orange-500" />
          <span>方法1: ブックマークレット (一番簡単・インストール不要)</span>
        </button>

        <button
          onClick={() => setActiveTab('tampermonkey')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'tampermonkey'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>方法2: Tampermonkey (常時自動で色分け)</span>
        </button>

        <button
          onClick={() => setActiveTab('stylus')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'stylus'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4 text-cyan-500" />
          <span>方法3: Stylus / Stylebot (CSS拡張)</span>
        </button>
      </div>

      {/* Tab 1: Bookmarklet (The primary recommendation) */}
      {activeTab === 'bookmarklet' && (
        <div className="space-y-6">
          {/* Bookmarklet Action Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              下のボタンをブラウザの「ブックマークバー」にドラッグしてください
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              ドラッグ＆ドロップするだけで準備完了です。スマートフォンやドラッグできない場合は「コードをコピー」して通常のブックマークのURL欄に貼り付けます。
            </p>

            {/* Draggable Button Box */}
            <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-orange-800 mb-3 flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-orange-600 animate-bounce" />
                ↓ このボタンをブラウザのブックマークバーに直接ドラッグ！
              </p>

              {/* The Real Draggable Bookmarklet Link */}
              <a
                href={bookmarkletCode}
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    '【登録方法】\nこのボタンをお使いのブラウザの上部「ブックマークバー」へドラッグ＆ドロップしてください。\n\nもしドラッグできない場合や押しても反応しない場合は、下の「コードをコピー」を押し、ブックマークの編集画面でURL欄に貼り付けてください。'
                  );
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base sm:text-lg px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-grab"
              >
                <Bookmark className="w-5 h-5 fill-current" />
                <span>📺 bangumi.org色分け</span>
              </a>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleCopy(bookmarkletCode, 'bookmarklet')}
                  className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
                >
                  {copiedType === 'bookmarklet' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">コードをコピーしました！</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>ブックマークレットコードをコピー</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopy(bookmarkletCode.replace(/^javascript:/, ''), 'console')}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
                >
                  {copiedType === 'console' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">コンソール用コードをコピー済！</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 text-slate-300" />
                      <span>F12 コンソール用コードをコピー (確実)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Troubleshooting alert box: Why it didn't change */}
            <div className="mt-6 bg-rose-50 border-2 border-rose-300 rounded-xl p-5 text-slate-800">
              <h4 className="font-bold text-rose-900 text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>「ブックマークを押しても何も変わらない」場合の確認ポイント</span>
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed mb-3">
                最新のGoogle ChromeやMicrosoft Edgeでは、セキュリティ仕様により<strong>ブックマーク登録時に先頭の「javascript:」が自動的に消去されたり、ドラッグが無効化されるケース</strong>があります。以下の3つをご確認ください。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-rose-200">
                  <strong className="text-slate-900 block mb-1">① ブックマークの「URL」を確認</strong>
                  <p className="text-slate-600 leading-relaxed">
                    登録したブックマークを右クリック →「編集」を開き、URL欄の先頭が <code className="bg-slate-100 text-rose-700 font-bold px-1 py-0.5 rounded">javascript:</code> で始まっているか確認してください。もし消えていたら貼り直して保存してください。
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-rose-200">
                  <strong className="text-slate-900 block mb-1">② 5秒でできる「F12コンソール実行」</strong>
                  <p className="text-slate-600 leading-relaxed">
                    bangumi.orgの画面でキーボードの <code className="bg-slate-100 font-bold px-1 rounded">F12</code>（または右クリック「検証」）を押し、上部タブの「Console」に上の黒ボタン「F12コンソール用コード」を貼り付けて Enter を押すと、100%確実に即座に色分けされます！
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-rose-200">
                  <strong className="text-slate-900 block mb-1">③ 毎回自動化するならTampermonkey</strong>
                  <p className="text-slate-600 leading-relaxed">
                    上のタブ「方法2: Tampermonkey」を使えば、ブックマークを押す必要すらなく、bangumi.orgを開いた瞬間に完全自動で色分けされます（ブラウザの制限も受けません）。
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Steps Illustrated */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mb-2">
                  Step 1
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">ブックマークに登録</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  上のオレンジのボタンをお使いのブラウザ（Chrome, Edge, Safari等）のブックマークバーへドラッグします。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mb-2">
                  Step 2
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">bangumi.org を開く</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  いつもの <a href="https://bangumi.org/epg/td?ggm_group_id=73" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-semibold underline">bangumi.org 番組表</a>（東海・中京73など）を開きます。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center mb-2">
                  Step 3
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">ブックマークをクリック！</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  登録した「📺 bangumi.org色分け」を押すだけ！一瞬で番組表がアニメ・スポーツ・音楽等に色分けされます。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tampermonkey Userscript */}
      {activeTab === 'tampermonkey' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Tampermonkey ユーザースクリプト (自動適用)
              </h3>
              <button
                onClick={() => handleCopy(tampermonkeyScript, 'tampermonkey')}
                className="inline-flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                {copiedType === 'tampermonkey' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>コピー完了！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>スクリプトをコピー</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              拡張機能「Tampermonkey」や「Violentmonkey」にこのコードを登録すると、bangumi.orgを開いた瞬間に自動で色分けが適用されます。ボタンを押す手間すら不要になります。
            </p>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                {tampermonkeyScript}
              </pre>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Tampermonkeyの導入手順:</strong> ブラウザの拡張機能ストアから「Tampermonkey」を無料追加 → ダッシュボードで「新規スクリプト作成」 → 上のコードを貼り付けて保存するだけです。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Stylus CSS */}
      {activeTab === 'stylus' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-600" />
                Stylus / Stylebot 用 カスタムCSS
              </h3>
              <button
                onClick={() => handleCopy(stylusCss, 'stylus')}
                className="inline-flex items-center space-x-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                {copiedType === 'stylus' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>CSSをコピーしました！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>CSSコードをコピー</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              拡張機能「Stylus」をお使いの場合は、ドメイン「bangumi.org」に対するユーザースタイルとして登録できます。
            </p>

            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
              {stylusCss}
            </pre>
          </div>
        </div>
      )}

      {/* Interactive Simulator: "Try it before you leave!" */}
      <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>リアルタイム体験シミュレーター</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              bangumi.org 上での色分け効果プレビュー
            </h3>
            <p className="text-xs text-slate-500">
              実際の bangumi.org (番組表.Gガイド) のカード構造を再現しています。ボタンを押してビフォー・アフターを確認できます。
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSimulatedColored(!simulatedColored)}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm ${
                simulatedColored
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {simulatedColored ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>元のモノトーンに戻す</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>スクリプトを実行して色分けする！</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Simulated bangumi.org Grid Cards */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-300">
          <div className="bg-white border border-slate-300 rounded-lg p-2.5 mb-3 flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              bangumi.org/epg/td?ggm_group_id=73 (東海・中京) の再現画面
            </span>
            <span className="text-[11px] text-slate-500">
              状態: {simulatedColored ? '🎨 色分けスクリプト適用中' : '⚪ 通常表示 (モノトーン)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleItems.map((item) => {
              const genreId = item.genre as GenreId;
              const col = colorConfig.colors[genreId] || colorConfig.colors.other;
              const gDef = GENRE_DEFINITIONS.find((g) => g.id === item.genre);

              return (
                <div
                  key={item.id}
                  style={
                    simulatedColored
                      ? {
                          backgroundColor: col.bg,
                          borderLeftWidth: `${colorConfig.borderWidth}px`,
                          borderLeftColor: col.border,
                          borderLeftStyle: 'solid',
                        }
                      : {
                          backgroundColor: '#ffffff',
                          borderLeftWidth: '1px',
                          borderLeftColor: '#e2e8f0',
                          borderLeftStyle: 'solid',
                        }
                  }
                  className="rounded-lg p-3.5 border border-slate-200 transition-all duration-300 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-mono font-bold text-slate-800">{item.time}</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                      {item.channel}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 mb-1.5">
                    {simulatedColored && colorConfig.showBadge && (
                      <span
                        style={{ backgroundColor: col.border }}
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-xs shrink-0"
                      >
                        {gDef?.shortName || item.genre}
                      </span>
                    )}
                    <h5
                      style={{ color: simulatedColored ? col.text : '#1e293b' }}
                      className="font-bold text-xs leading-snug"
                    >
                      {item.title}
                    </h5>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
