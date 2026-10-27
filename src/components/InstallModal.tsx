'use client';

import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('SW registration note:', err));
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Download LED Marquee App</h3>
            <p className="text-xs text-neutral-400">Install directly onto your home screen</p>
          </div>
        </div>

        {isStandalone || isInstalled ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-400 mb-4">
            <Check className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">App Already Installed!</p>
              <p className="text-xs text-neutral-400">
                You are running the app in standalone mode or have already installed it.
              </p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-300">
              Install this app on your Android phone, tablet, or desktop to use it full-screen anytime, even without an internet connection!
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-98 transition cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Install App on Device</span>
            </button>
          </div>
        ) : isIOS ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-300">
              To install this LED Marquee app on your iPhone or iPad:
            </p>

            <div className="space-y-3 bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 text-xs">
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex-shrink-0">
                  1
                </span>
                <p className="text-neutral-300 leading-relaxed">
                  Tap the <strong className="text-white inline-flex items-center gap-1 mx-1"><Share2 className="w-3.5 h-3.5 text-blue-400" /> Share</strong> button in Safari's toolbar (bottom of screen).
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex-shrink-0">
                  2
                </span>
                <p className="text-neutral-300 leading-relaxed">
                  Scroll down the share sheet and tap <strong className="text-white inline-flex items-center gap-1 mx-1"><PlusSquare className="w-3.5 h-3.5 text-neutral-300" /> Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex-shrink-0">
                  3
                </span>
                <p className="text-neutral-300 leading-relaxed">
                  Tap <strong className="text-amber-400">Add</strong> in the top right corner. The LED Marquee will launch full-screen!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-neutral-300">
              You can install this app through your browser menu:
            </p>
            <div className="bg-neutral-950/70 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center space-x-2 text-neutral-200">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span><strong>Chrome/Edge on Desktop:</strong> Click the install icon in the URL bar (top right).</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-200">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span><strong>Mobile Browser:</strong> Tap the browser menu ⋮ and select <em>Install App</em> or <em>Add to Home Screen</em>.</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
