# Sakana EPG Color Customizer

> bangumi.org のテレビ番組表をカテゴリー別カラーで見やすくするユーザースクリプト

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-12.0-orange.svg)

## 概要

Sakana EPG Color Customizer は、[bangumi.org](https://bangumi.org) のテレビ番組表をカテゴリー別に色分けして表示する Tampermonkey / Greasemonkey ユーザースクリプトです。

12ジャンルの自動判定と色分け、ジャンル別フィルター、お気に入り機能により、見たい番組を一目で見つけられます。

## スクリーンショット

- 番組表の各セルをジャンル別の背景色で色分け
- 左ボーダーの色でジャンルを視覚的に識別
- 折りたたみ可能なコントロールパル

## 対応サイト

- `https://bangumi.org/epg/*`

## 機能

### 12ジャンルの自動色分け

| ジャンル | 色 | キーワード例 |
|---|---|---|
| アニメ | オレンジ | アニメ、特撮、プリキュア、ガンダム、鬼滅 |
| ドラマ | ピンク | ドラマ、大河、朝ドラ、サスペンス、時代劇 |
| スポーツ | 青 | スポーツ、野球、サッカー、ゴルフ、相撲、競馬 |
| 音楽 | 紫 | 音楽、ライブ、コンサート、Mステ、うたコン |
| 映画 | 黄 | 映画、シネマ、劇場版、ロードショー |
| バラエティ | 黄色 | バラエティ、お笑い、クイズ、漫才、コント |
| ニュース | グレー | ニュース、報道、天気、気象、時事 |
| 情報・ワイド | 緑 | 情報、ワイドショー、あさイチ、めざまし |
| ドキュメント | 青緑 | ドキュメンタリー、教養、NHKスペシャル |
| 趣味・教育 | 緑 | 趣味、教育、Eテレ、料理、将棋、囲碁 |
| 劇場・公演 | マゼンタ | 劇場、公演、歌舞伎、落語、宝塚 |
| その他 | 白 | 上記に当しない番組 |

### 主要機能

- **カテゴリー別表示/非表示**: パネルの色チップをクリックするだけでジャンルの表示を切り替え
- **お気に入り（★）**: 番組をクリックでお気に入り登録。「★のみ」ボタンでお気に入りだけ表示
- **折りたたみパネル**: パネルタイトルをクリックで最小化、🐟 ボタンで再表示
- **自動更新対応**: GitHub Gist と連携して、スクリプト更新を全ブラウザに自動反映
- **設定保存**: お気に入りや表示設定はブラウザの localStorage に保存

## インストール

### 方法1: Tampermonkey（推奨）

1. [Tampermonkey](https://www.tampermonkey.net/) をブラウザにインストール
2. [sakana_epg_wrapper_v12.js](./sakana_epg_wrapper_v12.js) を Tampermonkey に追加
3. bangumi.org の番組表ページを開くと自動実行

#### 自動更新（Gist連携）

複数ブラウザでスクリプトを自動同期する場合:

1. [sakana_epg_core_v12.js](./sakana_epg_core_v12.js) を GitHub Gist にアップロード
2. ラッパースクリトの `@require` URL を自分の Gist Raw URL に変更
3. Gist を更新 → ラッパーの `@version` を上げる → 全ブラウザに自動反映

詳細は [sakana_epg_v12_update_guide.html](./sakana_epg_v12_update_guide.html) を参照。

### 方法2: ブックマークレット（拡張機能非対応端末用）

Tampermonkey が使えないタブレット・スマホ向け。

1. [sakana_epg_bookmarklet.html](./sakana_epg_bookmarklet.html) をブラウザで開く
2. 「Sakana EPG」ボタンをブックマークバーに追加
3. bangumi.org の番組表を開いた状態でブックマークを実行

※ ページを開くたびに手動実行が必要

## 使い方

### 基本操作

| 操作 | 方法 |
|---|---|
| ジャンルの表示/非表示 | パネルの色チップをクリック |
| お気に入り登録 | 番組セルをクリック（★が付く） |
| お気に入りのみ表示 | 「★のみ」ボタンをクリック |
| パネルを閉じる | パネルタイトル（Sakana EPG v12）をクリック |
| パネルを開く | 右上の 🐟 ボタンをクリック |
| 全表示 | 全表示」ボタン |
| 全非表示 | 「全非表示」ボタン |
| 再スキャン | 「再スキャン」ボタン（番組表の動的読み込み後に使用） |

### 対応ブラウザ

| ブラウザ | Tampermonkey | ブックマークレット |
|---|---|---|
| PC Chrome | ✅ | ✅ |
| PC Brave | ✅ | ✅ |
| PC Firefox | ✅ | ✅ |
| Android Kiwi Browser | ✅ | ✅ |
| Android Chrome/Brave | ❌ | ✅ |
| iPad Safari | ❌ | ✅ |

## ファイル構成

```
.
├── sakana_epg_core_v12.js          # Gist アップロード用本体
├── sakana_epg_wrapper_v12.js        # Tampermonkey ラッパー
├── sakana_epg_wrapper_correct.js    # ラッパー（改行修正版）
├── sakana_epg_bookmarklet.html      # ブックマークレット用HTML
├── sakana_epg_v12_update_guide.html # アップデート手順書
└── README.md                         # このファイル
```

## 更新履歴

### v12.0
- エクスポート/インポート機能を削除（Gist自動更新に一本化）
- パネル折りたたみ機能追加
- チャンネル間縦線を細化

### v11.0
- 設定のエクスポート/インポート機能追加
- パネル折りたたみ機能追加

### v10.0
- チャンネル間縦線を1pxに細化

### v9.0
- パネル内チップの文字色を自動調整（背景に応じて黒/白）
- 番組表内のジャンルバッジを削除（左ボーダー色のみで識別）

### v8.0
- div/CSS Grid レイアウト対応（table td 以外の構造も検出）
- スマートセル検出アルゴリズム追加

### v7.0
- iframe/SPA 応
- セレクタ拡張

### v6.0
- CSS の !important 過多を修正
- エラーハンドリング強化

## トラブルシューティング

### パネルが表示されない

1. F12 → Console で `[Sakana EPG v12] Core loaded from Gist` が出ているか確認
2. 出ていない場合は Tampermonkey アイコンをクリックし、スクリプトが有効になっているか確認
3. bangumi.org の番組表ページを Ctrl+Shift+R でキャッシュクリアして再読み込み

### セル検出が0個と表示される

1. ページが完全に読み込まれてから「再スキャン」ボタンをクリック
2. それでも改善しない場合は、番組表のHTML構造が変更された可能性があります。Issue を作成してください。

### 自動更新が反映されない

1. ラッパースクリプトの `@version` が上がっているか確認
2. Gist の Raw URL にブラウザで直接アクセスし、最新内容が表示されるか確認
3. `@require` URL の末尾に `?v=12` のようなクエリを追加してキャッシュを回避

## 注意事項

- 本スクリプトは bangumi.org の非公式拡張です
- 番組のジャンル判定はタイトル・説明文のキーワードマッチングによるもので、完全な精度は保証されません
- お気に入りや表示設定はブラウザの localStorage に保存されるため、ブラウザを変更すると設定は引き継がれません

## License

MIT License

## Author

Sakana AI
