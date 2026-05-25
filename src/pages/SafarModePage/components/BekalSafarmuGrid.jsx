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
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-amber-500">✨</span> Bekal Safarmu
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        
        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-safar')} className="group relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-rose-900/30 hover:border-rose-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <BookHeart size={80} className="text-white" />
          </div>
          <div className="bg-rose-900/30 text-rose-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <BookHeart size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Doa Safar</h3>
          <p className="text-xs text-rose-400/80 mt-1 font-medium">Buka teks doa</p>
        </a>

        <Link to="/sholat" className="group relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-blue-900/30 hover:border-blue-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <Clock size={80} className="text-white" />
          </div>
          <div className="bg-blue-900/30 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Clock size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Waktu Sholat</h3>
          <p className="text-xs text-blue-400/80 mt-1 font-medium">Cek jadwal lokal</p>
        </Link>

        <Link to="/kiblat" className="group relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-emerald-900/30 hover:border-emerald-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <Compass size={80} className="text-white" />
          </div>
          <div className="bg-emerald-900/30 text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Compass size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Arah Kiblat</h3>
          <p className="text-xs text-emerald-400/80 mt-1 font-medium">Kompas akurat</p>
        </Link>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-naik-kendaraan')} className="group relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-indigo-900/30 hover:border-indigo-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <CarFront size={80} className="text-white" />
          </div>
          <div className="bg-indigo-900/30 text-indigo-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <CarFront size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Doa Kendaraan</h3>
          <p className="text-xs text-indigo-400/80 mt-1 font-medium">Naik mobil/motor</p>
        </a>

        <a href="#essential-duas" onClick={(e) => handleDoaScroll(e, 'doa-macet')} className="group relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-purple-900/30 hover:border-purple-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <Navigation size={80} className="text-white" />
          </div>
          <div className="bg-purple-900/30 text-purple-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Navigation size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Perjalanan Jauh</h3>
          <p className="text-xs text-purple-400/80 mt-1 font-medium">Doa saat macet</p>
        </a>

        <button onClick={() => setChecklistOpen(true)} className="group text-left relative overflow-hidden bg-slate-800/80 p-4 rounded-2xl border border-amber-900/30 hover:border-amber-500/50 shadow-lg transition-all">
          <div className="absolute -right-4 -bottom-4 opacity-[0.05] transform group-hover:scale-110 transition-transform">
            <CheckSquare size={80} className="text-white" />
          </div>
          <div className="bg-amber-900/30 text-amber-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <CheckSquare size={22} />
          </div>
          <h3 className="font-bold text-white leading-tight">Checklist Safar</h3>
          <p className="text-xs text-amber-400/80 mt-1 font-medium">Daftar ibadah</p>
        </button>

      </div>

      <SafarChecklistModal isOpen={isChecklistOpen} onClose={() => setChecklistOpen(false)} />
    </section>
  );
}
