import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { HKFont } from '../../constants/hollow';
import { useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';

function EntryCardBase({ image, name, description, children }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.top}>
        <Image
          source={image}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
          recyclingKey={name}
          accessibilityLabel={name}
        />
        <AppText style={styles.name}>{name}</AppText>
      </View>
      <AppText style={styles.description}>{description}</AppText>
      {children}
    </View>
  );
}

export const EntryCard = memo(EntryCardBase);

export function Stat({ label, value }) {
  const { colors } = useSettings();
  return (
    <AppText style={styles.stat}>
      <AppText style={[styles.statLabel, { color: colors.muted }]}>{label}: </AppText>
      {value}
    </AppText>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  image: { width: 72, height: 72 },
  name: { flex: 1, fontFamily: HKFont, fontSize: 20 },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  stat: { marginTop: 8, fontSize: 15 },
  statLabel: { fontWeight: 'bold', fontSize: 15 },
});
