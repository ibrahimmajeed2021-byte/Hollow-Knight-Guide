import { Image } from "expo-image";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { getWikiLocationGuide } from "../../data/wiki-location-guides";
import { useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";
import { layout, radius, space, type } from "../../ui/design-system";

const openSource = (url) => {
  if (url) Linking.openURL(url).catch(() => {});
};

function WikiSourceLink({ label, url, colors }) {
  return (
    <Pressable
      onPress={() => openSource(url)}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.link,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <AppText style={[styles.linkText, { color: colors.accent }]}>
        {label} ↗
      </AppText>
    </Pressable>
  );
}

// Rendered inside an expanded item card only, so remote map images aren't
// downloaded for the entire list on initial load. No native build required.
export function WikiLocationSection({ item, gameId, guideOverride }) {
  const { colors } = useSettings();
  const [failedImageUrl, setFailedImageUrl] = useState(null);
  const guide = guideOverride || getWikiLocationGuide(item, gameId);
  if (!guide) return null;

  const displayMap = guide.imageUrl && failedImageUrl !== guide.imageUrl;

  return (
    <View style={styles.section}>
      <AppText style={[styles.heading, { color: colors.text }]}>
        Where to find it
      </AppText>
      <AppText style={[styles.location, { color: colors.text }]}>
        {guide.location || "See the Wiki for this item's acquisition method."}
      </AppText>

      {displayMap ? (
        <>
          <AppText style={[styles.mapLabel, { color: colors.muted }]}>
            {guide.mapLabel}
          </AppText>
          <Image
            source={{ uri: guide.imageUrl }}
            style={[guide.imageType === "artwork" ? styles.artwork : styles.map, { backgroundColor: colors.background }]}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityLabel={`${item.name}: ${guide.mapLabel.toLowerCase()} from Hollow Knight Wiki`}
            onError={() => setFailedImageUrl(guide.imageUrl)}
          />
        </>
      ) : guide.imageUrl ? (
        <View style={[styles.imageFallback, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <AppText style={[styles.imageFallbackTitle, { color: colors.text }]}>
            {guide.imageType === "artwork" ? "Artwork preview unavailable" : "Map preview unavailable"}
          </AppText>
          <AppText style={[styles.imageFallbackHelp, { color: colors.muted }]}>
            Your location details are still here. Open the wiki source below or try loading the preview again.
          </AppText>
          <Pressable
            onPress={() => setFailedImageUrl(null)}
            accessibilityRole="button"
            accessibilityLabel="Retry wiki image preview"
            style={[styles.retryButton, { borderColor: colors.border }]}
          >
            <AppText style={[styles.retryText, { color: colors.accent }]}>Try image again</AppText>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.links}>
        {guide.fileUrl ? (
          <WikiSourceLink
            label={guide.imageType === "artwork" ? "Open artwork and credits on Wiki" : "Open map and credits on Wiki"}
            url={guide.fileUrl}
            colors={colors}
          />
        ) : null}
        <WikiSourceLink
          label="View full Wiki location guide"
          url={guide.wikiUrl}
          colors={colors}
        />
      </View>
      <AppText style={[styles.credit, { color: colors.muted }]}>
        Location reference: Hollow Knight Wiki. Map screenshots are copyrighted
        game artwork; image credits and usage details are on the linked file page.
        Map previews require internet and may be unavailable.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    gap: 8,
  },
  heading: {
    ...type.subheading,
  },
  location: {
    ...type.body,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  map: {
    width: "100%",
    height: 190,
    borderRadius: radius.control,
  },
  artwork: {
    width: "100%",
    height: 115,
    borderRadius: 12,
  },
  links: {
    gap: 8,
    marginTop: 4,
  },
  link: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    minHeight: layout.touchTarget,
    borderRadius: radius.control,
    borderWidth: 1,
    justifyContent: "center",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600",
  },
  imageFallback: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 8, alignItems: "flex-start" },
  imageFallbackTitle: { fontSize: 15, fontWeight: "700" },
  imageFallbackHelp: { fontSize: 13, lineHeight: 20 },
  retryButton: { borderWidth: 1, borderRadius: radius.control, minHeight: layout.touchTarget, paddingHorizontal: space.lg, paddingVertical: space.sm, justifyContent: "center" },
  retryText: { fontSize: 14, fontWeight: "700" },
  credit: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
