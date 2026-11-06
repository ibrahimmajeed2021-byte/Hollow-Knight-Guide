// Pure, testable spoiler policy; the normal guide remains unchanged until
// a Premium user enables Guided Mode. Completed and manually revealed entries
// are always readable. Each kind/collectible category progresses separately.
export const SPOILER_WINDOWS = { cautious: 3, balanced: 8, exploratory: 18 };

export function entryProgressKey(kind, item) {
  return kind === "boss" ? item?.name : kind === "collectible" ? "c:" + item?.name : item?.name;
}

export function entryRevealKey(kind, item) {
  return kind + ":" + String(item?.name || "");
}

export function isEntryCompleted(kind, item, defeated = {}, collected = {}) {
  const key = entryProgressKey(kind, item);
  return kind === "boss" ? !!defeated[key] : !!collected[key];
}

export function visibleInGuidedMode({ enabled, window = "balanced", kind, item, config, defeated = {}, collected = {}, revealed = {} }) {
  if (!enabled || !item) return true;
  if (isEntryCompleted(kind, item, defeated, collected)) return true;
  if (revealed[entryRevealKey(kind, item)]) return true;
  const collection = kind === "boss"
    ? (config?.bosses || [])
    : kind === "item"
      ? (config?.items || [])
      : (config?.collectibles || []).filter((entry) => entry.group === item.group);
  const index = collection.findIndex((entry) => entry.name === item.name);
  if (index < 0) return true; // Never block content absent from a user's active guide.
  let lastCompleted = -1;
  collection.forEach((entry, i) => {
    if (isEntryCompleted(kind, entry, defeated, collected)) lastCompleted = Math.max(i, lastCompleted);
  });
  const distance = SPOILER_WINDOWS[window] ?? SPOILER_WINDOWS.balanced;
  return index <= lastCompleted + distance;
}

export function hiddenLabel(kind) {
  if (kind === "boss") return "Undiscovered boss";
  if (kind === "collectible") return "Undiscovered discovery";
  return "Undiscovered equipment";
}

export function hintFor(item, level = 1) {
  if (!item) return "";
  if (level === 0) return "Follow the main path and explore nearby branches.";
  // Hints are intentionally approximate. Exact requirements remain inside
  // the manually revealed entry, not in a spoiler-free clue.
  const location = String(item.location || item.locations?.[0]?.name || "");
  if (!location) return "Check unexplored routes and your current map.";
  const region = location.split(/[—–,;.]/)[0].trim();
  if (level === 1) return region ? "Look around " + region + "." : "Explore the next area.";
  return String(item.requires || item.location || location).slice(0, 240);
}
