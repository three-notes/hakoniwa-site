import { defineConfig } from "astro/config";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repositoryName.endsWith(".github.io");
const base = process.env.PUBLIC_BASE_PATH
  ?? (repositoryName && !isUserSite ? `/${repositoryName}` : "/");

export default defineConfig({
  base,
  outDir: process.env.PUBLIC_OUT_DIR || "dist",
  vite: {
    cacheDir: "../.vite-cache/hakoniwa_site",
  },
});
