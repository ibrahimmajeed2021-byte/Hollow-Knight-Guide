import { usePathname } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useSettings } from '../settings/settings-context';
export default function AppTabs() {
  const { colors } = useSettings();
  const pathname = usePathname();
  const hideTabBar = pathname.startsWith('/progress/photo') || pathname === '/progress/booth';
  return (
    <NativeTabs
      hidden={hideTabBar}
      minimizeBehavior="onScrollDown"
      backgroundColor={colors.tabBar}
      indicatorColor={colors.background}
      iconColor={{ default: colors.muted, selected: colors.text }}
      labelStyle={{ default: { color: colors.muted }, selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="charms">
        <NativeTabs.Trigger.Label>Charms</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'seal', selected: 'seal.fill' }} md="stars" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bosses">
        <NativeTabs.Trigger.Label>Bosses</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'flame', selected: 'flame.fill' }} md="whatshot" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
