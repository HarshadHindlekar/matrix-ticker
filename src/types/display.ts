export type FontFamily = 
  | 'vt323'
  | 'silkscreen'
  | 'shareTech'
  | 'mono'
  | 'sans';

export type GlowIntensity = 'none' | 'low' | 'medium' | 'high';
export type DotGridStyle = 'none' | 'fine' | 'classic';
export type BezelStyle = 'industrial' | 'slim' | 'none';
export type ScrollDirection = 'rtl' | 'ltr';

export interface MarqueeConfig {
  text: string;
  fontFamily: FontFamily;
  textColor: string;
  backgroundColor: string;
  speed: number; // 5 (fast) to 40 (slow) seconds
  fontSize: number; // in vh or rem
  direction: ScrollDirection;
  glowIntensity: GlowIntensity;
  dotGrid: DotGridStyle;
  bezel: BezelStyle;
  isBlinking: boolean;
}

export interface PresetTheme {
  id: string;
  name: string;
  category: 'transit' | 'medical' | 'retail' | 'alert';
  icon: string;
  config: Partial<MarqueeConfig>;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'train-station',
    name: 'Train Station LED',
    category: 'transit',
    icon: '🚆',
    config: {
      text: 'TRAIN 12002 NEW DELHI EXP • PLATFORM 3 • ARRIVING ON TIME • PLEASE MIND THE GAP',
      fontFamily: 'vt323',
      textColor: '#ff9900', // Classic Amber LED
      backgroundColor: '#0a0802',
      speed: 16,
      fontSize: 16,
      direction: 'rtl',
      glowIntensity: 'high',
      dotGrid: 'classic',
      bezel: 'industrial',
      isBlinking: false,
    },
  },
  {
    id: 'medical-pharmacy',
    name: '24/7 Medical & Pharmacy',
    category: 'medical',
    icon: '⚕️',
    config: {
      text: '+ 24X7 EMERGENCY PHARMACY + ALL MEDICINES AVAILABLE + FREE HOME DELIVERY + CALL 1800-MED-CARE +',
      fontFamily: 'shareTech',
      textColor: '#00ff66', // Bright Medical Green
      backgroundColor: '#020f06',
      speed: 14,
      fontSize: 15,
      direction: 'rtl',
      glowIntensity: 'high',
      dotGrid: 'classic',
      bezel: 'industrial',
      isBlinking: false,
    },
  },
  {
    id: 'emergency-alert',
    name: 'Red Alert / Emergency',
    category: 'alert',
    icon: '🚨',
    config: {
      text: '⚠️ CAUTION: TRACK WORK IN PROGRESS • SPEED RESTRICTION 30 KM/H • STAY CLEAR OF PLATFORM EDGE ⚠️',
      fontFamily: 'vt323',
      textColor: '#ff2222', // Ruby Red
      backgroundColor: '#120202',
      speed: 12,
      fontSize: 17,
      direction: 'rtl',
      glowIntensity: 'high',
      dotGrid: 'classic',
      bezel: 'industrial',
      isBlinking: false,
    },
  },
  {
    id: 'metro-digital',
    name: 'Metro Cyber Cyan',
    category: 'transit',
    icon: '🚇',
    config: {
      text: 'NEXT METRO IN 2 MIN • TERMINAL 3 AIRPORT EXPRESS • DOORS WILL OPEN ON THE LEFT',
      fontFamily: 'silkscreen',
      textColor: '#00f0ff', // Cyber Cyan
      backgroundColor: '#020b12',
      speed: 15,
      fontSize: 14,
      direction: 'rtl',
      glowIntensity: 'high',
      dotGrid: 'fine',
      bezel: 'slim',
      isBlinking: false,
    },
  },
  {
    id: 'supermarket-sale',
    name: 'Store Advertisement',
    category: 'retail',
    icon: '🏷️',
    config: {
      text: '🔥 MEGA WEEKEND SALE! FLAT 50% OFF ON ALL FRESH PRODUCE & ELECTRONICS • SHOP NOW 🔥',
      fontFamily: 'sans',
      textColor: '#ffee00', // Yellow
      backgroundColor: '#0f0e02',
      speed: 13,
      fontSize: 16,
      direction: 'rtl',
      glowIntensity: 'medium',
      dotGrid: 'fine',
      bezel: 'slim',
      isBlinking: false,
    },
  },
];

export const COLOR_PALETTE = [
  { name: 'Amber Orange (Train)', value: '#ff9900' },
  { name: 'Pharmacy Green', value: '#00ff66' },
  { name: 'Emergency Red', value: '#ff2828' },
  { name: 'Cyber Cyan', value: '#00f0ff' },
  { name: 'Highway Yellow', value: '#ffee00' },
  { name: 'Neon Magenta', value: '#ff1493' },
  { name: 'Pure White LED', value: '#ffffff' },
  { name: 'Ice Blue', value: '#70d6ff' },
];

export const FONT_OPTIONS: { id: FontFamily; name: string; fontClass: string; desc: string }[] = [
  { id: 'vt323', name: 'VT323 Digital', fontClass: 'font-[family-name:var(--font-vt323)]', desc: 'Classic railway & airport board' },
  { id: 'shareTech', name: 'Share Tech Mono', fontClass: 'font-[family-name:var(--font-share-tech)]', desc: 'Medical store & hospital ticker' },
  { id: 'silkscreen', name: 'Silkscreen Matrix', fontClass: 'font-[family-name:var(--font-silkscreen)]', desc: 'Dot-matrix pixel announcement' },
  { id: 'mono', name: 'System Monospace', fontClass: 'font-mono', desc: 'Standard terminal typography' },
  { id: 'sans', name: 'Heavy Sans Display', fontClass: 'font-[family-name:var(--font-inter)] font-black uppercase tracking-widest', desc: 'High visibility advertisement' },
];
