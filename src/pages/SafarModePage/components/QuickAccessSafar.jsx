import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft, Clock, Timer, Compass,
  BookHeart, Lightbulb, CheckSquare, X, ArrowRight
} from 'lucide-react';

const STATIC_FEATURES = [
  {
    id: 'qashar',
    title: 'Qashar Prayer',
    description: 'Meringkas shalat fardhu 4 rakaat menjadi 2 rakaat saat safar.',
    icon: ArrowRightLeft,
    color: 'emerald',
    action: 'modal',
    modalContent: {
      title: 'Qashar (Ringkas) Shalat',
      items: [
        { name: 'Dzuhur', from: 4, to: 2 },
        { name: 'Ashar', from: 4, to: 2 },
        { name: 'Isya', from: 4, to: 2 },
      ],
      note: 'Maghrib (3 rakaat) dan Subuh (2 rakaat) tidak dapat di-qashar.'
    }
  },
  {
    id: 'jamak-taqdim',
    title: 'Jamak Taqdim',
    description: 'Menggabungkan dua sholat fardhu di waktu sholat yang pertama.',
    icon: Clock,
    color: 'blue',
    action: 'modal',
    modalContent: {
      title: 'Jamak Taqdim',
      items: [
        { name: 'Dzuhur & Ashar', time: 'Dikerjakan di waktu Dzuhur' },
        { name: 'Maghrib & Isya', time: 'Dikerjakan di waktu Maghrib' },
      ],
      note: 'Syaratnya dikerjakan berurutan, dimulai dari sholat pertama.'
    }
  },
  {
    id: 'jamak-takhir',
    title: 'Jamak Takhir',
    description: 'Menggabungkan dua sholat fardhu di waktu sholat yang kedua.',
    icon: Timer,
    color: 'purple',
    action: 'modal',
    modalContent: {
      title: 'Jamak Takhir',
      items: [
        { name: 'Dzuhur & Ashar', time: 'Dikerjakan di waktu Ashar' },
        { name: 'Maghrib & Isya', time: 'Dikerjakan di waktu Isya' },
      ],
      note: 'Wajib berniat jamak takhir sebelum habis waktu sholat pertama.'
    }
  },
  {
    id: 'kiblat',
    title: 'Qibla Direction',
    description: 'Kompas kiblat presisi menentukan arah Ka’bah dari lokasi Anda.',
    icon: Compass,
    color: 'teal',
    action: 'link',
    href: '/kiblat'
  },
  {
    id: 'doa',
    title: 'Travel Du’a',
    description: 'Kumpulan doa perlindungan dan dzikr safar lengkap terjemahan.',
    icon: BookHeart,
    color: 'gold',
    action: 'scroll',
    scrollTo: 'doa-safar'
  },
  {
    id: 'tips',
    title: 'Islamic Travel Tips',
    description: 'Checklist ibadah & adab safar agar perjalanan diberkahi Allah.',
    icon: Lightbulb,
    color: 'pink',
    action: 'checklist'
  },
];

const colorClasses = {
  emerald: 'safar-feature-card--emerald',
  blue: 'safar-feature-card--blue',
  purple: 'safar-feature-card--purple',
  teal: 'safar-feature-card--teal',
  gold: 'safar-feature-card--gold',
  pink: 'safar-feature-card--pink',
};

function FeatureDetailModal({ feature, onClose }) {
  if (!feature || !feature.modalContent) return null;
  const { modalContent } = feature;

  return (
    <div className="safar-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="safar-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="safar-modal-header">
          <div className="flex items-center gap-3">
            <div className="safar-modal-icon-wrap">
              <feature.icon size={20} />
            </div>
            <h3 className="safar-modal-title">{modalContent.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/85 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="safar-modal-body">
          {modalContent.items.map((item, idx) => (
            <div key={idx} className="safar-modal-item">
              <span className="safar-modal-item-label">{item.name}</span>
              {item.from !== undefined ? (
                <span className="safar-modal-item-value">
                  {item.from} <ArrowRight size={14} /> {item.to} Rakaat
                </span>
              ) : (
                <span className="safar-modal-item-value">{item.time}</span>
              )}
            </div>
          ))}

          {modalContent.note && (
            <div className="safar-modal-note">
              💡 {modalContent.note}
            </div>
          )}
        </div>

        <div className="safar-modal-footer">
          <button onClick={onClose} className="safar-modal-close-btn">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SafarChecklistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const checklist = [
    { label: "Niat ikhlas karena Allah SWT", category: "Persiapan" },
    { label: "Membawa sajadah & perlengkapan sholat portable", category: "Persiapan" },
    { label: "Cek jadwal waktu sholat kota tujuan", category: "Persiapan" },
    { label: "Mengerjakan sholat sunnah safar sebelum berangkat", category: "Keberangkatan" },
    { label: "Membaca doa keluar rumah & naik kendaraan", category: "Keberangkatan" },
    { label: "Bertasbih saat jalan turun, takbir saat jalan menanjak", category: "Perjalanan" },
    { label: "Memperbanyak doa sepanjang jalan (doa musafir mustajab)", category: "Perjalanan" },
    { label: "Memanfaatkan rukhshah jamak-qashar sholat", category: "Ibadah" }
  ];

  return (
    <div className="safar-modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="safar-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="safar-modal-header">
          <div className="flex items-center gap-3">
            <div className="safar-modal-icon-wrap">
              <CheckSquare size={20} />
            </div>
            <h3 className="safar-modal-title">Checklist Ibadah Safar</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/85 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="safar-modal-body">
          {['Persiapan', 'Keberangkatan', 'Perjalanan', 'Ibadah'].map(cat => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2" style={{ marginBottom: '8px' }}>{cat}</h4>
              <ul className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {checklist.filter(i => i.category === cat).map((item, idx) => (
                  <li key={idx} className="safar-checklist-item">
                    <input type="checkbox" className="safar-checklist-checkbox" />
                    <span className="text-sm text-slate-300 font-medium leading-normal">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="safar-modal-footer">
          <button onClick={onClose} className="safar-modal-close-btn">
            Selesai
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuickAccessSafar() {
  const [activeModal, setActiveModal] = useState(null);
  const [isChecklistOpen, setChecklistOpen] = useState(false);

  useEffect(() => {
    const handleOpenChecklist = () => setChecklistOpen(true);
    window.addEventListener('safar-open-checklist', handleOpenChecklist);
    return () => window.removeEventListener('safar-open-checklist', handleOpenChecklist);
  }, []);

  const handleCardClick = (feature) => {
    if (feature.action === 'modal') {
      setActiveModal(feature);
    } else if (feature.action === 'checklist') {
      setChecklistOpen(true);
    } else if (feature.action === 'scroll') {
      window.dispatchEvent(new CustomEvent('safar-open-dua', { detail: { duaId: feature.scrollTo } }));
      setTimeout(() => {
        const el = document.getElementById(feature.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const memoizedFeatures = useMemo(() => STATIC_FEATURES, []);

  return (
    <section id="essentials" className="safar-essentials scroll-mt-24">
      <div className="safar-section-header">
        <span className="safar-section-badge">Travel Essentials</span>
        <h2 className="safar-section-title">Quick Access</h2>
        <p className="safar-section-desc">Kebutuhan dasar ibadah musafir untuk kelancaran safar Anda.</p>
      </div>

      <div className="safar-essentials-grid">
        {memoizedFeatures.map((feature) => {
          const IconComp = feature.icon;
          const isLink = feature.action === 'link';

          const innerContent = (
            <div className={`safar-feature-card ${colorClasses[feature.color]}`}>
              <div className="safar-feature-card__icon-wrap">
                <IconComp size={24} className="safar-feature-card__icon" />
              </div>
              <div className="safar-feature-card__info">
                <h3 className="safar-feature-card__title">{feature.title}</h3>
                <p className="safar-feature-card__desc">{feature.description}</p>
              </div>
              <div className="safar-feature-card__shortcut-indicator">
                <ArrowRight size={14} className="safar-feature-card__arrow" />
              </div>
            </div>
          );

          if (isLink) {
            return (
              <Link key={feature.id} to={feature.href} className="safar-feature-card-wrapper">
                {innerContent}
              </Link>
            );
          }

          return (
            <div
              key={feature.id}
              onClick={() => handleCardClick(feature)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(feature)}
              className="safar-feature-card-wrapper"
            >
              {innerContent}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <FeatureDetailModal feature={activeModal} onClose={() => setActiveModal(null)} />
        )}
        {isChecklistOpen && (
          <SafarChecklistModal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
