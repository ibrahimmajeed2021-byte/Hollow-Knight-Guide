import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { Screen } from "../components/hollow/screen";
import { Body, Title } from "../components/hollow/section-text";
import { useGame } from "../games/game-context";
import { useGuidedMode } from "../premium/guided-context";
import { usePurchases } from "../purchases/PurchasesContext";
import { useSettings } from "../settings/SettingsContext.jsx";

const SENSITIVITY = [
  { id: "cautious", name: "Cautious", summary: "Reveal roughly 3 upcoming entries per category" },
  { id: "balanced", name: "Balanced", summary: "Reveal roughly 8 upcoming entries per category" },
  { id: "exploratory", name: "Exploratory", summary: "Reveal roughly 18 upcoming entries per category" },
];

function rowPath(kind, item, gameId) {
  if (kind === "boss") return "/bosses";
  if (kind === "item") return "/charms";
  if (gameId === "silksong") {
    return ["objectives", "wishes"].includes(item.group) ? "/quests" : "/charms";
  }
  return "/progress/collectibles";
}

export default function GuidedModeScreen() {
  const { colors, settings, update } = useSettings();
  const { config } = useGame();
  const { isPremium } = usePurchases();
  const guided = useGuidedMode();
  const [hintSteps, setHintSteps] = useState({});

  const upcoming = useMemo(() => [
    { kind: "boss", title: "Bosses", entries: config.bosses || [] },
    { kind: "item", title: config.itemsLabel, entries: config.items || [] },
    { kind: "collectible", title: "Discoveries", entries: config.collectibles || [] },
  ].map(({ kind, title, entries }) => ({
    kind, title,
    entries: entries
      .filter((entry) => !guided.isCompleted(kind, entry) && guided.isVisible(kind, entry))
      .slice(0, 3),
  })), [config, guided]);

  if (!isPremium) return (
    <Screen>
      <Title>Spoiler-free Guided Mode</Title>
      <Body>Premium reveals a small part of the guide at a time, based on your own progress. The original full guide stays unchanged when this mode is off.</Body>
      <Button label="Explore Premium" onPress={() => router.push("/premium")} style={styles.mainButton} />
    </Screen>
  );

  return (
    <Screen>
      <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
      <Title>Spoiler-free Guided Mode</Title>
      <Body>Discover Hollow Knight and Silksong at your own pace. Future names, artwork and locations are concealed until you progress or choose to reveal them.</Body>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <AppText style={styles.heading}>Protect me from spoilers</AppText>
            <AppText style={[styles.body, { color: colors.muted }]}>
              {settings.guidedMode ? "Guided Mode is on for this device." : "Guided Mode is off. Your complete guide is visible as usual."}
            </AppText>
          </View>
          <Switch
            value={settings.guidedMode === true}
            onValueChange={(guidedMode) => update({ guidedMode })}
            accessibilityLabel="Enable spoiler-free Guided Mode"
            trackColor={{ true: colors.button }}
          />
        </View>
        {settings.guidedMode ? (
          <>
            <AppText style={styles.heading}>How many discoveries can I see ahead?</AppText>
            {SENSITIVITY.map((level) => (
              <Pressable
                key={level.id}
                onPress={() => update({ spoilerWindow: level.id })}
                accessibilityRole="radio"
                accessibilityState={{ selected: settings.spoilerWindow === level.id }}
                style={[styles.option, { borderColor: settings.spoilerWindow === level.id ? colors.accent : colors.border }]}
              >
                <View style={styles.flex}>
                  <AppText style={styles.optionName}>{level.name}</AppText>
                  <AppText style={[styles.body, { color: colors.muted }]}>{level.summary}</AppText>
                </View>
                <AppText style={{ color: colors.accent, fontWeight: "800" }}>
                  {settings.spoilerWindow === level.id ? "✓" : "○"}
                </AppText>
              </Pressable>
            ))}
          </>
        ) : null}
      </View>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>A hint, not a walkthrough</AppText>
        <AppText style={[styles.body, { color: colors.muted }]}>
          Your saved journal decides what you've completed. The upcoming discoveries below follow a recommended route; non-linear exploration means you can encounter things earlier or later.
        </AppText>
        {upcoming.map((group) => (
          <View key={group.kind} style={styles.group}>
            <AppText style={[styles.groupTitle, { color: colors.accent }]}>{group.title}</AppText>
            {group.entries.length ? group.entries.map((item) => {
              const key = group.kind + ":" + item.name;
              const level = hintSteps[key] || 0;
              return (
                <View key={key} style={[styles.discovery, { borderColor: colors.border }]}>
                  <AppText style={styles.discoveryName}>{item.name}</AppText>
                  <AppText style={[styles.body, { color: colors.muted }]}>
                    {level > 0 ? guided.hintFor(item, level) : "Need a clue? You control how much is revealed."}
                  </AppText>
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => setHintSteps((previous) => ({ ...previous, [key]: Math.min(2, level + 1) }))}
                      disabled={level >= 2}
                      accessibilityRole="button"
                      style={[styles.action, { borderColor: colors.border, opacity: level >= 2 ? 0.5 : 1 }]}
                    >
                      <AppText style={{ color: colors.accent, fontWeight: "700" }}>
                        {level === 0 ? "Gentle hint" : level === 1 ? "Detailed hint" : "Hint revealed"}
                      </AppText>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push({ pathname: rowPath(group.kind, item, config.id), params: { query: item.name } })}
                      accessibilityRole="button"
                      style={[styles.action, { borderColor: colors.border }]}
                    >
                      <AppText style={{ color: colors.accent, fontWeight: "700" }}>Open guide</AppText>
                    </Pressable>
                  </View>
                </View>
              );
            }) : (
              <AppText style={[styles.body, { color: colors.muted }]}>No upcoming entries in this section.</AppText>
            )}
          </View>
        ))}
      </View>
      <Button label="Open progression planner" onPress={() => router.push("/planner")} style={styles.mainButton} />
      <AppText style={[styles.footer, { color: colors.muted }]}>
        Guided Mode is optional. Turn it off at any time to restore the original unfiltered guide. Completed entries and those you reveal manually are always visible.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginHorizontal: 16, marginTop: 8, alignSelf: "flex-start" },
  mainButton: { marginHorizontal: 16, marginVertical: 12 },
  panel: { marginHorizontal: 16, marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 16, gap: 12 },
  switchRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  flex: { flex: 1 },
  heading: { fontWeight: "800", fontSize: 18 },
  body: { fontSize: 14, lineHeight: 21 },
  option: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderWidth: 1, borderRadius: 12 },
  optionName: { fontSize: 15, fontWeight: "800" },
  group: { marginTop: 12, gap: 8 },
  groupTitle: { fontSize: 17, fontWeight: "800" },
  discovery: { borderWidth: 1, padding: 12, borderRadius: 12, gap: 8 },
  discoveryName: { fontSize: 16, fontWeight: "700" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  action: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  footer: { marginHorizontal: 20, marginVertical: 12, lineHeight: 20, fontSize: 13 },
});
