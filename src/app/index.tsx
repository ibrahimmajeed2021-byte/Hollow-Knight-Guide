import { Linking, StyleSheet, Text } from 'react-native';

import { Body, Title } from '@/components/hollow/section-text';
import { Screen } from '@/components/hollow/screen';
import { HK } from '@/constants/hollow';

const EMAIL = 'apolohcr2@outlook.com';

export default function HomeScreen() {
  return (
    <Screen>
      <Title style={styles.big}>Welcome to this guide!</Title>
      <Body>
        This is a guide to help you in Hollow Knight! This app is designed to help you as you
        progress along the game. It is split into multiple sections which you can find using the
        tabs at the bottom. If you don&apos;t want to get spoiled then I would recommend you to only
        use this app if you absolutely need it or have already beaten the game and are looking to
        100% the game. If you do want to get spoiled then please enjoy! This app is a work in
        progress so please expect some things to be missing or not working. I will try to update it
        as often as possible so please check back often! If you have any questions or comments
        please email me at{' '}
        <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>
          {EMAIL}
        </Text>
        . Thank you for using this app! Have fun playing Hollow Knight!
      </Body>
      <Title style={[styles.big, styles.gap]}>Hollow Knight</Title>
      <Body>
        Hollow Knight is a beautifully crafted action-adventure game set in the haunting,
        hand-drawn world of Hallownest, a once-great kingdom now fallen into ruin. Players take
        control of a silent, mysterious knight as they explore vast underground caverns, uncover
        hidden secrets, and battle a wide variety of challenging enemies and bosses. With precise
        combat, fluid movement, and a deep sense of exploration, the game rewards curiosity and
        skill while slowly revealing its rich lore through environmental storytelling. Its
        atmospheric soundtrack and striking art style combine to create an immersive and emotional
        experience that stays with players long after their journey ends.
      </Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  big: { fontSize: 32 },
  gap: { marginTop: 32 },
  link: { color: HK.accent, textDecorationLine: 'underline' },
});
