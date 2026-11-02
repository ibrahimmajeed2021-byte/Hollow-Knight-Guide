import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { photoUri, useJournal } from '../../journal/journal-context';
import { takePhoto } from '../../journal/take-photo';
import { useHaptics, useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';
import { Button } from './button';
import { Stat } from './entry-card';

export function BossSummary({ name, health }) {
  const { defeated } = useJournal();
  const { colors } = useSettings();
  return (
    <>
      <Stat label="Health" value={health} />
      {defeated[name] ? (
        <AppText style={[styles.badge, { color: colors.accent }]}>✓ Defeated</AppText>
      ) : null}
    </>
  );
}

export function BossExtras({ name }) {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { defeated, toggleDefeated, photos, addPhoto } = useJournal();
  const bossPhotos = photos.filter((p) => p.tag?.type === 'boss' && p.tag.name === name);

  const attach = async () => {
    const uri = await takePhoto();
    if (uri) addPhoto(uri, { tag: { type: 'boss', name } });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText style={styles.label}>Defeated</AppText>
        <Switch
          value={!!defeated[name]}
          onValueChange={() => {
            triggerHaptic();
            toggleDefeated(name);
          }}
          accessibilityLabel={`Mark ${name} as defeated`}
          trackColor={{ true: colors.button }}
        />
      </View>
      <View style={styles.photos}>
        {bossPhotos.map((photo) => (
          <Pressable
            key={photo.id}
            onPress={() => router.push(`/progress/photo/${photo.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Open photo of ${name}`}
          >
            <Image source={{ uri: photoUri(photo) }} style={styles.thumb} contentFit="cover" />
          </Pressable>
        ))}
      </View>
      <Button label="Add photo" variant="outline" onPress={attach} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { marginTop: 2, fontSize: 14, fontWeight: 'bold' },
  wrap: { marginTop: 14, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontWeight: 'bold', fontSize: 15 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: 64, height: 64, borderRadius: 8 },
});

export function CharmSummary({ name, notches }) {
  const { collected } = useJournal();
  const { colors } = useSettings();
  return (
    <>
      <Stat label="Notches" value={notches} />
      {collected[name] ? (
        <AppText style={[styles.badge, { color: colors.accent }]}>✓ Collected</AppText>
      ) : null}
    </>
  );
}

export function CharmExtras({ name }) {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { collected, toggleCollected } = useJournal();
  return (
    <View style={[styles.wrap, styles.row]}>
      <AppText style={styles.label}>Collected</AppText>
      <Switch
        value={!!collected[name]}
        onValueChange={() => {
          triggerHaptic();
          toggleCollected(name);
        }}
        accessibilityLabel={`Mark ${name} as collected`}
        trackColor={{ true: colors.button }}
      />
    </View>
  );
}
