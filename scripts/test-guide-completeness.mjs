import assert from "node:assert/strict";

import { bosses as baseBosses } from "../src/data/bosses.js";
import { hollowExtraBosses } from "../src/data/hollow-extra-bosses.js";
import { charms as baseCharms } from "../src/data/charms.js";
import { hollowExtraCharms } from "../src/data/hollow-extra-charms.js";
import { hollowCollectibles, hollowCollectibleGroups } from "../src/data/hollow-collectibles.js";
import { silksongBosses as baseSilksongBosses } from "../src/data/silksong-bosses.js";
import { silksongExtraBosses } from "../src/data/silksong-extra-bosses.js";
import { silksongItems } from "../src/data/silksong-items.js";
import { silksongCollectibles, silksongCollectibleGroups } from "../src/data/silksong-collectibles.js";
import {
  silksongExtraCollectibles,
  silksongExtraCollectibleGroups,
} from "../src/data/silksong-extra-collectibles.js";
import { sortByProgression, sortMixedSilksongItems } from "../src/data/progression-order.js";

const bosses = [...baseBosses, ...hollowExtraBosses];
const charms = [...baseCharms, ...hollowExtraCharms];
const silkBosses = [...baseSilksongBosses, ...silksongExtraBosses];
const silkCollections = [...silksongCollectibles, ...silksongExtraCollectibles];
const silkGroups = [...silksongCollectibleGroups, ...silksongExtraCollectibleGroups];

const unique = (entries, label) => {
  const names = entries.map((entry) => entry.name);
  assert.equal(new Set(names).size, names.length, label + " has duplicate names (progress keys)");
};
for (const [label, entries] of [
  ["HK bosses", bosses], ["HK charms", charms], ["HK collectibles", hollowCollectibles],
  ["Silksong bosses", silkBosses], ["Silksong tools", silksongItems],
  ["Silksong collections", silkCollections],
]) unique(entries, label);

assert.equal(bosses.length, 47, "Hollow Knight boss variants and Warrior Dreams");
assert.equal(charms.length, 45, "Hollow Knight charm and its 4 alternate forms");
assert.equal(silkBosses.length, 47, "Silksong boss entries and repeat fights");
assert.equal(silksongItems.length, 67, "Silksong equipment");
assert.equal(silksongCollectibles.length, 150, "Previously supported Silksong entries");
assert.equal(silksongExtraCollectibles.length, 72, "Fleas, story, keys, mementos and Bellhome upgrades");

const hkGroupCount = (id) => hollowCollectibles.filter((entry) => entry.group === id).length;
const ssGroupCount = (id) => silkCollections.filter((entry) => entry.group === id).length;
assert.equal(hkGroupCount("grubs"), 46);
assert.equal(hkGroupCount("maskshards"), 16);
assert.equal(hkGroupCount("vesselfragments"), 9);
assert.equal(hkGroupCount("paleore"), 6);
assert.equal(hkGroupCount("charmnotches"), 8);
assert.equal(hkGroupCount("godhome"), 8);
assert.equal(ssGroupCount("fleas"), 30);
assert.equal(ssGroupCount("wishes"), 54);
assert.equal(ssGroupCount("objectives"), 20);
assert.equal(ssGroupCount("keyitems"), 13);
assert.equal(ssGroupCount("mementos"), 7);
assert.equal(ssGroupCount("bellhome"), 2);

assert.equal(hollowCollectibles.length, 138);
assert.equal(silkCollections.length, 222);
assert.ok(hollowExtraBosses.some((entry) => entry.name === "Pure Vessel"));
assert.ok(hollowExtraBosses.some((entry) => entry.name === "Absolute Radiance"));
assert.ok(hollowExtraBosses.some((entry) => entry.name === "Nightmare King Grimm"));
assert.ok(hollowExtraBosses.some((entry) => entry.name === "Sisters of Battle"));
assert.ok(charms.some((entry) => entry.name === "Fury of the Fallen"));
assert.ok(hollowCollectibles.some((entry) => entry.name === "Pantheon of Hallownest"));

for (const [label, entries, groups] of [
  ["HK", hollowCollectibles, hollowCollectibleGroups],
  ["Silksong", silkCollections, silkGroups],
]) {
  const validGroups = new Set(groups.map((group) => group.id));
  assert.equal(validGroups.size, groups.length, label + " group ids are unique");
  for (const entry of entries) {
    assert.ok(validGroups.has(entry.group), label + " unknown group " + entry.group);
  }
}
// New records have explicit links and directions. Existing Silksong records
// can also derive source URLs and ability locations in getCollectibleGuide().
for (const entry of [...hollowCollectibles, ...silksongExtraCollectibles]) {
  assert.ok(entry.wikiUrl?.startsWith("https://hollowknight.wiki/w/"),
    "Missing wiki source for " + entry.name);
  assert.ok(entry.location, "Missing location for " + entry.name);
}

const hkBosses = sortByProgression("hollow", "bosses", bosses);
const hkCharms = sortByProgression("hollow", "items", charms);
const hkItems = sortByProgression("hollow", "collectibles", hollowCollectibles);
const ssBosses = sortByProgression("silksong", "bosses", silkBosses);
const ssItems = sortByProgression("silksong", "collectibles", silkCollections);
const mixedItems = sortMixedSilksongItems([
  ...silksongItems.map((item) => ({ type: "equipment", item })),
  ...silkCollections
    .filter((item) => item.group !== "wishes" && item.group !== "objectives")
    .map((item) => ({ type: "collectible", item })),
]);
assert.equal(hkBosses[0].name, "Gruz Mother");
assert.equal(hkBosses.at(-1).name, "Absolute Radiance");
assert.equal(hkCharms[0].name, "Fury of the Fallen");
assert.equal(hkCharms.length, 45);
assert.equal(hkItems.length, hollowCollectibles.length);
assert.equal(ssBosses.length, 47);
assert.equal(ssItems.length, silkCollections.length);
assert.equal(mixedItems.length, 67 + 150 - 54 + 30 + 13 + 7 + 2);
assert.equal(mixedItems[0].item.name, "Hunter Crest");
assert.ok(ssItems.findIndex((entry) => entry.name === "Flea #1") <
  ssItems.findIndex((entry) => entry.name === "Flea #30"));

console.log("Guide coverage validated:",
  bosses.length, "Hollow Knight fights,",
  charms.length, "charms,",
  hollowCollectibles.length, "HK collection entries,",
  silkBosses.length, "Silksong fights,",
  silkCollections.length, "Silksong collectible and quest entries.");
