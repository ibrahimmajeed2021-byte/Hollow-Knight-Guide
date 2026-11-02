import { StyleSheet } from 'react-native';

import { HKFont } from '../../constants/hollow';
import { AppText } from './app-text';

export function Title({ style, ...props }) {
  return <AppText {...props} style={[styles.title, style]} />;
}

export function Body({ style, ...props }) {
  return <AppText {...props} style={[styles.body, style]} />;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: HKFont,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
