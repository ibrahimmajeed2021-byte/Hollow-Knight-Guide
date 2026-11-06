import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isSecondaryGuideRoute } from '../navigation/route-policy.mjs';

const TAB_BAR_HEIGHT = 64;

export function isTabBarHidden(pathname) {
  return isSecondaryGuideRoute(pathname);
}

export function useTabInset() {
  const { bottom } = useSafeAreaInsets();
  const hidden = isTabBarHidden(usePathname());
  if (Platform.OS === 'web') return 0;
  return bottom + (hidden ? 0 : TAB_BAR_HEIGHT);
}
