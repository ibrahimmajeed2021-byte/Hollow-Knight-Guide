import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import { useSettings } from "../settings/SettingsContext.jsx";

function PolicySection({ heading, children }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <AppText style={styles.heading}>{heading}</AppText>
      <AppText style={styles.copy}>{children}</AppText>
    </View>
  );
}

function PolicyLink({ text, url }) {
  const { colors } = useSettings();
  return (
    <Pressable onPress={() => Linking.openURL(url).catch(() => {})} accessibilityRole="link" accessibilityLabel={text} style={[styles.link, { borderColor: colors.border }]}>
      <AppText style={[styles.linkText, { color: colors.accent }]}>{text} ↗</AppText>
    </Pressable>
  );
}

export default function PrivacyScreen() {
  const { colors } = useSettings();
  return (
    <Screen>
      <View style={styles.page}>
        <Button label="‹ Back" variant="outline" onPress={() => router.back()} style={styles.back} />
        <Title>Privacy notice</Title>
        <AppText style={[styles.date, { color: colors.muted }]}>Last updated 6 November 2026</AppText>
        <AppText style={[styles.intro, { color: colors.muted }]}>
          This explains the data used by the current Hollow Knight Guide app.
          Your guide does not require you to create an account.
        </AppText>

        <PolicySection heading="Saved on your device">
          Your defeated bosses, collected items, completed quests, notes,
          loadouts and preferences are stored locally for the checklist to work.
          Journal photos are stored on your device. You can export a backup
          yourself using Settings; photo files are not included in that backup.
        </PolicySection>

        <PolicySection heading="Internet connections">
          The app may request updated guide JSON from our hosted static API,
          and images or wiki pages from third-party websites. Those websites
          can receive normal connection information, such as your IP address
          and the files requested. The bundled guide remains available when
          the update service is unavailable.
        </PolicySection>

        <PolicySection heading="Advertisements and purchases">
          Where enabled, Google Mobile Ads processes ad requests and provides
          consent controls. RevenueCat is used to check and manage Premium
          purchase entitlements. These providers may process device or
          transaction information according to their own privacy notices.
          Purchases are completed through your device's app store.
        </PolicySection>

        <PolicySection heading="Device permissions">
          If you choose to use the journal or photo features, the app may ask
          to access the camera, photo library or files. You can change device
          permissions through your operating system settings.
        </PolicySection>

        <PolicySection heading="Your choices">
          Use Progress to reset checklist entries, Settings to reset
          preferences, and the photo journal to remove saved photos.
          Ad privacy choices appear in Settings where required.
          Exported backups are controlled by whichever location or service
          you choose to share them with. Resetting local data does not delete
          records held by external ad, purchase, or hosting providers.
        </PolicySection>

        <View style={styles.links}>
          <PolicyLink text="Google privacy policy" url="https://policies.google.com/privacy" />
          <PolicyLink text="RevenueCat privacy policy" url="https://www.revenuecat.com/privacy" />
          <PolicyLink text="Contact developer: apolohcr2@outlook.com" url="mailto:apolohcr2@outlook.com" />
        </View>

        <AppText style={[styles.footer, { color: colors.muted }]}>
          This notice describes the features currently present in the app.
          The privacy and content-rights disclosures should be reviewed
          again before any public store release.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 16, gap: 14 },
  back: { alignSelf: "flex-start" },
  date: { textAlign: "center", fontSize: 12 },
  intro: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  section: { padding: 16, borderWidth: 1, borderRadius: 16, gap: 9 },
  heading: { fontSize: 17, fontWeight: "800" },
  copy: { fontSize: 14, lineHeight: 22 },
  links: { gap: 9 },
  link: { borderWidth: 1, padding: 13, borderRadius: 11, minHeight: 48, justifyContent: "center" },
  linkText: { fontSize: 14, fontWeight: "700" },
  footer: { textAlign: "center", fontSize: 12, lineHeight: 18, paddingBottom: 8 },
});
