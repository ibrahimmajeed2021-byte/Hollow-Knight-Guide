// Validate that every selectable Premium theme has a light/dark palette,
// an API media entry and local images for offline use.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = readFileSync(join(root, "src/themes/theme-catalog.js"), "utf8");
const palettes = readFileSync(join(root, "src/constants/hollow.js"), "utf8");
const apiBuilder = readFileSync(join(root, "scripts/build-api.mjs"), "utf8");

const themeIds = [...source.matchAll(/^    id: "([^"]+)"/gm)].map((m) => m[1]);
const requiredIds = themeIds.filter((id) => id !== "default");
assert.equal(new Set(themeIds).size, themeIds.length, "Theme IDs must be unique");
assert.ok(requiredIds.includes("godhome"), "Godhome theme missing");
assert.ok(requiredIds.includes("voidheart"), "Voidheart theme missing");
assert.ok(requiredIds.includes("citadelOfSong"), "Citadel of Song theme missing");

for (const id of requiredIds) {
  // Legacy Hallownest and Pharloom styles have existing palette objects.
  const light = new RegExp("^  " + id + ": (?:premiumPalette\\(|\\{)", "m");
  const dark = new RegExp("^  " + id + "Dark: (?:premiumPalette\\(|\\{)", "m");
  assert.match(palettes, light, id + " light palette missing");
  assert.match(palettes, dark, id + " dark palette missing");
  assert.match(apiBuilder, new RegExp("^  " + id + ": \\[", "m"),
    id + " API media entry missing");
}

let checkedAssets = 0;
for (const match of source.matchAll(/require\("\.\.\/\.\.\/(assets\/[^"]+)"\)/g)) {
  const path = join(root, match[1]);
  assert.ok(existsSync(path), "Theme artwork missing: " + match[1]);
  checkedAssets++;
}
assert.ok(checkedAssets > requiredIds.length, "Expected bundled theme artwork");

console.log("Verified " + themeIds.length + " selectable themes (" +
  requiredIds.length + " Premium) and " + checkedAssets + " bundled art references.");
