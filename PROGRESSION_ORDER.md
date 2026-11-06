# Recommended progression order

**Purpose:** The default Bosses, Charms, Silksong Items and Quests screens show the order in which players are likely to encounter entries while following a conventional playthrough. **There is no one required sequence in either game.** Optional bosses, special modes, side quests, shortcuts, and backtracking can change a player's route.

## Route assumptions

### Hollow Knight
The main path used for ordering starts at Forgotten Crossroads and moves through Greenpath, Fungal Wastes and City of Tears before Crystal Peak, the Dream Nail, the lower regions, Dreamers, and the final encounters. Side content in Howling Cliffs, Deepnest, Kingdom's Edge, Queen's Gardens, Hive, Grimm Troupe and Godhome is placed near a plausible first visit or later unlock.

Hollow Knight boss and charm lists are explicitly curated by name because boss repeat encounters, vendors, special rewards, and Godhome content are not accurately ordered using a simple location match.

### Silksong
The recommended Act 1 route broadly follows **Moss Grotto → Bone Bottom → The Marrow → Deep Docks → Far Fields → Greymoor → Bellhart → Shellwood → Blasted Steps**. Optional detours such as Wormways, Hunter's March and Weavenest Atla are slotted into the closest practical stage.

Act 2 follows the central Citadel route through **Choral Chambers / Songclave, Cogwork Core, Whispering Vaults, Underworks, Mount Fay, High Halls** and The Cradle. Side areas including the Slab, Whiteward, Bilewater, the Memorium, Wisp Thicket and Sands of Karak are assigned nearby positions. Act 3 discoveries and re-visits appear after the first two acts.

References for the main paths:
- [Nintendo Life — Silksong recommended progression](https://www.nintendolife.com/guides/hollow-knight-silksong-progression-guide-recommended-route)
- [Silksong Map — Act 1 recommended route](https://mapsilksong.com/docs/game-guide/recommended-route)
- [Hollow Knight area progression reference](https://teemo.dev/game-design/hollow-knight/systems/areas-and-progression-reference/)
- [Hollow Knight Wiki](https://hollowknight.wiki/w/Main_Page)

## Technical implementation

The shared sorter is in `src/data/progression-order.js`. `GameProvider` sorts **all three game-data collections** (bosses, items and collectibles) after merging bundled and remote data, so cached API ordering cannot undo the chronology.

Hollow Knight bosses/charms and Silksong bosses use named encounter/acquisition orders. Silksong equipment, fragments, abilities, and wishes use the documented act and location plus carefully selected manual exceptions for abilities, crests and late rewards. The combined Items view interleaves equipment and collectible groups by their progression rank rather than showing all tools before all fragments. Home's next-item suggestion uses this same mixed chronology.

The existing `item.name` and `c:item.name` journal keys **never change**; this is only a display/order change. Category filters, search, Progress totals, backup files and game switching are unaffected. Entries of equal rank keep their original relative order, and unknown additions remain visible.

For new content, add location/act to the source data or add a named override if it has special unlock requirements. Do not try to sort by item number alone: `Mask Shard #17` is numbered by wiki list, not when the player gets it.

## Regression checks

From the repository root:

```bash
npm run test:progression
```

Check an actual development client as well:
- Hollow Knight Bosses begins with Gruz Mother / False Knight, not Broken Vessel.
- Hollow Knight Charms begins with early Dirtmouth/Crossroads acquisitions, not late-game upgrades.
- Silksong Bosses starts at the Ruined Chapel and moves through the Act 1 route; Lost Lace is at the end.
- Silksong Items interleaves crests, tools, mask shards and fragments by normal availability, including inside filtered category chips.
- Silksong Quests is grouped in Act 1 → Act 2 → Act 3 progression rather than the previous dataset order.
- Progress > Collectibles also uses the updated in-group order, and Home's Next Item matches Items.
- Search, completion checkmarks, counters and saved progress remain unchanged.
