'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Type, 
  Palette, 
  Gauge, 
  Smartphone,
  Eye
} from 'lucide-react';
import { 
  MarqueeConfig, 
  PRESET_THEMES, 
  COLOR_PALETTE, 
  FONT_OPTIONS, 
  DotGridStyle, 
  GlowIntensity, 
  BezelStyle 
} from '@/types/display';

interface ConfigurationFormProps {
  config: MarqueeConfig;
  onChange: (updated: Partial<MarqueeConfig>) => void;
  onSubmit: () => void;
  onOpenInstall: () => void;
}

export function ConfigurationForm({
  config,
  onChange,
  onSubmit,
  onOpenInstall,
}: ConfigurationFormProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'speed'>('text');

  const activeFont = FONT_OPTIONS.find((f) => f.id === config.fontFamily) || FONT_OPTIONS[0];

  // Glow shadow generator for live preview
  const getPreviewGlow = () => {
    const col = config.textColor;
    switch (config.glowIntensity) {
      case 'none':
        return 'none';
      case 'low':
        return `0 0 5px ${col}`;
      case 'medium':
        return `0 0 10px ${col}, 0 0 20px ${col}88`;
      case 'high':
      default:
        return `0 0 8px ${col}, 0 0 20px ${col}, 0 0 35px ${col}88`;
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_THEMES.find((p) => p.id === presetId);
    if (preset) {
      onChange(preset.config);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Navigation */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
            <span className="text-2xl font-mono font-bold">LED</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              LED Marquee Display
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PWA Ready
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              Train station, medical store & advertisement landscape scroller
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Download as Mobile App button */}
          <button
            onClick={onOpenInstall}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Download App</span>
          </button>
        </div>
      </header>

      {/* Live Interactive Preview Box */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            Live Display Preview
          </span>
          <span className="text-neutral-500 font-mono">
            {config.direction === 'rtl' ? 'Right to Left ◄' : 'Left to Right ►'} • {config.speed}s Loop
          </span>
        </div>

        <div
          className={`relative h-32 sm:h-40 rounded-2xl overflow-hidden flex items-center shadow-2xl transition-all ${
            config.bezel === 'industrial' ? 'led-bezel' : 'border border-neutral-800'
          }`}
          style={{ backgroundColor: config.backgroundColor }}
        >
          {/* Dot Grid Layer */}
          {config.dotGrid === 'classic' && (
            <div className="absolute inset-0 pointer-events-none led-matrix-grid opacity-75 z-10" />
          )}
          {config.dotGrid === 'fine' && (
            <div className="absolute inset-0 pointer-events-none led-matrix-grid-fine opacity-75 z-10" />
          )}

          {/* Scanlines Effect */}
          <div className="absolute inset-0 pointer-events-none led-scanlines opacity-40 z-10" />

          {/* Glass Reflection */}
          <div className="absolute inset-0 pointer-events-none display-reflection z-10" />

          {/* Moving Marquee Text */}
          <div className="w-full whitespace-nowrap overflow-hidden">
            <div
              className={`inline-block ${activeFont.fontClass} ${
                config.isBlinking ? 'animate-led-blink' : ''
              }`}
              style={{
                animationName: config.direction === 'rtl' ? 'marquee-rtl' : 'marquee-ltr',
                animationDuration: `${config.speed}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                color: config.textColor,
                textShadow: getPreviewGlow(),
                fontSize: '2.5rem',
                lineHeight: 1.1,
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              {config.text || 'YOUR DISPLAY TEXT HERE...'}
            </div>
          </div>
        </div>
      </section>

      {/* Preset Fast-Pickers */}
      <section className="space-y-3">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Templates & Display Types
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PRESET_THEMES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="p-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition active:scale-95 group cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{preset.icon}</span>
                <span className="font-semibold text-xs text-neutral-200 group-hover:text-amber-400 transition truncate">
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 capitalize">
                {preset.category} layout
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Settings Tabs */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 text-xs font-semibold bg-neutral-950/60">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'text'
                ? 'border-amber-500 text-amber-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Message & Font</span>
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'style'
                ? 'border-amber-500 text-amber-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Colors & LED Effects</span>
          </button>
          <button
            onClick={() => setActiveTab('speed')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center space-x-2 border-b-2 transition cursor-pointer ${
              activeTab === 'speed'
                ? 'border-amber-500 text-amber-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Speed & Motion</span>
          </button>
        </div>

        {/* Tab 1: Text & Font */}
        {activeTab === 'text' && (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Marquee Announcement Text
                </label>
                <button
                  onClick={() => onChange({ text: config.text.toUpperCase() })}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Convert to UPPERCASE
                </button>
              </div>
              <textarea
                rows={3}
                value={config.text}
                onChange={(e) => onChange({ text: e.target.value })}
                placeholder="Enter advertisement, pharmacy notice, or train departure info..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none resize-none transition"
              />
              <p className="text-[11px] text-neutral-500">
                Tip: Use bullet characters (•, +, ⚠️, ★) between notices for a realistic station display look!
              </p>
            </div>

            {/* Typography selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                Digital Display Font
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onChange({ fontFamily: f.id })}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      config.fontFamily === f.id
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-md'
                        : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-200 mb-1">{f.name}</span>
                    <span
                      className={`text-lg font-bold text-amber-400 my-1 truncate ${f.fontClass}`}
                    >
                      {config.text ? config.text.slice(0, 18) : 'SAMPLE 123'}
                    </span>
                    <span className="text-[10px] text-neutral-500">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Colors & Effects */}
        {activeTab === 'style' && (
          <div className="p-6 space-y-6">
            {/* LED Text Color Palettes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                LED Light Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onChange({ textColor: c.value })}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                      config.textColor.toLowerCase() === c.value.toLowerCase()
                        ? 'border-white bg-neutral-800 text-white'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: c.value, boxShadow: `0 0 8px ${c.value}` }}
                    />
                    <span className="text-xs truncate">{c.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Color Inputs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-neutral-400">Custom LED Color:</label>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-neutral-700"
                  />
                  <span className="text-xs font-mono text-neutral-400">{config.textColor}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs text-neutral-400">Display Background:</label>
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => onChange({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-neutral-700"
                  />
                  <span className="text-xs font-mono text-neutral-400">{config.backgroundColor}</span>
                </div>
              </div>
            </div>

            {/* Matrix Texture & Bezel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Dot Grid Density */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  LED Matrix Dots
                </label>
                <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
                  {(['classic', 'fine', 'none'] as DotGridStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => onChange({ dotGrid: style })}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        config.dotGrid === style
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glow Bloom */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Neon Glow Intensity
                </label>
                <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
                  {(['high', 'medium', 'low', 'none'] as GlowIntensity[]).map((glow) => (
                    <button
                      key={glow}
                      onClick={() => onChange({ glowIntensity: glow })}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        config.glowIntensity === glow
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {glow}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Enclosure Bezel */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Station Chassis Bezel
                </label>
                <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
                  {(['industrial', 'slim', 'none'] as BezelStyle[]).map((bez) => (
                    <button
                      key={bez}
                      onClick={() => onChange({ bezel: bez })}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        config.bezel === bez
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {bez}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blinking Toggle */}
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-neutral-300 bg-neutral-950 px-3.5 py-2.5 rounded-xl border border-neutral-800">
                <input
                  type="checkbox"
                  checked={config.isBlinking}
                  onChange={(e) => onChange({ isBlinking: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-neutral-900 border-neutral-700"
                />
                <span>Flashing / Alert Blink Mode</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Speed & Motion */}
        {activeTab === 'speed' && (
          <div className="p-6 space-y-6">
            {/* Speed Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Scroll Cycle Time ({config.speed} seconds)
                </label>
                <span className="text-xs font-mono text-amber-400">
                  {config.speed < 10 ? 'Fast Ticker' : config.speed > 25 ? 'Slow Crawl' : 'Standard Speed'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={config.speed}
                onChange={(e) => onChange({ speed: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Fast (5s)</span>
                <span>Normal (15s)</span>
                <span>Slow (40s)</span>
              </div>
            </div>

            {/* Font Size in Fullscreen */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                  Landscape Text Size ({config.fontSize}vh)
                </label>
                <span className="text-xs font-mono text-amber-400">
                  Scales to mobile & tablet
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="28"
                step="1"
                value={config.fontSize}
                onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Compact (8vh)</span>
                <span>Medium (16vh)</span>
                <span>Gigantic (28vh)</span>
              </div>
            </div>

            {/* Scroll Direction */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                Scroll Direction
              </label>
              <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
                <button
                  onClick={() => onChange({ direction: 'rtl' })}
                  className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
                    config.direction === 'rtl'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>◄ Right to Left (Train & Pharmacy Standard)</span>
                </button>
                <button
                  onClick={() => onChange({ direction: 'ltr' })}
                  className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center space-x-1 ${
                    config.direction === 'ltr'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Left to Right (Reversed) ►</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Action Footer */}
        <div className="p-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for full-screen landscape display</span>
          </div>

          <button
            onClick={onSubmit}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-neutral-950 font-black rounded-xl text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 active:scale-98 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Landscape Marquee</span>
          </button>
        </div>
      </div>

      {/* Feature Explanations / Mobile Guidance */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-900 text-xs text-neutral-400">
        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1.5">
          <h4 className="font-bold text-neutral-200 flex items-center gap-1.5">
            <span>🚆</span> Authentic Transit Aesthetics
          </h4>
          <p className="text-neutral-400 leading-relaxed">
            Engineered with realistic diode matrix patterns, bloom glow, and scanlines matching railway, metro, and airport tickers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1.5">
          <h4 className="font-bold text-neutral-200 flex items-center gap-1.5">
            <span>🔄</span> Auto Landscape Rotation
          </h4>
          <p className="text-neutral-400 leading-relaxed">
            Automatically requests landscape orientation and full screen mode. Works horizontally on smartphones, tablets, and external monitors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-1.5">
          <h4 className="font-bold text-neutral-200 flex items-center gap-1.5">
            <span>📱</span> Install as Mobile App (PWA)
          </h4>
          <p className="text-neutral-400 leading-relaxed">
            Installable directly to home screens on Android & iOS. Operates completely standalone without browser toolbars.
          </p>
        </div>
      </footer>
    </div>
  );
}
