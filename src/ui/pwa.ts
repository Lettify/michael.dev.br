import { getLang, getTranslation } from '../i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function initPWA(toastFn: (msg: string) => void) {
  // 1. Online / Offline dynamic detection
  window.addEventListener('offline', () => {
    const msg = getTranslation('toasts.offline', getLang());
    toastFn(msg || '✦ Modo Offline ativo — Navegação em cache completa');
    document.body.classList.add('is-offline');
  });

  window.addEventListener('online', () => {
    const msg = getTranslation('toasts.online', getLang());
    toastFn(msg || '✦ Conexão restabelecida ✦ Online');
    document.body.classList.remove('is-offline');
  });

  // 2. Install prompt (A2HS)
  let deferredPrompt: BeforeInstallPromptEvent | null = null;
  const installBtn = document.getElementById('pwaInstallBtn') as HTMLButtonElement | null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    if (installBtn) {
      installBtn.hidden = false;
    }
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        const msg = getTranslation('toasts.appInstalled', getLang());
        toastFn(msg || '✦ Aplicativo instalado com sucesso!');
      }
    } catch (err) {
      console.warn('[PWA] Prompt error:', err);
    } finally {
      deferredPrompt = null;
      installBtn.hidden = true;
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) installBtn.hidden = true;
    const msg = getTranslation('toasts.appInstalled', getLang());
    toastFn(msg || '✦ Aplicativo instalado com sucesso!');
  });

  // 3. Service Worker registration
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const msg = getTranslation('toasts.updateAvailable', getLang());
              toastFn(msg || '✦ Nova versão do portfólio sincronizada');
            }
          });
        });
      } catch (err) {
        console.warn('[PWA] Service Worker registration failed:', err);
      }
    });
  }
}
