import { StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';

import { HK, HKFont } from '@/constants/hollow';

export function Title(props: TextProps) {
  return <Text {...props} style={[styles.title, props.style]} />;
}

export function Body(props: TextProps) {
  return <Text {...props} style={[styles.body, props.style]} />;
}

const styles = StyleSheet.create({
  title: {
    color: HK.text,
    fontFamily: HKFont,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  body: {
    color: HK.text,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
