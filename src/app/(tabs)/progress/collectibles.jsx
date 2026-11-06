import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";

import { Button } from "../../../components/hollow/button";
import { EntryCard, Stat } from "../../../components/hollow/entry-card";
import { CharmExtras, CharmSummary } from "../../../components/hollow/progress-extras";
import { AppText } from "../../../components/hollow/app-text";
import { WikiLocationSection } from "../../../components/hollow/wiki-location-section";
import { SearchFilter } from "../../../components/hollow/search-filter";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { useTabInset } from "../../../hooks/use-tab-inset";
import { useJournal } from "../../../journal/journal-context";
import { getCollectibleGuide } from "../../../data/silksong-collectible-guides";
import { getCollectibleFallbackArtwork } from "../../../data/entry-fallback-artwork";
import { getCollectibleArtwork } from "../../../data/collectible-icons";
import { useGame } from "../../../games/game-context";

const STATUS = [
  { value: "all", label: "All" },
  { value: "todo", label: "Not completed" },
  { value: "done", label: "Completed" },
];
const keyOf = (item) => `c:${item.name}`;

export default function CollectiblesScreen() {
  const { config } = useGame();
  const { collected } = useJournal();
  const { group: routeGroup, query: routeQuery } = useLocalSearchParams();
  const items = config.collectibles ?? [];
  const groups = config.collectibleGroups ?? [];
  const isSilksong = config.id === "silksong";
  const inset = useTabInset();
  const [query, setQuery] = useState(typeof routeQuery === "string" ? routeQuery : "");
  const [filter, setFilter] = useState("all");
  const [group, setGroup] = useState(
    typeof routeGroup === "string" ? routeGroup : groups[0]?.id ?? "all",
  );

  useEffect(() => {
    const desiredQuery = typeof routeQuery === "string" ? routeQuery : "";
    setQuery(desiredQuery);
    // Deep links from Home select the collection to which an item belongs.
    const match = desiredQuery
      ? items.find((item) => item.name === desiredQuery)
      : null;
    const wanted = match?.group ||
      (typeof routeGroup === "string" ? routeGroup : groups[0]?.id);
    if (wanted && groups.some((g) => g.id === wanted)) setGroup(wanted);
  }, [routeQuery, routeGroup, items, groups]);

  const groupFilters = useMemo(
    () => groups.map((g) => {
      const inGroup = items.filter((item) => item.group === g.id);
      const done = inGroup.filter((item) => collected[keyOf(item)]).length;
      return { value: g.id, label: `${g.title} ${done}/${inGroup.length}` };
    }),
    [groups, items, collected],
  );

  const current = groups.find((g) => g.id === group);
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) =>
      item.group === group &&
      (!q || item.name.toLowerCase().includes(q) ||
        (item.location ?? "").toLowerCase().includes(q)) &&
      (filter === "all" || (filter === "done") === !!collected[keyOf(item)]),
    );
  }, [items, group, query, filter, collected]);

  const header = (
    <>
      <Title>{isSilksong ? "Silksong Collectibles" : "Hallownest Collectibles"}</Title>
      <Body>
        {current?.blurb ?? "Collectibles, upgrades and optional challenges."}
        {" "}Entries follow a recommended route; optional discoveries may be found in a different order.
      </Body>
      <Button
        label="Back to progress"
        variant="outline"
        onPress={() => router.back()}
        style={{ marginHorizontal: 16, marginTop: 8 }}
      />
      <SearchFilter
        filters={groupFilters}
        filter={group}
        onFilter={setGroup}
        value={query}
        onChangeText={setQuery}
        placeholder="Search collectibles and upgrades"
      />
      <SearchFilter
        hideSearch
        filters={STATUS}
        filter={filter}
        onFilter={setFilter}
      />
    </>
  );

  return (
    <Screen scroll={false}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={header}
        ListEmptyComponent={<Body>No entries match these filters.</Body>}
        contentContainerStyle={{ paddingBottom: inset + 16 }}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        renderItem={({ item }) => {
          const guide = isSilksong
            ? getCollectibleGuide(item)
            : {
                location: item.location ?? null,
                wikiUrl: item.wikiUrl ?? "https://hollowknight.wiki/w/Items_(Hollow_Knight)",
                imageUrl: item.locationMapUrl ?? null,
                fileUrl: item.locationMapSource ?? null,
                mapLabel: item.locationMapLabel ?? "Location reference",
              };
          const isTask = ["wishes", "objectives", "godhome", "trials", "dreamers", "milestones"].includes(item.group);
          return (
            <EntryCard
              spoilerKind="collectible"
              spoilerEntry={item}
              image={item.iconUrl ? { uri: item.iconUrl } : getCollectibleArtwork(item, config.id, guide?.artworkUrl)}
              fallbackImage={getCollectibleFallbackArtwork(item, config.id) ?? (item.iconFallbackUrl ? { uri: item.iconFallbackUrl } : undefined)}
              name={item.name}
              description={item.description ?? ""}
              summary={
                <>
                  {item.kind ? <Stat label="Type" value={item.kind} /> : null}
                  {item.act ? <Stat label="Act" value={String(item.act)} /> : null}
                  <CharmSummary
                    id={keyOf(item)}
                    name={item.name}
                    completedLabel={isTask ? "Completed" : "Collected"}
                  />
                </>
              }
            >
              <WikiLocationSection
                item={item}
                gameId={config.id}
                guideOverride={guide}
              />
              {item.requires ? <Stat label="Requires" value={item.requires} /> : null}
              {item.reward ? <Stat label="Reward" value={item.reward} /> : null}
              {item.quote ? <AppText>{item.quote}</AppText> : null}
              <CharmExtras
                id={keyOf(item)}
                name={item.name}
                label={isTask ? "Completed" : "Collected"}
              />
            </EntryCard>
          );
        }}
      />
    </Screen>
  );
}
