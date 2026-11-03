import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "../../components/hollow/app-text";
import { Button } from "../../components/hollow/button";
import { ProgressBar } from "../../components/hollow/progress-bar";
import { Screen } from "../../components/hollow/screen";
import { Body, Title } from "../../components/hollow/section-text";
import { tips } from "../../data/tips";
import { useGame } from "../../games/game-context";
import { useJournal } from "../../journal/journal-context";
import { useLoadouts } from "../../loadouts/loadouts-context";
import { useSettings } from "../../settings/SettingsContext.jsx";

const tip = tips[Math.floor(Math.random() * tips.length)];
const EMAIL = "apolohcr2@outlook.com";

function Card({ children, onPress, label }) {
  const { colors } = useSettings();
  const style = [
    styles.card,
    { backgroundColor: colors.card, borderColor: colors.border },
  ];
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={style}
    >
      {children}
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colors } = useSettings();
  const { defeated, collected } = useJournal();
  const { loadouts } = useLoadouts();
  const { config } = useGame();
  const bosses = config.bosses;
  const charms = config.items;

  const bossDone = bosses.filter((b) => defeated[b.name]).length;
  const charmDone = charms.filter((c) => collected[c.name]).length;
  const total = bosses.length + charms.length;
  const pct = total ? Math.round(((bossDone + charmDone) / total) * 100) : 0;
  const nextBoss = bosses.find((b) => !defeated[b.name]);
  const lastLoadout = loadouts[0];

  return (
    <Screen>
      <Title style={styles.big}>Your journey</Title>
      <View style={styles.list}>
        <Card
          onPress={() => router.push("/progress")}
          label={`Overall progress ${pct}%`}
        >
          <View style={styles.row}>
            <AppText style={styles.cardTitle}>Overall progress</AppText>
            <AppText style={styles.cardTitle}>{pct}%</AppText>
          </View>
          <ProgressBar pct={pct} label="Overall progress" />
          <AppText style={[styles.small, { color: colors.muted }]}>
            {bossDone}/{bosses.length} bosses · {charmDone}/{charms.length}{" "}
            {config.itemsLabel.toLowerCase()}
          </AppText>
        </Card>

        <Card onPress={() => router.push("/bosses")} label="Next boss">
          <AppText style={[styles.small, { color: colors.muted }]}>
            Next undefeated boss
          </AppText>
          <AppText style={styles.cardTitle}>
            {nextBoss
              ? nextBoss.name
              : bosses.length
              ? "All bosses defeated! 🎉"
              : "Bosses coming soon"}
          </AppText>
        </Card>

        {config.hasLoadouts && (
          <Card>
            <AppText style={[styles.small, { color: colors.muted }]}>
              Charm loadout
            </AppText>
            <AppText style={styles.cardTitle}>
              {lastLoadout ? lastLoadout.name : "No loadouts yet"}
            </AppText>
            {lastLoadout ? (
              <AppText style={[styles.small, { color: colors.muted }]}>
                {lastLoadout.charms.length} charms
              </AppText>
            ) : null}
            <Button
              label={lastLoadout ? "Open loadouts" : "Build a loadout"}
              variant="outline"
              onPress={() => router.push("/charms/loadout")}
            />
          </Card>
        )}

        {config.id === "hollow" && (
          <Card>
            <AppText style={[styles.small, { color: colors.muted }]}>
              Tip
            </AppText>
            <AppText style={styles.tip}>{tip}</AppText>
          </Card>
        )}
      </View>

      <Title style={[styles.big, styles.gap]}>Welcome!</Title>
      <Body>
        This guide helps you as you play {config.title}. Use the tabs at the
        bottom to explore. If you don&apos;t want to be spoiled, only use it
        when you really need it. It&apos;s a work in progress, so please check
        back often! Questions or comments? Email{" "}
        <AppText
          style={[styles.link, { color: colors.accent }]}
          onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
        >
          {EMAIL}
        </AppText>
        . Have fun!
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 32 },
  gap: { marginTop: 24 },
  list: { padding: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  small: { fontSize: 13 },
  tip: { fontSize: 15, lineHeight: 22 },
  link: { textDecorationLine: "underline" },
});
