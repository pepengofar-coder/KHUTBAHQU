import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Clock, BookHeart, CarFront, Navigation, CheckSquare, X } from 'lucide-react';

const SafarChecklistModal = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-4 flex items-center justify-between">
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
                  <li key={idx} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900" />
                    <span className="text-sm text-slate-300 font-medium leading-tight">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BekalSafarmuGrid() {
  const [isChecklistOpen, setChecklistOpen] = useState(false);

  const handleDoaScroll = (e, id) => {
    e.preventDefault();
    // Dispatch event to auto-open the target doa accordion
    window.dispatchEvent(new CustomEvent('safar-open-dua', { detail: { duaId: id } }));
    // Small delay to let the accordion open before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight text-balance">
          <span className="text-amber-500">✨</span> Bekal Safarmu
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed text-balance">
          Akses cepat fitur penting untuk kelancaran ibadah safar Anda.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-safar')} className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-rose-900/30 hover:border-rose-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-rose-900/40 to-rose-900/10 text-rose-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <BookHeart size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight">Doa Safar</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Buka teks doa utama saat bepergian jauh</p>
          </div>
        </a>

        <Link to="/sholat" className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-blue-900/30 hover:border-blue-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 text-blue-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Clock size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight">Waktu Sholat</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Cek jadwal sholat untuk kota tujuan Anda</p>
          </div>
        </Link>

        <Link to="/kiblat" className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-emerald-900/30 hover:border-emerald-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-900/10 text-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Compass size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight">Arah Kiblat</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Kompas presisi untuk di perjalanan</p>
          </div>
        </Link>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-naik-kendaraan')} className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-indigo-900/30 hover:border-indigo-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 text-indigo-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <CarFront size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight">Doa Kendaraan</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Doa saat naik pesawat atau mobil</p>
          </div>
        </a>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-macet')} className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-purple-900/30 hover:border-purple-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/10 text-purple-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Navigation size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight text-balance">Saat Kesulitan</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Doa ketika jalanan macet atau lelah</p>
          </div>
        </a>

        <button onClick={() => setChecklistOpen(true)} className="group flex flex-col items-center text-center bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-amber-900/30 hover:border-amber-500/50 shadow-xl transition-all min-h-[160px]">
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-900/10 text-amber-400 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <CheckSquare size={32} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg md:text-xl leading-tight text-balance">Checklist Safar</h3>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2">Daftar ibadah agar tidak ada yang terlewat</p>
          </div>
        </button>

      </div>

      <SafarChecklistModal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
    </section>
  );
}
