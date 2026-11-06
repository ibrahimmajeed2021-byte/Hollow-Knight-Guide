import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defaultSettings } from "../src/constants/hollow.js";
import {
  visibleInGuidedMode,
  entryProgressKey,
  entryRevealKey,
  SPOILER_WINDOWS,
} from "../src/premium/guided-logic.mjs";
import {
  buildSuggestedPlan,
  FEATURED_GOALS,
  SUGGESTED_PREPARATIONS,
} from "../src/premium/planner-logic.mjs";

const root = new URL("..", import.meta.url).pathname;
assert.equal(defaultSettings.guidedMode, false, "Guided Mode must be opt-in");
assert.equal(defaultSettings.cardDensity, "comfortable");
assert.equal(defaultSettings.showArtwork, true);
assert.equal(defaultSettings.accentPreset, "theme");
assert.deepEqual(Object.values(defaultSettings.homeSections), [true, true, true, true]);
assert.ok(SPOILER_WINDOWS.cautious < SPOILER_WINDOWS.balanced);

const bosses = Array.from({ length: 20 }, (_, i) => ({ name: "Boss " + (i + 1) }));
const items = Array.from({ length: 12 }, (_, i) => ({ name: "Charm " + (i + 1) }));
const collectibles = [
  { name: "Grub 1", group: "grubs" },
  { name: "Grub 2", group: "grubs" },
  { name: "Mask 1", group: "maskshards" },
  { name: "Mask 2", group: "maskshards" },
];
const config = { id: "hollow", bosses, items, collectibles };
const vis = (kind, item, overrides = {}) =>
  visibleInGuidedMode({
    enabled: true,
    kind, item, config,
    defeated: {}, collected: {}, revealed: {},
    window: "cautious",
    ...overrides,
  });

assert.equal(vis("boss", bosses[19], { enabled: false }), true, "Default full guide must remain visible");
assert.equal(vis("boss", bosses[0]), true, "Early bosses are visible");
assert.equal(vis("boss", bosses[10]), false, "Future bosses are hidden");
assert.equal(vis("boss", bosses[10], { defeated: { "Boss 10": true } }), true, "Completed bosses are visible");
assert.equal(vis("boss", bosses[11], { defeated: { "Boss 10": true } }), true, "Completion moves the frontier");
assert.equal(vis("boss", bosses[19], { revealed: { [entryRevealKey("boss", bosses[19])]: true } }), true, "Reveal choice works");
assert.equal(vis("collectible", collectibles[2]), true, "Collectible groups have independent frontiers");
assert.equal(entryProgressKey("collectible", collectibles[0]), "c:Grub 1");

const graphConfig = {
  id: "hollow",
  bosses: [],
  items: [{ name: "Kingsoul" }, { name: "Void Heart" }],
  collectibles: [
    { name: "Dream Nail" },
    { name: "Awoken Dream Nail" },
    { name: "Monarch Wings" },
    { name: "Mantis Claw" },
    { name: "Mothwing Cloak" },
    { name: "Crystal Heart" },
    { name: "Shade Cloak" },
    { name: "King's Brand" },
  ],
};
const plan = buildSuggestedPlan(graphConfig, { kind: "item", name: "Void Heart" }, {}, {});
assert.equal(plan[plan.length - 1].entry.name, "Void Heart", "Goal comes last");
assert.ok(plan.some(x => x.entry.name === "Kingsoul"), "Preparation chain includes Kingsoul");
assert.ok(plan.some(x => x.entry.name === "Shade Cloak"), "Preparation chain includes Shade Cloak");
assert.equal(new Set(plan.map(x => x.id)).size, plan.length, "No duplicate steps");
assert.equal(buildSuggestedPlan(graphConfig, { kind: "item", name: "Unknown item" }, {}, {}).length, 0);

const fileSources = {
  hollow: ["src/data/bosses.js", "src/data/hollow-extra-bosses.js", "src/data/charms.js", "src/data/hollow-extra-charms.js", "src/data/hollow-collectibles.js"],
  silksong: ["src/data/silksong-bosses.js", "src/data/silksong-extra-bosses.js", "src/data/silksong-items.js", "src/data/silksong-collectibles.js", "src/data/silksong-extra-collectibles.js"],
};
for (const gameId of ["hollow", "silksong"]) {
  const data = fileSources[gameId]
    .map(file => readFileSync(join(root, file), "utf8")).join("\n");
  for (const goal of FEATURED_GOALS[gameId]) {
    assert.ok(data.includes(goal.name), gameId + " featured goal missing: " + goal.name);
  }
  const references = SUGGESTED_PREPARATIONS[gameId];
  for (const [goal, requirements] of Object.entries(references)) {
    for (const requirement of requirements) {
      assert.ok(!requirement.includes(":undefined"), goal + " has broken preparation reference");
    }
  }
}
console.log("Premium companion checks passed: spoiler policy, saved journal keys, default UI, curated goals and planner.");
