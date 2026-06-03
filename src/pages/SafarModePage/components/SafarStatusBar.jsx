import { motion } from 'framer-motion';
import { Route, AlertCircle } from 'lucide-react';

export default function SafarStatusBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="safar-status-card"
      role="alert"
    >
      <div className="safar-status-card__icon">
        <div className="safar-status-card__icon-pulse" />
        <Route className="h-6 w-6 text-amber-400 relative z-10" />
      </div>
      <div className="safar-status-card__content">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={16} className="text-amber-400 shrink-0" />
          <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">Syarat Musafir</span>
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed">
          Anda dianggap musafir jika perjalanan mencapai minimal <strong className="text-white">81 km</strong> menurut jumhur ulama, dengan niat yang mubah.
        </p>
      </div>
    </motion.div>
  );
}
