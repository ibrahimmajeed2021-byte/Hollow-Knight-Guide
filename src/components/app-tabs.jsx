import { NativeTabs } from 'expo-router/native-tabs';
import { HK } from '../constants/hollow';
export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={HK.tabBar}
      indicatorColor={HK.background}
      iconColor={{ default: HK.muted, selected: HK.text }}
      labelStyle={{ default: { color: HK.muted }, selected: { color: HK.text } }}
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
    </NativeTabs>
  );
}
