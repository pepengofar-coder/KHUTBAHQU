import React from 'react';
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export default function SafarStatusBar() {
  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 shadow-xl border border-indigo-500/20 mb-8">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/30 shadow-inner">
            <ShieldCheck className="h-6 w-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">Teman Perjalanan</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Ketenangan di Setiap Langkah</h2>
            <p className="text-indigo-200 text-sm mt-1 max-w-md leading-relaxed">
              Pendamping perjalanan Islami. Dirancang khusus untuk kemudahan ibadah dan ketenangan Anda saat bepergian jauh.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-indigo-300 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-100 leading-relaxed">
              <strong className="text-white">Syarat Musafir:</strong> Anda dianggap sedang safar (bepergian) jika perjalanan mencapai jarak minimal ±81 km (menurut jumhur ulama) dengan niat yang mubah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
