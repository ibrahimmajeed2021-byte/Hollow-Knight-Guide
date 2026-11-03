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
import { SearchFilter } from "../../../components/hollow/search-filter";
import { useTabInset } from "../../../hooks/use-tab-inset";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { useGame } from "../../../games/game-context";
import { useJournal } from "../../../journal/journal-context";
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

function ItemDetails({ item }) {
  return (
    <>
      {item.location ? <Stat label="Location" value={item.location} /> : null}
      {Object.entries(item.details ?? {}).map(([label, value]) => (
        <Stat key={label} label={label} value={value} />
      ))}
    </>
  );
}

export default function CharmsScreen() {
  const { collected } = useJournal();
  const { config } = useGame();
  const charms = config.items;
  const charmImages = config.itemImages;
  const inset = useTabInset();
  const [query, setQuery] = useState("");
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
            {item.kind ? <ItemDetails item={item} /> : null}
            <CharmExtras name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
