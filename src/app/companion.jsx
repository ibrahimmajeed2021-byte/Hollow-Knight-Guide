import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import { useGame } from "../games/game-context";
import { useJournal } from "../journal/journal-context";
import { useGuidedMode } from "../premium/guided-context";
import { buildSuggestedPlan, getEntry } from "../premium/planner-logic.mjs";
import { usePurchases } from "../purchases/PurchasesContext";
import { useSettings } from "../settings/SettingsContext.jsx";
import { resolveTheme } from "../themes/theme-catalog";

const FEATURES = [
  {
    id: "guided",
    symbol: "◈",
    title: "Guided exploration",
    description: "Keep later discoveries hidden and request hints when you're ready.",
    path: "/guided",
  },
  {
    id: "planner",
    symbol: "⌁",
    title: "Your progression plan",
    description: "Choose a milestone and follow suggested preparation steps.",
    path: "/planner",
  },
  {
    id: "studio",
    symbol: "✧",
    title: "Make it yours",
    description: "Themes, accents, card layouts and your Home dashboard.",
    path: "/premium-studio",
  },
];

function FeatureRow({ feature, detail, isPremium, colors }) {
  const destination = isPremium ? feature.path : "/premium";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={feature.title + (isPremium ? "" : ", Premium feature")}
      onPress={() => router.push(destination)}
      style={({ pressed }) => [
        styles.feature,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.82 : 1 },
      ]}
    >
      <View style={[styles.symbolWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <AppText style={[styles.symbol, { color: colors.accent }]}>{feature.symbol}</AppText>
      </View>
      <View style={styles.flex}>
        <AppText style={styles.featureTitle}>{feature.title}</AppText>
        <AppText style={[styles.featureDescription, { color: colors.muted }]}>{feature.description}</AppText>
        {isPremium && detail ? (
          <AppText style={[styles.featureStatus, { color: colors.accent }]}>{detail}</AppText>
        ) : null}
      </View>
      <AppText style={[styles.arrow, { color: colors.accent }]}>{isPremium ? "›" : "🔒"}</AppText>
    </Pressable>
  );
}

export default function CompanionScreen() {
  const { colors, settings } = useSettings();
  const { isPremium } = usePurchases();
  const { config } = useGame();
  const { defeated, collected } = useJournal();
  const guided = useGuidedMode();

  const goalRef = guided.goal
    ? getEntry(config, guided.goal.kind + ":" + guided.goal.name)
    : null;
  const plan = goalRef
    ? buildSuggestedPlan(config, guided.goal, defeated, collected)
    : [];
  const finished = plan.filter((step) => step.completed).length;
  const next = plan.find((step) => !step.completed);
  const theme = resolveTheme(settings.themeStyle);

  const details = {
    guided: settings.guidedMode ? "Enabled · " + (settings.spoilerWindow || "balanced") + " visibility" : "Currently off",
    planner: goalRef ? finished + " of " + plan.length + " steps finished" : "No goal selected",
    studio: theme.name + " theme",
  };

  return (
    <Screen contentStyle={styles.screen}>
      <Button
        label="Back"
        variant="outline"
        onPress={() => router.back()}
        style={styles.back}
      />
      <View style={styles.intro}>
        <AppText style={[styles.eyebrow, { color: colors.accent }]}>
          {isPremium ? "YOUR PREMIUM COMPANION" : "DISCOVER PREMIUM"}
        </AppText>
        <Title style={styles.title}>Your journey, your way.</Title>
        <AppText style={[styles.subtitle, { color: colors.muted }]}>
          {isPremium
            ? "A quieter place for your personal guidance and customisation. Your complete field guide is always one tap away."
            : "The free guide already includes the bosses, locations, items and progress tools. Premium adds a more personal way to explore."}
        </AppText>
      </View>

      {isPremium && goalRef ? (
        <View style={[styles.goal, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={[styles.eyebrow, { color: colors.accent }]}>YOUR CURRENT GOAL</AppText>
          <AppText style={styles.goalName}>{goalRef.entry.name}</AppText>
          <AppText style={[styles.featureDescription, { color: colors.muted }]}>
            {next
              ? "Next suggested step: " + (guided.isVisible(next.kind, next.entry) ? next.entry.name : "an undiscovered step")
              : "All suggested steps completed."}
          </AppText>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: (plan.length ? Math.round(finished / plan.length * 100) : 0) + "%" }]} />
          </View>
          <Pressable onPress={() => router.push("/planner")} accessibilityRole="button" style={styles.goalLink}>
            <AppText style={[styles.link, { color: colors.accent }]}>Continue planning ›</AppText>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.features}>
        <AppText style={styles.heading}>{isPremium ? "Your tools" : "Beyond the field guide"}</AppText>
        {FEATURES.map((feature) => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            detail={details[feature.id]}
            isPremium={isPremium}
            colors={colors}
          />
        ))}
      </View>

      <View style={[styles.benefits, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>{isPremium ? "Always part of Premium" : "What stays free"}</AppText>
        <AppText style={[styles.featureDescription, { color: colors.muted }]}>
          {isPremium
            ? "Ad-free use, offline guide access, your exclusive themes and additional selector tracks are available alongside the tools above."
            : "Complete guide entries, locations, images, progress tracking, search, loadouts and accessibility settings remain free."}
        </AppText>
        <Button
          label={isPremium ? "Manage Premium" : "See Premium plans and benefits"}
          onPress={() => router.push("/premium")}
          variant={isPremium ? "outline" : "solid"}
        />
      </View>
      <Pressable
        onPress={() => router.replace("/")}
        accessibilityRole="button"
        style={styles.returnLink}
      >
        <AppText style={[styles.link, { color: colors.accent }]}>Return to the field guide</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 10, paddingBottom: 32 },
  back: { alignSelf: "flex-start", marginHorizontal: 16, marginTop: 6 },
  intro: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { marginTop: 0, paddingHorizontal: 0, textAlign: "left", fontSize: 31 },
  subtitle: { fontSize: 15, lineHeight: 23 },
  features: { paddingHorizontal: 16, marginTop: 22, gap: 10 },
  heading: { fontSize: 19, fontWeight: "800", marginBottom: 2 },
  feature: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderRadius: 16, padding: 14, minHeight: 100,
  },
  symbolWrap: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  symbol: { fontSize: 25, fontWeight: "700" },
  flex: { flex: 1, gap: 4 },
  featureTitle: { fontSize: 17, fontWeight: "800" },
  featureDescription: { fontSize: 14, lineHeight: 21 },
  featureStatus: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  arrow: { fontSize: 20 },
  goal: { marginHorizontal: 16, marginTop: 20, borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  goalName: { fontSize: 21, fontWeight: "800" },
  progressTrack: { height: 6, borderRadius: 6, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 6 },
  goalLink: { alignSelf: "flex-start", paddingVertical: 6 },
  link: { fontSize: 15, fontWeight: "700" },
  benefits: { marginHorizontal: 16, marginTop: 22, borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  returnLink: { alignItems: "center", padding: 18, marginTop: 4 },
});
