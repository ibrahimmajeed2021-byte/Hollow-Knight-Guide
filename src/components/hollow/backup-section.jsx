import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, StyleSheet, View } from 'react-native';

import { useJournal } from '../../journal/journal-context';
import { useLoadouts } from '../../loadouts/loadouts-context';
import { useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';
import { Button } from './button';

const APP_ID = 'hollow-knight-guide';
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export function BackupSection() {
  const { colors, settings, update } = useSettings();
  const { defeated, collected, notes, restoreProgress } = useJournal();
  const { loadouts, replaceLoadouts } = useLoadouts();

  const exportBackup = async () => {
    try {
      const backup = {
        app: APP_ID,
        version: 1,
        settings,
        progress: { defeated, collected, notes },
        loadouts,
      };
      const file = new File(Paths.cache, 'hollow-knight-backup.json');
      if (file.exists) file.delete();
      file.create();
      await file.write(JSON.stringify(backup, null, 2));
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing unavailable', 'This device cannot share files.');
        return;
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Save your Hollow Knight Guide backup',
        UTI: 'public.json',
      });
    } catch {
      Alert.alert('Export failed', 'Could not create the backup file.');
    }
  };

  const applyBackup = (backup) => {
    if (isObject(backup.settings)) update(backup.settings);
    restoreProgress({
      defeated: isObject(backup.progress?.defeated) ? backup.progress.defeated : {},
      collected: isObject(backup.progress?.collected) ? backup.progress.collected : {},
      notes: isObject(backup.progress?.notes) ? backup.progress.notes : {},
    });
    replaceLoadouts(Array.isArray(backup.loadouts) ? backup.loadouts : []);
    Alert.alert('Backup restored', 'Your settings, progress and loadouts have been restored.');
  };

  const importBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const backup = JSON.parse(await new File(result.assets[0].uri).text());
      if (!isObject(backup) || backup.app !== APP_ID) {
        Alert.alert('Invalid backup', 'This file is not a Hollow Knight Guide backup.');
        return;
      }
      Alert.alert(
        'Restore backup?',
        'This replaces your current settings, progress and loadouts.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Restore', style: 'destructive', onPress: () => applyBackup(backup) },
        ],
      );
    } catch {
      Alert.alert('Import failed', 'Could not read that file.');
    }
  };

  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AppText style={styles.title}>Backup</AppText>
      <AppText style={[styles.hint, { color: colors.muted }]}>
        Save your settings, boss and charm progress and loadouts to a file, or restore them on a
        new phone. Journal photos are not included.
      </AppText>
      <View style={styles.row}>
        <Button label="Export" onPress={exportBackup} style={styles.flex} />
        <Button label="Import" variant="outline" onPress={importBackup} style={styles.flex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  title: { fontWeight: 'bold', fontSize: 18 },
  hint: { fontSize: 13 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
