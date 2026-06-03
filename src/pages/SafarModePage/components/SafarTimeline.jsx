import { motion } from 'framer-motion';
import { Sparkles, DoorOpen, Clock, ArrowRightLeft, MapPinCheck } from 'lucide-react';

const STEPS = [
  {
    num: 1,
    title: 'Niat Safar',
    description: 'Niatkan perjalanan karena Allah dengan tujuan yang mubah. Sholat sunnah safar 2 rakaat sebelum berangkat.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-400',
    interactive: false,
  },
  {
    num: 2,
    title: 'Doa Keluar Rumah',
    description: 'Baca doa keluar rumah dan doa naik kendaraan sebelum memulai perjalanan.',
    icon: DoorOpen,
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-400',
    interactive: true,
    scrollTo: 'doa-keluar-rumah',
  },
  {
    num: 3,
    title: 'Shalat Saat Perjalanan',
    description: 'Laksanakan sholat tepat waktu. Gunakan fitur waktu sholat untuk mengetahui jadwal di kota tujuan.',
    icon: Clock,
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    interactive: false,
  },
  {
    num: 4,
    title: 'Jamak dan Qashar',
    description: 'Jika memenuhi syarat musafir (±81 km), boleh meringkas dan menggabungkan sholat fardhu.',
    icon: ArrowRightLeft,
    color: 'from-indigo-500 to-purple-600',
    textColor: 'text-indigo-400',
    interactive: false,
  },
  {
    num: 5,
    title: 'Tiba di Tujuan',
    description: 'Baca doa tiba di tujuan. Laksanakan sholat dengan sempurna dan bersyukur atas keselamatan.',
    icon: MapPinCheck,
    color: 'from-rose-500 to-pink-600',
    textColor: 'text-rose-400',
    interactive: true,
    scrollTo: 'doa-kembali',
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function SafarTimeline() {
  const handleStepClick = (step) => {
    if (!step.interactive || !step.scrollTo) return;
    window.dispatchEvent(new CustomEvent('safar-open-dua', { detail: { duaId: step.scrollTo } }));
    setTimeout(() => {
      const el = document.getElementById(step.scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
          <span className="text-blue-400 mr-2">📋</span>Panduan Safar
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
          Langkah demi langkah tata cara ibadah selama dalam perjalanan.
        </p>
      </motion.div>

      <div className="safar-timeline">
        {STEPS.map((step, index) => {
          const IconComp = step.icon;
          const isLast = index === STEPS.length - 1;

          return (
            <motion.div
              key={step.num}
              className={`safar-timeline__step ${step.interactive ? 'safar-timeline__step--interactive' : ''}`}
              variants={stepVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              onClick={() => handleStepClick(step)}
              role={step.interactive ? 'button' : undefined}
              tabIndex={step.interactive ? 0 : undefined}
              onKeyDown={step.interactive ? (e) => e.key === 'Enter' && handleStepClick(step) : undefined}
            >
              {/* Timeline connector */}
              <div className="safar-timeline__connector">
                <div className={`safar-timeline__circle bg-gradient-to-br ${step.color}`}>
                  <span className="text-white font-bold text-sm">{step.num}</span>
                </div>
                {!isLast && <div className="safar-timeline__line" />}
              </div>

              {/* Content card */}
              <div className="safar-timeline__card">
                <div className="flex items-center gap-3 mb-2">
                  <IconComp size={20} className={step.textColor} />
                  <h3 className="font-bold text-white text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                {step.interactive && (
                  <span className={`inline-block mt-3 text-xs font-semibold ${step.textColor} tracking-wide`}>
                    Tap untuk membuka doa →
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
