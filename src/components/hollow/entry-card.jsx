import { Image } from "expo-image";
import { memo, useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { HKFont } from "../../constants/hollow";
import { useHaptics, useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";

function EntryCardBase({ image, name, summary, description, children }) {
  const { colors, settings } = useSettings();
  const triggerHaptic = useHaptics();
  const [expanded, setExpanded] = useState(settings.startExpanded);
  const [failedImageKey, setFailedImageKey] = useState(null);
  const imageKey = typeof image === "number"
    ? String(image)
    : image?.uri ?? JSON.stringify(image ?? null);
  const showArtwork = !!image && failedImageKey !== imageKey;

  const toggle = () => {
    if (!settings.reduceMotion) LayoutAnimation.easeInEaseOut();
    triggerHaptic();
    setExpanded((value) => !value);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={name}
        accessibilityHint={expanded ? "Collapse details" : "Expand details"}
        accessibilityState={{ expanded }}
        style={styles.top}
      >
        {showArtwork ? (
          <Image
            source={image}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
            recyclingKey={name}
            onError={() => setFailedImageKey(imageKey)}
            accessible={false}
          />
        ) : (
          <View
            style={[styles.imageFallback, { borderColor: colors.border, backgroundColor: colors.background }]}
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
  stat: { marginTop: 4, fontSize: 15 },
  statLabel: { fontWeight: "bold", fontSize: 15 },
});
