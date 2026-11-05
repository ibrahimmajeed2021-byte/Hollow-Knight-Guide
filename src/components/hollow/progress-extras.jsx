import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { photoUri, useJournal } from "../../journal/journal-context";
import { takePhoto } from "../../journal/take-photo";
import { useHaptics, useSettings } from "../../settings/SettingsContext.jsx";
import { AppText } from "./app-text";
import { Button } from "./button";
import { Stat } from "./entry-card";

export function BossSummary({ name, health }) {
  const { defeated } = useJournal();
  const { colors } = useSettings();
  return (
    <>
      <Stat label="Health" value={health} />
      {defeated[name] ? (
        <AppText style={[styles.badge, { color: colors.accent }]}>
          ✓ Defeated
        </AppText>
      ) : null}
    </>
  );
}

export function BossExtras({ name }) {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { defeated, toggleDefeated, photos, addPhoto, notes, setNote } =
    useJournal();
  const [draft, setDraft] = useState(notes[name] ?? "");
  const bossPhotos = photos.filter(
    (p) => p.tag?.type === "boss" && p.tag.name === name
  );

  const attach = async () => {
    const uri = await takePhoto();
    if (uri) addPhoto(uri, { tag: { type: "boss", name } });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText style={styles.label}>Defeated</AppText>
        <Switch
          value={!!defeated[name]}
          onValueChange={() => {
            triggerHaptic();
            toggleDefeated(name);
          }}
          accessibilityLabel={`Mark ${name} as defeated`}
          trackColor={{ true: colors.button }}
        />
      </View>
      <View style={styles.photos}>
        {Platform.OS !== "web" &&
          bossPhotos.map((photo) => (
            <Pressable
              key={photo.id}
              onPress={() => router.push(`/progress/photo/${photo.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Open photo of ${name}`}
            >
              <Image
                source={{ uri: photoUri(photo) }}
                style={styles.thumb}
                contentFit="cover"
              />
            </Pressable>
          ))}
      </View>
      <AppText style={styles.label}>My strategy notes</AppText>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onEndEditing={() => setNote(name, draft)}
        onBlur={() => setNote(name, draft)}
        placeholder="Tips, nail upgrades, charms that worked…"
        placeholderTextColor={colors.muted}
        multiline
        accessibilityLabel={`Strategy notes for ${name}`}
        style={[
          styles.notes,
          { color: colors.text, borderColor: colors.border },
        ]}
      />
      {Platform.OS !== "web" && (
        <Button label="Add photo" variant="outline" onPress={attach} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { marginTop: 2, fontSize: 14, fontWeight: "bold" },
  wrap: { marginTop: 14, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontWeight: "bold", fontSize: 15 },
  photos: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  notes: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    minHeight: 70,
    textAlignVertical: "top",
  },
  thumb: { width: 64, height: 64, borderRadius: 8 },
});

export function CharmSummary({ name, notches, id = name, completedLabel = "Collected" }) {
  const { collected } = useJournal();
  const { colors } = useSettings();
  return (
    <>
      {notches != null ? <Stat label="Notches" value={notches} /> : null}
      {collected[id] ? (
        <AppText style={[styles.badge, { color: colors.accent }]}>
          ✓ {completedLabel}
        </AppText>
      ) : null}
    </>
  );
}

export function CharmExtras({ name, id = name, label = "Collected" }) {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { collected, toggleCollected } = useJournal();
  return (
    <View style={[styles.wrap, styles.row]}>
      <AppText style={styles.label}>{label}</AppText>
      <Switch
        value={!!collected[id]}
        onValueChange={() => {
          triggerHaptic();
          toggleCollected(id);
        }}
        accessibilityLabel={`Mark ${name} as ${label.toLowerCase()}`}
        trackColor={{ true: colors.button }}
      />
    </View>
  );
}
