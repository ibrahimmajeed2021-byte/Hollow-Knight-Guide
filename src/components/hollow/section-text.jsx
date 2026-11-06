import { StyleSheet } from 'react-native';

import { HKFont } from '../../constants/hollow';
import { type, layout } from '../../ui/design-system';
import { AppText } from './app-text';

export function Title({ style, ...props }) {
  return <AppText {...props} style={[styles.title, style]} />;
}

export function Body({ style, ...props }) {
  return <AppText {...props} style={[styles.body, style]} />;
}

const styles = StyleSheet.create({
  title: {
    ...type.title,
    fontFamily: HKFont,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: layout.gutter,
  },
  body: {
    ...type.body,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: layout.gutter,
  },
});
