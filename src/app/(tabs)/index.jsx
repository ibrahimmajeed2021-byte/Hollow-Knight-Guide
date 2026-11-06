import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AdBanner } from "../../ads/AdBanner";
import { AppText } from "../../components/hollow/app-text";
import { Button } from "../../components/hollow/button";
import { Screen } from "../../components/hollow/screen";
import { useGame } from "../../games/game-context";
import { useJournal } from "../../journal/journal-context";
import { useLoadouts } from "../../loadouts/loadouts-context";
import { useSettings } from "../../settings/SettingsContext.jsx";

function DashboardCard({ children, onPress, label, style }) {
  const { colors } = useSettings();
  const baseStyle = [
    styles.card,
    { backgroundColor: colors.card, borderColor: colors.border },
    style,
  ];
  // Non-clickable cards are Views so their nested buttons stay interactive.
  if (!onPress) return <View style={baseStyle}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [baseStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

function SectionHeading({ title, subtitle }) {
  const { colors } = useSettings();
  return (
    <View style={styles.sectionHeading}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {subtitle ? (
        <AppText style={[styles.sectionHint, { color: colors.muted }]}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

function SummaryTile({ initial, label, done, total }) {
  const { colors } = useSettings();
  return (
    <View
      style={[styles.summaryTile, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityLabel={label + ": " + done + " of " + total + " completed"}
    >
      <AppText style={[styles.tileInitial, { color: colors.accent }]}>{initial}</AppText>
      <AppText style={styles.tileCount}>{done}/{total}</AppText>
      <AppText style={[styles.tileLabel, { color: colors.muted }]}>{label}</AppText>
    </View>
  );
}

function NextRow({ initial, title, name, detail, onPress, complete }) {
  const { colors } = useSettings();
  return (
    <DashboardCard onPress={onPress} label={title + ": " + name} style={styles.nextCard}>
      <View style={[styles.itemMarker, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <AppText style={[styles.markerText, { color: colors.accent }]}>{initial}</AppText>
      </View>
      <View style={styles.flex}>
        <AppText style={[styles.overline, { color: colors.muted }]}>{title}</AppText>
        <AppText style={styles.nextName} numberOfLines={2}>{name}</AppText>
        <AppText style={[styles.nextDetail, { color: colors.muted }]} numberOfLines={1}>
          {complete ? "Browse the complete collection" : detail}
        </AppText>
      </View>
      <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
    </DashboardCard>
  );
}

const navigateTo = (path, query) => {
  if (query) router.push({ pathname: path, params: { query } });
  else router.push(path);
};

export default function HomeScreen() {
  const { colors, fontScale } = useSettings();
  const { defeated, collected } = useJournal();
  const { loadouts } = useLoadouts();
  const { config, dataStatus } = useGame();
  const [query, setQuery] = useState("");

  const bosses = config.bosses;
  const equipment = config.items;
  const isSilksong = config.id === "silksong";
  const allCollectibles = isSilksong ? config.collectibles ?? [] : [];
  const quests = allCollectibles.filter((entry) => entry.group === "wishes");
  const pickups = allCollectibles.filter((entry) => entry.group !== "wishes");

  const bossDone = bosses.filter((entry) => defeated[entry.name]).length;
  const equipmentDone = equipment.filter((entry) => collected[entry.name]).length;
  const pickupDone = pickups.filter((entry) => collected["c:" + entry.name]).length;
  const questDone = quests.filter((entry) => collected["c:" + entry.name]).length;
  const itemDone = equipmentDone + pickupDone;
  const itemTotal = equipment.length + pickups.length;
  const total = bosses.length + itemTotal + quests.length;
  const complete = bossDone + itemDone + questDone;
  const percent = total ? Math.round((complete / total) * 100) : 0;

  const nextBoss = bosses.find((entry) => !defeated[entry.name]);
  const nextEquipment = equipment.find((entry) => !collected[entry.name]);
  const nextPickup = pickups.find((entry) => !collected["c:" + entry.name]);
  const nextItem = nextEquipment ?? nextPickup;
  const nextQuest = quests.find((entry) => !collected["c:" + entry.name]);
  const loadout = loadouts[0];

  const lookup = useMemo(() => [
    ...bosses.map((entry) => ({
      id: "boss:" + entry.name,
      name: entry.name,
      category: "Boss",
      location: (entry.locations ?? []).map((loc) => loc.name).join(" "),
      path: "/bosses",
    })),
    ...equipment.map((entry) => ({
      id: "item:" + entry.name,
      name: entry.name,
      category: isSilksong ? "Tool or Crest" : "Charm",
      location: entry.location ?? "",
      path: "/charms",
    })),
    ...pickups.map((entry) => ({
      id: "pickup:" + entry.name,
      name: entry.name,
      category: "Item",
      location: entry.location ?? "",
      path: "/charms",
    })),
    ...quests.map((entry) => ({
      id: "quest:" + entry.name,
      name: entry.name,
      category: "Quest",
      location: entry.location ?? "",
      path: "/quests",
    })),
  ], [bosses, equipment, pickups, quests, isSilksong]);

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return lookup
      .filter((entry) =>
        entry.name.toLowerCase().includes(term) ||
        entry.location.toLowerCase().includes(term),
      )
      .slice(0, 7);
  }, [lookup, query]);

  const sourceLabel = dataStatus.source === "online"
    ? "Guide data updated online"
    : dataStatus.source === "cached"
      ? "Using saved guide data"
      : "Offline guide data available";

  return (
    <Screen contentStyle={styles.screenContent}>
      <Pressable
        onPress={() => router.push("/progress")}
        accessibilityRole="button"
        accessibilityLabel={"Open overall progress, " + percent + " percent"}
        style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
      >
        {config.loadingBackground ? (
          <Image source={config.loadingBackground} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}
        <View style={[StyleSheet.absoluteFill, styles.heroDim]} />
        <Image source={config.loadingImage} style={[styles.heroCharacter, { height: config.loadingImageSize.height * 1.25, width: config.loadingImageSize.width * 1.25 }]} contentFit="contain" />
        <View style={styles.heroContent}>
          <AppText style={styles.heroEyebrow}>YOUR FIELD JOURNAL · {config.tagline.toUpperCase()}</AppText>
          <AppText style={styles.heroTitle}>Your journey continues</AppText>
          <AppText style={styles.heroSubtitle}>{complete} of {total} guide entries completed</AppText>
          <View style={styles.heroProgressTrack} accessibilityRole="progressbar" accessibilityLabel="Overall guide completion" accessibilityValue={{ min: 0, max: 100, now: percent }}>
            <View style={[styles.heroProgressFill, { width: percent + "%" }]} />
          </View>
          <AppText style={styles.heroFooter}>{percent}% explored  ·  View progress ›</AppText>
        </View>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.summaryRow}>
          <SummaryTile initial="B" label="Bosses" done={bossDone} total={bosses.length} />
          <SummaryTile initial={isSilksong ? "I" : "C"} label={isSilksong ? "Items" : "Charms"} done={itemDone} total={itemTotal} />
          {isSilksong ? (
            <SummaryTile initial="Q" label="Quests" done={questDone} total={quests.length} />
          ) : (
            <DashboardCard onPress={() => router.push("/progress")} label="View checklist" style={styles.summaryAction}>
              <AppText style={[styles.tileInitial, { color: colors.accent }]}>✓</AppText>
              <AppText style={styles.tileCount}>Track</AppText>
              <AppText style={[styles.tileLabel, { color: colors.muted }]}>Progress</AppText>
            </DashboardCard>
          )}
        </View>

        <SectionHeading title="Find something" subtitle="Search bosses, items, locations and quests" />
        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={[styles.searchIcon, { color: colors.accent }]}>⌕</AppText>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your field guide"
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search guide entries"
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.text, fontSize: 16 * fontScale }]}
          />
          {query.length ? (
            <Pressable onPress={() => setQuery("")} accessibilityRole="button" accessibilityLabel="Clear search" style={styles.clearSearch}>
              <AppText style={[styles.clearIcon, { color: colors.muted }]}>×</AppText>
            </Pressable>
          ) : null}
        </View>
        {query.trim() ? (
          <View style={[styles.results, { borderColor: colors.border, backgroundColor: colors.card }]}>
            {searchResults.length ? searchResults.map((result) => (
              <Pressable
                key={result.id}
                onPress={() => navigateTo(result.path, result.name)}
                accessibilityRole="button"
                accessibilityLabel={result.category + ": " + result.name}
                style={({ pressed }) => [
                  styles.resultRow,
                  { borderBottomColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.flex}>
                  <AppText style={styles.resultTitle}>{result.name}</AppText>
                  <AppText style={[styles.resultMeta, { color: colors.muted }]}>{result.category}</AppText>
                </View>
                <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
              </Pressable>
            )) : (
              <AppText style={[styles.emptySearch, { color: colors.muted }]}>
                No matches yet. Try another boss, item or location.
              </AppText>
            )}
          </View>
        ) : null}

        <SectionHeading title="Continue exploring" subtitle="Pick up where you left off" />
        <View style={styles.nextList}>
          <NextRow
            initial="B"
            title="NEXT BOSS"
            name={nextBoss?.name ?? "All bosses defeated"}
            detail="Open boss guide and location"
            complete={!nextBoss}
            onPress={() => navigateTo("/bosses", nextBoss?.name)}
          />
          <NextRow
            initial={isSilksong ? "I" : "C"}
            title={isSilksong ? "NEXT ITEM" : "NEXT CHARM"}
            name={nextItem?.name ?? (isSilksong ? "All items collected" : "All charms collected")}
            detail={nextEquipment ? "Open equipment guide" : "View location and acquisition details"}
            complete={!nextItem}
            onPress={() => navigateTo("/charms", nextItem?.name)}
          />
          {isSilksong ? (
            <NextRow
              initial="Q"
              title="NEXT QUEST"
              name={nextQuest?.name ?? "All quests completed"}
              detail="See requirements and rewards"
              complete={!nextQuest}
              onPress={() => navigateTo("/quests", nextQuest?.name)}
            />
          ) : null}
        </View>

        <SectionHeading title="Your toolkit" subtitle="Useful shortcuts for your next session" />
        <DashboardCard>
          <AppText style={styles.toolkitTitle}>{loadout ? loadout.name : "Your loadout"}</AppText>
          <AppText style={[styles.toolkitNote, { color: colors.muted }]}>
            {loadout
              ? isSilksong
                ? (loadout.crest || "Crest") + " · " + (loadout.tools?.length ?? 0) + " tools equipped"
                : (loadout.charms?.length ?? 0) + " charms equipped"
              : "Save your favourite combinations for a boss or area."}
          </AppText>
          <Button
            label={loadout ? "Manage loadouts" : "Build a loadout"}
            onPress={() => router.push(isSilksong ? "/charms/silksong-loadout" : "/charms/loadout")}
          />
        </DashboardCard>

        <Pressable onPress={() => router.push("/about")} accessibilityRole="button" accessibilityLabel="About, credits and privacy" style={styles.footerLink}>
          <AppText style={[styles.footerText, { color: colors.muted }]}>
            Independent fan guide · {sourceLabel}
          </AppText>
          <AppText style={[styles.footerAction, { color: colors.accent }]}>About & sources ›</AppText>
        </Pressable>
      </View>

      <AdBanner />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingTop: 10, paddingBottom: 28 },
  hero: { marginHorizontal: 16, marginTop: 6, borderRadius: 24, overflow: "hidden", minHeight: 225, backgroundColor: "#08111c" },
  heroDim: { backgroundColor: "rgba(4,9,17,0.72)" },
  heroCharacter: { position: "absolute", right: 12, bottom: 10, opacity: 0.67 },
  heroContent: { padding: 22, minHeight: 225, justifyContent: "flex-end", maxWidth: "80%", gap: 7 },
  heroEyebrow: { color: "#dce8f7", fontSize: 10, letterSpacing: 1.2, fontWeight: "700" },
  heroTitle: { color: "#ffffff", fontSize: 29, lineHeight: 33, fontWeight: "800" },
  heroSubtitle: { color: "#e1e7ee", fontSize: 13 },
  heroProgressTrack: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.32)", overflow: "hidden", marginTop: 5 },
  heroProgressFill: { backgroundColor: "#c5e8d2", height: "100%", borderRadius: 4 },
  heroFooter: { color: "#ffffff", fontSize: 12, fontWeight: "600", marginTop: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  summaryRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  summaryTile: { flex: 1, minWidth: 0, padding: 12, borderRadius: 16, borderWidth: 1, gap: 3, alignItems: "center" },
  summaryAction: { flex: 1, minWidth: 0, padding: 12, borderRadius: 16, alignItems: "center", gap: 3 },
  tileInitial: { fontSize: 16, fontWeight: "900" },
  tileCount: { fontSize: 15, fontWeight: "700" },
  tileLabel: { fontSize: 11, textAlign: "center" },
  sectionHeading: { gap: 3, marginTop: 14 },
  sectionTitle: { fontSize: 21, fontWeight: "800", letterSpacing: -0.3 },
  sectionHint: { fontSize: 13, lineHeight: 18 },
  searchWrap: { borderRadius: 15, borderWidth: 1, minHeight: 54, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  searchIcon: { fontSize: 24, width: 21, textAlign: "center" },
  searchInput: { flex: 1, minHeight: 52, paddingVertical: 8 },
  clearSearch: { width: 30, height: 38, alignItems: "center", justifyContent: "center" },
  clearIcon: { fontSize: 24 },
  results: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  resultRow: { flexDirection: "row", alignItems: "center", minHeight: 56, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  resultTitle: { fontSize: 15, fontWeight: "700" },
  resultMeta: { fontSize: 12, marginTop: 2 },
  emptySearch: { padding: 18, fontSize: 14 },
  nextList: { gap: 9 },
  card: { borderWidth: 1, borderRadius: 17, padding: 16, gap: 8 },
  pressed: { opacity: 0.76 },
  nextCard: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 94 },
  itemMarker: { width: 44, height: 44, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  markerText: { fontSize: 21, fontWeight: "900" },
  flex: { flex: 1 },
  overline: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  nextName: { fontSize: 16, fontWeight: "700", marginTop: 3 },
  nextDetail: { fontSize: 12, marginTop: 4 },
  chevron: { fontSize: 27, fontWeight: "400" },
  toolkitTitle: { fontSize: 18, fontWeight: "800" },
  toolkitNote: { fontSize: 13, lineHeight: 18 },
  footerLink: { alignItems: "center", marginTop: 10, gap: 6, paddingVertical: 12 },
  footerText: { fontSize: 12, textAlign: "center" },
  footerAction: { fontSize: 14, fontWeight: "700" },
});
