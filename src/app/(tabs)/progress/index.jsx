import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/hollow/app-text';
import { Button } from '../../../components/hollow/button';
import { ProgressBar } from '../../../components/hollow/progress-bar';
import { Screen } from '../../../components/hollow/screen';
import { Body, Title } from '../../../components/hollow/section-text';
import { bosses } from '../../../data/bosses';
import { charms } from '../../../data/charms';
import { useJournal } from '../../../journal/journal-context';
import { useSettings } from '../../../settings/settings-context';

function percent(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}

function ProgressRow({ label, done, total, onPress, big }) {
  const { colors } = useSettings();
  const pct = percent(done, total);
  const content = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.rowTop}>
        <AppText style={big ? styles.bigLabel : styles.label}>{label}</AppText>
        <AppText style={big ? styles.bigPct : styles.pct}>{pct}%</AppText>
      </View>
      <ProgressBar pct={pct} label={`${label} progress`} />
      <AppText style={[styles.count, { color: colors.muted }]}>
        {done} / {total}
      </AppText>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${pct}%`}>
      {content}
    </Pressable>
  );
}

export default function ProgressScreen() {
  const { defeated, collected, photos, resetProgress } = useJournal();
  const bossDone = bosses.filter((b) => defeated[b.name]).length;
  const charmDone = charms.filter((c) => collected[c.name]).length;

  const confirmReset = () =>
    Alert.alert('Reset progress?', 'This clears all defeated bosses and collected charms.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetProgress },
    ]);

  return (
    <Screen>
      <Title>Progress</Title>
      <Body>Tick bosses and charms on their pages to track your run.</Body>
      <View style={styles.list}>
        <ProgressRow
          big
          label="Overall"
          done={bossDone + charmDone}
          total={bosses.length + charms.length}
        />
        <ProgressRow
          label="Bosses"
          done={bossDone}
          total={bosses.length}
          onPress={() => router.push('/bosses')}
        />
        <ProgressRow
          label="Charms"
          done={charmDone}
          total={charms.length}
          onPress={() => router.push('/charms')}
        />
        <Button
          label={`Photo journal (${photos.length})`}
          onPress={() => router.push('/progress/journal')}
          style={styles.gap}
        />
        <Button label="Reset progress" variant="outline" onPress={confirmReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 18, fontWeight: 'bold' },
  pct: { fontSize: 18, fontWeight: 'bold' },
  bigLabel: { fontSize: 22, fontWeight: 'bold' },
  bigPct: { fontSize: 28, fontWeight: 'bold' },
  count: { fontSize: 14 },
  gap: { marginTop: 8 },
});
