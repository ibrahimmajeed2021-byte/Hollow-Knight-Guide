import { Image } from "expo-image";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { getWikiLocationGuide } from "../../data/wiki-location-guides";
import { useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";

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
    fontSize: 18,
    fontWeight: "700",
  },
  location: {
    fontSize: 16,
    lineHeight: 24,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  map: {
    width: "100%",
    height: 190,
    borderRadius: 12,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600",
  },
  credit: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});
