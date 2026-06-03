import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, Clock, Timer, Compass,
  BookHeart, Lightbulb, CheckSquare, X, ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    id: 'qashar',
    title: 'Qashar Shalat',
    description: 'Meringkas sholat fardhu 4 rakaat menjadi 2 rakaat saat bepergian jauh.',
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
      note: 'Maghrib (3 rakaat) dan Subuh (2 rakaat) tidak di-qashar.'
    }
  },
  {
    id: 'jamak-taqdim',
    title: 'Jamak Taqdim',
    description: 'Menggabungkan dua sholat di waktu sholat pertama (waktu awal).',
    icon: Clock,
    color: 'blue',
    action: 'modal',
    modalContent: {
      title: 'Jamak Taqdim',
      items: [
        { name: 'Dzuhur + Ashar', time: 'Di waktu Dzuhur' },
        { name: 'Maghrib + Isya', time: 'Di waktu Maghrib' },
      ],
      note: 'Dilaksanakan saat hendak berangkat safar atau di awal perjalanan.'
    }
  },
  {
    id: 'jamak-takhir',
    title: 'Jamak Takhir',
    description: 'Menggabungkan dua sholat di waktu sholat kedua (waktu akhir).',
    icon: Timer,
    color: 'indigo',
    action: 'modal',
    modalContent: {
      title: 'Jamak Takhir',
      items: [
        { name: 'Dzuhur + Ashar', time: 'Di waktu Ashar' },
        { name: 'Maghrib + Isya', time: 'Di waktu Isya' },
      ],
      note: 'Dilaksanakan saat sedang dalam perjalanan dan belum sempat sholat pertama.'
    }
  },
  {
    id: 'kiblat',
    title: 'Arah Kiblat Saat Safar',
    description: 'Kompas kiblat presisi untuk menemukan arah Ka\'bah di mana pun Anda berada.',
    icon: Compass,
    color: 'cyan',
    action: 'link',
    href: '/kiblat'
  },
  {
    id: 'doa',
    title: 'Doa Perjalanan',
    description: 'Kumpulan doa perlindungan dan kebaikan selama perjalanan jauh.',
    icon: BookHeart,
    color: 'rose',
    action: 'scroll',
    scrollTo: 'doa-safar'
  },
  {
    id: 'tips',
    title: 'Tips Safar Islami',
    description: 'Checklist ibadah agar perjalanan Anda penuh keberkahan dan tidak ada yang terlewat.',
    icon: Lightbulb,
    color: 'amber',
    action: 'checklist'
  },
];

const colorMap = {
  emerald: {
    bg: 'bg-emerald-900/30',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/60',
    glow: 'hover:shadow-emerald-500/10',
  },
  blue: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/60',
    glow: 'hover:shadow-blue-500/10',
  },
  indigo: {
    bg: 'bg-indigo-900/30',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    hoverBorder: 'hover:border-indigo-500/60',
    glow: 'hover:shadow-indigo-500/10',
  },
  cyan: {
    bg: 'bg-cyan-900/30',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/60',
    glow: 'hover:shadow-cyan-500/10',
  },
  rose: {
    bg: 'bg-rose-900/30',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/60',
    glow: 'hover:shadow-rose-500/10',
  },
  amber: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/60',
    glow: 'hover:shadow-amber-500/10',
  },
};

// --- Detail Modal ---
function FeatureDetailModal({ feature, onClose }) {
  if (!feature || !feature.modalContent) return null;
  const { modalContent } = feature;
  const colors = colorMap[feature.color];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-5 border-b border-slate-800 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
              <feature.icon size={22} />
            </div>
            <h3 className="font-bold text-white text-lg">{modalContent.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {modalContent.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/80 rounded-2xl border border-slate-700/50">
              <span className="font-semibold text-slate-200">{item.name}</span>
              {item.from !== undefined ? (
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  {item.from} <ArrowRight size={14} className={colors.text} /> {item.to} Rakaat
                </span>
              ) : (
                <span className={`text-sm font-semibold ${colors.text}`}>{item.time}</span>
              )}
            </div>
          ))}
        </div>

        {modalContent.note && (
          <div className="px-5 pb-5">
            <div className={`text-sm text-slate-300 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 leading-relaxed`}>
              💡 {modalContent.note}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Checklist Modal (preserved from BekalSafarmuGrid) ---
function SafarChecklistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const checklist = [
    { label: "Niat ikhlas karena Allah", category: "Persiapan" },
    { label: "Membawa sajadah & mukena/sarung", category: "Persiapan" },
    { label: "Cek jadwal waktu sholat kota tujuan", category: "Persiapan" },
    { label: "Sholat sunnah safar 2 rakaat sblm berangkat", category: "Keberangkatan" },
    { label: "Membaca doa keluar rumah", category: "Keberangkatan" },
    { label: "Membaca doa naik kendaraan", category: "Keberangkatan" },
    { label: "Memperbanyak doa karena doa musafir mustajab", category: "Saat Safar" },
    { label: "Bertasbih di jalan menurun, bertakbir di jalan menanjak", category: "Saat Safar" },
    { label: "Menjamak/Mengqashar sholat jika memenuhi syarat", category: "Ibadah" }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-5 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <CheckSquare size={20} />
            Checklist Ibadah Safar
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {['Persiapan', 'Keberangkatan', 'Saat Safar', 'Ibadah'].map(cat => (
            <div key={cat} className="mb-4 last:mb-0">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{cat}</h4>
              <ul className="space-y-2">
                {checklist.filter(i => i.category === cat).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 accent-amber-500" />
                    <span className="text-sm text-slate-300 font-medium leading-tight">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors">
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Container Animation ---
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

// --- Main Component ---
export default function SafarFeatureGrid() {
  const [activeModal, setActiveModal] = useState(null);
  const [isChecklistOpen, setChecklistOpen] = useState(false);

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
    // 'link' action is handled via <Link>
  };

  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          <span className="text-amber-400 mr-2">✨</span>Bekal Safarmu
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
          Akses cepat fitur-fitur penting untuk kelancaran ibadah safar Anda.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {FEATURES.map((feature) => {
          const colors = colorMap[feature.color];
          const IconComp = feature.icon;

          const cardContent = (
            <motion.div
              variants={cardVariants}
              className={`safar-feature-card group relative flex flex-col items-center text-center p-6 md:p-8 rounded-3xl border ${colors.border} ${colors.hoverBorder} bg-slate-800/60 backdrop-blur-sm shadow-lg hover:shadow-2xl ${colors.glow} transition-all duration-300 cursor-pointer min-h-[180px]`}
            >
              <div className={`${colors.bg} ${colors.text} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <IconComp size={30} />
              </div>
              <h3 className="font-bold text-white text-lg md:text-xl leading-tight mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{feature.description}</p>
            </motion.div>
          );

          if (feature.action === 'link') {
            return (
              <Link key={feature.id} to={feature.href} className="block">
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={feature.id} onClick={() => handleCardClick(feature)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCardClick(feature)}>
              {cardContent}
            </div>
          );
        })}
      </motion.div>

      {/* Detail Modals */}
      {activeModal && (
        <FeatureDetailModal feature={activeModal} onClose={() => setActiveModal(null)} />
      )}
      <SafarChecklistModal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
    </section>
  );
}
