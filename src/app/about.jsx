import Constants from "expo-constants";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import { useSettings } from "../settings/SettingsContext.jsx";

const SUPPORT = "apolohcr2@outlook.com";
const REPO = "https://github.com/ibrahimmajeed2021-byte/Hollow-Knight-Guide";
const PRIVACY_URL = REPO + "/blob/master/PRIVACY.md";

function InfoSection({ title, children }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <AppText style={styles.panelTitle}>{title}</AppText>
      {children}
    </View>
  );
}

function ExternalLink({ label, description, url }) {
  const { colors } = useSettings();
  return (
    <Pressable
      onPress={() => Linking.openURL(url).catch(() => {})}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.externalLink,
        { backgroundColor: colors.background, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.flex}>
        <AppText style={[styles.linkTitle, { color: colors.accent }]}>{label}</AppText>
        {description ? <AppText style={[styles.linkHint, { color: colors.muted }]}>{description}</AppText> : null}
      </View>
      <AppText style={[styles.linkArrow, { color: colors.accent }]}>↗</AppText>
    </Pressable>
  );
}

export default function AboutScreen() {
  const { colors } = useSettings();
  const version = Constants.expoConfig?.version ?? "1.1.0";
  return (
    <Screen>
      <View style={styles.page}>
        <Button label="‹ Back" variant="outline" onPress={() => router.back()} style={styles.back} />
        <Title>About this guide</Title>
        <AppText style={[styles.lead, { color: colors.muted }]}>
          A personal field guide for exploring Hallownest and Pharloom.
          Keep track of bosses, items, quests and your own progress in one place.
        </AppText>

        <InfoSection title="An independent fan project">
          <AppText style={styles.paragraph}>
            Hollow Knight Guide is an unofficial, independently developed fan companion.
            It is not made, sponsored, approved or endorsed by Team Cherry.
            Hollow Knight, Silksong, their characters, imagery and music belong to
            their respective rights holders.
          </AppText>
          <AppText style={[styles.small, { color: colors.muted }]}>
            Guide version {version}. This checklist measures progress within the guide,
            not necessarily the game's official completion percentage.
          </AppText>
        </InfoSection>

        <InfoSection title="Sources & acknowledgements">
          <AppText style={styles.paragraph}>
            Guide facts, item descriptions and map references draw on the independent
            Hollow Knight Wiki. Community article text is attributed to the wiki
            contributors; individual files may carry different copyright and usage terms.
            Open a map's source link to see its own credit page.
          </AppText>
          <ExternalLink
            label="Hollow Knight Wiki"
            description="Community information, authors and image source pages"
            url="https://hollowknight.wiki/w/Main_Page"
          />
          <ExternalLink
            label="Team Cherry"
            description="Official developer and game information"
            url="https://www.teamcherry.com.au/games"
          />
          <AppText style={[styles.small, { color: colors.muted }]}>
            Musical compositions in Hollow Knight and Silksong are by Christopher Larkin.
            Listing a source is not a claim of permission to redistribute its artwork or music.
          </AppText>
        </InfoSection>

        <InfoSection title="Privacy & support">
          <AppText style={styles.paragraph}>
            Your checklists, notes and loadouts are saved on this device.
            Network services used for guide updates, images, ads or purchases are
            described in the privacy notice.
          </AppText>
          <Button label="Read privacy notice" onPress={() => router.push("/privacy")} />
          <ExternalLink label="Public privacy policy" description="View the policy on GitHub" url={PRIVACY_URL} />
          <ExternalLink label="Contact the developer" description={SUPPORT} url={"mailto:" + SUPPORT} />
          <ExternalLink label="Source code & updates" description="View this project on GitHub" url={REPO} />
        </InfoSection>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 16, gap: 15 },
  back: { alignSelf: "flex-start", paddingHorizontal: 16 },
  lead: { fontSize: 15, lineHeight: 23, textAlign: "center", marginHorizontal: 10 },
  panel: { padding: 17, gap: 12, borderWidth: 1, borderRadius: 18 },
  panelTitle: { fontSize: 19, fontWeight: "800" },
  paragraph: { fontSize: 15, lineHeight: 23 },
  small: { fontSize: 12, lineHeight: 18 },
  externalLink: { padding: 14, minHeight: 54, borderRadius: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  flex: { flex: 1, gap: 4 },
  linkTitle: { fontSize: 15, fontWeight: "700" },
  linkHint: { fontSize: 12 },
  linkArrow: { fontSize: 19 },
});
