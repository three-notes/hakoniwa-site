# GitHub Pages公開手順

## 1. ローカルビルド確認

通常のコマンドプロンプトで実行する。

```cmd
C:\work\chatgpt\hakoniwa_site\build-astro.cmd
```

`dist` フォルダが作られれば成功。

## 2. GitHubで空のリポジトリを作る

最初は公開リポジトリを推奨。

- Repository name: `hakoniwa-site` など
- README、.gitignore、Licenseは追加しない
- 独自ドメインは設定しない

## 3. サイトフォルダをGit管理する

```cmd
cd /d C:\work\chatgpt\hakoniwa_site
git init -b main
git add .
git commit -m "Initial site release"
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

## 4. GitHub Pagesを有効にする

GitHubリポジトリで次を開く。

```text
Settings
→ Pages
→ Build and deployment
→ Source: GitHub Actions
```

`.github/workflows/deploy-pages.yml` が自動でビルドと公開を行う。

## 5. 公開確認

Actionsの `Deploy Astro site to GitHub Pages` が緑になったら、Pages画面のURLを開く。

通常リポジトリの場合:

```text
https://ユーザー名.github.io/リポジトリ名/
```

`ユーザー名.github.io` リポジトリの場合:

```text
https://ユーザー名.github.io/
```

## 日次更新

公開後、ローカルでJSONを同期して更新する場合:

```cmd
C:\work\chatgpt\hakoniwa_site\sync-drive-site-data.cmd
cd /d C:\work\chatgpt\hakoniwa_site
git add src\data\daily
git commit -m "Update daily data"
git push
```

push後、GitHub Actionsが自動でサイトを再公開する。

## 現時点の範囲

- GitHubへのpushでサイトは自動公開される。
- Google Driveからローカルへの同期は `sync-drive-site-data.cmd` で行う。
- GASからGitHubへ直接JSONを送る完全自動化は、公開確認後に追加する。

