'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
  RotateCw, 
  Share2, 
  Sliders,
  Check
} from 'lucide-react';
import { MarqueeConfig, FONT_OPTIONS } from '@/types/display';

interface MarqueeDisplayProps {
  config: MarqueeConfig;
  onExit: () => void;
  onUpdateConfig: (updated: Partial<MarqueeConfig>) => void;
}

export function MarqueeDisplay({ config, onExit, onUpdateConfig }: MarqueeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [forceCssLandscape, setForceCssLandscape] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Orientation & Fullscreen detection
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Attempt native landscape orientation lock if supported
    try {
      const orientation = screen.orientation as unknown as { lock?: (type: string) => Promise<void> };
      if (orientation?.lock) {
        orientation.lock('landscape').catch(() => {
          // Handled silently if not permitted
        });
      }
    } catch {
      // Ignored
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Keyboard navigation (Space to pause/play, Escape to exit, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        triggerControlsVisibility();
      } else if (e.code === 'Escape') {
        onExit();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'ArrowUp') {
        onUpdateConfig({ fontSize: Math.min(30, config.fontSize + 1) });
        triggerControlsVisibility();
      } else if (e.key === 'ArrowDown') {
        onUpdateConfig({ fontSize: Math.max(8, config.fontSize - 1) });
        triggerControlsVisibility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.fontSize, onExit, onUpdateConfig]);

  // Auto-hide controls after 3.5 seconds
  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showQuickSettings) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    triggerControlsVisibility();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showQuickSettings]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as unknown as { webkitRequestFullscreen?: () => void })?.webkitRequestFullscreen) {
        (containerRef.current as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      text: config.text,
      font: config.fontFamily,
      color: config.textColor,
      bg: config.backgroundColor,
      speed: config.speed.toString(),
      size: config.fontSize.toString(),
      glow: config.glowIntensity,
      dir: config.direction,
    });
    const url = `${window.location.origin}/?${params.toString()}&mode=marquee`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Font styling resolver
  const activeFont = FONT_OPTIONS.find((f) => f.id === config.fontFamily) || FONT_OPTIONS[0];

  // Glow shadow generator
  const getGlowStyle = () => {
    const col = config.textColor;
    switch (config.glowIntensity) {
      case 'none':
        return 'none';
      case 'low':
        return `0 0 6px ${col}`;
      case 'medium':
        return `0 0 10px ${col}, 0 0 20px ${col}88`;
      case 'high':
      default:
        return `0 0 10px ${col}, 0 0 25px ${col}, 0 0 50px ${col}88, 0 0 80px ${col}44`;
    }
  };

  const animationDuration = `${config.speed}s`;
  const animationName = config.direction === 'rtl' ? 'marquee-rtl' : 'marquee-ltr';

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerControlsVisibility}
      onTouchStart={triggerControlsVisibility}
      onClick={() => {
        triggerControlsVisibility();
      }}
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none ${
        forceCssLandscape && isPortrait
          ? 'rotate-90 origin-center w-[100vh] h-[100vw] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          : 'w-full h-full'
      }`}
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Landscape Guidance Banner for Mobile Portrait */}
      {isPortrait && !forceCssLandscape && (
        <div className="absolute top-4 left-4 right-4 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 rounded-xl p-3 shadow-2xl flex items-center justify-between text-xs backdrop-blur-md animate-in slide-in-from-top">
          <div className="flex items-center space-x-2">
            <span className="text-xl animate-spin text-amber-400">🔄</span>
            <div>
              <p className="font-bold text-amber-400">Turn Phone to Landscape</p>
              <p className="text-neutral-400">Rotate phone horizontally for authentic train & pharmacy LED banner</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setForceCssLandscape(true);
            }}
            className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition cursor-pointer flex-shrink-0"
          >
            Force Landscape
          </button>
        </div>
      )}

      {/* Main LED Chassis / Board */}
      <div
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${
          config.bezel === 'industrial' ? 'led-bezel' : config.bezel === 'slim' ? 'border-4 border-neutral-800' : ''
        }`}
      >
        {/* LED Matrix Background Grid Pattern */}
        {config.dotGrid === 'classic' && (
          <div className="absolute inset-0 pointer-events-none led-matrix-grid z-10 opacity-70" />
        )}
        {config.dotGrid === 'fine' && (
          <div className="absolute inset-0 pointer-events-none led-matrix-grid-fine z-10 opacity-70" />
        )}

        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none led-scanlines z-10 opacity-50" />

        {/* Diagonal Screen Reflection */}
        <div className="absolute inset-0 pointer-events-none display-reflection z-10" />

        {/* Corner Screws for Industrial Bezel */}
        {config.bezel === 'industrial' && (
          <>
            <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-neutral-700 border border-neutral-900 shadow-inner z-20 flex items-center justify-center opacity-60">
              <div className="w-2.5 h-0.5 bg-neutral-900" />
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-neutral-700 border border-neutral-900 shadow-inner z-20 flex items-center justify-center opacity-60">
              <div className="w-2.5 h-0.5 bg-neutral-900" />
            </div>
            <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-neutral-700 border border-neutral-900 shadow-inner z-20 flex items-center justify-center opacity-60">
              <div className="w-2.5 h-0.5 bg-neutral-900" />
            </div>
            <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-neutral-700 border border-neutral-900 shadow-inner z-20 flex items-center justify-center opacity-60">
              <div className="w-2.5 h-0.5 bg-neutral-900" />
            </div>
          </>
        )}

        {/* Scrolling LED Text Container */}
        <div className="relative w-full flex items-center whitespace-nowrap overflow-visible py-4">
          <div
            className={`inline-block ${activeFont.fontClass} ${
              config.isBlinking ? 'animate-led-blink' : ''
            }`}
            style={{
              animationName,
              animationDuration,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
              color: config.textColor,
              textShadow: getGlowStyle(),
              fontSize: `${config.fontSize}vh`,
              lineHeight: 1.1,
              letterSpacing: '0.08em',
              fontWeight: 700,
              willChange: 'transform',
            }}
          >
            {config.text}
          </div>
        </div>
      </div>

      {/* Floating HUD Controls Bar */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-neutral-900/90 border border-neutral-700/60 rounded-full px-4 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back / Exit */}
        <button
          onClick={onExit}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          title="Back to Configuration (Esc)"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <div className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer"
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Font Size decrease / increase */}
        <div className="flex items-center text-xs text-neutral-300 px-1">
          <button
            onClick={() => onUpdateConfig({ fontSize: Math.max(6, config.fontSize - 1) })}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300 font-bold cursor-pointer"
            title="Decrease Text Size"
          >
            A-
          </button>
          <span className="text-[11px] font-mono px-1">{config.fontSize}</span>
          <button
            onClick={() => onUpdateConfig({ fontSize: Math.min(32, config.fontSize + 1) })}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300 font-bold cursor-pointer"
            title="Increase Text Size"
          >
            A+
          </button>
        </div>

        {/* Speed adjustment */}
        <div className="flex items-center text-xs text-neutral-300 px-1">
          <button
            onClick={() => onUpdateConfig({ speed: Math.min(45, config.speed + 3) })}
            className="px-2 py-1 text-[11px] rounded hover:bg-neutral-800 text-neutral-300 cursor-pointer"
            title="Slower"
          >
            Slower
          </button>
          <span className="text-[10px] text-neutral-400 font-mono">{config.speed}s</span>
          <button
            onClick={() => onUpdateConfig({ speed: Math.max(4, config.speed - 3) })}
            className="px-2 py-1 text-[11px] rounded hover:bg-neutral-800 text-amber-400 font-semibold cursor-pointer"
            title="Faster"
          >
            Faster
          </button>
        </div>

        <div className="w-px h-5 bg-neutral-700 mx-1" />

        {/* Direction Switch */}
        <button
          onClick={() =>
            onUpdateConfig({ direction: config.direction === 'rtl' ? 'ltr' : 'rtl' })
          }
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer text-xs"
          title={`Direction: ${config.direction === 'rtl' ? 'Right to Left' : 'Left to Right'}`}
        >
          {config.direction === 'rtl' ? '◄ RTL' : 'LTR ►'}
        </button>

        {/* Force CSS Landscape Toggle */}
        <button
          onClick={() => setForceCssLandscape(!forceCssLandscape)}
          className={`p-2 rounded-full transition cursor-pointer ${
            forceCssLandscape ? 'text-amber-400 bg-amber-500/20' : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
          title="Toggle 90° Landscape Orientation"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Share Link */}
        <button
          onClick={handleShare}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer relative"
          title="Copy shareable link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition cursor-pointer"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Persistent Subtle Settings Pill if controls are hidden */}
      {!showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowControls(true);
          }}
          className="fixed top-4 right-4 z-40 p-2.5 rounded-full bg-black/40 hover:bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white backdrop-blur-sm transition opacity-40 hover:opacity-100 cursor-pointer"
          title="Show Controls"
        >
          <Sliders className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
