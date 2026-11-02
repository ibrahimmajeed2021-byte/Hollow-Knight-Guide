import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { HK, HKFont } from '../../constants/hollow';
export function EntryCard({ image, name, description, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Image source={image} style={styles.image} contentFit="contain" accessibilityLabel={name} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      {children}
    </View>
  );
}
export function Stat({ label, value }) {
  return (
    <Text style={styles.stat}>
      <Text style={styles.statLabel}>{label}: </Text>
      {value}
    </Text>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: HK.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: HK.tabBar,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  image: { width: 72, height: 72 },
  name: { flex: 1, fontFamily: HKFont, fontSize: 20, color: HK.text },
  description: { marginTop: 10, color: HK.text, fontSize: 15, lineHeight: 22 },
  stat: { marginTop: 8, color: HK.text, fontSize: 15 },
  statLabel: { fontWeight: 'bold', color: HK.muted },
});
