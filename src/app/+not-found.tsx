import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/hollow/screen';
import { HK } from '@/constants/hollow';

export default function NotFound() {
  return (
    <Screen>
      <Text style={styles.text}>404 Page Not Found</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { color: HK.text, fontSize: 24, textAlign: 'center', marginTop: 40 },
});
