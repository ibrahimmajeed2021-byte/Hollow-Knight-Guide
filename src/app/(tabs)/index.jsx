import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AdBanner } from "../../ads/AdBanner";
import { AppText } from "../../components/hollow/app-text";
import { ApiArtworkImage } from "../../components/hollow/api-artwork-image";
import { Screen } from "../../components/hollow/screen";
import { SurfaceCard } from "../../components/hollow/surface-card";
import { layout, radius, space, type } from "../../ui/design-system";
import { useGame } from "../../games/game-context";
import { useJournal } from "../../journal/journal-context";
import { useLoadouts } from "../../loadouts/loadouts-context";
import { useSettings } from "../../settings/SettingsContext.jsx";
import { useGuidedMode } from "../../premium/guided-context";
import { usePurchases } from "../../purchases/PurchasesContext";
import { resolveTheme } from "../../themes/theme-catalog";
import { useOnlineAccess } from "../../network/online-access-context";
import { sortMixedSilksongItems } from "../../data/progression-order";
import { getCollectibleGuide } from "../../data/silksong-collectible-guides";
import { getCollectibleArtwork } from "../../data/collectible-icons";
import {
  getBossFallbackArtwork,
  getCharmFallbackArtwork,
  getCollectibleFallbackArtwork,
} from "../../data/entry-fallback-artwork";

// Use the same artwork and offline fallback sources as the detail screens.
function homeArtwork(item, kind, config) {
  if (!item) return {};
  if (kind === "boss") {
    return {
      image: item.iconUrl ? { uri: item.iconUrl } : config.bossImages[item.image],
      fallbackImage: getBossFallbackArtwork(item, config.bossImages) ?? config.bossImages[item.image] ?? (item.iconFallbackUrl ? { uri: item.iconFallbackUrl } : undefined),
    };
  }
  if (kind === "equipment") {
    return {
      image: item.iconUrl ? { uri: item.iconUrl } : config.itemImages[item.image],
      fallbackImage: getCharmFallbackArtwork(item, config.itemImages) ?? config.itemImages[item.image] ?? (item.iconFallbackUrl ? { uri: item.iconFallbackUrl } : undefined),
    };
  }
  const wikiArtwork = config.id === "silksong"
    ? getCollectibleGuide(item)?.artworkUrl
    : undefined;
  return {
    image: item.iconUrl ? { uri: item.iconUrl } : getCollectibleArtwork(item, config.id, wikiArtwork),
    fallbackImage: getCollectibleFallbackArtwork(item, config.id) ?? (item.iconFallbackUrl ? { uri: item.iconFallbackUrl } : undefined),
  };
}

// If a wiki image does not load, show its bundled artwork rather than a letter.
function ArtworkThumbnail({ image, fallbackImage, initial, size = 44 }) {
  const { colors, settings } = useSettings();
  const [failedImageKey, setFailedImageKey] = useState(null);
  const [failedFallbackKey, setFailedFallbackKey] = useState(null);
  const imageKey = typeof image === "number" ? String(image) : image?.uri ?? null;
  const fallbackKey = typeof fallbackImage === "number"
    ? String(fallbackImage) : fallbackImage?.uri ?? null;
  const usePrimary = !!image && failedImageKey !== imageKey;
  const useFallback = !usePrimary && !!fallbackImage && failedFallbackKey !== fallbackKey;
  const source = settings.showArtwork === false ? null : usePrimary ? image : useFallback ? fallbackImage : null;
  return (
    <View
      style={[
        styles.itemMarker,
        { width: size, height: size, backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={styles.markerImage}
          contentFit="contain"
          cachePolicy="memory-disk"
          accessible={false}
          onError={() => {
            if (usePrimary) setFailedImageKey(imageKey);
            else setFailedFallbackKey(fallbackKey);
          }}
        />
      ) : (
        <AppText style={[styles.markerText, { color: colors.accent }]}>{initial}</AppText>
      )}
    </View>
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

function SummaryTile({ initial, label, done, total, image, fallbackImage }) {
  const { colors } = useSettings();
  return (
    <SurfaceCard
      style={styles.summaryTile}
      label={label + ": " + done + " of " + total + " completed"}
    >
      <ArtworkThumbnail initial={initial} image={image} fallbackImage={fallbackImage} size={38} />
      <AppText style={styles.tileCount}>{done}/{total}</AppText>
      <AppText style={[styles.tileLabel, { color: colors.muted }]}>{label}</AppText>
    </SurfaceCard>
  );
}

function NextRow({ initial, image, fallbackImage, title, name, detail, onPress, complete }) {
  const { colors } = useSettings();
  return (
    <SurfaceCard onPress={onPress} label={title + ": " + name} style={styles.nextCard}>
      <ArtworkThumbnail initial={initial} image={image} fallbackImage={fallbackImage} />
      <View style={styles.flex}>
        <AppText style={[styles.overline, { color: colors.muted }]}>{title}</AppText>
        <AppText style={styles.nextName} numberOfLines={2}>{name}</AppText>
        <AppText style={[styles.nextDetail, { color: colors.muted }]} numberOfLines={1}>
          {complete ? "Browse the complete collection" : detail}
        </AppText>
      </View>
      <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
    </SurfaceCard>
  );
}

const navigateTo = (path, query) => {
  if (query) router.push({ pathname: path, params: { query } });
  else router.push(path);
};

export default function HomeScreen() {
  const { colors, fontScale, settings } = useSettings();
  const guided = useGuidedMode();
  const { isPremium } = usePurchases();
  const showSection = (id) => settings.homeSections?.[id] !== false;
  const { status: networkStatus } = useOnlineAccess();
  const { defeated, collected } = useJournal();
  const { loadouts } = useLoadouts();
  const { config, dataStatus, mediaManifest } = useGame();
  const activeTheme = resolveTheme(settings.themeStyle);
  const customTheme = activeTheme.id !== "default" && !settings.highContrast;
  const hostedTheme = networkStatus === "online"
    ? mediaManifest?.themes?.[activeTheme.id] : null;
  const homeBackground = customTheme ? activeTheme.backgroundAsset : config.loadingBackground;
  const homeBackgroundUrl = customTheme
    ? hostedTheme?.backgroundImageUrl : config.backgroundImageUrl;
  const homeMotif = customTheme ? activeTheme.motifAsset : config.loadingImage;
  const homeMotifUrl = customTheme ? hostedTheme?.motifImageUrl : config.heroImageUrl;
  const [query, setQuery] = useState("");

  const bosses = config.bosses;
  const equipment = config.items;
  const isSilksong = config.id === "silksong";
  const allCollectibles = config.collectibles ?? [];
  const quests = isSilksong
    ? allCollectibles.filter((entry) => entry.group === "wishes" || entry.group === "objectives")
    : [];
  const pickups = allCollectibles.filter((entry) => entry.group !== "wishes" && entry.group !== "objectives");

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
  // Use the same chronology as the combined Items screen, not all tools
  // before all fragments. Hollow Knight charms are already sorted by config.
  const nextItemRow = isSilksong
    ? sortMixedSilksongItems([
        ...equipment.map((item) => ({ type: "equipment", item })),
        ...pickups.map((item) => ({ type: "collectible", item })),
      ]).find((row) =>
        !collected[row.type === "equipment" ? row.item.name : "c:" + row.item.name],
      )
    : null;
  const nextEquipment = isSilksong
    ? (nextItemRow?.type === "equipment" ? nextItemRow.item : null)
    : equipment.find((entry) => !collected[entry.name]);
  const nextItem = isSilksong ? nextItemRow?.item : nextEquipment;
  const nextPickup = pickups.find((entry) => !collected["c:" + entry.name]);
  const nextQuest = quests.find((entry) => !collected["c:" + entry.name]);
  const nextBossSafe = !nextBoss || guided.isVisible("boss", nextBoss);
  const nextItemKind = isSilksong && nextItemRow?.type === "collectible" ? "collectible" : "item";
  const nextItemSafe = !nextItem || guided.isVisible(nextItemKind, nextItem);
  const nextPickupSafe = !nextPickup || guided.isVisible("collectible", nextPickup);
  const nextQuestSafe = !nextQuest || guided.isVisible("collectible", nextQuest);
  const featuredBoss = bosses.find((entry) =>
    entry.image === (isSilksong ? "BellBeast" : "FalseKnight")) ?? bosses[0];
  const featuredEquipment = equipment.find((entry) =>
    entry.image === (isSilksong ? "Compass" : "WaywardCompass")) ?? equipment[0];
  const featuredCollectible = pickups.find((entry) =>
    entry.group === (isSilksong ? "fleas" : "grubs")) ?? pickups[0];
  const bossTileArtwork = homeArtwork(featuredBoss, "boss", config);
  const itemTileArtwork = homeArtwork(featuredEquipment, "equipment", config);
  const questTileArtwork = homeArtwork(quests[0], "collectible", config);
  const collectibleTileArtwork = homeArtwork(featuredCollectible, "collectible", config);
  const nextBossArtwork = homeArtwork(nextBoss, "boss", config);
  const nextItemArtwork = homeArtwork(
    nextItem, isSilksong && nextItemRow?.type === "collectible" ? "collectible" : "equipment", config,
  );
  const loadout = loadouts[0];

  // Do not build hundreds of image-source objects on every Home render.
  // Scan entry text only when the user searches; resolve artwork for the
  // seven visible matches, never the full guide.
  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || settings.homeSections?.search === false) return [];

    const matches = [];
    const addMatches = (entries, kind, category, path, artworkKind, prefix) => {
      for (const entry of entries) {
        if (matches.length >= 7) break;
        const location = kind === "boss"
          ? (entry.locations ?? []).map((loc) => loc.name).join(" ")
          : entry.location ?? "";
        if (!entry.name.toLowerCase().includes(term) &&
            !String(location).toLowerCase().includes(term)) continue;
        if (!guided.isVisible(kind, entry)) continue;
        matches.push({
          id: prefix + entry.name,
          name: entry.name,
          category,
          location,
          path,
          ...homeArtwork(entry, artworkKind, config),
        });
      }
    };

    addMatches(bosses, "boss", "Boss", "/bosses", "boss", "boss:");
    addMatches(equipment, "item", isSilksong ? "Tool or Crest" : "Charm",
      "/charms", "equipment", "item:");
    addMatches(pickups, "collectible", "Item",
      isSilksong ? "/charms" : "/progress/collectibles", "collectible", "pickup:");
    addMatches(quests, "collectible", "Quest", "/quests", "collectible", "quest:");
    return matches;
  }, [
    query, bosses, equipment, pickups, quests, isSilksong, config,
    guided.isVisible, settings.homeSections?.search,
  ]);

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
        style={({ pressed }) => [styles.hero, customTheme && { backgroundColor: colors.header }, pressed && styles.pressed]}
      >
        {homeBackground || homeBackgroundUrl ? (
          <ApiArtworkImage
            iconUrl={homeBackgroundUrl}
            fallbackImage={homeBackground}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : null}
        <View style={[StyleSheet.absoluteFill, styles.heroDim, customTheme && { backgroundColor: "rgba(5,7,11,0.48)" }]} />
        <ApiArtworkImage
          iconUrl={homeMotifUrl}
          fallbackImage={homeMotif}
          style={[styles.heroCharacter, customTheme
            ? { height: 205, width: 205 }
            : { height: config.loadingImageSize.height * 1.25, width: config.loadingImageSize.width * 1.25 }]}
          contentFit="contain"
        />
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
        {showSection("overview") ? <View style={styles.summaryRow}>
          <SummaryTile
            initial="B"
            image={bossTileArtwork.image}
            fallbackImage={bossTileArtwork.fallbackImage}
            label="Bosses"
            done={bossDone}
            total={bosses.length}
          />
          <SummaryTile
            initial={isSilksong ? "I" : "C"}
            image={itemTileArtwork.image}
            fallbackImage={itemTileArtwork.fallbackImage}
            label={isSilksong ? "Items" : "Charms"}
            done={isSilksong ? itemDone : equipmentDone}
            total={isSilksong ? itemTotal : equipment.length}
          />
          {isSilksong ? (
            <SummaryTile
              initial="Q"
              image={questTileArtwork.image}
              fallbackImage={questTileArtwork.fallbackImage ?? getCollectibleFallbackArtwork({ group: "wishes" }, "silksong")}
              label="Quests"
              done={questDone}
              total={quests.length}
            />
          ) : (
            <SurfaceCard
              onPress={() => router.push("/progress/collectibles")}
              label="Open Hollow Knight collectibles and challenge checklist"
              style={styles.summaryAction}
            >
              <ArtworkThumbnail
                initial="G"
                image={collectibleTileArtwork.image}
                fallbackImage={collectibleTileArtwork.fallbackImage}
                size={38}
              />
              <AppText style={styles.tileCount}>{pickupDone}/{pickups.length}</AppText>
              <AppText style={[styles.tileLabel, { color: colors.muted }]}>Collectibles</AppText>
            </SurfaceCard>
          )}
        </View> : null}

        {showSection("search") ? <>
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
                <ArtworkThumbnail
                  initial={result.name.charAt(0).toUpperCase()}
                  image={result.image}
                  fallbackImage={result.fallbackImage}
                  size={40}
                />
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
        </> : null}

        {showSection("continue") ? <>
          <SectionHeading title="Continue exploring" subtitle="A good place to pick up your journey" />
          <View style={styles.nextList}>
            <NextRow
              initial="B"
              image={nextBossSafe ? nextBossArtwork.image : null}
              fallbackImage={nextBossSafe ? nextBossArtwork.fallbackImage : null}
              title="NEXT BOSS"
              name={nextBossSafe ? (nextBoss?.name ?? "All bosses defeated") : guided.hiddenLabel("boss")}
              detail={nextBossSafe ? "Boss guide and location" : "Continue exploring to discover this boss"}
              complete={!nextBoss}
              onPress={() => navigateTo("/bosses", nextBossSafe ? nextBoss?.name : null)}
            />
            <NextRow
              initial={isSilksong ? "I" : "C"}
              image={nextItemSafe ? nextItemArtwork.image : null}
              fallbackImage={nextItemSafe ? nextItemArtwork.fallbackImage : null}
              title={isSilksong ? "NEXT ITEM" : "NEXT CHARM"}
              name={nextItemSafe
                ? (nextItem?.name ?? (isSilksong ? "All items collected" : "All charms collected"))
                : guided.hiddenLabel(nextItemKind)}
              detail={nextItemSafe ? "See where to find it" : "Keep exploring to reveal this discovery"}
              complete={!nextItem}
              onPress={() => navigateTo("/charms", nextItemSafe ? nextItem?.name : null)}
            />
            <Pressable
              onPress={() => navigateTo(
                isSilksong ? "/quests" : "/progress/collectibles",
                isSilksong
                  ? (nextQuestSafe ? nextQuest?.name : null)
                  : (nextPickupSafe ? nextPickup?.name : null),
              )}
              accessibilityRole="button"
              accessibilityLabel={isSilksong ? "Browse Silksong quests" : "Browse Hollow Knight collectibles"}
              style={[styles.secondaryShortcut, { borderColor: colors.border }]}
            >
              <View style={styles.flex}>
                <AppText style={[styles.shortcutEyebrow, { color: colors.muted }]}>
                  {isSilksong ? "QUESTS" : "COLLECTIBLES"}
                </AppText>
                <AppText style={styles.shortcutName} numberOfLines={1}>
                  {isSilksong
                    ? (nextQuestSafe ? (nextQuest?.name ?? "All quests completed") : guided.hiddenLabel("collectible"))
                    : (nextPickupSafe ? (nextPickup?.name ?? "All collectibles completed") : guided.hiddenLabel("collectible"))}
                </AppText>
              </View>
              <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
            </Pressable>
          </View>
        </> : null}

        {showSection("toolkit") ? <>
          <SectionHeading title="Your toolkit" subtitle="Ready for your next encounter" />
          <SurfaceCard
            onPress={() => router.push(isSilksong ? "/charms/silksong-loadout" : "/charms/loadout")}
            label={loadout ? "Manage loadout " + loadout.name : "Build a loadout"}
            style={styles.toolkitRow}
          >
            <View style={styles.flex}>
              <AppText style={styles.toolkitTitle}>{loadout ? loadout.name : "Build a loadout"}</AppText>
              <AppText style={[styles.toolkitNote, { color: colors.muted }]}>
                {loadout
                  ? isSilksong
                    ? (loadout.crest || "Crest") + " · " + (loadout.tools?.length ?? 0) + " tools"
                    : (loadout.charms?.length ?? 0) + " charms equipped"
                  : "Save your favourite equipment for bosses and areas."}
              </AppText>
            </View>
            <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
          </SurfaceCard>
        </> : null}

        <SectionHeading
          title="Your companion"
          subtitle={isPremium ? "Go further, your way" : "Optional ways to personalise your journey"}
        />
        <SurfaceCard
          onPress={() => router.push("/companion")}
          label={isPremium ? "Open your Premium Companion" : "Discover optional Premium Companion features"}
          style={styles.companionRow}
        >
          <View style={[styles.companionSymbol, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <AppText style={[styles.companionGlyph, { color: colors.accent }]}>✧</AppText>
          </View>
          <View style={styles.flex}>
            <AppText style={styles.toolkitTitle}>
              {isPremium ? "Premium Companion" : "Make the guide yours"}
            </AppText>
            <AppText style={[styles.toolkitNote, { color: colors.muted }]}>
              {isPremium
                ? (guided.goal
                  ? "Continue your plan or explore in Guided Mode"
                  : "Guided Mode, your planner and customisation")
                : "See the extra guidance and offline features"}
            </AppText>
          </View>
          <AppText style={[styles.chevron, { color: colors.accent }]}>›</AppText>
        </SurfaceCard>

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
  hero: { marginHorizontal: layout.gutter, marginTop: 6, borderRadius: radius.hero, overflow: "hidden", minHeight: 225, backgroundColor: "#08111c" },
  heroDim: { backgroundColor: "rgba(4,9,17,0.72)" },
  heroCharacter: { position: "absolute", right: 12, bottom: 10, opacity: 0.67 },
  heroContent: { padding: 22, minHeight: 225, justifyContent: "flex-end", maxWidth: "80%", gap: 7 },
  heroEyebrow: { color: "#dce8f7", fontSize: 10, letterSpacing: 1.2, fontWeight: "700" },
  heroTitle: { color: "#ffffff", fontSize: 29, lineHeight: 33, fontWeight: "800" },
  heroSubtitle: { color: "#e1e7ee", fontSize: 13 },
  heroProgressTrack: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.32)", overflow: "hidden", marginTop: 5 },
  heroProgressFill: { backgroundColor: "#c5e8d2", height: "100%", borderRadius: 4 },
  heroFooter: { color: "#ffffff", fontSize: 12, fontWeight: "600", marginTop: 1 },
  content: { paddingHorizontal: layout.gutter, gap: space.md },
  summaryRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  summaryTile: { flex: 1, minWidth: 0, padding: space.md, gap: 3, alignItems: "center" },
  summaryAction: { flex: 1, minWidth: 0, padding: space.md, alignItems: "center", gap: 3 },
  tileInitial: { fontSize: 16, fontWeight: "900" },
  tileCount: { fontSize: 15, fontWeight: "700" },
  tileLabel: { fontSize: 11, textAlign: "center" },
  sectionHeading: { gap: 3, marginTop: 14 },
  sectionTitle: { ...type.heading, letterSpacing: -0.3 },
  sectionHint: { fontSize: 13, lineHeight: 18 },
  searchWrap: { borderRadius: radius.control, borderWidth: 1, minHeight: 54, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 },
  searchIcon: { fontSize: 24, width: 21, textAlign: "center" },
  searchInput: { flex: 1, minHeight: 52, paddingVertical: 8 },
  clearSearch: { width: 30, height: 38, alignItems: "center", justifyContent: "center" },
  clearIcon: { fontSize: 24 },
  results: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  resultTitle: { fontSize: 15, fontWeight: "700" },
  resultMeta: { fontSize: 12, marginTop: 2 },
  emptySearch: { padding: 18, fontSize: 14 },
  nextList: { gap: 9 },
  pressed: { opacity: 0.76 },
  nextCard: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 92 },
  itemMarker: { width: 44, height: 44, borderWidth: 1, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  markerText: { fontSize: 21, fontWeight: "900" },
  markerImage: { width: "100%", height: "100%" },
  flex: { flex: 1 },
  overline: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  nextName: { fontSize: 16, fontWeight: "700", marginTop: 3 },
  nextDetail: { fontSize: 12, marginTop: 4 },
  chevron: { fontSize: 27, fontWeight: "400" },
  secondaryShortcut: {
    minHeight: 64, borderTopWidth: 1, marginHorizontal: 6, paddingHorizontal: 12,
    paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10,
  },
  shortcutEyebrow: { fontSize: 10, letterSpacing: 1.1, fontWeight: "800" },
  shortcutName: { fontSize: 15, fontWeight: "700", marginTop: 2 },
  toolkitRow: { flexDirection: "row", alignItems: "center", minHeight: 78 },
  companionRow: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 94 },
  companionSymbol: { width: 48, height: 48, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  companionGlyph: { fontSize: 25 },
  toolkitTitle: { fontSize: 18, fontWeight: "800" },
  toolkitNote: { fontSize: 13, lineHeight: 18 },
  footerLink: { alignItems: "center", marginTop: 10, gap: 6, paddingVertical: 12 },
  footerText: { fontSize: 12, textAlign: "center" },
  footerAction: { fontSize: 14, fontWeight: "700" },
});
