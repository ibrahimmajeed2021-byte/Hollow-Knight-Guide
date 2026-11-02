import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HKFont } from '../../constants/hollow';
import { useSettings } from '../../settings/settings-context';
import { AppText } from './app-text';

export function AppHeader() {
  const { top } = useSafeAreaInsets();
  const { colors } = useSettings();
  return (
    <View style={[styles.container, { paddingTop: top + 8, backgroundColor: colors.header }]}>
      <AppText style={[styles.title, { color: colors.headerText }]}>Hollow Knight Guide</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 12, alignItems: 'center' },
  title: { fontSize: 28, fontFamily: HKFont, textAlign: 'center' },
});
