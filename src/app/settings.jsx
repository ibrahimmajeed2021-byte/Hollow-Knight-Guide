import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '../components/hollow/app-text';
import { Screen } from '../components/hollow/screen';
import { Title } from '../components/hollow/section-text';
import { defaultSettings } from '../constants/hollow';
import { useHaptics, useSettings } from '../settings/settings-context';

const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];
const FONT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'default', label: 'Default' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra large' },
];
const INTENSITIES = [
  { value: 'default', label: 'Default' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

function Section({ title, children }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </View>
  );
}

function Segmented({ options, value, onChange }) {
  const { colors } = useSettings();
  return (
    <View style={styles.segmented} accessibilityRole="radiogroup">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.option,
              { borderColor: colors.border },
              selected && { backgroundColor: colors.button, borderColor: colors.button },
            ]}
          >
            <AppText
              style={[
                styles.optionText,
                selected && { color: colors.buttonText, fontWeight: 'bold' },
              ]}
            >
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({ label, hint, value, onChange }) {
  const { colors } = useSettings();
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <AppText style={styles.rowLabel}>{label}</AppText>
        {hint ? <AppText style={[styles.hint, { color: colors.muted }]}>{hint}</AppText> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.button }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, update, reset, colors } = useSettings();
  const triggerHaptic = useHaptics();

  return (
    <Screen>
      <Title>Settings</Title>

      <Section title="Appearance">
        <AppText style={styles.rowLabel}>Theme</AppText>
        <Segmented
          options={THEMES}
          value={settings.theme}
          onChange={(theme) => update({ theme })}
        />
        <ToggleRow
          label="High contrast"
          hint="Stronger colours and borders for easier reading"
          value={settings.highContrast}
          onChange={(highContrast) => update({ highContrast })}
        />
      </Section>

      <Section title="Text size">
        <Segmented
          options={FONT_SIZES}
          value={settings.fontSize}
          onChange={(fontSize) => update({ fontSize })}
        />
        <AppText style={[styles.hint, { color: colors.muted }]}>
          Preview: The quick knight explores Hallownest.
        </AppText>
      </Section>

      <Section title="Haptic feedback">
        <ToggleRow
          label="Haptics"
          hint="Vibration when switching tabs"
          value={settings.hapticsEnabled}
          onChange={(hapticsEnabled) => update({ hapticsEnabled })}
        />
        {settings.hapticsEnabled && (
          <>
            <AppText style={styles.rowLabel}>Intensity</AppText>
            <Segmented
              options={INTENSITIES}
              value={settings.hapticsIntensity}
              onChange={(hapticsIntensity) => {
                update({ hapticsIntensity });
                if (hapticsIntensity === 'default') triggerHaptic();
              }}
            />
          </>
        )}
      </Section>

      <Section title="Cards">
        <ToggleRow
          label="Start expanded"
          hint="Show full details on boss and charm cards without tapping"
          value={settings.startExpanded}
          onChange={(startExpanded) => update({ startExpanded })}
        />
      </Section>

      <Section title="Motion">
        <ToggleRow
          label="Reduce motion"
          hint="Turns off map momentum and zoom animations"
          value={settings.reduceMotion}
          onChange={(reduceMotion) => update({ reduceMotion })}
        />
      </Section>

      <Pressable
        onPress={reset}
        accessibilityRole="button"
        style={[styles.resetButton, { backgroundColor: colors.button }]}
      >
        <AppText style={[styles.resetText, { color: colors.buttonText }]}>
          Reset to defaults
        </AppText>
      </Pressable>
      <AppText style={[styles.hint, styles.centered, { color: colors.muted }]}>
        Defaults: {defaultSettings.theme} theme, default text size, default haptics.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 18 },
  rowLabel: { fontSize: 16 },
  hint: { fontSize: 13 },
  centered: { textAlign: 'center', marginTop: 8 },
  segmented: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  optionText: { fontSize: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleText: { flex: 1, gap: 2 },
  resetButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: { fontWeight: 'bold' },
});
