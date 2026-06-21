# 箱庭日常記録

沙耶・片代・瑠奈の母艦サイトMVP。

初期版は静的HTML/CSSで作成し、その後Astroへ移行した。
既存の `index.html` は初期MVPとして残し、Astro版は `src/pages/index.astro` で管理する。

## Files

- `index.html`: トップ、三人紹介、SNSログ、短編、AboutのMVP
- `src/pages/index.astro`: Astro版トップページ
- `styles.css`: サイト全体のスタイル
- `public/styles.css`: Astro版で配信するCSS
- `start-preview.ps1`: ローカルプレビュー用サーバ
- `start-preview.cmd`: Windows用の起動ラッパー
- `assets/group_cafe_06.png`: トップ画像
- `public/assets/group_cafe_06.png`: Astro版で配信するトップ画像
- `content/sns`: SNSログをサイト用に整理する置き場
- `content/stories`: 箱庭短編を置く予定地

## Astro Preview

初回または依存関係を更新したとき:

```cmd
C:\Program Files\nodejs\npm.cmd install
```

開発サーバ:

```cmd
C:\work\chatgpt\hakoniwa_site\start-astro-dev.cmd
```

ビルド:

```cmd
C:\work\chatgpt\hakoniwa_site\build-astro.cmd
```

PowerShellでは `npm` が実行ポリシーで止まる場合があるため、`npm.cmd` を使う。
Codex内ではPATHが古い場合があるため、上記の `.cmd` は Node.js と Git のインストール先を先頭に足してから実行する。

## Daily Data Sync

SNS下書きMarkdownからサイト用JSONを生成する。

```cmd
C:\work\chatgpt\hakoniwa_site\sync-daily-data.cmd
```

生成先:

```text
C:\work\chatgpt\hakoniwa_site\src\data\daily
```

公開後のGAS自動反映は `GAS_GITHUB_SYNC.md` を参照する。

## Static Preview

PowerShellまたはコマンドプロンプトで次を実行する。

```powershell
C:\work\chatgpt\hakoniwa_site\start-preview.ps1
```

または:

```cmd
C:\work\chatgpt\hakoniwa_site\start-preview.cmd
```

起動後、次を開く。

```text
http://127.0.0.1:4321/
```

ポートを変える場合:

```powershell
C:\work\chatgpt\hakoniwa_site\start-preview.ps1 4328
```

## Source Materials

- 正史基準: `C:\work\chatgpt\GPTS参照設定_v2`
- 初回SNS出力: `C:\work\chatgpt\blog_ops_daily\202606\20260605_sns_draft.md`
- 初期トップ画像: `C:\work\chatgpt\GPTS参照設定\参考画像\curated\group_cafe_06.png`

## Next

- Astro化する。
- SNSログをMarkdownまたはJSONで取り込む。
- 三人紹介を公開用ページとして分離する。
- noteとXの実リンクを追加する。
