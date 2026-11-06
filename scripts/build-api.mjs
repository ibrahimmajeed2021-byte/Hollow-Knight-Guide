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
const hollowExtraBosses = await load("hollow-extra-bosses.js", "hollowExtraBosses");
const hollowExtraCharms = await load("hollow-extra-charms.js", "hollowExtraCharms");
const hollowCollectibles = await load("hollow-collectibles.js", "hollowCollectibles");
const silksongExtraBosses = await load("silksong-extra-bosses.js", "silksongExtraBosses");
const silksongExtraCollectibles = await load("silksong-extra-collectibles.js", "silksongExtraCollectibles");
const charms = await load("charms.js", "charms");
const silksongBosses = await load("silksong-bosses.js", "silksongBosses");
const silksongItems = await load("silksong-items.js", "silksongItems");
const silksongCollectibles = await load(
  "silksong-collectibles.js",
  "silksongCollectibles",
);
const tips = await load("tips.js", "tips");

const getWikiLocationGuide = await load(
  "wiki-location-guides.js",
  "getWikiLocationGuide",
);

const getCollectibleGuide = await load(
  "silksong-collectible-guides.js",
  "getCollectibleGuide",
);

// Publish acquisition directions and attribution alongside the existing item
// descriptions. The app can download these updates without a native rebuild.
const withWikiLocations = (items, gameId) =>
  items.map((item) => {
    const guide = getWikiLocationGuide(item, gameId);
    return {
      ...item,
      ...(guide?.location ? { location: guide.location } : {}),
      ...(guide?.wikiUrl ? { wikiUrl: guide.wikiUrl } : {}),
      ...(guide?.imageUrl
        ? {
            locationMapUrl: guide.imageUrl,
            locationMapSource: guide.fileUrl,
            locationMapLabel: guide.mapLabel,
          }
        : {}),
    };
  });

// Location map fields are optional: some checklist entries have no verified
// wiki map. Every entry still receives a source article link and its location.
const withCollectibleLocations = (entries) =>
  entries.map((item) => {
    const guide = getCollectibleGuide(item);
    return {
      ...item,
      wikiUrl: guide.wikiUrl,
      ...(guide.location ? { location: guide.location } : {}),
      ...(guide.artworkUrl
        ? {
            artworkUrl: guide.artworkUrl,
            artworkSource: guide.artworkSource,
          }
        : {}),
      ...(guide.imageType === "map"
        ? {
            locationMapUrl: guide.imageUrl,
            locationMapSource: guide.fileUrl,
            locationMapLabel: guide.mapLabel,
          }
        : {}),
    };
  });

write("hollow/bosses.json", [...bosses, ...hollowExtraBosses]);
write("hollow/items.json", withWikiLocations([...charms, ...hollowExtraCharms], "hollow"));
write("hollow/collectibles.json", hollowCollectibles);
write("silksong/bosses.json", [...silksongBosses, ...silksongExtraBosses]);
write("silksong/items.json", withWikiLocations(silksongItems, "silksong"));
write("silksong/collectibles.json", withCollectibleLocations([...silksongCollectibles, ...silksongExtraCollectibles]));
write("tips.json", tips);
write("index.json", {
  updatedAt: new Date().toISOString(),
  endpoints: [
    "hollow/bosses.json",
    "hollow/items.json",
    "hollow/collectibles.json",
    "silksong/bosses.json",
    "silksong/items.json",
    "silksong/collectibles.json",
    "tips.json",
  ],
});

console.log(`API written to ${out}`);
