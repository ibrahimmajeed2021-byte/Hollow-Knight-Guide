// Builds API-managed icon URLs and publishes local image assets to /public/guide-icons.
// Run through npm run build:api, then export web and deploy dist to Surge.
// No image downloads from the wiki: remote wiki images retain source links and
// get an API-hosted fallback when a suitable bundled image exists.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DEFAULT_ORIGIN = "https://hollow-knight-guide-ibrahim.surge.sh";

function objectText(content, declaration) {
  const start = content.indexOf("const " + declaration + " = {");
  if (start < 0) return "";
  const end = content.indexOf("\n};", start);
  if (end < 0) throw new Error("Cannot read mapping " + declaration);
  return content.slice(start, end);
}

function exportedObjectText(content, declaration) {
  const start = content.indexOf("export const " + declaration + " = {");
  if (start < 0) throw new Error("Cannot read image mapping " + declaration);
  const end = content.indexOf("\n};", start);
  if (end < 0) throw new Error("Cannot find image mapping end: " + declaration);
  return content.slice(start, end);
}

function readImageMapping(content, declaration) {
  const block = exportedObjectText(content, declaration);
  const map = new Map();
  const lines = /^\s*(\w+):\s*(?:require\(["']\.\.\/\.\.\/(assets\/[^"']+)["']\)|wikiImageSource\(["']([^"']+)["']\))/gm;
  for (const match of block.matchAll(lines)) {
    map.set(match[1], match[2] ? { local: match[2] } : { wiki: match[3] });
  }
  return map;
}

function readGroupFallback(content, declaration) {
  const map = new Map();
  const regex = /^\s*(\w+):\s*require\(["']\.\.\/\.\.\/(assets\/[^"']+)["']\)/gm;
  for (const match of objectText(content, declaration).matchAll(regex)) {
    map.set(match[1], match[2]);
  }
  return map;
}

function readNamedArtwork(content, declaration) {
  const map = new Map();
  const regex = /^\s*(?:"([^"]+)"|(\w+)):\s*"([^"]+\.png)"/gm;
  for (const match of objectText(content, declaration).matchAll(regex)) {
    map.set(match[1] || match[2], match[3]);
  }
  return map;
}

export function createIconApi(root) {
  const origin = (process.env.GUIDE_ASSET_ORIGIN || DEFAULT_ORIGIN).replace(/\/+$/, "");
  const images = readFileSync(join(root, "src/data/images.js"), "utf8");
  const silkImages = readFileSync(join(root, "src/data/silksong-images.js"), "utf8");
  const collectibleIcons = readFileSync(join(root, "src/data/collectible-icons.js"), "utf8");
  const fallbacks = readFileSync(join(root, "src/data/entry-fallback-artwork.js"), "utf8");

  const hkBosses = readImageMapping(images, "bossImages");
  const hkItems = readImageMapping(images, "charmImages");
  const hkLocations = readImageMapping(images, "locationImages");
  const ssBosses = readImageMapping(silkImages, "silksongBossImages");
  const ssItems = readImageMapping(silkImages, "silksongItemImages");
  const ssLocations = readImageMapping(silkImages, "silksongLocationImages");
  const hkGroups = readGroupFallback(fallbacks, "hk");
  const ssGroups = readGroupFallback(fallbacks, "ss");
  const hkNamed = readNamedArtwork(collectibleIcons, "hollowNamed");
  const ssNamed = readNamedArtwork(collectibleIcons, "silksongNamed");
  const ssGroupArtwork = readNamedArtwork(collectibleIcons, "silksongGroups");

  const cdn = new Map();
  const cdnEntry = /^\s*"([^"]+\.png)":\s*"(https:\/\/cdn\.wikimg\.net\/[^"]+)"/gm;
  for (const match of collectibleIcons.matchAll(cdnEntry)) cdn.set(match[1], match[2]);

  const staged = new Set();
  function publicAsset(path) {
    if (!path || !path.startsWith("assets/")) return null;
    const from = join(root, path);
    if (!existsSync(from)) throw new Error("Missing artwork asset: " + path);
    const relative = path.slice("assets/".length);
    const to = join(root, "public/guide-icons", relative);
    if (!staged.has(relative)) {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
      staged.add(relative);
    }
    return origin + "/guide-icons/" + relative.split("/").map(encodeURIComponent).join("/");
  }
  function wikiFile(name) {
    if (!name) return null;
    return cdn.get(name) ||
      ("https://hollowknight.wiki/w/Special:Redirect/file/" +
        encodeURIComponent(name.replace(/ /g, "_")));
  }
  function wikiFileFromPreview(url) {
    const marker = "/Special:Redirect/file/";
    if (!url || !url.includes(marker)) return null;
    return decodeURIComponent(url.slice(url.lastIndexOf(marker) + marker.length)).replace(/_/g, " ");
  }
  function fromMapping(map, key) {
    const found = map.get(key);
    return found ? (found.local ? publicAsset(found.local) : wikiFile(found.wiki)) : null;
  }
  function fields(url, backup) {
    return {
      ...(url ? { iconUrl: url } : {}),
      ...(backup && backup !== url ? { iconFallbackUrl: backup } : {}),
    };
  }

  const bossFallbackNames = new Map([
    ["Failed Champion", "FalseKnight"],
    ["Soul Tyrant", "SoulMaster"],
    ["Lost Kin", "BrokenVessel"],
    ["White Defender", "DungDefender"],
    ["Grey Prince Zote", "Zote"],
    ["Nightmare King Grimm", "Grimm"],
    ["Enraged Guardian", "CrystalGuardian"],
    ["Hornet Sentinel", "HornetProtector"],
    ["Pure Vessel", "HollowKnight"],
    ["Absolute Radiance", "Radiance"],
    ["Sisters of Battle", "MantisLords"],
    ["Winged Nosk", "Nosk"],
  ]);

  function boss(entry, gameId) {
    const map = gameId === "silksong" ? ssBosses : hkBosses;
    const locationMap = gameId === "silksong" ? ssLocations : hkLocations;
    const url = fromMapping(map, entry.image);
    const backupKey = bossFallbackNames.get(entry.name);
    const backup = backupKey
      ? fromMapping(map, backupKey)
      : entry.kind === "Warrior Dream"
        ? publicAsset("assets/hollow/charms/DreamShield.png")
        : null;
    return {
      ...entry,
      ...fields(url || backup, backup),
      locations: (entry.locations || []).map((loc) => {
        const imageUrl = loc.image ? fromMapping(locationMap, loc.image) : null;
        return { ...loc, ...(imageUrl ? { imageUrl } : {}) };
      }),
    };
  }

  function equipment(entry, gameId) {
    const map = gameId === "silksong" ? ssItems : hkItems;
    const url = fromMapping(map, entry.image);
    const backup = gameId === "hollow" && entry.name === "Fury of the Fallen"
      ? fromMapping(hkItems, "NailmastersGlory")
      : null;
    return { ...entry, ...fields(url || backup, backup) };
  }

  function collectible(entry, gameId, guide = null) {
    const groups = gameId === "silksong" ? ssGroups : hkGroups;
    const backup = publicAsset(groups.get(entry.group));
    let url = null;
    if (gameId === "hollow") {
      url = wikiFile(hkNamed.get(entry.name)) || backup;
    } else {
      const name = entry.group === "maskshards"
        ? "Icon SS Mask Shard Pickup 1.png"
        : entry.group === "spoolfragments"
          ? "Spool Extender.png"
          : ssNamed.get(entry.name) || ssGroupArtwork.get(entry.group);
      url = wikiFile(name) ||
        wikiFile(wikiFileFromPreview(guide?.artworkUrl)) || backup;
    }
    return { ...entry, ...fields(url || backup, backup) };
  }

  return {
    boss,
    equipment,
    collectible,
    asset: publicAsset,
    stagedCount: () => staged.size,
  };
}
