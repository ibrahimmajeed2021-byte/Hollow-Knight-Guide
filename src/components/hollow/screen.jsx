import { ScrollView, StyleSheet, View } from "react-native";

import { useTabInset } from "../../hooks/use-tab-inset";
import { useSettings } from "../../settings/SettingsContext";
import { AppHeader } from "./app-header";
import { ThemeBackdrop } from "../../themes/theme-backdrop";
import { layout } from "../../ui/design-system";

export function Screen({ children, scroll = true, contentStyle }) {
  const { colors } = useSettings();
  const inset = useTabInset();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ThemeBackdrop />
      <AppHeader />
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: inset + layout.screenBottom },
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
  content: { paddingTop: layout.screenTop, paddingBottom: layout.screenBottom },
});
