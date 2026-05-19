import { useState, useEffect } from 'react';
import { Download, Smartphone, Info } from 'lucide-react';
import './ApkDownloadBar.css';

const APK_URL = import.meta.env.VITE_APK_URL || import.meta.env.NEXT_PUBLIC_APK_URL || '';

export default function ApkDownloadBar() {
  const [device, setDevice] = useState({
    isAndroid: false,
    isIOS: false,
    isStandalone: false,
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');

    setDevice({ isAndroid, isIOS, isStandalone });
  }, []);

  // Rules: 
  // 1. Do not show on iOS
  // 2. Do not show if already in Standalone PWA mode
  if (device.isIOS || device.isStandalone) {
    return null;
  }

  const handleDownload = () => {
    if (APK_URL) {
      localStorage.setItem('islamediaku_apk_downloaded', Date.now().toString());
    }
  };

  return (
    <div className="apk-bar-container">
      <div className="apk-bar">
        <div className="apk-bar__content">
          <div className="apk-bar__header">
            <div className="apk-bar__icon-wrapper">
              <Smartphone size={22} className="apk-bar__icon" />
            </div>
            <div className="apk-bar__text">
              <h3 className="apk-bar__title">Install di Android</h3>
              <p className="apk-bar__subtitle">Akses lebih cepat dari handphone Anda.</p>
            </div>
          </div>
          
          <div className="apk-bar__actions">
            {APK_URL ? (
              <a 
                href={APK_URL} 
                className="apk-bar__btn apk-bar__btn--active" 
                onClick={handleDownload}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download size={16} />
                Download APK
              </a>
            ) : (
              <div className="apk-bar__btn apk-bar__btn--disabled">
                <Info size={16} />
                APK belum tersedia
              </div>
            )}
          </div>
        </div>
        {APK_URL && (
          <div className="apk-bar__helper">
            <Info size={12} />
            <span>Jika diminta, izinkan instalasi dari browser Anda.</span>
          </div>
        )}
      </div>
    </div>
  );
}
