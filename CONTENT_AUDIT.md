# Hollow Knight Guide — content coverage audit
Updated: 6 November 2026

This audit tracks what is **currently in the guide**, not a guarantee of every
possible encounter, enemy, lore pickup, map purchasable, environmental secret,
achievement or optional challenge in either game. Both games have branching
routes and optional content; the guide's completion percentage is **not**
an in-game official completion or achievement percentage.

## Hollow Knight

| Content | Guide entries | Status |
|---|---:|---|
| Boss encounters & variants | 47 | 28 pre-existing + 19 newly added |
| Charms & alternate forms | 45 | Added Fury of the Fallen |
| Grubs | 46 | Numbered as wiki locations, with acquisition prerequisites |
| Mask Shards | 16 | Individual collection checklist |
| Vessel Fragments | 9 | Individual collection checklist |
| Pale Ore | 6 | Individual collection checklist |
| Extra Charm Notches | 8 | Individual collection checklist |
| Movement/dream abilities | 13 | Includes Focus, Dream Nail and upgrades |
| Combat spells and upgrades | 6 | All three base spells + improved versions |
| Nail Arts | 3 | Master Mato, Sheo and Oro |
| Keys & key story items | 13 | Main exploration/key progression |
| Dreamers | 3 | Monomon, Lurien, Herrah |
| Colosseum Trials | 3 | Warrior, Conqueror, Fool |
| Godhome tasks | 8 | Five Pantheons + unlock, Hall of Gods and Eternal Ordeal |
| Nail upgrade milestones | 4 | Sharpened through Pure Nail |

The new boss entries include **seven Warrior Dreams**, **six Dream Bosses**,
**two optional normal-boss variants**, and **four Godhome-only encounters**,
including Pure Vessel, Sisters of Battle, Winged Nosk and Absolute Radiance.
Previously tracked bosses such as Grimm, Radiance, Oro & Mato and God Tamer
remain in place. Pantheons are *separate checkboxes* from boss victories, so
players may record the gauntlet and its last boss independently.

The 46 Grub numbers follow the wiki's **Rewards and locations** table.
A Grub's individual number identifies a map pin, **not** a required rescue
order; milestone rewards depend on the *number rescued*, not which Grub was
rescued at that time. Each Grub card links to that map/list. For entries
without a confirmed precise map marker, directions remain deliberately general.

## Hollow Knight: Silksong

| Content | Guide entries | Status |
|---|---:|---|
| Boss encounters & variants | 47 | Existing list plus separate Skull Tyrant rematch |
| Tools and Crests | 67 | Existing equipment list retained |
| Earlier collectibles / wishes / abilities | 150 | No original entries removed |
| Rescued Fleas | 30 | Includes Kratt, Huge Flea and Vog |
| Main story objectives | 20 | Included in Quests with category filter |
| Keys and key items | 13 | Four Simple Keys + unique keys |
| Mementos | 7 | Sprintmaster, Guardian, Hero, Hunter, Grey, Surface, Craw |
| Bellhome upgrades | 2 | Materium, Crawbell (Farsight already under Abilities) |

Total Silksong collectible/quest records: **222**. Both games' list
sorters continue to order entries by recommended progression, while allowing
alternative routes.

## What the app does with this data

- Hollow Knight **Progress → Collectibles** now opens a complete category
  checklist, with information on how to get an entry and a link to the wiki.
- Silksong **Items** includes the new Flea, key, Memento and Bellhome filters.
- Silksong **Quests** has **Main story** and **Wishes** filters.
- All checklist state is keyed by the original names, with `c:` prefixes
  for collectible entries. This update doesn't rename pre-existing keys.
- The Home dashboard and overall progress now include the additional data.
- The app merges bundled and remote data by name without discarding new
  bundled entries when an old static API is still hosted on Surge.
- `scripts/build-api.mjs` generates `hollow/collectibles.json` and includes
  the new entries in their respective existing endpoints.

## Limits and follow-up content

This is **not yet an exhaustive compendium of all Hunter's Journal enemies,
lore tablets, Whispering Roots, every relic/tradable, named NPC interactions,
maps/benches, individual enemy gauntlets, equipment consumables or every
game achievement**. These may be added as separate optional checklists.
Godhome bindings and every Ascended/Radiant Hall of Gods statue are likewise
not each individual checkboxes yet.

Some acquired items have location text and **wiki source links, but no
verified individual map image**. A placeholder is shown rather than using an
unrelated or misleading image. Map and audio rights must be checked before
publishing the app.

## Primary reference pages

- https://hollowknight.wiki/w/Bosses_(Hollow_Knight)
- https://hollowknight.wiki/w/Charms
- https://hollowknight.wiki/w/Grub
- https://hollowknight.wiki/w/Mask_Shard_(Hollow_Knight)
- https://hollowknight.wiki/w/Vessel_Fragment
- https://hollowknight.wiki/w/Pale_Ore
- https://hollowknight.wiki/w/Pantheons
- https://hollowknight.wiki/w/Spells_and_Abilities_(Hollow_Knight)
- https://hollowknight.wiki/w/Bosses_(Silksong)
- https://hollowknight.wiki/w/Flea
- https://hollowknight.wiki/w/Items_(Silksong)
- https://hollowknight.wiki/w/Simple_Key_(Silksong)
- https://hollowknight.wiki/w/Acts

Content is inspired by/adapted from fan-maintained game wiki pages and
cannot be assumed licensed for commercial redistribution without checking
each text/image/audio source and appropriate permissions.
