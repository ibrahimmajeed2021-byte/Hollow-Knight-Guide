import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';

import { HKFont } from '../../constants/hollow';
import { useHaptics, useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';

function EntryCardBase({ image, name, summary, description, children }) {
  const { colors, settings } = useSettings();
  const triggerHaptic = useHaptics();
  const [expanded, setExpanded] = useState(settings.startExpanded);

  const toggle = () => {
    if (!settings.reduceMotion) LayoutAnimation.easeInEaseOut();
    triggerHaptic();
    setExpanded((value) => !value);
  };

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={expanded ? 'Collapse details' : 'Expand details'}
      accessibilityState={{ expanded }}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.top}>
        <Image
          source={image}
          style={styles.image}
          contentFit="contain"
          cachePolicy="memory-disk"
          recyclingKey={name}
          accessible={false}
        />
        <View style={styles.titleBlock}>
          <AppText style={styles.name}>{name}</AppText>
          {summary}
        </View>
        <AppText style={[styles.chevron, { color: colors.muted }]}>{expanded ? '▲' : '▼'}</AppText>
      </View>
      {expanded && (
        <View>
          <AppText style={styles.description}>{description}</AppText>
          {children}
        </View>
      )}
    </Pressable>
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
  titleBlock: { flex: 1 },
  name: { fontFamily: HKFont, fontSize: 20 },
  chevron: { fontSize: 14 },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  stat: { marginTop: 4, fontSize: 15 },
  statLabel: { fontWeight: 'bold', fontSize: 15 },
});
