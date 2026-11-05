import { router } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "../../../components/hollow/app-text";
import { Button } from "../../../components/hollow/button";
import { ProgressBar } from "../../../components/hollow/progress-bar";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import {
  silksongCollectibleGroups,
  silksongCollectibles,
} from "../../../data/silksong-collectibles";
import { useGame } from "../../../games/game-context";
import { useJournal } from "../../../journal/journal-context";
import { useSettings } from "../../../settings/SettingsContext.jsx";

function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function ProgressRow({ label, done, total, onPress, big }) {
  const { colors } = useSettings();
  const pct = percent(done, total);
  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.rowTop}>
        <AppText style={big ? styles.bigLabel : styles.label}>{label}</AppText>
        <AppText style={big ? styles.bigPct : styles.pct}>{pct}%</AppText>
      </View>
      <ProgressBar pct={pct} label={`${label} progress`} />
      <AppText style={[styles.count, { color: colors.muted }]}>
        {done} / {total} completed · {Math.max(0, total - done)} remaining
      </AppText>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${done} of ${total} completed, ${pct}%`}
    >
      {content}
    </Pressable>
  );
}

export default function ProgressScreen() {
  const { defeated, collected, photos, resetProgress } = useJournal();
  const { config } = useGame();
  const { colors } = useSettings();
  const isSilksong = config.id === "silksong";
  const bosses = config.bosses;
  const items = config.items;
  const collectibles = config.collectibles ?? silksongCollectibles;
  const bossDone = bosses.filter((boss) => defeated[boss.name]).length;
  const itemDone = items.filter((item) => collected[item.name]).length;

  const collectibleProgress = silksongCollectibleGroups.map((group) => {
    const groupItems = collectibles.filter((item) => item.group === group.id);
    const done = groupItems.filter((item) => collected[`c:${item.name}`]).length;
    return { ...group, done, total: groupItems.length };
  });
  const collectibleDone = collectibleProgress.reduce((sum, group) => sum + group.done, 0);
  const collectibleTotal = collectibleProgress.reduce((sum, group) => sum + group.total, 0);

  const totalDone = bossDone + itemDone + (isSilksong ? collectibleDone : 0);
  const totalItems = bosses.length + items.length + (isSilksong ? collectibleTotal : 0);

  const confirmReset = () =>
    Alert.alert(
      "Reset progress?",
      `This clears all defeated bosses and collected ${config.itemsLabel.toLowerCase()}${isSilksong ? " and Silksong collectibles" : ""}. Your photo journal and saved loadouts will remain.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetProgress },
      ],
    );

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

        {isSilksong && (
          <>
            <Title style={styles.sectionTitle}>Collectibles</Title>
            <ProgressRow
              label="All collectibles"
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
                onPress={() => router.push("/progress/collectibles")}
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
        <Button
          label="Reset progress"
          variant="outline"
          onPress={confirmReset}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  label: { fontSize: 18, fontWeight: "bold", flex: 1 },
  pct: { fontSize: 18, fontWeight: "bold" },
  bigLabel: { fontSize: 22, fontWeight: "bold", flex: 1 },
  bigPct: { fontSize: 28, fontWeight: "bold" },
  count: { fontSize: 14 },
  note: { fontSize: 13, lineHeight: 19, paddingHorizontal: 2 },
  sectionTitle: { fontSize: 22, marginTop: 12 },
  gap: { marginTop: 8 },
});
