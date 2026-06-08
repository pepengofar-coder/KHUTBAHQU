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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full flex items-center justify-center bg-slate-800/80">
              <feature.icon size={20} className="text-teal-400" />
            </div>
            <h3 className="font-bold text-white text-lg">{modalContent.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {modalContent.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60">
              <span className="font-semibold text-slate-300">{item.name}</span>
              {item.from !== undefined ? (
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  {item.from} <ArrowRight size={14} className="text-teal-400" /> {item.to} Rakaat
                </span>
              ) : (
                <span className="text-sm font-semibold text-teal-400">{item.time}</span>
              )}
            </div>
          ))}

          {modalContent.note && (
            <div className="text-xs text-slate-400 bg-teal-950/20 text-teal-300/80 p-4 rounded-2xl border border-teal-900/30 leading-relaxed mt-2">
              💡 {modalContent.note}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors">
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <CheckSquare size={20} className="text-teal-400" />
            Checklist Ibadah Safar
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {['Persiapan', 'Keberangkatan', 'Perjalanan', 'Ibadah'].map(cat => (
            <div key={cat}>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{cat}</h4>
              <ul className="space-y-2">
                {checklist.filter(i => i.category === cat).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-slate-950/44 p-3.5 rounded-2xl border border-slate-800/50">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded bg-slate-850 border-slate-700 text-teal-600 focus:ring-teal-500 focus:ring-offset-slate-900 accent-teal-500" />
                    <span className="text-sm text-slate-300 font-medium leading-normal">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors">
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
