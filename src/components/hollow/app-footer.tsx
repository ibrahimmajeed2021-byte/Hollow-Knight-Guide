import { StyleSheet, Text, View } from 'react-native';

import { HK } from '@/constants/hollow';

export function AppFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thanks for using this guide!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: HK.header, padding: 12, alignItems: 'center', marginTop: 24 },
  text: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
