import { ScrollView, StyleSheet, View } from "react-native";

import { useTabInset } from "../../hooks/use-tab-inset";
import { useSettings } from "../../settings/SettingsContext";
import { AppHeader } from "./app-header";

export function Screen({ children, scroll = true, contentStyle }) {
  const { colors } = useSettings();
  const inset = useTabInset();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AppHeader />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: inset + 24 },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 18, paddingBottom: 32 },
});
