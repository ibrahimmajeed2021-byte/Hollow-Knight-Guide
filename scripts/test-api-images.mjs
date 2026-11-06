// Regression check for the API's managed icon URLs and staged static files.
// Run after npm run build:api (or use npm run test:api-images).
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const apiDir = join(root, "public/api");
const index = JSON.parse(readFileSync(join(apiDir, "index.json"), "utf8"));
assert.ok(index.schemaVersion >= 2, "API index is missing image schema v2");

const collections = [
  "hollow/bosses.json",
  "hollow/items.json",
  "hollow/collectibles.json",
  "silksong/bosses.json",
  "silksong/items.json",
  "silksong/collectibles.json",
];

let total = 0;
let assets = 0;
let failed = [];

function checkUrl(url, label) {
  if (!url) return failed.push(label + ": missing URL");
  let parsed;
  try { parsed = new URL(url); }
  catch { return failed.push(label + ": invalid URL"); }
  if (parsed.protocol !== "https:") return failed.push(label + ": icon must use HTTPS");
  if (parsed.pathname.startsWith("/guide-icons/")) {
    const relative = decodeURIComponent(parsed.pathname.slice("/guide-icons/".length));
    const path = join(root, "public/guide-icons", relative);
    if (!existsSync(path) || !statSync(path).isFile()) {
      failed.push(label + ": image not staged: " + relative);
    } else assets++;
  }
}

// The app's loading screen and Home use the same API media manifest.
const media = JSON.parse(readFileSync(join(apiDir, "media.json"), "utf8"));
for (const gameId of ["hollow", "silksong"]) {
  const game = media.games?.[gameId];
  checkUrl(game?.heroImageUrl, "media " + gameId + " hero");
  checkUrl(game?.backgroundImageUrl, "media " + gameId + " background");
}

// Every Premium theme must publish its wallpaper/motif URLs. Themes without
// a scene background still have a motif; their colour palette supplies the base.
const expectedThemes = [
  "hollowknight", "cityOfTears", "voidheart", "godhome", "greenpath",
  "crystalPeak", "whitePalace", "silksong", "citadelOfSong", "mossGrotto",
  "deepDocks", "bilewater", "songclave",
];
for (const id of expectedThemes) {
  const theme = media.themes?.[id];
  if (!theme) {
    failed.push("media themes." + id + " is missing");
    continue;
  }
  checkUrl(theme.motifImageUrl, "media theme " + id + " motif");
  if (theme.backgroundImageUrl) {
    checkUrl(theme.backgroundImageUrl, "media theme " + id + " background");
  }
}

for (const collection of collections) {
  const list = JSON.parse(readFileSync(join(apiDir, collection), "utf8"));
  assert.ok(Array.isArray(list) && list.length, collection + " must contain items");
  for (const item of list) {
    const label = collection + " > " + item.name;
    total++;
    checkUrl(item.iconUrl, label);
    if (item.iconFallbackUrl) checkUrl(item.iconFallbackUrl, label + " fallback");
    if (collection.endsWith("/bosses.json")) {
      for (const location of item.locations ?? []) {
        if (location.image) checkUrl(location.imageUrl, label + " location");
      }
    }
  }
}
if (failed.length) {
  console.error(failed.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Verified " + total + " API entries; " + assets +
    " same-origin artwork references resolve to staged files.");
}
