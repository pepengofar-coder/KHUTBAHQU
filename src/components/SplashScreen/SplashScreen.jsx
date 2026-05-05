import { useState, useEffect } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1800);
    const removeTimer = setTimeout(() => onFinish(), 2300);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen${fadeOut ? ' fade-out' : ''}`}>
      <div className="splash-screen__icon">📖</div>
      <h1 className="splash-screen__title">KhutbahQu</h1>
      <p className="splash-screen__subtitle">Materi Khutbah Islam</p>
      <p className="splash-screen__arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
    </div>
  );
}
