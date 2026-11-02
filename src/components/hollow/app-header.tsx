import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HK, HKFont } from '@/constants/hollow';

export function AppHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 8 }]}>
      <Text style={styles.title}>Hollow Knight Guide</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: HK.header, paddingBottom: 12, alignItems: 'center' },
  title: { color: HK.headerText, fontSize: 28, fontFamily: HKFont, textAlign: 'center' },
});
