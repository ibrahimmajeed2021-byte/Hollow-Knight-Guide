import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HK } from '@/constants/hollow';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <View style={styles.root}>
      <AppHeader />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>
          {children}
          <AppFooter />
        </ScrollView>
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
