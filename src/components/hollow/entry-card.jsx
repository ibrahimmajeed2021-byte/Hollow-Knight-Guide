import { Image } from "expo-image";
import { memo, useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { HKFont } from "../../constants/hollow";
import { useGuidedMode } from "../../premium/guided-context";
import { useHaptics, useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";

function EntryCardBase({ image, fallbackImage, name, summary, description, children, spoilerEntry, spoilerKind }) {
  const { colors, settings } = useSettings();
  const triggerHaptic = useHaptics();
  const guided = useGuidedMode();
  const [expanded, setExpanded] = useState(settings.startExpanded);
  const [failedImageKey, setFailedImageKey] = useState(null);
  const imageKey = typeof image === "number"
    ? String(image)
    : image?.uri ?? JSON.stringify(image ?? null);
  const fallbackImageKey = typeof fallbackImage === "number"
    ? String(fallbackImage)
    : fallbackImage?.uri ?? JSON.stringify(fallbackImage ?? null);
  const [failedFallbackKey, setFailedFallbackKey] = useState(null);
  const showArtwork = settings.showArtwork !== false && !!image && failedImageKey !== imageKey;
  const showFallbackArtwork = settings.showArtwork !== false && !showArtwork && !!fallbackImage &&
    failedFallbackKey !== fallbackImageKey;
  const displayedImage = showArtwork ? image : showFallbackArtwork ? fallbackImage : null;

  const toggle = () => {
    if (!settings.reduceMotion) LayoutAnimation.easeInEaseOut();
    triggerHaptic();
    setExpanded((value) => !value);
  };

  // Mask undiscovered entries before rendering their names, pictures,
  // rewards, locations or summaries. The user can reveal them deliberately.
  const hidden = spoilerKind && spoilerEntry && !guided.isVisible(spoilerKind, spoilerEntry);
  if (hidden) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          settings.cardDensity === "compact" && styles.compactCard,
        ]}
      >
        <AppText style={[styles.hiddenTitle, { color: colors.text }]}>
          {guided.hiddenLabel(spoilerKind)}
        </AppText>
        <AppText style={[styles.hiddenHelp, { color: colors.muted }]}>
          This entry is further ahead in the recommended route. Guided Mode
          hides its name, artwork and location until you discover or reveal it.
        </AppText>
        <Pressable
          onPress={() => guided.revealEntry(spoilerKind, spoilerEntry)}
          accessibilityRole="button"
          accessibilityLabel={"Reveal hidden " + spoilerKind + " details and spoilers"}
          style={[styles.revealButton, { borderColor: colors.border }]}
        >
          <AppText style={[styles.revealText, { color: colors.accent }]}>
            Reveal entry (spoiler)
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        settings.cardDensity === "compact" && styles.compactCard,
      ]}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={name}
        accessibilityHint={expanded ? "Collapse details" : "Expand details"}
        accessibilityState={{ expanded }}
        style={[styles.top, settings.cardDensity === "compact" && styles.compactTop]}
      >
        {displayedImage ? (
          <Image
            source={displayedImage}
            style={[styles.image, settings.cardDensity === "compact" && styles.compactImage]}
            contentFit="contain"
            cachePolicy="memory-disk"
            recyclingKey={name}
            onError={() => {
              if (showArtwork) setFailedImageKey(imageKey);
              else setFailedFallbackKey(fallbackImageKey);
            }}
            accessible={false}
          />
        ) : (
          <View
            style={[styles.imageFallback, { borderColor: colors.border, backgroundColor: colors.background }, settings.cardDensity === "compact" && styles.compactImage]}
            accessibilityLabel={image ? name + " artwork is unavailable" : name + " has no artwork"}
          >
            <AppText style={[styles.fallbackLetter, { color: colors.accent }]}>
              {name?.trim()?.charAt(0)?.toUpperCase() || "?"}
            </AppText>
          </View>
        )}
        <View style={styles.titleBlock}>
          <AppText style={styles.name} numberOfLines={3}>{name}</AppText>
          {summary}
        </View>
        <AppText style={[styles.chevron, { color: colors.muted }]}>
          {expanded ? "▲" : "▼"}
        </AppText>
      </Pressable>
      {expanded && (
        <Animated.View
          entering={settings.reduceMotion ? undefined : FadeIn.duration(250)}
        >
          {description ? <AppText style={styles.description}>{description}</AppText> : null}
          {children}
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel={`Back from ${name} details`}
            style={[styles.closeDetails, { borderColor: colors.border }]}
          >
            <AppText style={[styles.closeDetailsText, { color: colors.accent }]}>
              Back to list
            </AppText>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

export const EntryCard = memo(EntryCardBase);

export function Stat({ label, value }) {
  const { colors } = useSettings();
  return (
    <AppText style={styles.stat}>
      <AppText style={[styles.statLabel, { color: colors.muted }]}>
        {label}:{" "}
      </AppText>
      {value}
    </AppText>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
  },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  image: { width: 72, height: 72 },
  imageFallback: { width: 72, height: 72, borderRadius: 13, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  fallbackLetter: { fontSize: 29, fontWeight: "800" },
  titleBlock: { flex: 1 },
  name: { fontFamily: HKFont, fontSize: 19, lineHeight: 26 },
  chevron: { fontSize: 14 },
  description: { marginTop: 14, fontSize: 15, lineHeight: 23 },
  closeDetails: {
    alignSelf: "flex-start",
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  closeDetailsText: { fontSize: 14, fontWeight: "bold" },
  compactCard: { padding: 10, marginTop: 7 },
  compactImage: { width: 48, height: 48 },
  compactTop: { gap: 8 },
  hiddenTitle: { fontSize: 17, fontWeight: "800" },
  hiddenHelp: { fontSize: 13, lineHeight: 20, marginTop: 6 },
  revealButton: { marginTop: 12, borderWidth: 1, borderRadius: 10, padding: 10, alignSelf: "flex-start" },
  revealText: { fontSize: 14, fontWeight: "700" },
  stat: { marginTop: 4, fontSize: 15 },
  statLabel: { fontWeight: "bold", fontSize: 15 },
});
