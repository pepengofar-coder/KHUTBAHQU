import React from 'react';
import { BookOpen, Clock, ArrowRightLeft, ArrowRight, Info } from 'lucide-react';

export default function QuickSafarGuide() {
  return (
    <section className="mb-2 md:mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-blue-900/50 flex items-center justify-center text-blue-400 shadow-inner">
          <BookOpen size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Panduan Ringkas Safar</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tata cara ibadah saat dalam perjalanan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Qashar Card */}
        <div className="bg-slate-800/80 rounded-3xl p-5 md:p-6 border border-slate-700 shadow-xl hover:border-slate-600 transition-all flex flex-col h-full relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-900/30 rounded-xl text-emerald-400">
              <ArrowRightLeft size={24} />
            </div>
            <h3 className="font-bold text-white text-lg md:text-xl">Qashar (Ringkas)</h3>
          </div>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed flex-1">
            Meringkas sholat fardhu 4 rakaat menjadi 2 rakaat saat bepergian jauh.
          </p>
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/50">
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="font-medium">Dzuhur</span>
                <span className="font-bold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="font-medium">Ashar</span>
                <span className="font-bold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-medium">Isya</span>
                <span className="font-bold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Jamak Card */}
        <div className="bg-slate-800/80 rounded-3xl p-5 md:p-6 border border-slate-700 shadow-xl hover:border-slate-600 transition-all flex flex-col h-full relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-900/30 rounded-xl text-indigo-400">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-white text-lg md:text-xl">Jamak (Gabung)</h3>
          </div>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed flex-1">
            Menggabungkan dua waktu sholat fardhu untuk dikerjakan sekaligus.
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-700/50">
              <span className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Pasangan Sholat</span>
              <div className="flex justify-between items-center text-sm font-bold text-slate-200">
                <span>Dzuhur & Ashar</span>
                <span className="text-indigo-500 text-lg leading-none">|</span>
                <span>Maghrib & Isya</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-900/60 rounded-2xl p-3 border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="block text-sm font-bold text-indigo-400 mb-0.5">Taqdim</span>
                <span className="text-[11px] text-slate-400 leading-tight">Di waktu awal</span>
              </div>
              <div className="flex-1 bg-slate-900/60 rounded-2xl p-3 border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="block text-sm font-bold text-indigo-400 mb-0.5">Takhir</span>
                <span className="text-[11px] text-slate-400 leading-tight">Di waktu akhir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-3 text-[13px] text-slate-300 bg-indigo-900/20 px-4 py-4 rounded-2xl border border-indigo-500/20">
        <Info size={20} className="shrink-0 text-indigo-400 mt-0.5" />
        <p className="leading-relaxed">Boleh digabungkan (Jamak Qashar). Contoh: Dzuhur 2 rakaat & Ashar 2 rakaat dikerjakan di waktu Dzuhur (Jamak Taqdim Qashar).</p>
      </div>
    </section>
  );
}
