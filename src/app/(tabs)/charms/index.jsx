import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Button } from "../../../components/hollow/button";
import { EntryCard, Stat } from "../../../components/hollow/entry-card";
import { CollectionEntry } from "../../../components/hollow/collection-entry";
import {
  CharmExtras,
  CharmSummary,
} from "../../../components/hollow/progress-extras";
import { AppText } from "../../../components/hollow/app-text";
import { WikiLocationSection } from "../../../components/hollow/wiki-location-section";
import { SearchFilter } from "../../../components/hollow/search-filter";
import { useTabInset } from "../../../hooks/use-tab-inset";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { useGame } from "../../../games/game-context";
import { getCharmFallbackArtwork } from "../../../data/entry-fallback-artwork";
import { useJournal } from "../../../journal/journal-context";
import { silksongCollectibleGroups } from "../../../data/silksong-collectibles";
import { silksongExtraCollectibleGroups } from "../../../data/silksong-extra-collectibles";
import { sortMixedSilksongItems } from "../../../data/progression-order";
const FILTERS = [
  { value: "all", label: "All" },
  { value: "todo", label: "Not collected" },
  { value: "done", label: "Collected" },
];

const KIND_FILTERS = [
  { value: "all", label: "All" },
  { value: "Crest", label: "Crests" },
  { value: "Red Tool", label: "Red" },
  { value: "Blue Tool", label: "Blue" },
  { value: "Yellow Tool", label: "Yellow" },
];

function ItemDetails({ item, gameId }) {
  return (
    <>
      {Object.entries(item.details ?? {}).map(([label, value]) => (
        <Stat key={label} label={label} value={value} />
      ))}
      <WikiLocationSection item={item} gameId={gameId} />
    </>
  );
}

function HollowCharmsScreen() {
  const { collected } = useJournal();
  const { config } = useGame();
  const charms = config.items;
  const charmImages = config.itemImages;
  const inset = useTabInset();
  const { query: routeQuery } = useLocalSearchParams();
  const [query, setQuery] = useState(typeof routeQuery === "string" ? routeQuery : "");
  useEffect(() => {
    setQuery(typeof routeQuery === "string" ? routeQuery : "");
  }, [routeQuery]);
  const [filter, setFilter] = useState("all");
  const [kind, setKind] = useState("all");
  const hasKinds = charms.some((c) => c.kind);
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return charms.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (kind === "all" || c.kind === kind) &&
        (filter === "all" || (filter === "done") === !!collected[c.name]),
    );
  }, [charms, query, filter, kind, collected]);
  return (
    <Screen scroll={false}>
      <SearchFilter
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${config.itemsLabel.toLowerCase()}`}
        filters={FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      {hasKinds && (
        <SearchFilter
          filters={KIND_FILTERS}
          filter={kind}
          onFilter={setKind}
          hideSearch
        />
      )}
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText style={{ textAlign: "center", marginTop: 24 }}>
            No {config.itemsLabel.toLowerCase()} match.
          </AppText>
        }
        keyExtractor={(c) => c.name}
        initialNumToRender={8}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: inset + 16 }}
        ListHeaderComponent={
          <>
            <Button label="Back" variant="outline" onPress={() => router.back()} style={{ marginHorizontal: 16, marginBottom: 8, alignSelf: "flex-start" }} />
            <Title>{config.itemsLabel}</Title>
            <Body>Recommended discovery order, including optional charms you may find earlier or later.</Body>
            {config.hasLoadouts && (
              <Button
                label={config.id === "silksong" ? "Crest & tool loadout builder" : "Loadout builder"}
                onPress={() => router.push(config.id === "silksong" ? "/charms/silksong-loadout" : "/charms/loadout")}
                style={{ marginHorizontal: 16, marginTop: 12 }}
              />
            )}
            <Body>
              {config.items.length === 0
                ? `${config.title} ${config.itemsLabel.toLowerCase()} are coming soon.`
                : hasKinds
                  ? `Crests change how Hornet fights and set how many tool and skill slots she has. Tools are red (active), blue (passive) or yellow (utility). Below is every crest and tool with how to get it.`
                  : `Charms are a very important component in Hollow Knight. Equipping charms can alter
              your gameplay and can help you when you are stuck. Charms allow players to have
              freedom in the way they play. Charms can be found in various places across the game.
              However, with the amount of charms there are in the game it can be hard to figure out
              what each one does and which ones are the best to use. Below is an overview of every
              charm in the game, what they do and how many notches they cost.`}
            </Body>
          </>
        }
        renderItem={({ item }) => (
          <EntryCard
            image={charmImages[item.image]}
            fallbackImage={getCharmFallbackArtwork(item, charmImages)}
            name={item.name}
            description={item.description}
            summary={
              item.kind ? (
                <>
                  <Stat label="Type" value={item.kind} />
                  <CharmSummary name={item.name} />
                </>
              ) : (
                <CharmSummary name={item.name} notches={item.notches} />
              )
            }
          >
            <ItemDetails item={item} gameId={config.id} />
            <CharmExtras name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}


// These category tabs bring the Silksong collectibles into Items, while
// Wishes have their own Quests tab. They still use their existing c:<name>
// journal keys, so progress is shared with the Progress screen.
const SILKSONG_CATEGORIES = [
  { value: "all", label: "All items" },
  { value: "tools", label: "Tools" },
  { value: "crests", label: "Crests" },
  { value: "Red Tool", label: "Red tools" },
  { value: "Blue Tool", label: "Blue tools" },
  { value: "Yellow Tool", label: "Yellow tools" },
  ...[...silksongCollectibleGroups, ...silksongExtraCollectibleGroups]
    .filter((group) => group.id !== "wishes" && group.id !== "objectives")
    .map((group) => ({ value: group.id, label: group.title })),
];

const matchesCategory = (row, category) => {
  if (category === "all") return true;
  if (category === "tools") return row.type === "equipment" && row.item.kind?.endsWith("Tool");
  if (category === "crests") return row.type === "equipment" && row.item.kind === "Crest";
  return row.type === "equipment"
    ? row.item.kind === category
    : row.item.group === category;
};

function SilksongItemsScreen() {
  const { config } = useGame();
  const { collected } = useJournal();
  const { category: routeCategory, query: routeQuery } = useLocalSearchParams();
  const inset = useTabInset();
  const [query, setQuery] = useState(typeof routeQuery === "string" ? routeQuery : "");
  useEffect(() => {
    setQuery(typeof routeQuery === "string" ? routeQuery : "");
  }, [routeQuery]);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");

  // Deep links from Progress open the corresponding category automatically.
  useEffect(() => {
    const requested = typeof routeCategory === "string" ? routeCategory : "all";
    setCategory(SILKSONG_CATEGORIES.some((option) => option.value === requested) ? requested : "all");
  }, [routeCategory]);

  const rows = useMemo(
    () => sortMixedSilksongItems([
      ...config.items.map((item) => ({
        type: "equipment",
        key: `e:${item.name}`,
        journalKey: item.name,
        item,
      })),
      ...(config.collectibles ?? [])
        .filter((item) => item.group !== "wishes" && item.group !== "objectives")
        .map((item) => ({
          type: "collectible",
          key: `c:${item.name}`,
          journalKey: `c:${item.name}`,
          item,
        })),
    ]),
    [config.items, config.collectibles],
  );

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (row) =>
        matchesCategory(row, category) &&
        (!q ||
          row.item.name.toLowerCase().includes(q) ||
          (row.item.location ?? "").toLowerCase().includes(q) ||
          (row.item.description ?? "").toLowerCase().includes(q)) &&
        (filter === "all" || (filter === "done") === !!collected[row.journalKey]),
    );
  }, [rows, query, category, filter, collected]);

  return (
    <Screen scroll={false}>
      <SearchFilter
        value={query}
        onChangeText={setQuery}
        placeholder="Search items and collectibles"
        filters={FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      <SearchFilter
        hideSearch
        filters={SILKSONG_CATEGORIES}
        filter={category}
        onFilter={setCategory}
      />
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(row) => row.key}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        contentContainerStyle={{ paddingBottom: inset + 16 }}
        ListHeaderComponent={
          <>
            <Title>Items</Title>
            <Body>
              Tools, crests, Mask Shards, Spool Fragments, Memory Lockets,
              Silk Hearts, materials and abilities. Swipe the category filters
              to find what you need. Entries follow a recommended playthrough,
              not a mandatory route.
            </Body>
            <Button
              label="Crest & tool loadout builder"
              onPress={() => router.push("/charms/silksong-loadout")}
              style={{ marginHorizontal: 16, marginTop: 12 }}
            />
            <Body>Showing {data.length} of {rows.length} items.</Body>
          </>
        }
        ListEmptyComponent={<Body>No items match your filters.</Body>}
        renderItem={({ item: row }) => {
          if (row.type === "collectible") {
            return <CollectionEntry item={row.item} />;
          }
          const item = row.item;
          return (
            <EntryCard
              image={config.itemImages[item.image]}
              name={item.name}
              description={item.description}
              summary={
                <>
                  <Stat label="Type" value={item.kind ?? "Tool"} />
                  <CharmSummary name={item.name} />
                </>
              }
            >
              <ItemDetails item={item} gameId="silksong" />
              <CharmExtras name={item.name} />
            </EntryCard>
          );
        }}
      />
    </Screen>
  );
}

export default function CharmsScreen() {
  const { config } = useGame();
  return config.id === "silksong"
    ? <SilksongItemsScreen />
    : <HollowCharmsScreen />;
}
