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
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/30">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-20"></span>
            <MapPin className="h-6 w-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Status Aktif</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mode Safar</h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-md">
              Pendamping perjalanan Islami. Dirancang khusus untuk kemudahan dan ketenangan Anda saat berada dalam perjalanan jauh.
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
