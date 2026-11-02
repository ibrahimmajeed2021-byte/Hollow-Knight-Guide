import { ScrollView, StyleSheet, View } from "react-native";

import { useTabInset } from "../../hooks/use-tab-inset";
import { useSettings } from "../../settings/settings-context";
import { AppHeader } from "./app-header";

export function Screen({ children, scroll = true }) {
  const { colors } = useSettings();
  const inset = useTabInset();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AppHeader />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: inset + 16 },
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 16, paddingBottom: 32 },
});
