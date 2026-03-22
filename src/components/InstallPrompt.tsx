import { useState, useEffect } from 'preact/hooks';
import { X, Share2, Plus, Check } from 'lucide-preact';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isMobileViewport() {
  return window.innerWidth <= 768;
}

function detectIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

function isStandalone() {
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

interface Props {
  onVisibilityChange?: (visible: boolean) => void;
}

export function InstallPrompt({ onVisibilityChange }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ios, setIos] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const hide = () => {
    setVisible(false);
    setShowIOSGuide(false);
    onVisibilityChange?.(false);
  };

  useEffect(() => {
    if (isStandalone()) return;

    const mobile = isMobileViewport();
    setIsMobile(mobile);
    const iosDevice = detectIOS();
    setIos(iosDevice);

    const onResize = () => {
      const m = isMobileViewport();
      setIsMobile(m);
      if (!m) { setVisible(false); onVisibilityChange?.(false); }
    };
    window.addEventListener('resize', onResize);

    // iOS: always show the bar (no beforeinstallprompt on Safari)
    if (iosDevice && mobile) {
      setVisible(true);
      onVisibilityChange?.(true);
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (isMobileViewport()) {
        setVisible(true);
        onVisibilityChange?.(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleInstall = async () => {
    if (ios) {
      // Can't trigger programmatically on iOS — show step guide
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') hide();
    setDeferredPrompt(null);
  };

  if (!visible || !isMobile) return null;

  return (
    <>
      {/* ── Bottom install bar ── */}
      <div class="fixed bottom-0 left-0 right-0 z-100 animate-slide-up">
        <div
          class="bg-slate-900 border-t border-slate-700 px-4 flex items-center gap-3"
          style={{ paddingTop: '12px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
        >
          <img src="/icon-192.svg" alt="TacComm" class="w-10 h-10 rounded-xl border border-slate-700 shrink-0" />

          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm leading-tight">TacComm</p>
            <p class="text-slate-500 text-xs">Tactical Communication</p>
          </div>

          {/* Primary CTA — same button for both platforms */}
          <button
            onClick={handleInstall}
            class="shrink-0 bg-emerald-600 active:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Add to Home
          </button>

          <button
            onClick={hide}
            aria-label="Dismiss"
            class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 text-slate-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── iOS step-by-step overlay ── */}
      {showIOSGuide && (
        <div
          class="fixed inset-0 z-200 flex items-end justify-center"
          onClick={() => setShowIOSGuide(false)}
        >
          {/* dim backdrop */}
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            class="relative w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl px-6 pt-5 animate-slide-up"
            style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* handle */}
            <div class="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-5" />

            <p class="text-white font-bold text-lg mb-1">Add to Home Screen</p>
            <p class="text-slate-400 text-sm mb-6">Follow these steps in Safari to install TacComm:</p>

            <ol class="space-y-4">
              <Step n={1} icon={Share2}>
                Tap the <span class="text-white font-semibold">Share</span> button at the bottom of Safari
              </Step>
              <Step n={2} icon={Plus}>
                Scroll down and tap <span class="text-white font-semibold">"Add to Home Screen"</span>
              </Step>
              <Step n={3} icon={Check}>
                Tap <span class="text-white font-semibold">Add</span> — done!
              </Step>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              class="mt-8 w-full bg-slate-800 text-slate-300 font-semibold py-3 rounded-xl text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ n, icon: Icon, children }: { n: number; icon: any; children: preact.ComponentChildren }) {
  return (
    <li class="flex items-start gap-4">
      <span class="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <div class="flex items-center gap-2 flex-1">
        <Icon size={20} class="text-emerald-400 shrink-0" />
        <p class="text-slate-300 text-sm leading-snug">{children}</p>
      </div>
    </li>
  );
}
