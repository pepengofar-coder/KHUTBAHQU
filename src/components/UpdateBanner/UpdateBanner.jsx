import { useState } from 'react';
import { useAppVersion } from '../../hooks/useAppVersion';
import { RefreshCw } from 'lucide-react';
import './UpdateBanner.css';

export default function UpdateBanner() {
  const { updateAvailable, applyUpdate } = useAppVersion();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="update-banner" role="alert">
      <RefreshCw size={18} />
      <span className="update-banner__text">Versi baru tersedia</span>
      <button className="update-banner__btn" onClick={applyUpdate}>
        Perbarui
      </button>
      <button className="update-banner__dismiss" onClick={() => setDismissed(true)} aria-label="Tutup">
        ✕
      </button>
    </div>
  );
}
