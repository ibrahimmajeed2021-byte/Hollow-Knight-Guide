import { isEntryCompleted } from "./guided-logic.mjs";

// Suggested preparation chains only — not mandatory requirements.
// These games are non-linear. Explicit notes in each item's guide take
// precedence; the player can skip steps or discover them out of order.
export const FEATURED_GOALS = {
  hollow: [
    { kind: "collectible", name: "Mothwing Cloak", title: "Unlock early movement" },
    { kind: "collectible", name: "Crystal Heart", title: "Reach longer passages" },
    { kind: "collectible", name: "Monarch Wings", title: "Unlock double jump" },
    { kind: "collectible", name: "Shade Cloak", title: "Explore shadow paths" },
    { kind: "item", name: "Void Heart", title: "Complete the Void Heart journey" },
    { kind: "collectible", name: "Nail Upgrade 4: Pure Nail", title: "Fully upgrade your Nail" },
    { kind: "collectible", name: "Pantheon of Hallownest", title: "Godhome challenge" },
  ],
  silksong: [
    { kind: "collectible", name: "Swift Step", title: "Early traversal" },
    { kind: "collectible", name: "Cling Grip", title: "Improve climbing" },
    { kind: "collectible", name: "Clawline", title: "Reach new routes" },
    { kind: "collectible", name: "Faydown Cloak", title: "Improve movement" },
    { kind: "collectible", name: "Silk Soar", title: "Reach higher areas" },
    { kind: "item", name: "Architect Crest", title: "Unlock an advanced Crest" },
    { kind: "collectible", name: "OPEN: Grand Gate", title: "Progress the main story" },
  ],
};

// Reference format is "kind:name"; entries are checked against live API
// content, so an old cache or edited API never creates phantom checklist rows.
export const SUGGESTED_PREPARATIONS = {
  hollow: {
    "collectible:Mantis Claw": ["collectible:Mothwing Cloak"],
    "collectible:Crystal Heart": ["collectible:Mantis Claw"],
    "collectible:Monarch Wings": ["collectible:Mantis Claw", "collectible:Crystal Heart"],
    "collectible:Isma's Tear": ["collectible:Mantis Claw", "collectible:Crystal Heart"],
    "collectible:Shade Cloak": ["collectible:Mothwing Cloak", "collectible:Mantis Claw", "collectible:King's Brand"],
    "collectible:Awoken Dream Nail": ["collectible:Dream Nail"],
    "item:Kingsoul": ["collectible:Awoken Dream Nail", "collectible:Monarch Wings"],
    "item:Void Heart": ["item:Kingsoul", "collectible:Shade Cloak"],
    "collectible:Nail Upgrade 2: Channelled Nail": ["collectible:Nail Upgrade 1: Sharpened Nail"],
    "collectible:Nail Upgrade 3: Coiled Nail": ["collectible:Nail Upgrade 2: Channelled Nail"],
    "collectible:Nail Upgrade 4: Pure Nail": ["collectible:Nail Upgrade 3: Coiled Nail"],
    "collectible:Pantheon of the Artist": ["collectible:Pantheon of the Master"],
    "collectible:Pantheon of the Sage": ["collectible:Pantheon of the Artist"],
    "collectible:Pantheon of the Knight": ["collectible:Pantheon of the Sage"],
    "collectible:Pantheon of Hallownest": ["collectible:Pantheon of the Knight"],
  },
  silksong: {
    "collectible:Cling Grip": ["collectible:Swift Step"],
    "collectible:Clawline": ["collectible:Cling Grip"],
    "collectible:Faydown Cloak": ["collectible:Clawline"],
    "collectible:Silk Soar": ["collectible:Faydown Cloak"],
    "item:Architect Crest": ["collectible:Clawline"],
    "collectible:OPEN: Grand Gate": ["collectible:Swift Step"],
    "collectible:ASCEND: Pharloom's Crown": ["collectible:OPEN: Grand Gate"],
    "collectible:SEEK: The Dark Below": ["collectible:ASCEND: Pharloom's Crown"],
  },
};

export function listGoalEntries(config) {
  if (!config) return [];
  return [
    ...(config.bosses || []).map((entry) => ({ kind: "boss", entry })),
    ...(config.items || []).map((entry) => ({ kind: "item", entry })),
    ...(config.collectibles || []).map((entry) => ({ kind: "collectible", entry })),
  ];
}

export function getEntry(config, ref) {
  const all = listGoalEntries(config);
  return all.find(({ kind, entry }) => kind + ":" + entry.name === ref) ?? null;
}

export function buildSuggestedPlan(config, goal, defeated, collected) {
  if (!config || !goal?.name || !goal?.kind) return [];
  const routes = SUGGESTED_PREPARATIONS[config.id] || {};
  const visited = new Set();
  const output = [];
  const visit = (ref, depth = 0) => {
    if (visited.has(ref) || depth > 18) return;
    visited.add(ref);
    for (const requirement of routes[ref] || []) visit(requirement, depth + 1);
    const found = getEntry(config, ref);
    if (!found) return;
    output.push({
      kind: found.kind,
      entry: found.entry,
      id: ref,
      goal: ref === goal.kind + ":" + goal.name,
      completed: isEntryCompleted(found.kind, found.entry, defeated, collected),
    });
  };
  visit(goal.kind + ":" + goal.name);
  return output;
}
