import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";

import { Button } from "../../../components/hollow/button";
import { EntryCard, Stat } from "../../../components/hollow/entry-card";
import {
  CharmExtras,
  CharmSummary,
} from "../../../components/hollow/progress-extras";
import { AppText } from "../../../components/hollow/app-text";
import { WikiLocationSection } from "../../../components/hollow/wiki-location-section";
import { SearchFilter } from "../../../components/hollow/search-filter";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { useTabInset } from "../../../hooks/use-tab-inset";
import { useJournal } from "../../../journal/journal-context";
import { getCollectibleGuide } from "../../../data/silksong-collectible-guides";
import { useGame } from "../../../games/game-context";
import {
  silksongCollectibleGroups,
  silksongCollectibles,
} from "../../../data/silksong-collectibles";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "todo", label: "Not collected" },
  { value: "done", label: "Collected" },
];

const keyOf = (item) => `c:${item.name}`;

export default function CollectiblesScreen() {
  const { collected } = useJournal();
  const { config } = useGame();
  const collectibles = config.collectibles ?? silksongCollectibles;
  const inset = useTabInset();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [group, setGroup] = useState(silksongCollectibleGroups[0].id);

  const groupFilters = useMemo(
    () =>
      silksongCollectibleGroups.map((g) => {
        const items = collectibles.filter((i) => i.group === g.id);
        const done = items.filter((i) => collected[keyOf(i)]).length;
        return { value: g.id, label: `${g.title} ${done}/${items.length}` };
      }),
    [collected, collectibles],
  );
  const current = silksongCollectibleGroups.find((g) => g.id === group);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return collectibles.filter(
      (i) =>
        i.group === group &&
        (!q ||
          i.name.toLowerCase().includes(q) ||
          (i.location ?? "").toLowerCase().includes(q)) &&
        (filter === "all" || (filter === "done") === !!collected[keyOf(i)]),
    );
  }, [group, query, filter, collected, collectibles]);

  const header = (
    <>
      <Title>Collectibles</Title>
      <Body>{current.blurb} Entries are ordered by when they're normally reachable, rather than collectible number.</Body>
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
        placeholder="Search collectibles"
      />
      <SearchFilter
        hideSearch
        filters={FILTERS}
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
        ListEmptyComponent={<Body>Nothing matches.</Body>}
        contentContainerStyle={{ paddingBottom: inset }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        renderItem={({ item }) => (
          <EntryCard
            image={{ uri: getCollectibleGuide(item).artworkUrl }}
            name={item.name}
            description={item.description ?? ""}
            summary={
              <>
                {item.kind ? <Stat label="Type" value={item.kind} /> : null}
                {item.act ? <Stat label="Act" value={item.act} /> : null}
                <CharmSummary id={keyOf(item)} name={item.name} />
              </>
            }
          >
            <WikiLocationSection
              item={item}
              gameId="silksong"
              guideOverride={getCollectibleGuide(item)}
            />
            {item.requires ? (
              <Stat label="Requires" value={item.requires} />
            ) : null}
            {item.reward ? <Stat label="Reward" value={item.reward} /> : null}
            {item.quote ? <AppText>{item.quote}</AppText> : null}
            <CharmExtras id={keyOf(item)} name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
