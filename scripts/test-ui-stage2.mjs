// Stage 2 visual contract checks. These inspect source structure and
// JavaScript tokens; they do not replace a JSX build or iPhone UI review.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");
const tokens = read("src/ui/design-system.js");
assert.match(tokens, /touchTarget:\s*48/, "Primary controls need a 48pt target");
assert.match(tokens, /card:\s*16/, "Standard card corner radius missing");
assert.match(tokens, /standard:\s*230/, "Shared motion timing missing");

const renderHelpers = [
  "src/components/hollow/app-text.jsx",
  "src/components/hollow/button.jsx",
  "src/components/hollow/section-text.jsx",
  "src/components/hollow/screen.jsx",
  "src/components/hollow/app-header.jsx",
  "src/components/hollow/entry-card.jsx",
  "src/components/hollow/search-filter.jsx",
  "src/components/hollow/progress-bar.jsx",
  "src/components/hollow/surface-card.jsx",
  "src/components/hollow/empty-state.jsx",
];
for (const path of renderHelpers) {
  assert.ok(existsSync(join(root, path)), "Shared UI missing: " + path);
}

const text = read("src/components/hollow/app-text.jsx");
assert.match(text, /fontScale/, "Must preserve manual font scaling");
assert.match(text, /type\[variant\]/, "Shared typography variants missing");

const button = read("src/components/hollow/button.jsx");
assert.match(button, /minHeight:\s*layout\.touchTarget/, "Buttons too small");
assert.match(button, /accessibilityState=/, "Button disabled state missing");
assert.match(button, /pressed\s*&&/, "Button pressed feedback missing");

const filters = read("src/components/hollow/search-filter.jsx");
assert.match(filters, /minHeight:\s*layout\.touchTarget/, "Filter chips too small");
assert.match(filters, /accessibilityRole="radio"/, "Selected filters must remain accessible");

const progress = read("src/components/hollow/progress-bar.jsx");
assert.match(progress, /clampPercent\(pct\)/, "Progress must be clamped");
assert.match(progress, /settings\.reduceMotion/, "Reduced motion support missing");

const entry = read("src/components/hollow/entry-card.jsx");
assert.match(entry, /!settings\.reduceMotion/, "Entry card must honour reduced motion");
assert.match(entry, /guided\.isVisible/, "Spoiler protection must remain");
assert.match(entry, /settings\.cardDensity/, "Premium compact cards must remain");

const screen = read("src/components/hollow/screen.jsx");
assert.match(screen, /<ThemeBackdrop\s*\/>/, "Existing theme backdrops must remain");
assert.match(screen, /keyboardShouldPersistTaps="handled"/, "Search keyboard flow missing");

for (const path of [
  "src/app/(tabs)/bosses.jsx",
  "src/app/(tabs)/charms/index.jsx",
  "src/app/(tabs)/progress/collectibles.jsx",
  "src/app/(tabs)/quests.jsx",
]) {
  assert.match(read(path), /<EmptyState/, "List empty-state missing: " + path);
}
for (const path of [
  "src/app/(tabs)/index.jsx",
  "src/app/(tabs)/progress/index.jsx",
  "src/app/companion.jsx",
]) {
  assert.match(read(path), /<SurfaceCard/, "Shared card treatment missing: " + path);
}

const home = read("src/app/(tabs)/index.jsx");
assert.match(home, /<AdBanner\s*\/>/, "Free advertising must remain wired");
assert.match(home, /router\.push\("\/companion"\)/, "Stage 1 companion entry missing");
const settings = read("src/app/settings.jsx");
for (const category of [
  "Appearance & themes", "Accessibility & feedback",
  "Audio", "Guide preferences", "Data & support",
]) {
  assert.ok(settings.includes('title="' + category + '"'),
    "Stage 1 Settings category missing: " + category);
}
const premium = read("src/app/premium.jsx");
for (const action of ["presentPaywall", "purchasePackage", "restorePurchases", "presentCustomerCenter"]) {
  assert.ok(premium.includes(action), "Purchases action missing: " + action);
}

console.log("Stage 2 design checks passed: controls, cards, accessibility, themes and purchase paths.");
