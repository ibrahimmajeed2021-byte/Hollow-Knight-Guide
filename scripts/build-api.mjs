// Generates the static JSON API into public/api from the data files in src/data.
// Run with: npm run build:api
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), "hk-api-"));

async function load(file, name) {
  const target = join(tmp, `${name}.mjs`);
  writeFileSync(target, readFileSync(join(root, "src/data", file), "utf8"));
  return (await import(pathToFileURL(target).href))[name];
}

const out = join(root, "public/api");
const write = (path, data) => {
  const file = join(out, path);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, JSON.stringify(data));
};

const bosses = await load("bosses.js", "bosses");
const charms = await load("charms.js", "charms");
const silksongBosses = await load("silksong-bosses.js", "silksongBosses");
const silksongItems = await load("silksong-items.js", "silksongItems");
const silksongCollectibles = await load(
  "silksong-collectibles.js",
  "silksongCollectibles",
);
const tips = await load("tips.js", "tips");

write("hollow/bosses.json", bosses);
write("hollow/items.json", charms);
write("silksong/bosses.json", silksongBosses);
write("silksong/items.json", silksongItems);
write("silksong/collectibles.json", silksongCollectibles);
write("tips.json", tips);
write("index.json", {
  updatedAt: new Date().toISOString(),
  endpoints: [
    "hollow/bosses.json",
    "hollow/items.json",
    "silksong/bosses.json",
    "silksong/items.json",
    "silksong/collectibles.json",
    "tips.json",
  ],
});

console.log(`API written to ${out}`);
