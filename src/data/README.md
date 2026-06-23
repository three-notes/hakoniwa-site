# Site Data

GitHub Pages公開とGAS連携を見据えた、サイト用データ置き場。

## Daily Files

日次SNS下書きは、次の形式で保存する。

```text
src/data/daily/YYYYMMDD.json
```

例:

```text
src/data/daily/20260607.json
```

## 表示ルール

### X

- `x.hasPost: true` のとき、当日のXとして表示する。
- `x.hasPost: false` のとき、サイト表面では「今日はまだ何も書いてません。」を表示する。
- 現行JSONの `x.poster` / `x.text` は、Markdown内の複数X投稿から代表1件だけを保存する。複数投稿をサイト表面へ並べる場合は、別途 `xPosts[]` 形式へ拡張する。
- 過去のXは内部データとして残すが、サイト表面では履歴化しない。

### LINE

- `line.hasLine: true` の最新日を、最新LINEとして表示する。
- `line.mode` は `none` / `mini` / `full` のいずれか。
- `line.messages[].type: "message"` は通常発言。本文は `body`、末尾の補助表情は `reaction` に保存する。
- `reaction` は一般的な顔絵文字を1個だけ使用する。miniは会話全体で0～1個、fullは0～2個。
- 旧データ互換のため `"sticker"` 表示も維持するが、新規生成では使用しない。
- 当日にLINEがない場合は、直近のLINEを表示したままにする。
- 表示文は `最終更新 1日前` のようにする。
- 過去のLINEは内部データとして残すが、サイト表面では履歴化しない。

### note

- 週一の日記として履歴を残す。
- 日次ファイルの `noteMemo` は、週次note作成用の材料として使う。

### 短編

- 小説風の本編として履歴を残す。

## GASからGitHubへ送る場合

GASは、Google Driveへ下書きを保存したあと、同じ内容をこのJSON形式へ整形し、GitHub APIで該当ファイルを作成または更新する。

最初は日次JSONだけを送る。
サイト側のビルド処理で、当日のXと最新LINEを選ぶ。

## ローカル同期

公開前は、ローカル下書きMarkdownから日次JSONを作る。

```cmd
C:\work\chatgpt\hakoniwa_site\sync-daily-data.cmd
```

処理内容:

```text
C:\work\chatgpt\blog_ops_daily\202606\YYYYMMDD_sns_draft.md
↓
C:\work\chatgpt\hakoniwa_site\src\data\daily\YYYYMMDD.json
```

Codexサンドボックス内ではNodeのファイル書き込みが制限される場合がある。
その場合は通常のコマンドプロンプトから上記 `.cmd` を実行する。

## Google Drive同期

GASがGoogle Driveへサイト用JSONを保存した後は、Drive同期フォルダからサイトへコピーできる。

```cmd
C:\work\chatgpt\hakoniwa_site\sync-drive-site-data.cmd
```

既定では、次の候補を探す。

```text
G:\マイドライブ\chatgpt\blog_ops_daily\site_data\daily
G:\My Drive\chatgpt\blog_ops_daily\site_data\daily
G:\共有ドライブ\chatgpt\blog_ops_daily\site_data\daily
```

Driveの場所が違う場合は、同期元フォルダを引数で渡す。

```cmd
C:\work\chatgpt\hakoniwa_site\sync-drive-site-data.cmd "G:\マイドライブ\chatgpt\blog_ops_daily\site_data\daily"
```

処理内容:

```text
Google Drive側 site_data\daily\YYYYMMDD.json
↓
C:\work\chatgpt\hakoniwa_site\src\data\daily\YYYYMMDD.json
```
