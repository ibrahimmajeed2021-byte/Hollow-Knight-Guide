import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HKFont } from '../../constants/hollow';
import { useHaptics, useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';

export function AppHeader() {
  const { top } = useSafeAreaInsets();
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const onSettings = usePathname() === '/settings';

  const press = () => {
    triggerHaptic();
    if (onSettings) router.back();
    else router.push('/settings');
  };

  return (
    <View style={[styles.container, { paddingTop: top + 8, backgroundColor: colors.header }]}>
      <AppText style={[styles.title, { color: colors.headerText }]}>Hollow Knight Guide</AppText>
      <Pressable
        onPress={press}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={onSettings ? 'Close settings' : 'Settings'}
        style={[styles.action, { top: top + 8 }]}
      >
        <Text style={[styles.icon, { color: colors.headerText }]}>{onSettings ? '✕' : '⚙'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 12, paddingHorizontal: 48, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: HKFont, textAlign: 'center' },
  action: { position: 'absolute', right: 12, height: 36, justifyContent: 'center' },
  icon: { fontSize: 26 },
});
