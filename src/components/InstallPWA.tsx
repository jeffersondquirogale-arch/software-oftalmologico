import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem('pwa_install_dismissed');
      if (!dismissed) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_install_dismissed', '1');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4">
      <div className="bg-primary text-white rounded-xl shadow-xl p-4 flex items-center gap-3">
        <Download className="w-5 h-5 text-accent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Instalar OptiSalud</p>
          <p className="text-xs text-gray-300">Úsala sin conexión desde tu dispositivo</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-accent text-primary rounded-lg text-xs font-semibold hover:bg-yellow-400 transition-colors min-h-[44px] flex items-center justify-center"
        >
          Instalar
        </button>
        <button onClick={handleDismiss} className="text-gray-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
