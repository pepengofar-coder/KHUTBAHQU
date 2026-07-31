import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, Heart, Sparkles, Shield, 
  BookOpen, Users, Compass, Award, ArrowRight
} from 'lucide-react';

const HIJRAH_PHASES = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Niat Ikhlas & Taubat Nasuha',
    subtitle: 'Memulai lembaran baru dengan memohon ampunan Allah SWT',
    icon: Heart,
    color: 'emerald',
    steps: [
      { id: 'h1-1', label: 'Meluruskan niat hijrah semata-mata mengharap ridho Allah SWT (bukan pujian manusia).' },
      { id: 'h1-2', label: 'Melakukan Sholat Sunnah Taubat 2 rakaat di sepertiga malam/waktu tenang.' },
      { id: 'h1-3', label: 'Membaca Sayyidul Istighfar setiap pagi dan petang.' },
      { id: 'h1-4', label: 'Menyesali dosa masa lalu dan berjanji sungguh-sungguh tidak mengulanginya.' }
    ],
    quote: '"Sesungguhnya setiap amalan tergantung pada niatnya..." (HR. Bukhari & Muslim)'
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Memperbaiki Tiang Agama (Sholat 5 Waktu)',
    subtitle: 'Menjadikan sholat wajib sebagai prioritas tertinggi harian',
    icon: Compass,
    color: 'blue',
    steps: [
      { id: 'h2-1', label: 'Menjaga sholat 5 waktu tepat pada waktunya saat azan berkumandang.' },
      { id: 'h2-2', label: 'Bagi laki-laki: Diutamakan sholat berjamaah di masjid.' },
      { id: 'h2-3', label: 'Mempelajari dan menyempurnakan bacaan serta rukun sholat yang benar.' },
      { id: 'h2-4', label: 'Melengkapi dengan Sholat Sunnah Rawatib (Qobliyah & Ba\'diyyah).' }
    ],
    quote: '"Sholat adalah amalan pertama yang akan dihisab pada hari kiamat." (HR. Abu Daud)'
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Pembersihan Lingkungan & Pergaulan',
    subtitle: 'Menjaga diri dari pengaruh negatif dan mencari lingkaran kebaikan',
    icon: Users,
    color: 'purple',
    steps: [
      { id: 'h3-1', label: 'Mencari teman dan sahabat sholeh yang saling mengingatkan dalam kebaikan.' },
      { id: 'h3-2', label: 'Membersihkan linimasa sosial media dari konten maksiat, ghibah, dan pemicu dosa.' },
      { id: 'h3-3', label: 'Menjaga pandangan, lisan, dan adab dalam pergaulan sehari-hari.' },
      { id: 'h3-4', label: 'Menghadiri majlis ilmu / kajian rutin minimal sepekan sekali.' }
    ],
    quote: '"Seseorang itu mengikuti agama sahabat karibnya..." (HR. Abu Daud & Tirmidzi)'
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Merutinkan Dzikir & Interaksi Al-Qur\'an',
    subtitle: 'Membasahi lisan dengan mengingat Allah di setiap kesempatan',
    icon: BookOpen,
    color: 'teal',
    steps: [
      { id: 'h4-1', label: 'Membaca Al-Qur\'an setiap hari (minimal 1-5 ayat atau 1 halaman).' },
      { id: 'h4-2', label: 'Membaca Dzikir Pagi dan Dzikir Petang secara konsisten.' },
      { id: 'h4-3', label: 'Bersedekah subuh atau harian walau dengan jumlah kecil (rutin).' },
      { id: 'h4-4', label: 'Merutinkan Sholat Dhuha dan Sholat Tahajud.' }
    ],
    quote: '"Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram." (QS. Ar-Ra\'d: 28)'
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Istiqomah & Menjaga Keikhlasan',
    subtitle: 'Mempertahankan konsistensi hingga akhir hayat (Khusnul Khatimah)',
    icon: Award,
    color: 'gold',
    steps: [
      { id: 'h5-1', label: 'Menjaga konsistensi amalan meskipun sedikit daripada banyak tapi terputus.' },
      { id: 'h5-2', label: 'Terus memperdalam ilmu syar\'i dan membaca sejarah para Sahabat Nabi.' },
      { id: 'h5-3', label: 'Selalu berdoa memohon ketetapan hati: "Ya Muqollibal Qulub Tsabbit Qolbi \'Ala Diinik".' },
      { id: 'h5-4', label: 'Mengajak keluarga & kerabat dekat ke jalan kebaikan dengan hikmah.' }
    ],
    quote: '"Amalan yang paling dicintai Allah adalah amalan yang kontinyu (rutin) meskipun sedikit." (HR. Bukhari)'
  }
];

export default function HijrahGuide({ onSwitchToTracker }) {
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('islamediaku_hijrah_steps')) || {};
    } catch {
      return {};
    }
  });

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      localStorage.setItem('islamediaku_hijrah_steps', JSON.stringify(next));
      return next;
    });
  };

  const totalStepCount = HIJRAH_PHASES.reduce((acc, phase) => acc + phase.steps.length, 0);
  const doneStepCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = Math.round((doneStepCount / totalStepCount) * 100);

  return (
    <div className="hijrah-guide-container">
      {/* Hero Banner */}
      <div className="hijrah-hero">
        <div className="hijrah-hero__badge">
          <Sparkles size={14} /> Panduan Hijrah Step-by-Step
        </div>
        <h2 className="hijrah-hero__title">Peta Jalan Perbaikan Diri (Hijrah)</h2>
        <p className="hijrah-hero__desc">
          Tahapan terstruktur untuk memperbaiki kualitas ibadah, akhlaq, dan gaya hidup islami secara konsisten.
        </p>

        {/* Hijrah Progress Bar */}
        <div className="hijrah-progress-box">
          <div className="hijrah-progress-header">
            <span>Capaian Hijrah Anda</span>
            <strong>{doneStepCount} dari {totalStepCount} Langkah ({progressPercentage}%)</strong>
          </div>
          <div className="hijrah-progress-bar">
            <div 
              className="hijrah-progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phases Accordion / Stepper */}
      <div className="hijrah-phases-list">
        {HIJRAH_PHASES.map((phase) => {
          const PhaseIcon = phase.icon;
          const phaseDoneCount = phase.steps.filter(s => completedSteps[s.id]).length;
          const isPhaseComplete = phaseDoneCount === phase.steps.length;

          return (
            <div key={phase.id} className={`hijrah-phase-card ${isPhaseComplete ? 'hijrah-phase-card--complete' : ''}`}>
              <div className="hijrah-phase-header">
                <div className="hijrah-phase-number-box">
                  <PhaseIcon size={20} />
                  <span>Tahap 0{phase.number}</span>
                </div>
                <div className="hijrah-phase-title-box">
                  <h3 className="hijrah-phase-title">{phase.title}</h3>
                  <p className="hijrah-phase-subtitle">{phase.subtitle}</p>
                </div>
                <span className="hijrah-phase-badge">
                  {phaseDoneCount}/{phase.steps.length} Selesai
                </span>
              </div>

              {/* Quote */}
              <div className="hijrah-quote-box">
                <p>{phase.quote}</p>
              </div>

              {/* Checklist Steps */}
              <div className="hijrah-steps-list">
                {phase.steps.map((step) => {
                  const isChecked = !!completedSteps[step.id];
                  return (
                    <button
                      key={step.id}
                      className={`hijrah-step-item ${isChecked ? 'checked' : ''}`}
                      onClick={() => toggleStep(step.id)}
                    >
                      {isChecked ? (
                        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Circle size={22} className="text-slate-400 shrink-0" />
                      )}
                      <span className="hijrah-step-label">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA to Habit Tracker */}
      <div className="hijrah-cta-card">
        <div>
          <h3>Siap Menjaga Konsistensi Harian?</h3>
          <p>Gunakan Habit Tracker Good Path untuk memantau target amalan harian kamu!</p>
        </div>
        <button onClick={onSwitchToTracker} className="hijrah-cta-btn">
          Buka Habit Tracker <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
