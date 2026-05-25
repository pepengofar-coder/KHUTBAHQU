import React from 'react';
import { BookOpen, Clock, ArrowRightLeft, ArrowRight, Info } from 'lucide-react';

export default function QuickSafarGuide() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded-lg bg-blue-900/50 flex items-center justify-center text-blue-400">
          <BookOpen size={18} />
        </div>
        <h2 className="text-xl font-bold text-white">Panduan Ringkas Safar</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Qashar Card */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-900/30 rounded-lg text-emerald-400">
              <ArrowRightLeft size={20} />
            </div>
            <h3 className="font-bold text-white text-lg">Qashar (Meringkas)</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Meringkas sholat fardhu yang 4 rakaat menjadi 2 rakaat. Hanya berlaku untuk sholat Dzuhur, Ashar, dan Isya.
          </p>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-center justify-between">
                <span>Dzuhur</span>
                <span className="font-semibold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ashar</span>
                <span className="font-semibold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Isya</span>
                <span className="font-semibold flex items-center gap-2">4 <ArrowRight size={14} className="text-emerald-500" /> 2 Rakaat</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Jamak Card */}
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-900/30 rounded-lg text-indigo-400">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-white text-lg">Jamak (Menggabungkan)</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Menggabungkan dua waktu sholat fardhu untuk dikerjakan dalam satu waktu sekaligus.
          </p>
          <div className="flex flex-col gap-2">
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
              <span className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Pasangan Sholat</span>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
                <span>Dzuhur & Ashar</span>
                <span className="text-indigo-500">|</span>
                <span>Maghrib & Isya</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-900/50 rounded-xl p-2.5 border border-slate-700/50">
                <span className="block text-xs font-bold text-indigo-400 mb-1">Taqdim</span>
                <span className="text-xs text-slate-400">Dikerjakan di waktu sholat yang pertama</span>
              </div>
              <div className="flex-1 bg-slate-900/50 rounded-xl p-2.5 border border-slate-700/50">
                <span className="block text-xs font-bold text-indigo-400 mb-1">Takhir</span>
                <span className="text-xs text-slate-400">Dikerjakan di waktu sholat yang kedua</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
        <Info size={16} className="shrink-0 mt-0.5 text-indigo-400" />
        <p>Boleh digabungkan (Jamak Qashar). Contoh: Dzuhur 2 rakaat & Ashar 2 rakaat dikerjakan di waktu Dzuhur (Jamak Taqdim Qashar).</p>
      </div>
    </section>
  );
}
