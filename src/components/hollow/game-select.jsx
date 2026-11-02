import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HKFont } from '../../constants/hollow';
import { gameList } from '../../games/config';
import { useGame } from '../../games/game-context';
import { useHaptics } from '../../settings/settings-context';

export function GameSelect() {
  const { gameId, loaded, selectGame } = useGame();
  const triggerHaptic = useHaptics();
  const { top, bottom } = useSafeAreaInsets();

  if (!loaded || gameId) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.overlay, { paddingTop: top + 24, paddingBottom: bottom + 24 }]}
    >
      <Text style={styles.heading}>CHOOSE YOUR GAME</Text>
      <View style={styles.list}>
        {gameList.map((game) => (
          <Pressable
            key={game.id}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            onPress={() => {
              triggerHaptic();
              selectGame(game.id);
              router.replace('/');
            }}
            style={styles.card}
          >
            <Text style={styles.title}>{game.title.toUpperCase()}</Text>
            <Text style={styles.tagline}>{game.tagline}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 24,
    zIndex: 900,
    elevation: 900,
  },
  heading: { color: '#fff', fontFamily: HKFont, fontSize: 22, letterSpacing: 4, textAlign: 'center' },
  list: { width: '100%', gap: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    alignItems: 'center',
    gap: 6,
  },
  title: { color: '#fff', fontFamily: HKFont, fontSize: 20, letterSpacing: 3, textAlign: 'center' },
  tagline: { color: '#aaa', fontSize: 14 },
});
