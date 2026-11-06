import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { closeDestination, isPrimaryGuideRoute, isSecondaryGuideRoute } from "../src/navigation/route-policy.mjs";
import { shouldBlockGuide } from "../src/network/access-policy.mjs";
import { normaliseJournal } from "../src/journal/journal-utils.mjs";
import { visibleInGuidedMode } from "../src/premium/guided-logic.mjs";

const root = new URL("..", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");

for (const route of ["/", "/bosses", "/charms", "/quests", "/music", "/progress"]) {
  assert.equal(isPrimaryGuideRoute(route), true, route + " should keep its tab bar");
  assert.equal(isSecondaryGuideRoute(route), false);
}
for (const route of [
  "/settings", "/premium", "/companion", "/guided", "/planner",
  "/premium-studio", "/privacy", "/about", "/progress/collectibles",
  "/progress/photo/123", "/charms/loadout", "/charms/silksong-loadout",
]) {
  assert.equal(isSecondaryGuideRoute(route), true, route + " needs the Close X");
}
assert.equal(closeDestination(true), "back");
assert.equal(closeDestination(false), "home");
const header = read("src/components/hollow/app-header.jsx");
const screen = read("src/components/hollow/screen.jsx");
assert.match(header, /isSecondaryGuideRoute\(pathname\)/);
assert.match(header, /router\.canGoBack\(\)/);
assert.match(header, /router\.replace\("\/"\)/);
assert.match(header, /Close settings/);
assert.match(header, /canClose \? "×" : "⚙"/);
assert.ok(screen.indexOf("<AppHeader />") < screen.indexOf("<ScrollView"),
  "Close X should remain above scrolling content");
assert.match(read("src/hooks/use-tab-inset.js"), /isSecondaryGuideRoute\(pathname\)/);

assert.deepEqual(normaliseJournal(null),
  { photos: [], defeated: {}, collected: {}, notes: {} });
assert.deepEqual(normaliseJournal({
  photos: "broken", defeated: null, collected: [], notes: false,
}), { photos: [], defeated: {}, collected: {}, notes: {} });
const journal = {
  photos: [{ id: "photo-1", file: "memory.jpg" }],
  defeated: { "Hornet Protector": true },
  collected: { "c:Grub 1": true },
  notes: { "Hornet Protector": "Keep moving" },
};
assert.deepEqual(normaliseJournal(journal), journal);
const journalSource = read("src/journal/journal-context.jsx");
assert.match(journalSource, /if \(!ready\) \{/, "Journal must wait for hydration");
assert.ok(journalSource.includes('accessibilityLabel="Loading your saved guide progress"'),
  "Saved progress loading should be accessible");
assert.match(journalSource, /saveQueue\.current/);
assert.match(journalSource, /resetProgress[\s\S]*defeated: \{\}, collected: \{\}/);
assert.match(read("src/app/_layout.jsx"),
  /<JournalProvider key=\{config\.id\} suffix=\{config\.storageSuffix\}>/);

for (const test of [
  { status: "online", premium: false, ready: true, blocked: false },
  { status: "online", premium: false, ready: false, blocked: false },
  { status: "checking", premium: false, ready: true, blocked: true },
  { status: "unreachable", premium: false, ready: false, blocked: true },
  { status: "unreachable", premium: true, ready: true, blocked: false },
  { status: "unreachable", premium: true, ready: false, blocked: true },
]) {
  assert.equal(shouldBlockGuide({
    onlineStatus: test.status, premium: test.premium,
    entitlementCacheReady: test.ready,
  }), test.blocked, JSON.stringify(test));
}

const bosses = Array.from({ length: 12 }, (_, n) => ({ name: "Boss " + n }));
const config = { bosses, items: [], collectibles: [] };
const show = (enabled, defeated = {}) => visibleInGuidedMode({
  enabled, window: "cautious", kind: "boss",
  item: bosses[11], config, defeated,
});
assert.equal(show(false), true);
assert.equal(show(true), false);
assert.equal(show(true, { "Boss 11": true }), true);

const search = read("src/components/hollow/search-filter.jsx");
assert.match(search, /accessibilityLabel="Clear search"/);
assert.ok(search.includes('onChangeText("")'), "The clear control must clear the query");
const progress = read("src/app/(tabs)/progress/index.jsx");
assert.match(progress, /confirmingReset/);
assert.match(progress, /Yes, reset progress/);
assert.ok(!progress.includes("Alert.alert("), "Reset must work on web");
for (const path of [
  "src/app/(tabs)/bosses.jsx",
  "src/app/(tabs)/charms/index.jsx",
  "src/app/(tabs)/quests.jsx",
  "src/app/(tabs)/progress/collectibles.jsx",
]) {
  assert.match(read(path), /setFilter\("all"\)/,
    path + " should clear stale completion filters on deep links");
}

const home = read("src/app/(tabs)/index.jsx");
const paywall = read("src/app/premium.jsx");
assert.match(home, /<AdBanner\s*\/>/);
assert.match(home, /router\.push\("\/companion"\)/);
for (const fn of ["presentPaywall", "purchasePackage", "restorePurchases", "presentCustomerCenter"]) {
  assert.ok(paywall.includes(fn), "RevenueCat purchase flow missing " + fn);
}
assert.ok(existsSync(join(root, "src/navigation/route-policy.mjs")));
console.log("Stage 3 QA source contracts passed: X navigation, progress, offline, search and Premium.");
