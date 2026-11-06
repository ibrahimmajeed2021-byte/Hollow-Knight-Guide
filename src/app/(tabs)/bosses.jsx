import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Linking, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../../components/hollow/app-text";
import { Button } from "../../components/hollow/button";
import { EntryCard, Stat } from "../../components/hollow/entry-card";
import {
  BossExtras,
  BossSummary,
} from "../../components/hollow/progress-extras";
import { Screen } from "../../components/hollow/screen";
import { SearchFilter } from "../../components/hollow/search-filter";
import { Body, Title } from "../../components/hollow/section-text";
import { useGame } from "../../games/game-context";
import { getBossFallbackArtwork } from "../../data/entry-fallback-artwork";
import { useTabInset } from "../../hooks/use-tab-inset";
import { useJournal } from "../../journal/journal-context";
import { useSettings } from "../../settings/SettingsContext.jsx";
const FILTERS = [
  { value: "all", label: "All" },
  { value: "todo", label: "Not defeated" },
  { value: "done", label: "Defeated" },
];

export default function BossesScreen() {
  const { colors } = useSettings();
  const { query: routeQuery } = useLocalSearchParams();
  const inset = useTabInset();
  const { defeated } = useJournal();
  const { config } = useGame();
  const { bosses, bossImages, locationImages } = config;
  const [query, setQuery] = useState(typeof routeQuery === "string" ? routeQuery : "");
  useEffect(() => {
    setQuery(typeof routeQuery === "string" ? routeQuery : "");
  }, [routeQuery]);
  const [filter, setFilter] = useState("all");
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bosses.filter(
      (b) =>
        (!q || b.name.toLowerCase().includes(q)) &&
        (filter === "all" || (filter === "done") === !!defeated[b.name])
    );
  }, [bosses, query, filter, defeated]);
  return (
    <Screen scroll={false}>
      <SearchFilter
        value={query}
        onChangeText={setQuery}
        placeholder="Search bosses"
        filters={FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText style={styles.empty}>No bosses match.</AppText>
        }
        keyExtractor={(b) => b.name}
        initialNumToRender={6}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: inset + 16 }}
        ListHeaderComponent={
          <>
            <Button label="Back" variant="outline" onPress={() => router.back()} style={{ marginHorizontal: 16, marginBottom: 8, alignSelf: "flex-start" }} />
            <Title>Bosses</Title>
            <Body>
              {config.id === "silksong"
                ? "Every boss in Hollow Knight: Silksong, grouped by act in the order they usually appear, with health, rewards and where to find them. Boss data adapted from the Hollow Knight Wiki (hollowknight.wiki), licensed CC BY-SA."
                : `Bosses in Hollow Knight play a crucial role in shaping the game&apos;s challenge,
              progression, and storytelling, acting as major skill checks that test a player&apos;s
              mastery of movement, timing, and combat. Each boss introduces unique attack patterns
              and mechanics, which can feel overwhelming for new players. This guide breaks down
              every boss and where they can be found so you can improve faster, build confidence,
              and enjoy the game without feeling stuck.`}
            </Body>
            <Body>
              Listed in recommended encounter order. Optional bosses and
              alternate routes may change when you meet them.
            </Body>
          </>
        }
        renderItem={({ item }) => (
          <EntryCard
            image={item.iconUrl ? { uri: item.iconUrl } : bossImages[item.image]}
            fallbackImage={getBossFallbackArtwork(item, bossImages) ?? bossImages[item.image] ?? (item.iconFallbackUrl ? { uri: item.iconFallbackUrl } : undefined)}
            name={item.name}
            description={item.description}
            summary={<BossSummary name={item.name} health={item.health} />}
          >
            {config.largeBossImage && (item.iconUrl || bossImages[item.image]) ? (
              <Image
                source={item.iconUrl ? { uri: item.iconUrl } : bossImages[item.image]}
                style={styles.bossImage}
                contentFit="contain"
                cachePolicy="memory-disk"
                accessible={false}
              />
            ) : null}
            {item.act ? <Stat label="Act" value={String(item.act)} /> : null}
            {item.kind ? <Stat label="Encounter type" value={item.kind} /> : null}
            {item.requires ? <Stat label="How to unlock" value={item.requires} /> : null}
            <Stat label="Reward" value={item.reward} />
            <AppText style={[styles.locationLabel, { color: colors.muted }]}>
              Location
            </AppText>
            {item.locations.map((loc) => (
              <View key={loc.name} style={styles.location}>
                {loc.imageUrl || loc.image ? (
                  <Image
                    source={loc.imageUrl ? { uri: loc.imageUrl } : locationImages[loc.image]}
                    style={styles.locationImage}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    accessibilityLabel={`${loc.name} map location`}
                  />
                ) : null}
                <AppText style={styles.locationName}>{loc.name}</AppText>
              </View>
            ))}
            {item.wikiUrl ? (
              <Pressable
                onPress={() => Linking.openURL(item.wikiUrl).catch(() => {})}
                accessibilityRole="link"
                accessibilityLabel={`View source for ${item.name}`}
                style={styles.wikiLink}
              >
                <AppText style={[styles.wikiText, { color: colors.accent }]}>
                  Open boss guide on Hollow Knight Wiki ↗
                </AppText>
              </Pressable>
            ) : null}
            <BossExtras name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  empty: { textAlign: "center", marginTop: 24 },
  bossImage: { width: "100%", height: 200, marginTop: 8 },
  wikiLink: { minHeight: 44, paddingVertical: 12, justifyContent: "center" },
  wikiText: { fontSize: 15, fontWeight: "700" },
  locationLabel: { marginTop: 8, fontWeight: "bold", fontSize: 15 },
  location: { marginTop: 6, alignItems: "center", gap: 4 },
  locationImage: { width: "100%", height: 160 },
  locationName: { fontSize: 15 },
});
