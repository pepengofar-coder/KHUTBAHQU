import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import './AppDownloadPopup.css';

const STORAGE_KEY = 'imk_apk_popup';
const APK_URL = ''; // TODO: Set APK download URL when available
const DISMISS_DAYS = 7;
const DOWNLOAD_DISMISS_DAYS = 30;

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isMobile() {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

function shouldShow() {
  // Never show on iOS
  if (isIOS()) return false;

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data.dismissedAt) {
      const days = data.downloaded ? DOWNLOAD_DISMISS_DAYS : DISMISS_DAYS;
      const diff = Date.now() - data.dismissedAt;
      if (diff < days * 24 * 60 * 60 * 1000) return false;
    }
  } catch { /* ignore */ }
  return true;
}

export default function AppDownloadPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const android = isAndroid();
  const mobile = isMobile();

  useEffect(() => {
    // Delay popup to not be aggressive
    const timer = setTimeout(() => {
      if (shouldShow()) setVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = (downloaded = false) => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        dismissedAt: Date.now(),
        downloaded
      }));
    }, 300);
  };

  const handleDownload = () => {
    if (APK_URL) {
      window.open(APK_URL, '_blank');
    }
    dismiss(true);
  };

  if (!visible) return null;

  return (
    <>
      <div className={`apk-overlay ${closing ? 'closing' : ''}`} onClick={() => dismiss()} />
      <div className={`apk-popup ${closing ? 'closing' : ''}`}>
        <button className="apk-popup__close" onClick={() => dismiss()} aria-label="Tutup">
          <X size={18} />
        </button>

        <div className="apk-popup__icon">
          <img src="/icon-192.png" alt="Islamediaku" width={56} height={56} style={{borderRadius: '12px'}} />
        </div>

        <h3 className="apk-popup__title">Download Aplikasi Islamediaku</h3>

        {android ? (
          <p className="apk-popup__desc">
            Install aplikasi Islamediaku di handphone Anda untuk akses yang lebih cepat dan nyaman.
          </p>
        ) : mobile ? (
          <p className="apk-popup__desc">
            Aplikasi Islamediaku tersedia untuk perangkat Android.
          </p>
        ) : (
          <p className="apk-popup__desc">
            Buka website ini di HP Android Anda untuk menginstall aplikasi Islamediaku.
          </p>
        )}

        <div className="apk-popup__actions">
          {android && (
            <button className="apk-popup__btn apk-popup__btn--primary" onClick={handleDownload}>
              <Download size={16} />
              {APK_URL ? 'Download APK' : 'Segera Tersedia'}
            </button>
          )}
          {!android && !mobile && (
            <button className="apk-popup__btn apk-popup__btn--primary" disabled>
              <Smartphone size={16} />
              Tersedia untuk Android
            </button>
          )}
          <button className="apk-popup__btn apk-popup__btn--ghost" onClick={() => dismiss()}>
            Nanti Saja
          </button>
        </div>
      </div>
    </>
  );
}
