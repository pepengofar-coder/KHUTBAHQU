import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, PlusSquare, Info } from 'lucide-react';
import './AppDownloadPopup.css';

// Using Vite env vars, falling back to Next.js naming for compatibility if passed dynamically
const APK_URL = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL || '';
const IOS_APP_URL = import.meta.env.VITE_IOS_APP_URL || import.meta.env.NEXT_PUBLIC_IOS_APP_URL || '';

// LocalStorage keys
const KEYS = {
  DISMISSED: 'islamediaku_install_popup_dismissed_until',
  APK_DL: 'islamediaku_apk_downloaded',
  PWA_INSTALLED: 'islamediaku_pwa_installed',
  IOS_SEEN: 'islamediaku_ios_install_instruction_seen',
};

// Durations in milliseconds
const DAY_MS = 24 * 60 * 60 * 1000;

export default function AppDownloadPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Device detection
  const [device, setDevice] = useState({
    isAndroid: false,
    isIOS: false,
    isDesktop: false,
    isStandalone: false
  });

  useEffect(() => {
    // Detect environment
    const ua = navigator.userAgent;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isMobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
    const isDesktop = !isMobile;
    
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDevice({ isAndroid, isIOS, isDesktop, isStandalone });

    // Capture Android PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if we should show the popup
    const checkShouldShow = () => {
      if (isStandalone) return false;

      try {
        const now = Date.now();
        const dismissedUntil = parseInt(localStorage.getItem(KEYS.DISMISSED) || '0', 10);
        const apkDownloaded = parseInt(localStorage.getItem(KEYS.APK_DL) || '0', 10);
        const pwaInstalled = parseInt(localStorage.getItem(KEYS.PWA_INSTALLED) || '0', 10);
        const iosSeen = parseInt(localStorage.getItem(KEYS.IOS_SEEN) || '0', 10);

        if (now < pwaInstalled) return false; // Never show if installed
        if (now < apkDownloaded) return false;
        if (now < dismissedUntil) return false;
        
        if (isIOS && now < iosSeen) return false;

        return true;
      } catch {
        return true; // If localStorage fails, default to showing
      }
    };

    if (checkShouldShow()) {
      // Delay to not block initial render
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const closePopup = (keyToSet = KEYS.DISMISSED, days = 7) => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      try {
        const expiresAt = Date.now() + (days * DAY_MS);
        localStorage.setItem(keyToSet, expiresAt.toString());
      } catch (e) {
        console.warn('Failed to save popup state', e);
      }
    }, 300);
  };

  const handlePwaInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      closePopup(KEYS.PWA_INSTALLED, 90);
    } else {
      closePopup(KEYS.DISMISSED, 7);
    }
    setDeferredPrompt(null);
  };

  const handleApkDownload = () => {
    if (APK_URL) {
      window.open(APK_URL, '_blank');
      closePopup(KEYS.APK_DL, 30);
    }
  };

  if (!visible) return null;

  // Render Platform-Specific UI
  return (
    <>
      <div className={`apk-overlay ${closing ? 'closing' : ''}`} onClick={() => closePopup()} />
      
      {/* Container class changes based on device for styling differences */}
      <div className={`apk-popup apk-popup--${device.isDesktop ? 'desktop' : 'mobile'} ${closing ? 'closing' : ''}`}>
        <button className="apk-popup__close" onClick={() => closePopup()} aria-label="Tutup">
          <X size={20} />
        </button>

        {/* =========================================
            ANDROID UI
        ========================================= */}
        {device.isAndroid && (
          <div className="apk-popup__content">
            <div className="apk-popup__header">
              <img src="/icon-192.png" alt="Islamediaku" className="apk-popup__app-icon" />
              <div>
                <h3 className="apk-popup__title">Download Aplikasi</h3>
                <p className="apk-popup__subtitle">Islamediaku</p>
              </div>
            </div>
            
            <p className="apk-popup__desc">
              Install Islamediaku di handphone Anda untuk akses yang lebih cepat dan nyaman.
            </p>

            <div className="apk-popup__actions">
              {deferredPrompt ? (
                <button className="apk-popup__btn apk-popup__btn--primary" onClick={handlePwaInstall}>
                  <Download size={18} />
                  Install Web App
                </button>
              ) : null}

              {APK_URL ? (
                <button 
                  className={`apk-popup__btn ${deferredPrompt ? 'apk-popup__btn--outline' : 'apk-popup__btn--primary'}`} 
                  onClick={handleApkDownload}
                >
                  <Smartphone size={18} />
                  Download APK
                </button>
              ) : (
                !deferredPrompt && <div className="apk-popup__empty-state"><Info size={16}/> APK belum tersedia.</div>
              )}
              
              <button className="apk-popup__btn apk-popup__btn--ghost" onClick={() => closePopup()}>
                Nanti Saja
              </button>
            </div>
            {APK_URL && (
              <p className="apk-popup__help">
                Jika diminta, izinkan instalasi dari browser Anda.
              </p>
            )}
          </div>
        )}


        {/* =========================================
            IOS UI
        ========================================= */}
        {device.isIOS && (
          <div className="apk-popup__content">
            <div className="apk-popup__header">
              <img src="/icon-192.png" alt="Islamediaku" className="apk-popup__app-icon" />
              <div>
                <h3 className="apk-popup__title">Install di iPhone</h3>
                <p className="apk-popup__subtitle">Islamediaku</p>
              </div>
            </div>

            <p className="apk-popup__desc">
              Tambahkan Islamediaku ke layar utama agar lebih cepat diakses seperti aplikasi biasa.
            </p>

            {IOS_APP_URL ? (
              <div className="apk-popup__actions" style={{marginTop: '1rem'}}>
                <a href={IOS_APP_URL} target="_blank" rel="noreferrer" className="apk-popup__btn apk-popup__btn--primary" onClick={() => closePopup(KEYS.IOS_SEEN, 14)}>
                  Buka App Store
                </a>
                <button className="apk-popup__btn apk-popup__btn--ghost" onClick={() => closePopup(KEYS.IOS_SEEN, 14)}>
                  Nanti Saja
                </button>
              </div>
            ) : (
              <>
                <div className="apk-popup__ios-steps">
                  <div className="ios-step">
                    <span className="ios-step__num">1</span>
                    <span className="ios-step__text">Buka website ini di <strong>Safari</strong></span>
                  </div>
                  <div className="ios-step">
                    <span className="ios-step__num">2</span>
                    <span className="ios-step__text">Tap tombol Share <Share size={14} style={{display:'inline', verticalAlign:'text-bottom', color:'var(--color-primary)'}} /> di bawah</span>
                  </div>
                  <div className="ios-step">
                    <span className="ios-step__num">3</span>
                    <span className="ios-step__text">Pilih <strong>Add to Home Screen</strong> <PlusSquare size={14} style={{display:'inline', verticalAlign:'text-bottom'}} /></span>
                  </div>
                  <div className="ios-step">
                    <span className="ios-step__num">4</span>
                    <span className="ios-step__text">Tap <strong>Add</strong> di ujung kanan atas</span>
                  </div>
                </div>

                <div className="apk-popup__actions" style={{marginTop: '1.25rem'}}>
                  <button className="apk-popup__btn apk-popup__btn--primary" onClick={() => closePopup(KEYS.IOS_SEEN, 14)}>
                    Mengerti
                  </button>
                </div>
              </>
            )}
          </div>
        )}


        {/* =========================================
            DESKTOP UI
        ========================================= */}
        {device.isDesktop && (
          <div className="apk-popup__content">
            <div className="apk-popup__header">
              <img src="/icon-192.png" alt="Islamediaku" className="apk-popup__app-icon" />
              <div>
                <h3 className="apk-popup__title">Gunakan di Handphone</h3>
                <p className="apk-popup__subtitle">Islamediaku</p>
              </div>
            </div>

            <p className="apk-popup__desc" style={{marginBottom: '1.5rem'}}>
              Install di Android atau tambahkan ke layar utama iPhone untuk pengalaman seperti aplikasi native.
            </p>

            <div className="apk-popup__actions" style={{flexDirection: 'row', gap: '8px'}}>
              {APK_URL && (
                <button className="apk-popup__btn apk-popup__btn--primary" style={{flex: 1}} onClick={handleApkDownload}>
                  <Download size={16} /> APK
                </button>
              )}
              <button className="apk-popup__btn apk-popup__btn--outline" style={{flex: 1}} onClick={() => closePopup()}>
                Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
