import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const siteRoot = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const workspaceRoot = resolve(siteRoot, "..");
const sourceDir = resolve(workspaceRoot, "blog_ops_daily", "202606");
const outputDir = resolve(siteRoot, "src", "data", "daily");

const names = ["沙耶", "片代", "瑠奈"];
const handles = {
  沙耶: "@saya",
  片代: "@katayo",
  瑠奈: "@runa",
};

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function getCommentMeta(text) {
  const match = text.match(/^<!--\n([\s\S]*?)\n-->/);
  const meta = {};
  if (!match) return meta;

  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    meta[key] = value;
  }

  return meta;
}

function getSection(text, heading) {
  const pattern = new RegExp(`(?:^|\\n)## ${heading}\\n([\\s\\S]*?)(?=\\n## |\\s*$)`);
  return text.match(pattern)?.[1].trim() ?? "";
}

function getMetadataValue(text, key) {
  const metadata = getSection(text, "Metadata");
  const pattern = new RegExp(`^- ${key}:\\s*(.+)$`, "m");
  return metadata.match(pattern)?.[1].trim() ?? "";
}

function parseX(text) {
  const section = getSection(text, "X");

  for (const name of names) {
    const pattern = new RegExp(`(?:^|\\n)### ${name}\\n([\\s\\S]*?)(?=\\n### |\\s*$)`);
    const raw = section.match(pattern)?.[1].trim() ?? "";
    if (raw && raw !== "no post") {
      return {
        hasPost: true,
        poster: name,
        handle: handles[name],
        text: raw,
      };
    }
  }

  return {
    hasPost: false,
    poster: null,
    handle: null,
    text: "",
  };
}

function parseLine(text) {
  const section = getSection(text, "LINE");
  if (!section || section.trim() === "none") {
    return {
      hasLine: false,
      title: null,
      messages: [],
    };
  }

  const messages = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf(":");
      if (index === -1) return null;
      return {
        speaker: line.slice(0, index).trim(),
        body: line.slice(index + 1).trim(),
      };
    })
    .filter(Boolean);

  return {
    hasLine: messages.length > 0,
    title: null,
    messages,
  };
}

function parseNoteMemo(text) {
  const section = getSection(text, "note Memo");
  const read = (key) => section.match(new RegExp(`^- ${key}:\\s*(.+)$`, "m"))?.[1].trim() ?? "";
  return {
    titleCandidate: read("title_candidate"),
    narrator: read("narrator_candidate"),
    theme: read("theme"),
    rememberedLine: read("remembered_line"),
  };
}

function lineTitleFromSeed(seed) {
  if (seed.includes("服")) return "服を見た日";
  if (seed.includes("カフェ")) return "いつものカフェ";
  if (seed.includes("駅")) return "駅で見るだけの朝";
  if (seed.includes("公園")) return "公園にいた日";
  return "三人のトーク";
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const files = (await readdir(sourceDir)).filter((name) => /^\d{8}_sns_draft\.md$/.test(name)).sort();
  const written = [];

  for (const file of files) {
    const date = basename(file, "_sns_draft.md");
    const source = normalizeNewlines(await readFile(join(sourceDir, file), "utf8"));
    const meta = getCommentMeta(source);
    const seed = getMetadataValue(source, "selected_seed");
    const line = parseLine(source);
    if (line.hasLine) line.title = lineTitleFromSeed(seed);

    const data = {
      date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
      createdAt: meta.created_at ?? getMetadataValue(source, "created_at"),
      eventOwner: meta.event_owner_today ?? getMetadataValue(source, "event_owner"),
      seed: { label: seed },
      x: parseX(source),
      line,
      noteMemo: parseNoteMemo(source),
    };

    const out = join(outputDir, `${date}.json`);
    await writeFile(out, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    written.push(out);
  }

  console.log(`Wrote ${written.length} daily JSON files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
