// Quick regression check for every chronology list. No Expo dependencies.
import assert from "node:assert/strict";

import { bosses as hollowBosses } from "../src/data/bosses.js";
import { charms as hollowCharms } from "../src/data/charms.js";
import { silksongBosses } from "../src/data/silksong-bosses.js";
import { silksongItems } from "../src/data/silksong-items.js";
import { silksongCollectibles } from "../src/data/silksong-collectibles.js";
import {
  getProgressionRank,
  sortByProgression,
  sortMixedSilksongItems,
} from "../src/data/progression-order.js";

function checkSorted(game, kind, source) {
  const before = [...source];
  const sorted = sortByProgression(game, kind, source);
  assert.equal(sorted.length, source.length, "No entries lost in " + game + "/" + kind);
  assert.deepEqual(source, before, "The source array must not be mutated");
  assert.deepEqual(
    sorted.map((e) => e.name).sort(),
    before.map((e) => e.name).sort(),
    "Entries must be preserved by name: " + game + "/" + kind,
  );
  for (let i = 1; i < sorted.length; i++) {
    assert.ok(
      getProgressionRank(game, kind, sorted[i - 1]) <= getProgressionRank(game, kind, sorted[i]),
      "Unsorted entries in " + game + "/" + kind,
    );
  }
  return sorted;
}

const hkBosses = checkSorted("hollow", "bosses", hollowBosses);
const hkCharms = checkSorted("hollow", "items", hollowCharms);
const ssBosses = checkSorted("silksong", "bosses", silksongBosses);
const ssTools = checkSorted("silksong", "items", silksongItems);
const ssCollectibles = checkSorted("silksong", "collectibles", silksongCollectibles);
const ssWishes = ssCollectibles.filter((entry) => entry.group === "wishes");

assert.equal(hkBosses[0].name, "Gruz Mother");
assert.equal(hkBosses[1].name, "False Knight");
assert.equal(hkBosses.at(-1).name, "Great Nailsage Sly");
assert.equal(hkCharms[0].name, "Wayward Compass");
assert.equal(hkCharms.at(-1).name, "Void Heart");
assert.equal(ssBosses[0].name, "Moss Mother (Ruined Chapel)");
assert.equal(ssBosses.at(-1).name, "Lost Lace");

const indexOf = (arr, name) => arr.findIndex((entry) => entry.name === name);
assert.ok(indexOf(ssCollectibles, "Mask Shard #1") < indexOf(ssCollectibles, "Mask Shard #7"));
assert.ok(indexOf(ssCollectibles, "Mask Shard #7") < indexOf(ssCollectibles, "Mask Shard #17"));
assert.ok(indexOf(ssCollectibles, "Spool Fragment #1") < indexOf(ssCollectibles, "Spool Fragment #7"));
assert.ok(indexOf(ssCollectibles, "Silkspear") < indexOf(ssCollectibles, "Clawline"));
assert.ok(indexOf(ssCollectibles, "Clawline") < indexOf(ssCollectibles, "Silk Soar"));

assert.equal(ssWishes.length, 54);
assert.ok(ssWishes.slice(0, ssWishes.findIndex((entry) => entry.act === 2)).every((entry) => entry.act === 1));
assert.ok(indexOf(ssWishes, "Berry Picking") < indexOf(ssWishes, "Great Taste of Pharloom"));
assert.ok(indexOf(ssWishes, "Great Taste of Pharloom") < indexOf(ssWishes, "Dark Hearts"));

const mixed = sortMixedSilksongItems([
  ...ssTools.map((item) => ({ type: "equipment", item })),
  ...ssCollectibles
    .filter((item) => item.group !== "wishes")
    .map((item) => ({ type: "collectible", item })),
]);
assert.equal(mixed.length, ssTools.length + ssCollectibles.filter((item) => item.group !== "wishes").length);
assert.equal(mixed[0].item.name, "Hunter Crest");
assert.ok(indexOf(mixed.map(({ item }) => item), "Spool Fragment #1") < indexOf(mixed.map(({ item }) => item), "Silk Soar"));

// Remote API payload order is not trusted; every refresh is sorted again.
const reversed = [...hollowBosses].reverse();
assert.deepEqual(
  sortByProgression("hollow", "bosses", reversed).map((entry) => entry.name),
  hkBosses.map((entry) => entry.name),
);
assert.deepEqual(reversed, [...hollowBosses].reverse());

console.log(
  "Chronology OK:",
  hkBosses.length, "Hollow Knight bosses,",
  hkCharms.length, "charms,",
  ssBosses.length, "Silksong bosses,",
  ssTools.length, "tools & crests,",
  ssCollectibles.length, "collectibles & wishes.",
);
