import { AppText } from "./app-text";
import { EntryCard, Stat } from "./entry-card";
import { CharmExtras, CharmSummary } from "./progress-extras";
import { WikiLocationSection } from "./wiki-location-section";
import { getCollectibleGuide } from "../../data/silksong-collectible-guides";
import { getCollectibleFallbackArtwork } from "../../data/entry-fallback-artwork";
import { getCollectibleArtwork } from "../../data/collectible-icons";
import { silksongCollectibleGroups } from "../../data/silksong-collectibles";
import { silksongExtraCollectibleGroups } from "../../data/silksong-extra-collectibles";

const groupNames = Object.fromEntries(
  [...silksongCollectibleGroups, ...silksongExtraCollectibleGroups]
    .map((group) => [group.id, group.title]),
);

// Both Items and Quests use their original progress key: c:<name>.
// This preserves all saved checkmarks, notes and completion totals.
export function CollectionEntry({ item }) {
  const isQuest = item.group === "wishes" || item.group === "objectives";
  const guide = getCollectibleGuide(item);
  const key = `c:${item.name}`;
  return (
    <EntryCard
      name={item.name}
      image={item.iconUrl ? { uri: item.iconUrl } : getCollectibleArtwork(item, "silksong", guide?.artworkUrl)}
      fallbackImage={getCollectibleFallbackArtwork(item, "silksong")}
      description={item.description ?? ""}
      summary={
        <>
          {isQuest
            ? <Stat label="Type" value={item.kind || "Wish"} />
            : <Stat label="Category" value={groupNames[item.group] ?? "Collectible"} />}
          {!isQuest && item.kind ? <Stat label="Type" value={item.kind} /> : null}
          {item.act ? <Stat label="Act" value={item.act} /> : null}
          <CharmSummary
            id={key}
            name={item.name}
            completedLabel={isQuest ? "Completed" : "Collected"}
          />
        </>
      }
    >
      <WikiLocationSection
        item={item}
        gameId="silksong"
        guideOverride={guide}
      />
      {item.requires ? <Stat label="Requires" value={item.requires} /> : null}
      {item.reward ? <Stat label="Reward" value={item.reward} /> : null}
      {item.quote ? <AppText>{item.quote}</AppText> : null}
      <CharmExtras
        id={key}
        name={item.name}
        label={isQuest ? "Completed" : "Collected"}
      />
    </EntryCard>
  );
}
