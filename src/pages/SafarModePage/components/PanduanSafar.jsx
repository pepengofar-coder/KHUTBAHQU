import { useState, useMemo } from 'react';
import { Sparkles, DoorOpen, Clock, ArrowRightLeft, MapPinCheck } from 'lucide-react';

const STATIC_STEPS = [
  {
    num: 1,
    title: 'Travel Intention',
    description: 'Niatkan safar karena ibadah / hal mubah, sholat sunnah safar 2 rakaat.',
    icon: Sparkles,
    color: 'emerald',
    interactive: false,
  },
  {
    num: 2,
    title: 'Du’a Before Leaving',
    description: 'Baca doa keluar rumah dan doa naik kendaraan perlindungan safar.',
    icon: DoorOpen,
    color: 'blue',
    interactive: true,
    scrollTo: 'doa-keluar-rumah',
  },
  {
    num: 3,
    title: 'Prayer During Travel',
    description: 'Tetap tegakkan sholat fardhu di jalan. Cari masjid terdekat.',
    icon: Clock,
    color: 'purple',
    interactive: false,
  },
  {
    num: 4,
    title: 'Jamak & Qashar',
    description: 'Manfaatkan kemudahan (rukhshah) meringkas & menggabungkan sholat.',
    icon: ArrowRightLeft,
    color: 'teal',
    interactive: false,
  },
  {
    num: 5,
    title: 'Arrival at Destination',
    description: 'Tiba dengan selamat, membaca doa syukur dan sholat jamak/sempurna.',
    icon: MapPinCheck,
    color: 'gold',
    interactive: true,
    scrollTo: 'doa-kembali',
  },
];

export default function PanduanSafar() {
  const [activeStep, setActiveStep] = useState(2); // Set Step 2 as active default

  const steps = useMemo(() => STATIC_STEPS, []);

  const handleStepClick = (step) => {
    setActiveStep(step.num);
    if (!step.interactive || !step.scrollTo) return;
    window.dispatchEvent(new CustomEvent('safar-open-dua', { detail: { duaId: step.scrollTo } }));
    setTimeout(() => {
      const el = document.getElementById(step.scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="guidance" className="safar-guidance scroll-mt-24">
      <div className="safar-section-header">
        <span className="safar-section-badge">Travel Journey</span>
        <h2 className="safar-section-title">Travel Guidance</h2>
        <p className="safar-section-desc">Langkah panduan ibadah teratur dari awal keberangkatan hingga tiba tujuan.</p>
      </div>

      <div className="safar-stepper-container">
        <div className="safar-stepper">
          {steps.map((step, index) => {
            const IconComp = step.icon;
            const isLast = index === steps.length - 1;
            const isCompleted = step.num < activeStep;
            const isActive = step.num === activeStep;

            return (
              <div 
                key={step.num}
                className={`safar-step ${isActive ? 'safar-step--active' : ''} ${isCompleted ? 'safar-step--completed' : ''}`}
                onClick={() => handleStepClick(step)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleStepClick(step)}
              >
                {/* Visual Step Indicator */}
                <div className="safar-step__indicator-row">
                  <div className="safar-step__circle">
                    {isCompleted ? (
                      <span className="text-xs font-bold">✓</span>
                    ) : (
                      <IconComp size={16} className="safar-step__icon" />
                    )}
                  </div>
                  {!isLast && (
                    <div className="safar-step__line">
                      <div 
                        className="safar-step__line-progress" 
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="safar-step__content">
                  <span className="safar-step__number">Langkah 0{step.num}</span>
                  <h3 className="safar-step__title">{step.title}</h3>
                  <p className="safar-step__desc">{step.description}</p>
                  {step.interactive && (
                    <span className="safar-step__badge">
                      Lihat Doa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
