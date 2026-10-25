import React from 'react';
import {
  HelpCircle,
  Bookmark,
  Zap,
  Code,
  Laptop,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface UsageGuideProps {
  onNavigateToTools: () => void;
}

export const UsageGuide: React.FC<UsageGuideProps> = ({ onNavigateToTools }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          <span>bangumi.org 色分け復活ガイド</span>
        </h2>
        <p className="text-sm text-slate-600">
          「以前のタイプはアニメ・音楽・スポーツ等特定のカテゴリーに色分けすることができたけど、今はできなくなってしまった」というお悩みに対する詳しい解決策と導入手順です。
        </p>
      </div>

      {/* Why did it disappear? */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-base font-bold text-amber-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          なぜ色分けができなくなってしまったのか？
        </h3>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed mb-3">
          「番組表.Gガイド (bangumi.org)」や旧Yahoo!テレビでは、かつて各ジャンル（アニメは黄色・橙、スポーツは青、映画は緑、音楽は紫など）ごとにセル全体が色分けされる機能や切り替えボタンが備わっていました。
          しかし、近年のサイトリニューアルで<strong>「フラットでモノトーンな白背景基調のデザイン」</strong>へ全面刷新され、ユーザー側でジャンル別カラーをオン・オフする設定項目がなくなってしまいました。
        </p>
        <p className="text-xs sm:text-sm text-amber-900 font-semibold">
          💡 <strong>解決策：</strong> ブラウザの「ブックマークレット」または「ユーザースクリプト（Tampermonkey）」を使うことで、現在のbangumi.orgでも<strong>旧Gガイドのようなカラフルな色分け表示を瞬時に復活</strong>させることができます！
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          あなたに合った方法をお選びください
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: Bookmarklet */}
          <div className="border-2 border-orange-200 bg-orange-50/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-800 text-sm flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-orange-600" />
                  方法1: ブックマークレット
                </span>
                <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
                  いちばん簡単！
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                ブラウザの拡張機能などのインストールは一切不要！ボタンをブックマークバーに登録しておき、bangumi.orgを開いた時に1回クリックするだけで色分けされます。
              </p>
              <ul className="text-xs text-slate-700 space-y-1 mb-4">
                <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 拡張機能の追加が不要（会社や共用PCでもOK）
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> iPhoneやiPad、スマホブラウザでも利用可能
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  ⚠️ ページを開くたびに1クリック必要
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToTools}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors text-center"
            >
              ブックマークレットを入手する &rarr;
            </button>
          </div>

          {/* Method 2: Tampermonkey */}
          <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  方法2: Tampermonkey (スクリプト)
                </span>
                <span className="text-[10px] bg-slate-700 text-white font-bold px-2 py-0.5 rounded-full">
                  常時完全自動
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                無料の拡張機能「Tampermonkey」にスクリプトを入れておくことで、bangumi.orgを開くだけで<strong>毎回自動的に100%色分け</strong>されます。
              </p>
              <ul className="text-xs text-slate-700 space-y-1 mb-4">
                <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> クリック不要、開いた瞬間に自動色分け
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 日付の切り替えや局の切り替えにも自動追従
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  ⚠️ 初回のみ拡張機能の追加が必要
                </li>
              </ul>
            </div>
            <button
              onClick={onNavigateToTools}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-colors text-center"
            >
              Tampermonkeyコードを見る &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step PC instructions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-slate-700" />
          パソコン（Chrome / Edge / Safari / Firefox）での登録手順
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-bold text-sm text-slate-800">ブラウザのブックマークバーを表示する</h4>
              <p className="text-xs text-slate-600 mt-1">
                ブックマークバーが非表示の場合は、ショートカットキーを押して表示させてください：
                <br />
                <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">
                  Ctrl + Shift + B
                </code>（Windows） / <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">Command + Shift + B</code>（Mac）
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-bold text-sm text-slate-800">「📺 bangumi.org色分け」ボタンをバーへドラッグ</h4>
              <p className="text-xs text-slate-600 mt-1">
                当ツールの「bangumi.org彩色」タブにあるオレンジのボタンをつかんで、ブラウザ上部のブックマークバーへそのままドラッグ＆ドロップします。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-bold text-sm text-slate-800">bangumi.org を開いてクリック</h4>
              <p className="text-xs text-slate-600 mt-1">
                <a
                  href="https://bangumi.org/epg/td?ggm_group_id=73"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 underline font-semibold"
                >
                  https://bangumi.org/epg/td?ggm_group_id=73
                </a> を開き、ブックマークバーのボタンをクリックすると、番組表がカラフルに彩色されます！
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smartphone instructions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-slate-700" />
          スマートフォン（iPhone Safari / Android Chrome）での利用方法
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          スマホブラウザではドラッグ＆ドロップができないため、以下の手順で登録します：
        </p>
        <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-lg">
          <li>「bangumi.org彩色」タブで<strong>「ブックマークレットコードをコピー」</strong>ボタンを押します。</li>
          <li>このページをブラウザの通常のブックマークに保存します（名前は「番組表色分け」など）。</li>
          <li>保存したブックマークの「編集」を開き、<strong>URL（アドレス）欄を消して、コピーしたコードを貼り付け</strong>て保存します。</li>
          <li>bangumi.orgの番組表ページを開き、アドレスバーに「番組表色分け」と入力して出てくるブックマークを選択すると実行されます。</li>
        </ol>
      </div>
    </div>
  );
};
