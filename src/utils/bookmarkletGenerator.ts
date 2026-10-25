import { GenreId } from '../types/epg';
import { GENRE_DEFINITIONS } from '../data/genres';

export interface UserColorConfig {
  colors: Record<GenreId, { bg: string; border: string; text: string }>;
  opacity: number; // 0.1 to 1.0
  borderWidth: number; // 2, 4, 6px
  showBadge: boolean;
  highlightKeyword?: string;
}

export function generateBookmarkletCode(config: UserColorConfig): string {
  const colorMapJson = JSON.stringify(config.colors);

  // Robust script specifically designed for bangumi.org DOM:
  // Targets #program_area, li[s], time[s], div.program_text, p.program_title, p.program_detail
  // Applies styles directly via setProperty(..., 'important') to bypass CSP and high-specificity stylesheets
  // Provides visual alert showing detection results
  const rawScript = `(function() {
  try {
    var colors = ${colorMapJson};
    var borderWidth = ${config.borderWidth};
    var showBadge = ${config.showBadge};

    var GENRE_PATTERNS = {
      anime: [/アニメ/i, /特撮/i, /声優/i, /プリキュア/i, /ガンダム/i, /鬼滅/i, /呪術/i, /ドラえもん/i, /名探偵コナン/i, /ポケモン/i, /ちびまる子/i, /サザエさん/i, /ワンピース/i, /ONE PIECE/i, /おはスタ/i, /フリーレン/i, /ダンダダン/i, /チェンソーマン/i, /BLEACH/i, /スパイファミリー/i, /ヒロアカ/i, /ブルーロック/i, /ハイキュー/i, /アンパンマン/i, /ウルトラマン/i, /仮面ライダー/i, /戦隊/i],
      sports: [/スポーツ/i, /プロ野球/i, /高校野球/i, /サッカー/i, /Jリーグ/i, /MLB/i, /大谷翔平/i, /ゴルフ/i, /大相撲/i, /競馬/i, /テニス/i, /バスケ/i, /Bリーグ/i, /バレー/i, /フィギュア/i, /格闘技/i, /ハイライト/i, /ナイター/i, /中継/i, /すぽると/i, /Going/i, /S☆1/i],
      music: [/音楽/i, /ミュージック/i, /ライブ/i, /コンサート/i, /Mステ/i, /うたコン/i, /カウントダウン/i, /ヒットチャート/i, /オーケストラ/i, /フェス/i, /クラシック/i, /J-POP/i, /歌謡曲/i, /演歌/i, /MelodiX/i, /MUSIC/i, /CDTV/i, /Venue101/i],
      drama: [/ドラマ/i, /連続テレビ小説/i, /朝ドラ/i, /大河/i, /サスペンス/i, /ミステリー/i, /時代劇/i, /木曜劇場/i, /日曜劇場/i, /月9/i, /相棒/i, /科捜研/i, /火曜ドラマ/i, /金曜ドラマ/i, /土曜ドラマ/i, /第[0-9]+話/],
      movie: [/映画/i, /シネマ/i, /劇場版/i, /金曜ロード/i, /土曜プレミアム/i, /午後のロードショー/i, /洋画/i, /邦画/i, /MOVIE/i, /CINEMA/i, /ロードショー/i],
      variety: [/バラエティ/i, /バラエティー/i, /お笑い/i, /クイズ/i, /トーク/i, /漫才/i, /コント/i, /モニタリング/i, /イッテQ/i, /アメトーーク/i, /水曜日のダウンタウン/i, /しゃべくり/i, /所さん/i, /ドッキリ/i, /プレバト/i, /マツコ/i],
      news: [/ニュース/i, /報道/i, /時事/i, /NEWS/i, /news/i, /報道ステーション/i, /Nスタ/i, /気象情報/i, /天気予報/i, /ウオッチ9/i, /WBS/i, /every/i, /zero/i],
      info: [/情報/i, /ワイドショー/i, /めざまし/i, /ZIP/i, /THE TIME/i, /DayDay/i, /ひるおび/i, /ゴゴスマ/i, /ミヤネ屋/i, /あさイチ/i, /モーニング/i, /ドデスカ/i, /ノンストップ/i],
      documentary: [/ドキュメンタリー/i, /NHKスペシャル/i, /プロフェッショナル/i, /情熱大陸/i, /ガイアの夜明け/i, /カンブリア宮殿/i, /72時間/i, /世界遺産/i],
      hobby: [/趣味/i, /教育/i, /きょうの料理/i, /ハンドメイド/i, /将棋/i, /囲碁/i, /語学/i, /英会話/i, /ピタゴラ/i, /Eテレ/i]
    };

    var GENRE_NAMES = {
      anime: 'アニメ',
      sports: 'スポーツ',
      music: '音楽',
      drama: 'ドラマ',
      movie: '映画',
      variety: 'バラエティ',
      news: 'ニュース',
      info: '情報',
      documentary: '教養・ドキュメント',
      hobby: '趣味・教育'
    };

    // Find all program text and containers on bangumi.org
    // Specific bangumi.org selectors: .program_text, .program_title, #program_area li, time[s], li[s]
    var elements = document.querySelectorAll(
      '.program_text, .program_title, #program_area li, time[s], li[s], [class*="program-box"], [class*="program"], div[class*="cell"]'
    );

    var count = 0;
    var countsByGenre = {};
    var processedSet = new Set();

    function matchGenre(str) {
      for (var gid in GENRE_PATTERNS) {
        var pats = GENRE_PATTERNS[gid];
        for (var i = 0; i < pats.length; i++) {
          if (pats[i].test(str)) {
            return gid;
          }
        }
      }
      return null;
    }

    elements.forEach(function(el) {
      // Find the card container
      var card = el.closest('li, time, [class*="program"], div[class*="cell"]') || el;
      if (processedSet.has(card)) return;

      var text = (card.innerText || card.textContent || '') + ' ' + (card.className || '') + ' ' + (card.getAttribute('data-genre') || '');
      var links = card.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        text += ' ' + (links[i].getAttribute('href') || '') + ' ' + (links[i].title || '');
      }

      var gid = matchGenre(text);
      if (gid) {
        processedSet.add(card);
        var col = colors[gid] || colors.other;
        count++;
        countsByGenre[gid] = (countsByGenre[gid] || 0) + 1;

        // Apply styles directly with !important to defeat site CSS
        card.style.setProperty('background-color', col.bg, 'important');
        card.style.setProperty('border-left', borderWidth + 'px solid ' + col.border, 'important');
        card.setAttribute('data-bgm-genre', gid);

        // Also color inner program_text if present
        var innerTextEl = card.querySelector('.program_text, [class*="program_text"]');
        if (innerTextEl) {
          innerTextEl.style.setProperty('background-color', col.bg, 'important');
        }

        // Add badge to title
        var titleEl = card.querySelector('.program_title, [class*="program_title"], h3, h4, strong') || card.querySelector('p, a');
        if (showBadge && titleEl && !card.querySelector('.bgm-tag')) {
          var tag = document.createElement('span');
          tag.className = 'bgm-tag';
          tag.style.cssText = 'background-color:' + col.border + ' !important; color:#ffffff !important; font-size:10px !important; font-weight:bold !important; padding:1px 5px !important; border-radius:3px !important; margin-right:4px !important; display:inline-block !important; line-height:1.2 !important; vertical-align:middle !important;';
          tag.textContent = '[' + (GENRE_NAMES[gid] || gid) + ']';
          titleEl.insertBefore(tag, titleEl.firstChild);
        }
      }
    });

    // Remove old controller if present
    var old = document.getElementById('bgm-color-toast');
    if (old) old.remove();

    // Floating Result Bar on bangumi.org
    var toast = document.createElement('div');
    toast.id = 'bgm-color-toast';
    toast.style.cssText = 'position:fixed;top:15px;right:15px;z-index:9999999;background:#0f172a;color:#f8fafc;padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.4);border:2px solid #ea580c;font-family:sans-serif;font-size:13px;max-width:360px;';
    
    if (count > 0) {
      toast.innerHTML = '<div style="font-weight:bold;color:#fb923c;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;">' +
        '<span>🎨 番組表の色分けを適用しました！</span>' +
        '<span style="cursor:pointer;color:#94a3b8;font-size:16px;" onclick="this.parentElement.parentElement.remove()">×</span>' +
        '</div>' +
        '<div style="font-size:12px;color:#cbd5e1;line-height:1.4;">' +
        '合計 <b>' + count + '番組</b> を検出・彩色しました<br>' +
        '<span style="font-size:11px;color:#94a3b8;">(アニメ: ' + (countsByGenre.anime || 0) + '件 / 音楽: ' + (countsByGenre.music || 0) + '件 / スポ: ' + (countsByGenre.sports || 0) + '件 / ドラマ: ' + (countsByGenre.drama || 0) + '件)</span>' +
        '</div>';
    } else {
      toast.style.borderColor = '#eab308';
      toast.innerHTML = '<div style="font-weight:bold;color:#facc15;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;">' +
        '<span>⚠️ 番組要素が見つかりませんでした</span>' +
        '<span style="cursor:pointer;color:#94a3b8;font-size:16px;" onclick="this.parentElement.parentElement.remove()">×</span>' +
        '</div>' +
        '<div style="font-size:11px;color:#cbd5e1;">bangumi.org の番組表ページ（/epg/td）が開かれているかご確認ください。</div>';
    }
    document.body.appendChild(toast);
    setTimeout(function() { if (toast.parentElement) toast.remove(); }, 8000);

    // Alert backup to ensure user gets immediate confirmation
    alert('【番組表 色分け結果】\\n合計 ' + count + ' 件の番組を色分けしました！\\n・アニメ: ' + (countsByGenre.anime || 0) + '件\\n・音楽: ' + (countsByGenre.music || 0) + '件\\n・スポーツ: ' + (countsByGenre.sports || 0) + '件\\n・ドラマ: ' + (countsByGenre.drama || 0) + '件');
  } catch (err) {
    alert('色分けスクリプトの実行中にエラーが発生しました: ' + err.message);
  }
})();`;

  // Encode safely for javascript: URI
  const minified = rawScript
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  return 'javascript:' + encodeURIComponent(minified);
}

export function generateTampermonkeyScript(config: UserColorConfig): string {
  const colorMapJson = JSON.stringify(config.colors);

  return `// ==UserScript==
// @name         bangumi.org 番組表ジャンル別カラーリング (アニメ・音楽・スポーツ色分け)
// @namespace    https://bangumi.org/
// @version      2.0
// @description  bangumi.org (番組表.Gガイド) の番組表を旧Gガイドのようにアニメ・音楽・スポーツ等ジャンル別に完全自動色分け表示します
// @author       EPG Colorizer
// @match        https://bangumi.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const colors = ${colorMapJson};
    const borderWidth = ${config.borderWidth};
    const showBadge = ${config.showBadge};

    const GENRE_PATTERNS = {
      anime: [/アニメ/i, /特撮/i, /声優/i, /プリキュア/i, /ガンダム/i, /鬼滅/i, /呪術/i, /ドラえもん/i, /名探偵コナン/i, /ポケモン/i, /ちびまる子/i, /サザエさん/i, /ワンピース/i, /ONE PIECE/i, /おはスタ/i, /フリーレン/i, /ダンダダン/i, /チェンソーマン/i, /BLEACH/i, /スパイファミリー/i, /ヒロアカ/i, /ブルーロック/i, /ハイキュー/i, /アンパンマン/i, /ウルトラマン/i, /仮面ライダー/i, /戦隊/i],
      sports: [/スポーツ/i, /プロ野球/i, /高校野球/i, /サッカー/i, /Jリーグ/i, /MLB/i, /大谷翔平/i, /ゴルフ/i, /大相撲/i, /競馬/i, /テニス/i, /バスケ/i, /Bリーグ/i, /バレー/i, /フィギュア/i, /格闘技/i, /ハイライト/i, /ナイター/i, /中継/i, /すぽると/i, /Going/i, /S☆1/i],
      music: [/音楽/i, /ミュージック/i, /ライブ/i, /コンサート/i, /Mステ/i, /うたコン/i, /カウントダウン/i, /ヒットチャート/i, /オーケストラ/i, /フェス/i, /クラシック/i, /J-POP/i, /歌謡曲/i, /演歌/i, /MelodiX/i, /MUSIC/i, /CDTV/i, /Venue101/i],
      drama: [/ドラマ/i, /連続テレビ小説/i, /朝ドラ/i, /大河/i, /サスペンス/i, /ミステリー/i, /時代劇/i, /木曜劇場/i, /日曜劇場/i, /月9/i, /相棒/i, /科捜研/i, /火曜ドラマ/i, /金曜ドラマ/i, /土曜ドラマ/i, /第[0-9]+話/],
      movie: [/映画/i, /シネマ/i, /劇場版/i, /金曜ロード/i, /土曜プレミアム/i, /午後のロードショー/i, /洋画/i, /邦画/i, /MOVIE/i, /CINEMA/i, /ロードショー/i],
      variety: [/バラエティ/i, /バラエティー/i, /お笑い/i, /クイズ/i, /トーク/i, /漫才/i, /コント/i, /モニタリング/i, /イッテQ/i, /アメトーーク/i, /水曜日のダウンタウン/i, /しゃべくり/i, /所さん/i, /ドッキリ/i, /プレバト/i, /マツコ/i],
      news: [/ニュース/i, /報道/i, /時事/i, /NEWS/i, /news/i, /報道ステーション/i, /Nスタ/i, /気象情報/i, /天気予報/i, /ウオッチ9/i, /WBS/i, /every/i, /zero/i],
      info: [/情報/i, /ワイドショー/i, /めざまし/i, /ZIP/i, /THE TIME/i, /DayDay/i, /ひるおび/i, /ゴゴスマ/i, /ミヤネ屋/i, /あさイチ/i, /モーニング/i, /ドデスカ/i, /ノンストップ/i],
      documentary: [/ドキュメンタリー/i, /NHKスペシャル/i, /プロフェッショナル/i, /情熱大陸/i, /ガイアの夜明け/i, /カンブリア宮殿/i, /72時間/i, /世界遺産/i],
      hobby: [/趣味/i, /教育/i, /きょうの料理/i, /ハンドメイド/i, /将棋/i, /囲碁/i, /語学/i, /英会話/i, /ピタゴラ/i, /Eテレ/i]
    };

    const GENRE_NAMES = {
      anime: 'アニメ',
      sports: 'スポーツ',
      music: '音楽',
      drama: 'ドラマ',
      movie: '映画',
      variety: 'バラエティ',
      news: 'ニュース',
      info: '情報',
      documentary: '教養',
      hobby: '趣味'
    };

    function matchGenre(str) {
      for (const [gid, pats] of Object.entries(GENRE_PATTERNS)) {
        if (pats.some(p => p.test(str))) return gid;
      }
      return null;
    }

    function applyBangumiColors() {
      const elements = document.querySelectorAll(
        '.program_text, .program_title, #program_area li, time[s], li[s], [class*="program-box"], [class*="program"]'
      );

      elements.forEach(el => {
        const card = el.closest('li, time, [class*="program"]') || el;
        if (card.getAttribute('data-bgm-applied') === 'true') return;

        let text = (card.innerText || card.textContent || '') + ' ' + (card.className || '');
        const links = card.querySelectorAll('a');
        links.forEach(l => { text += ' ' + (l.getAttribute('href') || '') + ' ' + (l.title || ''); });

        const gid = matchGenre(text);
        if (gid) {
          card.setAttribute('data-bgm-applied', 'true');
          card.setAttribute('data-bgm-genre', gid);
          const col = colors[gid] || colors.other;

          card.style.setProperty('background-color', col.bg, 'important');
          card.style.setProperty('border-left', borderWidth + 'px solid ' + col.border, 'important');

          const innerTextEl = card.querySelector('.program_text, [class*="program_text"]');
          if (innerTextEl) {
            innerTextEl.style.setProperty('background-color', col.bg, 'important');
          }

          const titleEl = card.querySelector('.program_title, [class*="program_title"], h3, h4, strong') || card.querySelector('p, a');
          if (showBadge && titleEl && !card.querySelector('.bgm-tag')) {
            const tag = document.createElement('span');
            tag.className = 'bgm-tag';
            tag.style.cssText = \`background-color: \${col.border} !important; color: #ffffff !important; font-size: 10px !important; font-weight: bold !important; padding: 1px 5px !important; border-radius: 3px !important; margin-right: 4px !important; display: inline-block !important; line-height: 1.2 !important;\`;
            tag.textContent = '[' + (GENRE_NAMES[gid] || gid) + ']';
            titleEl.insertBefore(tag, titleEl.firstChild);
          }
        }
      });
    }

    // 初回実行
    setTimeout(applyBangumiColors, 500);

    // 画面遷移や日付変更の検知
    const observer = new MutationObserver(() => {
      applyBangumiColors();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();`;
}

export function generateStylusCss(config: UserColorConfig): string {
  const rules = Object.entries(config.colors)
    .map(([genre, col]) => {
      const label = GENRE_DEFINITIONS.find((g) => g.id === genre)?.shortName || genre;
      return `  /* === ${label} (${genre}) === */
  [data-bgm-genre="${genre}"],
  [class*="program"][class*="${genre}"],
  [data-genre*="${genre}"],
  a[href*="genre=${encodeURIComponent(label)}"],
  a[href*="genre=${genre}"] {
    background-color: ${col.bg} !important;
    border-left: ${config.borderWidth}px solid ${col.border} !important;
  }`;
    })
    .join('\n\n');

  return `/* ==UserStyle==
@name         bangumi.org (G-Guide) 番組表 ジャンル別色分けカスタム
@namespace    bangumi-epg-colorizer
@version      2.0.0
@description  bangumi.orgの番組表をアニメ、スポーツ、ドラマ、音楽などジャンル別にカラーリングします
@author       EPG Colorizer
==/UserStyle== */

@-moz-document domain("bangumi.org") {
${rules}

  #program_area .program_text {
    transition: background-color 0.15s ease;
  }
}`;
}
