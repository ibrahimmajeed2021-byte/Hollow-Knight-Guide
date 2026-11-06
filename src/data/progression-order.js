// Recommended playthrough chronology, not a claim of one mandatory route.
// Hollow Knight and Silksong are non-linear; optional encounters can occur in
// many orders. Main-story sequence first, nearby optional encounters next.
// Sources and assumptions: see PROGRESSION_ORDER.md.
//
// Keep ordering outside the data files. The API can refresh entries without
// silently resetting a player's saved journal, and game switching is unchanged.

// The original Hollow Knight boss file wasn't ordered by encounter.
// Named ordering is more accurate than geography for repeat fights, trials,
// late story bosses and Godhome encounters.
const HK_BOSSES = [
  "Gruz Mother", "False Knight", "Brooding Mawlek",
  "Vengefly King", "Hornet (Protector)", "Massive Moss Charger",
  "Mantis Lords", "Soul Warrior", "Soul Master",
  "Crystal Guardian", "Dung Defender", "Flukemarm",
  "Broken Vessel", "Nosk", "Uumuu", "Watcher Knight",
  "The Collector", "Traitor Lord", "Hive Knight",
  "Oblobbles", "God Tamer", "Zote", "Grimm",
  "Hollow Knight", "Radiance", "Oro & Mato",
  "Paintmaster Sheo", "Great Nailsage Sly",
];

// Earliest practical acquisition on a conventional Hallownest route.
// Shop rewards, collect-all rewards and quest/DLC upgrades are deliberately
// moved later than the area in which the relevant vendor first appears.
const HK_CHARMS = [
  "Wayward Compass", "Gathering Swarm", "Stalwart Shell",
  "Soul Catcher", "Shaman Stone", "Steady Body", "Longnail",
  "Lifeblood Heart", "Quick Focus", "Thorns of Agony",
  "Baldur Shell", "Joni's Blessing",
  "Fragile Heart", "Fragile Greed", "Fragile Strength",
  "Spore Shroom", "Dashmaster", "Mark of Pride",
  "Spell Twister", "Flukenest", "Defender's Crest",
  "Grubsong", "Glowing Womb", "Deep Focus",
  "Soul Eater", "DreamShield", "Dream Wielder",
  "Sprintmaster", "Heavy Blow", "Quick Slash",
  "Nailmaster's Glory", "Weaversong", "Sharp Shadow",
  "Shape of Unn", "Hiveblood", "Lifeblood Core",
  "Grubberfly's Elegy", "Grimm Child",
  "Unbreakable Heart", "Unbreakable Greed", "Unbreakable Strength",
  "Carefree Melody", "Kingsoul", "Void Heart",
];

// Sequence by act and recommended encounter, not alphabetical or source order.
// Includes optional bosses close to the chapter in which they can be reached.
const SS_BOSSES = [
  "Moss Mother (Ruined Chapel)", "Bell Beast",
  "Skull Tyrant (The Marrow & Bone Bottom)", "Lace (Deep Docks)",
  "Fourth Chorus", "Moorwing", "Sister Splinter", "Widow",
  "Moss Mother (Weavenest Atla)", "Savage Beastfly (Chapel of the Beast)",
  "Phantom", "Great Conchflies", "Last Judge",
  "Forebrothers Signis & Gron", "Cogwork Dancers",
  "Second Sentinel", "Garmond and Zaza", "Shakra",
  "Savage Beastfly (Far Fields)", "Broodmother", "First Sinner",
  "Disgraced Chef Lugoli", "Groal the Great", "The Unravelled",
  "Father of the Flame", "Raging Conchfly", "Voltvyrm",
  "Trobbio", "Summoned Saviour", "Lace (The Cradle)",
  "Grand Mother Silk",
  "Bell Eater", "Crawfather", "Gurr the Outcast",
  "Pinstress", "Plasmified Zango", "Skarrsinger Karmelita",
  "Crust King Khann", "Watcher at the Edge",
  "Clover Dancers", "Palestag", "Lost Garmond",
  "Shrine Guardian Seth", "Nyleth", "Tormented Trobbio",
  "Lost Lace",
];

const hkBossIndex = new Map(HK_BOSSES.map((name, i) => [name, i]));
const hkCharmIndex = new Map(HK_CHARMS.map((name, i) => [name, i]));
const ssBossIndex = new Map(SS_BOSSES.map((name, i) => [name, i]));

// Most Silksong equipment, collectibles and wishes have usable location
// descriptions. Group them by recommended act and region, not by item type.
// An item's own act takes precedence if it revisits an early-game zone.
const SS_AREAS = {
  1: [
    "Moss Grotto", "Ruined Chapel", "Bone Bottom", "Mosshome",
    "The Marrow", "Deep Docks", "Far Fields", "Greymoor",
    "Craw Lake", "Halfway Home", "Bellhart", "Shellwood",
    "Wormways", "Hunter's March", "Chapel of the Beast",
    "Bonegrave", "Weavenest Atla", "Sinner's Road",
    "Blasted Steps", "Grand Gate",
  ],
  2: [
    "Choral Chambers", "Songclave", "Grand Bellway",
    "Cogwork Core", "Whispering Vaults", "Underworks",
    "Whiteward", "The Slab", "Mount Fay", "Memorium",
    "High Halls", "Sands of Karak", "Coral Tower",
    "Bilewater", "Putrified Ducts", "Wisp Thicket",
    "Voltnest", "The Stage", "Fleatopia", "The Cradle",
  ],
  3: [
    "Bellways", "Bellhart", "Bone Bottom", "Blasted Steps",
    "Songclave", "Far Fields", "Brightvein",
    "Wormways", "Lost Verdania", "The Slab", "Grand Gate",
    "Sands of Karak", "Red Memory", "Moss Grotto",
    "Weavenest Absolom", "The Abyss",
  ],
};

// Skills often have no location in the bundled data: explicit placements
// prevent them from being stranded after unrelated collectibles.
const SS_SPECIAL = {
  "Hunter Crest": [1, -1],
  "Bind": [1, -1],
  "Silkspear": [1, 0],
  "Silk Heart": [1, 4],
  "Swift Step": [1, 5],
  "Drifter's Cloak": [1, 6],
  "Thread Storm": [1, 7],
  "Reaper Crest": [1, 8],
  "Wanderer Crest": [1, 15],
  "Cling Grip": [1, 11],
  "Needolin": [1, 11.5],
  "Beast Crest": [1, 14],
  "Needle Strike": [1, 18],
  "Cross Stitch": [2, 13],
  "Sharpdart": [2, 9],
  "Rune Rage": [2, 7],
  "Pale Nails": [3, 14],
  "Clawline": [2, 5],
  "Sylphsong": [1, 16],
  "Vaultkeeper's Melody": [2, 4],
  "Architect's Melody": [2, 8.7],
  "Conductor's Melody": [2, 10],
  "Faydown Cloak": [2, 8],
  "Silk Soar": [3, 15],
  "Beastling Call": [3, 0],
  "Elegy of the Deep": [3, 12],
  "Farsight": [3, 15],
  "Everbloom": [3, 13],
  "Architect Crest": [2, 5],
  "Cursed Crest": [2, 14],
  "Cloakless Crest": [2, 7],
  "Shaman Crest": [3, 13],
  "Curvesickle": [3, 5],
  "Claw Mirrors": [3, 12],
  "Dead Bug's Purse": [3, 3],
  "Lost Lace": [3, 16],
  // These upgrades are gated by later tasks, despite early-area NPCs.
  "Egg of Flealia": [2, 18],
  "Flea Brew": [1, 16],
  "Pin Badge": [3, 3],
  "Reserve Bind": [2, 10],
  "Grubberfly's Elegy": [3, 15],
  "Silk Heart 2: Defeat The Unravelled": [2, 6],
  "Silk Heart 3: Defeat Lace": [2, 19],
};

function areaPosition(text, act) {
  const lower = String(text ?? "").toLowerCase();
  const areas = SS_AREAS[act] ?? [];
  // Prefer the first area named in the acquisition directions, avoiding
  // accidental matches in later alternative routes and quest destinations.
  const matches = areas
    .map((area, index) => ({
      index,
      at: lower.indexOf(area.toLowerCase()),
      length: area.length,
    }))
    .filter((area) => area.at >= 0)
    .sort((a, b) => a.at - b.at || b.length - a.length);
  return matches.length ? matches[0].index : null;
}

function inferredAct(entry) {
  if (entry.act === 1 || entry.act === 2 || entry.act === 3) return entry.act;
  const loc = String(entry.location ?? "");
  // "Act 1/2 ... Alternatively Act 3" remains an early pickup.
  const firstExplicit = loc.match(/\b(?:in |during )?Act\s*([123])\b/i);
  if (firstExplicit) return Number(firstExplicit[1]);
  for (const act of [1, 2, 3]) {
    if (areaPosition(loc, act) !== null) return act;
  }
  return 2; // Unspecified side content belongs near the optional Act 2 route.
}

function silkEntryRank(entry) {
  const special = SS_SPECIAL[entry.name];
  if (special) return special[0] * 100_000 + special[1] * 1000;
  const act = inferredAct(entry);
  let position = areaPosition(entry.location, act);
  // A later-act wish in an earlier zone still belongs in its own act.
  // Optional areas not named in that act keep their original relative order.
  if (position === null) {
    for (const otherAct of [1, 2, 3]) {
      position = areaPosition(entry.location, otherAct);
      if (position !== null) break;
    }
  }
  return act * 100_000 + (position ?? 18.5) * 1000;
}

export function getProgressionRank(gameId, kind, entry) {
  if (!entry) return Number.MAX_SAFE_INTEGER;
  if (gameId === "hollow") {
    const order = kind === "bosses" ? hkBossIndex : hkCharmIndex;
    return (order.get(entry.name) ?? 10000) * 1000;
  }
  if (kind === "bosses") return (ssBossIndex.get(entry.name) ?? 10000) * 1000;
  return silkEntryRank(entry);
}

export function sortByProgression(gameId, kind, entries) {
  // Stable sorting is essential for two entries unlocked at the same point.
  // Never mutate bundled arrays or remote API objects.
  return entries
    .map((entry, original) => ({
      entry, original, rank: getProgressionRank(gameId, kind, entry),
    }))
    .sort((a, b) => a.rank - b.rank || a.original - b.original)
    .map(({ entry }) => entry);
}

// A mixed Silksong Items screen needs the same time order across tools,
// crests and other collectibles rather than tools first then fragments.
export function sortMixedSilksongItems(rows) {
  return rows
    .map((row, original) => ({
      row, original,
      rank: getProgressionRank("silksong", row.type === "equipment" ? "items" : "collectibles", row.item),
    }))
    .sort((a, b) => a.rank - b.rank || a.original - b.original)
    .map(({ row }) => row);
}
