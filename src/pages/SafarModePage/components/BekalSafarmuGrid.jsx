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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-safar')} className="group flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-rose-900/30 hover:border-rose-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-rose-900/30 text-rose-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <BookHeart size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight">Doa Safar</h3>
            <p className="text-sm text-slate-400">Buka teks doa utama</p>
          </div>
        </a>

        <Link to="/sholat" className="group flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-blue-900/30 hover:border-blue-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-blue-900/30 text-blue-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <Clock size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight">Waktu Sholat</h3>
            <p className="text-sm text-slate-400">Cek jadwal lokal</p>
          </div>
        </Link>

        <Link to="/kiblat" className="group flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-emerald-900/30 hover:border-emerald-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-emerald-900/30 text-emerald-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <Compass size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight">Arah Kiblat</h3>
            <p className="text-sm text-slate-400">Kompas akurat safar</p>
          </div>
        </Link>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-naik-kendaraan')} className="group flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-indigo-900/30 hover:border-indigo-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-indigo-900/30 text-indigo-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <CarFront size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight">Doa Kendaraan</h3>
            <p className="text-sm text-slate-400">Naik mobil/pesawat</p>
          </div>
        </a>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-macet')} className="group flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-purple-900/30 hover:border-purple-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-purple-900/30 text-purple-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <Navigation size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight text-balance">Perjalanan Jauh</h3>
            <p className="text-sm text-slate-400">Doa saat macet/lelah</p>
          </div>
        </a>

        <button onClick={() => setChecklistOpen(true)} className="group text-left flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-amber-900/30 hover:border-amber-500/50 shadow-lg transition-all min-h-[88px]">
          <div className="bg-amber-900/30 text-amber-400 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
            <CheckSquare size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-white text-lg leading-tight text-balance">Checklist Safar</h3>
            <p className="text-sm text-slate-400">Daftar ibadah lengkap</p>
          </div>
        </button>

      </div>

      <SafarChecklistModal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
    </section>
  );
}
