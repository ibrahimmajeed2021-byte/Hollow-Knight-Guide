import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";

import { CollectionEntry } from "../../components/hollow/collection-entry";
import { Screen } from "../../components/hollow/screen";
import { SearchFilter } from "../../components/hollow/search-filter";
import { Body, Title } from "../../components/hollow/section-text";
import { useGame } from "../../games/game-context";
import { useTabInset } from "../../hooks/use-tab-inset";
import { useJournal } from "../../journal/journal-context";

const QUEST_CATEGORY_FILTERS = [
  { value: "all", label: "All quests" },
  { value: "objectives", label: "Main story" },
  { value: "wishes", label: "Wishes" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All quests" },
  { value: "todo", label: "Not completed" },
  { value: "done", label: "Completed" },
];

export default function QuestsScreen() {
  const { config } = useGame();
  const { query: routeQuery } = useLocalSearchParams();
  const { collected } = useJournal();
  const inset = useTabInset();
  const [query, setQuery] = useState(typeof routeQuery === "string" ? routeQuery : "");
  useEffect(() => {
    setQuery(typeof routeQuery === "string" ? routeQuery : "");
  }, [routeQuery]);
  const [filter, setFilter] = useState("all");
  const [questType, setQuestType] = useState("all");
  const isSilksong = config.id === "silksong";

  const quests = useMemo(
    () =>
      isSilksong
        ? (config.collectibles ?? []).filter((entry) => entry.group === "wishes" || entry.group === "objectives")
        : [],
    [config.collectibles, isSilksong],
  );
  const completed = quests.filter((entry) => collected[`c:${entry.name}`]).length;

  const data = useMemo(() => {
    const text = query.trim().toLowerCase();
    return quests.filter(
      (entry) =>
        (!text ||
          entry.name.toLowerCase().includes(text) ||
          (entry.location ?? "").toLowerCase().includes(text) ||
          (entry.description ?? "").toLowerCase().includes(text)) &&
        (questType === "all" || entry.group === questType) &&
        (filter === "all" ||
          (filter === "done") === !!collected[`c:${entry.name}`]),
    );
  }, [quests, query, questType, filter, collected]);

  if (!isSilksong) {
    return (
      <Screen>
        <Title>Quests</Title>
        <Body>Select Silksong to browse its quests.</Body>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <SearchFilter
        placeholder="Search quests"
        value={query}
        onChangeText={setQuery}
        filters={STATUS_FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      <SearchFilter
        hideSearch
        filters={QUEST_CATEGORY_FILTERS}
        filter={questType}
        onFilter={setQuestType}
      />
      <FlatList
        data={data}
        keyExtractor={(entry) => entry.name}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        contentContainerStyle={{ paddingBottom: inset + 16 }}
        ListHeaderComponent={
          <>
            <Title>Quests</Title>
            <Body>
              All {quests.length} Silksong tasks ({quests.filter((entry) => entry.group === "objectives").length} main-story objectives and {quests.filter((entry) => entry.group === "wishes").length} wishes). {completed} completed.
              Expand a quest for its location, requirements, and rewards.
              Quests follow a recommended Act 1 → 2 → 3 progression; optional
              wishes can be completed in different orders.
            </Body>
          </>
        }
        ListEmptyComponent={<Body>No quests match your filters.</Body>}
        renderItem={({ item }) => <CollectionEntry item={item} />}
      />
    </Screen>
  );
}
