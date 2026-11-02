import { StyleSheet } from 'react-native';

import { AppText } from '../components/hollow/app-text';
import { Screen } from '../components/hollow/screen';

export default function NotFound() {
  return (
    <Screen>
      <AppText style={styles.text}>404 Page Not Found</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 24, textAlign: 'center', marginTop: 40 },
});
