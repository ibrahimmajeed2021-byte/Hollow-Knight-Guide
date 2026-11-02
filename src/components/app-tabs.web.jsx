import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../settings/settings-context';
export default function AppTabs() {
  const { colors } = useSettings();
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <View style={[styles.tabList, { backgroundColor: colors.tabBar }]}>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="charms" href="/charms" asChild>
            <TabButton>Charms</TabButton>
          </TabTrigger>
          <TabTrigger name="bosses" href="/bosses" asChild>
            <TabButton>Bosses</TabButton>
          </TabTrigger>
          <TabTrigger name="map" href="/map" asChild>
            <TabButton>Map</TabButton>
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <TabButton>Progress</TabButton>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}
function TabButton({ children, isFocused, ...props }) {
  const { colors } = useSettings();
  return (
    <Pressable {...props} style={styles.button}>
      <Text
        style={[
          styles.label,
          { color: isFocused ? colors.text : colors.muted },
          isFocused && styles.focused,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  button: { flex: 1, alignItems: 'center' },
  label: { fontSize: 16 },
  focused: { fontWeight: 'bold' },
});
