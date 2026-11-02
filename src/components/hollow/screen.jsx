import { ScrollView, StyleSheet, View } from 'react-native';
import { HK } from '../../constants/hollow';
import { AppHeader } from './app-header';
export function Screen({ children, scroll = true }) {
  return (
    <View style={styles.root}>
      <AppHeader />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      ) : (
        children
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: HK.background },
  content: { paddingTop: 16, paddingBottom: 24 },
});
