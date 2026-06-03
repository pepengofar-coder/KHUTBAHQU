import { motion } from 'framer-motion';
import { Bell, Compass, BookOpen, ShieldCheck, Heart } from 'lucide-react';

const COMPANION_FEATURES = [
  {
    title: 'Pengingat Sholat',
    description: 'Notifikasi waktu sholat di kota tujuan Anda',
    icon: Bell,
    accent: 'text-blue-400',
    bgAccent: 'bg-blue-500/15',
  },
  {
    title: 'Bantuan Kiblat',
    description: 'Arah kiblat presisi di mana saja Anda berada',
    icon: Compass,
    accent: 'text-emerald-400',
    bgAccent: 'bg-emerald-500/15',
  },
  {
    title: 'Doa Perjalanan',
    description: 'Akses cepat doa-doa safar lengkap dengan terjemahan',
    icon: BookOpen,
    accent: 'text-amber-400',
    bgAccent: 'bg-amber-500/15',
  },
  {
    title: 'Panduan Darurat',
    description: 'Tata cara ibadah dalam kondisi darurat di perjalanan',
    icon: ShieldCheck,
    accent: 'text-rose-400',
    bgAccent: 'bg-rose-500/15',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function SafarCompanion() {
  return (
    <motion.section
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="safar-companion">
        {/* Decorative background elements */}
        <div className="safar-companion__decor">
          <div className="safar-companion__glow safar-companion__glow--1" />
          <div className="safar-companion__glow safar-companion__glow--2" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/20 flex items-center justify-center shadow-inner">
              <Heart className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Teman Perjalanan Muslim
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Selalu menemani ibadah Anda di mana pun
              </p>
            </div>
          </div>

          {/* Feature Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {COMPANION_FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={itemVariants}
                  className="safar-companion__item group"
                >
                  <div className={`w-12 h-12 rounded-xl ${feat.bgAccent} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp size={24} className={feat.accent} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base mb-1">{feat.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
