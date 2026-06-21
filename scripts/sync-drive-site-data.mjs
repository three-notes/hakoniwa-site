import { access, copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { basename, join, resolve } from "node:path";

const siteRoot = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const outputDir = resolve(siteRoot, "src", "data", "daily");

const argSource = process.argv[2];
const envSource = process.env.SITE_DATA_DAILY_SOURCE;

const defaultSources = [
  "G:\\マイドライブ\\chatgpt\\blog_ops_daily\\site_data\\daily",
  "G:\\My Drive\\chatgpt\\blog_ops_daily\\site_data\\daily",
  "G:\\共有ドライブ\\chatgpt\\blog_ops_daily\\site_data\\daily",
];

async function exists(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function findSourceDir() {
  const candidates = [argSource, envSource, ...defaultSources].filter(Boolean);
  for (const candidate of candidates) {
    const resolved = resolve(candidate);
    if (await exists(resolved)) return resolved;
  }

  throw new Error(
    [
      "Site data source folder was not found.",
      "Pass it as an argument:",
      "  node scripts/sync-drive-site-data.mjs \"G:\\マイドライブ\\chatgpt\\blog_ops_daily\\site_data\\daily\"",
      "Or set SITE_DATA_DAILY_SOURCE.",
    ].join("\n"),
  );
}

async function validateDailyJson(path) {
  const text = await readFile(path, "utf8");
  const data = JSON.parse(text);
  const required = ["date", "createdAt", "eventOwner", "seed", "x", "line", "noteMemo"];
  const missing = required.filter((key) => !(key in data));
  if (missing.length) {
    throw new Error(`${basename(path)} is missing keys: ${missing.join(", ")}`);
  }
}

async function main() {
  const sourceDir = await findSourceDir();
  await mkdir(outputDir, { recursive: true });

  const files = (await readdir(sourceDir)).filter((name) => /^\d{8}\.json$/.test(name)).sort();
  const copied = [];

  for (const file of files) {
    const source = join(sourceDir, file);
    const target = join(outputDir, file);
    await validateDailyJson(source);
    if (resolve(source).toLowerCase() === resolve(target).toLowerCase()) continue;
    await copyFile(source, target);
    copied.push(file);
  }

  console.log(`Copied ${copied.length} site daily JSON files from ${sourceDir}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
