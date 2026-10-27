'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MarqueeConfig, FontFamily, GlowIntensity, DotGridStyle, BezelStyle, ScrollDirection } from '@/types/display';
import { ConfigurationForm } from '@/components/ConfigurationForm';
import { MarqueeDisplay } from '@/components/MarqueeDisplay';
import { InstallModal } from '@/components/InstallModal';

const DEFAULT_CONFIG: MarqueeConfig = {
  text: 'WELCOME TO CENTRAL STATION • PLATFORM 2 • TRAIN 12002 EXP IS ON TIME • PLEASE MIND THE GAP • EMERGENCY PHARMACY OPEN 24/7',
  fontFamily: 'vt323',
  textColor: '#ff9900', // Iconic railway amber
  backgroundColor: '#0a0802',
  speed: 15,
  fontSize: 16,
  direction: 'rtl',
  glowIntensity: 'high',
  dotGrid: 'classic',
  bezel: 'industrial',
  isBlinking: false,
};

function MarqueeApp() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<MarqueeConfig>(DEFAULT_CONFIG);
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Initialize from URL params if present
  useEffect(() => {
    const textParam = searchParams.get('text');
    const fontParam = searchParams.get('font') as FontFamily | null;
    const colorParam = searchParams.get('color');
    const bgParam = searchParams.get('bg');
    const speedParam = searchParams.get('speed');
    const sizeParam = searchParams.get('size');
    const glowParam = searchParams.get('glow') as GlowIntensity | null;
    const dirParam = searchParams.get('dir') as ScrollDirection | null;
    const modeParam = searchParams.get('mode');

    if (textParam || fontParam || colorParam) {
      setConfig((prev) => ({
        ...prev,
        ...(textParam ? { text: textParam } : {}),
        ...(fontParam ? { fontFamily: fontParam } : {}),
        ...(colorParam ? { textColor: colorParam } : {}),
        ...(bgParam ? { backgroundColor: bgParam } : {}),
        ...(speedParam ? { speed: Number(speedParam) || prev.speed } : {}),
        ...(sizeParam ? { fontSize: Number(sizeParam) || prev.fontSize } : {}),
        ...(glowParam ? { glowIntensity: glowParam } : {}),
        ...(dirParam ? { direction: dirParam } : {}),
      }));
    }

    if (modeParam === 'marquee') {
      setIsMarqueeActive(true);
    }
  }, [searchParams]);

  const handleUpdateConfig = (updated: Partial<MarqueeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleLaunchMarquee = () => {
    setIsMarqueeActive(true);
  };

  const handleExitMarquee = () => {
    setIsMarqueeActive(false);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {isMarqueeActive ? (
        <MarqueeDisplay
          config={config}
          onExit={handleExitMarquee}
          onUpdateConfig={handleUpdateConfig}
        />
      ) : (
        <ConfigurationForm
          config={config}
          onChange={handleUpdateConfig}
          onSubmit={handleLaunchMarquee}
          onOpenInstall={() => setIsInstallOpen(true)}
        />
      )}

      {/* PWA App Download Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-amber-500 font-mono">
          Loading LED Marquee...
        </div>
      }
    >
      <MarqueeApp />
    </Suspense>
  );
}
