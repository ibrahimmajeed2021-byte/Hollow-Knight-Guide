import { router } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useState } from "react";

import { AppText } from "../../../components/hollow/app-text";
import { Button } from "../../../components/hollow/button";
import { ProgressBar } from "../../../components/hollow/progress-bar";
import { Screen } from "../../../components/hollow/screen";
import { SurfaceCard } from "../../../components/hollow/surface-card";
import { space, type } from "../../../ui/design-system";
import { Body, Title } from "../../../components/hollow/section-text";
import { useGame } from "../../../games/game-context";
import { useJournal } from "../../../journal/journal-context";
import { useSettings } from "../../../settings/SettingsContext.jsx";

function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function ProgressRow({ label, done, total, onPress, big }) {
  const { colors } = useSettings();
  const pct = percent(done, total);
  return (
    <SurfaceCard
      style={styles.card}
      onPress={onPress}
      label={onPress ? `${label}, ${done} of ${total} completed, ${pct}%` : undefined}
    >
      <View style={styles.rowTop}>
        <AppText style={big ? styles.bigLabel : styles.label}>{label}</AppText>
        <AppText style={big ? styles.bigPct : styles.pct}>{pct}%</AppText>
      </View>
      <ProgressBar pct={pct} label={`${label} progress`} />
      <AppText style={[styles.count, { color: colors.muted }]}>
        {done} / {total} completed · {Math.max(0, total - done)} remaining
      </AppText>
    </SurfaceCard>
  );
}

export default function ProgressScreen() {
  const { defeated, collected, photos, resetProgress } = useJournal();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);
  const { config } = useGame();
  const { colors } = useSettings();
  const isSilksong = config.id === "silksong";
  const bosses = config.bosses;
  const items = config.items;
  const collectibles = config.collectibles ?? [];
  const collectibleGroups = config.collectibleGroups ?? [];
  const bossDone = bosses.filter((boss) => defeated[boss.name]).length;
  const itemDone = items.filter((item) => collected[item.name]).length;

  const collectibleProgress = collectibleGroups.map((group) => {
    const groupItems = collectibles.filter((item) => item.group === group.id);
    const done = groupItems.filter((item) => collected[`c:${item.name}`]).length;
    return { ...group, done, total: groupItems.length };
  });
  const collectibleDone = collectibleProgress.reduce((sum, group) => sum + group.done, 0);
  const collectibleTotal = collectibleProgress.reduce((sum, group) => sum + group.total, 0);

  const totalDone = bossDone + itemDone + collectibleDone;
  const totalItems = bosses.length + items.length + collectibleTotal;

  const confirmReset = () => {
    resetProgress();
    setConfirmingReset(false);
    setResetMessage(true);
  };

  return (
    <Screen>
      <Button
        label="Back"
        variant="outline"
        onPress={() => router.back()}
        style={{ marginHorizontal: 16, marginTop: 8, alignSelf: "flex-start" }}
      />
      <Title>100% Completion</Title>
      <Body>
        Track everything currently included in the {config.title} guide. Your
        checklist is saved automatically on this device.
      </Body>
      <View style={styles.list}>
        <ProgressRow
          big
          label="Guide completion"
          done={totalDone}
          total={totalItems}
        />
        <AppText style={[styles.note, { color: colors.muted }]}>
          This percentage covers the guide's tracked entries. It is not the
          game's official in-game completion percentage.
        </AppText>

        <Title style={styles.sectionTitle}>Completion breakdown</Title>
        <ProgressRow
          label="Bosses defeated"
          done={bossDone}
          total={bosses.length}
          onPress={() => router.push("/bosses")}
        />
        <ProgressRow
          label={isSilksong ? "Tools & Crests collected" : "Charms collected"}
          done={itemDone}
          total={items.length}
          onPress={() => router.push("/charms")}
        />

        {collectibleProgress.length > 0 && (
          <>
            <Title style={styles.sectionTitle}>Collectibles</Title>
            <ProgressRow
              label={isSilksong ? "All collectibles & tasks" : "All collectibles & challenges"}
              done={collectibleDone}
              total={collectibleTotal}
              onPress={() => router.push("/progress/collectibles")}
            />
            {collectibleProgress.map((group) => (
              <ProgressRow
                key={group.id}
                label={group.title}
                done={group.done}
                total={group.total}
                onPress={() =>
                  !isSilksong
                    ? router.push({
                        pathname: "/progress/collectibles",
                        params: { group: group.id },
                      })
                    : (group.id === "wishes" || group.id === "objectives")
                      ? router.push("/quests")
                      : router.push({
                          pathname: "/charms",
                          params: { category: group.id },
                        })
                }
              />
            ))}
          </>
        )}

        {Platform.OS !== "web" && (
          <Button
            label={`Photo journal (${photos.length})`}
            onPress={() => router.push("/progress/journal")}
            style={styles.gap}
          />
        )}
        {resetMessage ? (
          <AppText accessibilityRole="alert" style={[styles.note, { color: colors.accent }]}>
            Your checklist has been reset. Photos, notes and saved loadouts remain untouched.
          </AppText>
        ) : null}
        {confirmingReset ? (
          <SurfaceCard style={styles.resetConfirmation}>
            <AppText style={styles.resetTitle}>Reset this game's progress?</AppText>
            <AppText style={[styles.note, { color: colors.muted }]}>
              This clears completed bosses, {config.itemsLabel.toLowerCase()} and collectible checkmarks for {config.title}.
              Your photos, notes and loadouts remain saved.
            </AppText>
            <View style={styles.resetActions}>
              <Button label="Cancel" variant="outline" onPress={() => setConfirmingReset(false)} style={styles.resetAction} />
              <Button label="Yes, reset progress" onPress={confirmReset} style={styles.resetAction} />
            </View>
          </SurfaceCard>
        ) : (
          <Button
            label="Reset progress"
            variant="outline"
            onPress={() => { setResetMessage(false); setConfirmingReset(true); }}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: { gap: space.sm },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  label: { ...type.subheading, flex: 1 },
  pct: { fontSize: 18, fontWeight: "bold" },
  bigLabel: { fontSize: 22, fontWeight: "bold", flex: 1 },
  bigPct: { fontSize: 28, fontWeight: "bold" },
  count: { fontSize: 14 },
  note: { fontSize: 13, lineHeight: 19, paddingHorizontal: 2 },
  sectionTitle: { ...type.heading, marginTop: space.md },
  gap: { marginTop: 8 },
  resetConfirmation: { gap: 12 },
  resetTitle: { fontSize: 17, fontWeight: "800" },
  resetActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  resetAction: { flexGrow: 1, minWidth: 125 },
});
