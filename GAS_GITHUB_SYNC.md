# GASからの日次データ自動反映

## Flow

```text
GASで日次SNS下書きを生成
↓
Google DriveへMarkdownとJSONを保存
↓
GitHubへ src/data/daily/YYYYMMDD.json を保存
↓
GitHub ActionsがAstroをビルド
↓
docsを更新
↓
GitHub Pagesへ反映
```

JSON保存やGitHub同期に失敗しても、SNS下書き生成とDrive保存は止めない。

## GAS Script Properties

Apps Scriptの「プロジェクトの設定」→「スクリプト プロパティ」に追加する。

```text
GITHUB_SITE_SYNC_ENABLED=true
GITHUB_REPOSITORY=three-notes/hakoniwa-site
GITHUB_BRANCH=main
GITHUB_DAILY_DATA_PATH=src/data/daily
GITHUB_TOKEN=<fine-grained personal access token>
```

`GITHUB_TOKEN` はコード、Google Drive、GitHubリポジトリへ保存しない。

## Fine-grained Token Permissions

- Resource owner: Organizationを管理するGitHubアカウント
- Repository access: Only select repositories
- Selected repository: `three-notes/hakoniwa-site`
- Repository permissions:
  - Contents: Read and write
  - Metadata: Read-only

## Manual Test

GASエディタで次を一度実行する。

```text
syncTodaySiteDailyJsonToGitHubManual
```

当日のDrive JSONだけをGitHubへ送るため、OpenAI APIは呼ばない。

成功後は、通常の日次トリガー `generateDailyDraftScheduled` がJSON保存とGitHub反映を続ける。

## GitHub Build

`.github/workflows/rebuild-pages.yml` が日次JSONの変更を検知し、Astroをビルドして `docs` を更新する。

