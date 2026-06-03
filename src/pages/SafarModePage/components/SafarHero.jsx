import { motion } from 'framer-motion';
import { MapPin, X, Plane, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SafarHero() {
  const navigate = useNavigate();

  return (
    <section className="safar-hero" role="banner">
      {/* Decorative Background Elements */}
      <div className="safar-hero__decor">
        <div className="safar-hero__orb safar-hero__orb--1" />
        <div className="safar-hero__orb safar-hero__orb--2" />
        <div className="safar-hero__orb safar-hero__orb--3" />
        <div className="safar-hero__pattern" />
      </div>

      {/* Top Bar */}
      <div className="safar-hero__topbar">
        <div className="flex items-center gap-3">
          <div className="safar-hero__icon-badge">
            <span className="safar-hero__icon-ping" />
            <MapPin className="h-5 w-5 text-emerald-400 relative z-10" />
          </div>
          <span className="text-sm font-bold text-emerald-400 tracking-wider uppercase">Mode Safar Aktif</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="safar-hero__close-btn"
          aria-label="Tutup Mode Safar"
        >
          <X size={20} />
          <span className="hidden sm:inline">Tutup</span>
        </button>
      </div>

      {/* Main Hero Content */}
      <div className="safar-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="safar-hero__text"
        >
          <div className="safar-hero__badge-row">
            <span className="safar-hero__label-badge">
              <Plane size={12} />
              Pendamping Perjalanan Islami
            </span>
          </div>

          <h1 className="safar-hero__title">
            Mode Safar
          </h1>

          <p className="safar-hero__subtitle">
            Kemudahan ibadah dan ketenangan hati di setiap langkah perjalanan Anda. 
            Panduan lengkap jamak, qashar, doa safar, dan arah kiblat — semua dalam satu halaman.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="safar-hero__illustration"
        >
          <div className="safar-hero__illus-ring safar-hero__illus-ring--outer">
            <div className="safar-hero__illus-ring safar-hero__illus-ring--inner">
              <Moon className="h-10 w-10 md:h-14 md:w-14 text-amber-300" />
            </div>
          </div>
          <div className="safar-hero__illus-star safar-hero__illus-star--1">✦</div>
          <div className="safar-hero__illus-star safar-hero__illus-star--2">✧</div>
          <div className="safar-hero__illus-star safar-hero__illus-star--3">✦</div>
        </motion.div>
      </div>
    </section>
  );
}
