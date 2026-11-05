import { useMemo, useState } from "react";
import { FlatList } from "react-native";

import { CollectionEntry } from "../../components/hollow/collection-entry";
import { Screen } from "../../components/hollow/screen";
import { SearchFilter } from "../../components/hollow/search-filter";
import { Body, Title } from "../../components/hollow/section-text";
import { useGame } from "../../games/game-context";
import { useTabInset } from "../../hooks/use-tab-inset";
import { useJournal } from "../../journal/journal-context";

const STATUS_FILTERS = [
  { value: "all", label: "All quests" },
  { value: "todo", label: "Not completed" },
  { value: "done", label: "Completed" },
];

export default function QuestsScreen() {
  const { config } = useGame();
  const { collected } = useJournal();
  const inset = useTabInset();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [kind, setKind] = useState("all");
  const isSilksong = config.id === "silksong";

  const quests = useMemo(
    () =>
      isSilksong
        ? (config.collectibles ?? []).filter((entry) => entry.group === "wishes")
        : [],
    [config.collectibles, isSilksong],
  );
  const kindFilters = useMemo(
    () => [
      { value: "all", label: "All types" },
      ...[...new Set(quests.map((entry) => entry.kind).filter(Boolean))].map(
        (value) => ({ value, label: value }),
      ),
    ],
    [quests],
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
        (kind === "all" || entry.kind === kind) &&
        (filter === "all" ||
          (filter === "done") === !!collected[`c:${entry.name}`]),
    );
  }, [quests, query, kind, filter, collected]);

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
      {kindFilters.length > 2 ? (
        <SearchFilter
          hideSearch
          filters={kindFilters}
          filter={kind}
          onFilter={setKind}
        />
      ) : null}
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
              All {quests.length} Silksong quests and wishes. {completed} completed.
              Expand a quest for its location, requirements, and rewards.
            </Body>
          </>
        }
        ListEmptyComponent={<Body>No quests match your filters.</Body>}
        renderItem={({ item }) => <CollectionEntry item={item} />}
      />
    </Screen>
  );
}
