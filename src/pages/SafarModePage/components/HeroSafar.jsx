import { motion } from 'framer-motion';
import { Compass, BookOpen } from 'lucide-react';

export default function HeroSafar({ onStartGuidance, onOpenDua }) {
  return (
    <section className="safar-hero" role="banner" style={{ minHeight: '380px' }}>
      {/* Decorative Background Glows */}
      <div className="safar-hero__decor">
        <div className="safar-hero__orb safar-hero__orb--1" />
        <div className="safar-hero__orb safar-hero__orb--2" />
        <div className="safar-hero__pattern" />
      </div>

      <div className="safar-hero__content">
        {/* Left Column - Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="safar-hero__text"
        >
          <div className="safar-hero__badge-row">
            <span className="safar-hero__label-badge">
              <span className="safar-hero__pulse-dot" />
              Mode Safar Aktif
            </span>
          </div>

          <h1 className="safar-hero__title" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Mode Safar
          </h1>

          <p className="safar-hero__subtitle" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            Pendamping Perjalanan Islami Anda. Temukan panduan ibadah lengkap, 
            kumpulan doa safar esensial, kompas arah kiblat presisi, serta audio dzikir 
            dan tilawah penyejuk perjalanan — semua terintegrasi dalam satu dasbor premium.
          </p>

          <div className="safar-hero__ctas" style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onStartGuidance}
              className="safar-hero__cta-primary"
              style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Compass size={16} style={{ marginRight: '8px' }} />
              Start Guidance
            </button>
            <button 
              onClick={onOpenDua}
              className="safar-hero__cta-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <BookOpen size={16} style={{ marginRight: '8px' }} />
              Open Travel Du'a
            </button>
          </div>
        </motion.div>

        {/* Right Column - Premium SVG Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="safar-hero__illustration-container"
          style={{ width: '400px', height: '400px' }}
        >
          <svg
            viewBox="0 0 400 400"
            className="safar-hero__svg"
            width="400"
            height="400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Glow Ring */}
            <circle cx="200" cy="200" r="140" stroke="url(#gradient-ring)" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="110" stroke="url(#gradient-ring-inner)" strokeWidth="1" />

            {/* Glowing Orb Filter */}
            <g filter="url(#glow-filter)">
              <circle cx="200" cy="200" r="60" fill="url(#gradient-orb)" opacity="0.6" />
            </g>

            {/* Mosque Silhouette */}
            <path
              d="M140 250 H260 V220 C260 190 240 180 200 180 C160 180 140 190 140 220 Z"
              fill="url(#gradient-mosque)"
              opacity="0.9"
            />
            <path
              d="M190 180 C190 160 195 155 200 150 C205 155 210 160 210 180 Z"
              fill="url(#mosque-dome-gold)"
            />
            <line x1="200" y1="150" x2="200" y2="135" stroke="#EAB308" strokeWidth="2" />
            <circle cx="200" cy="135" r="2" fill="#EAB308" />

            {/* Travel Route Path */}
            <path
              d="M 90 280 Q 180 220 220 300 T 320 230"
              stroke="url(#gradient-route)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="safar-svg-route"
            />

            {/* Suitcase */}
            <g transform="translate(100, 240)">
              <rect x="0" y="10" width="70" height="50" rx="8" fill="#0D9488" stroke="#14B8A6" strokeWidth="1.5" />
              <rect x="0" y="10" width="12" height="12" rx="3" fill="#0F766E" />
              <rect x="58" y="10" width="12" height="12" rx="3" fill="#0F766E" />
              <rect x="0" y="48" width="12" height="12" rx="3" fill="#0F766E" />
              <rect x="58" y="48" width="12" height="12" rx="3" fill="#0F766E" />
              <path d="M25 10 V3 H45 V10" stroke="#EAB308" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <line x1="20" y1="10" x2="20" y2="60" stroke="#0F766E" strokeWidth="2" />
              <line x1="50" y1="10" x2="50" y2="60" stroke="#0F766E" strokeWidth="2" />
            </g>

            {/* Compass */}
            <g transform="translate(260, 220)" className="safar-svg-compass">
              <circle cx="30" cy="30" r="26" fill="#0F172A" stroke="#EAB308" strokeWidth="2" />
              <circle cx="30" cy="30" r="21" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />
              <polygon points="30,12 34,30 26,30" fill="#EF4444" />
              <polygon points="30,48 34,30 26,30" fill="#64748B" />
              <circle cx="30" cy="30" r="3" fill="#EAB308" />
            </g>

            {/* Crescent Moon */}
            <path
              d="M 280 80 A 40 40 0 1 0 340 140 A 32 32 0 1 1 280 80 Z"
              fill="url(#gold-glow)"
              filter="url(#subtle-glow)"
            />

            {/* Sparkles */}
            <path d="M120 100 L122 105 L127 107 L122 109 L120 114 L118 109 L113 107 L118 105 Z" fill="#FBBF24" opacity="0.8" className="safar-sparkle-1" />
            <path d="M280 170 L281.5 174 L285.5 175.5 L281.5 177 L280 181 L278.5 177 L274.5 175.5 L278.5 174 Z" fill="#FBBF24" opacity="0.6" className="safar-sparkle-2" />
            <path d="M70 200 L71 203 L74 204 L71 205 L70 208 L69 205 L66 204 L69 203 Z" fill="#38BDF8" opacity="0.7" className="safar-sparkle-3" />

            {/* Definitions */}
            <defs>
              <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6366F1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient-ring-inner" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient-orb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
              <linearGradient id="gradient-mosque" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="gradient-route" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <radialGradient id="mosque-dome-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#EAB308" />
              </radialGradient>
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="subtle-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
