export const HKFont = 'TrajanPro';

export const palettes = {
  default: {
    background: '#f2e5eb',
    header: '#565a75',
    headerText: '#fafbf6',
    tabBar: '#c6b7be',
    card: '#fafbf6',
    border: '#c6b7be',
    text: '#0f0f1b',
    muted: '#565a75',
    accent: '#565a75',
    button: '#565a75',
    buttonText: '#ffffff',
  },
  dark: {
    background: '#14141f',
    header: '#2b2d42',
    headerText: '#fafbf6',
    tabBar: '#23253a',
    card: '#1f2030',
    border: '#3a3d5c',
    text: '#f2e5eb',
    muted: '#b5b8d0',
    accent: '#9aa0d6',
    button: '#565a75',
    buttonText: '#ffffff',
  },
};

export const highContrast = {
  light: {
    background: '#ffffff',
    header: '#000000',
    headerText: '#ffffff',
    tabBar: '#ffffff',
    card: '#ffffff',
    border: '#000000',
    text: '#000000',
    muted: '#000000',
    accent: '#0000cc',
    button: '#000000',
    buttonText: '#ffffff',
  },
  dark: {
    background: '#000000',
    header: '#000000',
    headerText: '#ffffff',
    tabBar: '#000000',
    card: '#000000',
    border: '#ffffff',
    text: '#ffffff',
    muted: '#ffffff',
    accent: '#8ab4ff',
    button: '#ffffff',
    buttonText: '#000000',
  },
};

export const fontScales = { small: 0.88, default: 1, large: 1.2, xlarge: 1.4 };

export const hapticStyles = ['default', 'light', 'medium', 'heavy'];

export const defaultSettings = {
  theme: 'default',
  fontSize: 'default',
  hapticsEnabled: true,
  hapticsIntensity: 'default',
  reduceMotion: false,
  startExpanded: false,
  highContrast: false,
};
