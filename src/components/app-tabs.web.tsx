import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HK } from '@/constants/hollow';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <View style={styles.tabList}>
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
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={styles.button}>
      <Text style={[styles.label, isFocused && styles.focused]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: HK.tabBar,
    paddingVertical: 10,
  },
  button: { flex: 1, alignItems: 'center' },
  label: { color: HK.muted, fontSize: 16 },
  focused: { color: HK.text, fontWeight: 'bold' },
});
