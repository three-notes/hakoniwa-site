# GitHub Pages公開手順

## 1. GitHub Pages用ビルド

通常のコマンドプロンプトで実行する。

```cmd
C:\work\chatgpt\hakoniwa_site\build-pages.cmd
```

`docs` フォルダが作られれば成功。

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
→ Source: Deploy from a branch
→ Branch: main
→ Folder: /docs
```

`main` ブランチの `docs` フォルダが公開される。

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
C:\work\chatgpt\hakoniwa_site\build-pages.cmd
git add src\data\daily docs
git commit -m "Update daily data"
git push
```

push後、GitHub Pagesが `docs` の内容を再公開する。

## 現時点の範囲

- GitHubへのpushで `docs` の内容が公開される。
- Google Driveからローカルへの同期は `sync-drive-site-data.cmd` で行う。
- GASからGitHubへ直接反映する完全自動化は、公開確認後に追加する。
