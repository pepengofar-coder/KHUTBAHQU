import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, BookOpen, Clock, ChevronRight } from 'lucide-react';
import './DailyRecommendations.css';

export default function DailyRecommendations() {
  const navigate = useNavigate();

  const recommendations = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay(); // 5 is Friday

    // 1. Dzikir Recommendation
    const isMorning = hours >= 3 && hours < 12;
    const dzikirRec = {
      title: isMorning ? 'Dzikir Pagi' : 'Dzikir Petang',
      subtitle: isMorning ? 'Waktu utama: Setelah Subuh' : 'Waktu utama: Setelah Ashar',
      desc: isMorning
        ? 'Lindungi diri dan buka pintu rezeki dengan dzikir pagi pembuka hari.'
        : 'Tenangkan hati menjelang malam dengan dzikir petang pelindung tidur.',
      icon: isMorning ? Sun : Moon,
      colorClass: isMorning ? 'rec-card--amber' : 'rec-card--indigo',
      link: '/doa-dzikir',
      state: { activeCat: isMorning ? 'pagi' : 'petang' }
    };

    // 2. Quran Recommendation
    const isFriday = day === 5;
    const quranRec = {
      title: isFriday ? 'Membaca Al-Kahfi' : 'Membaca Al-Mulk',
      subtitle: isFriday ? 'Sunnah hari Jumat' : 'Perisai siksa kubur',
      desc: isFriday
        ? 'Terangi diri dengan cahaya kebaikan dari Jumat ke Jumat berikutnya.'
        : 'Amalkan sebelum tidur untuk syafaat dan pengampunan dosa.',
      icon: BookOpen,
      colorClass: 'rec-card--emerald',
      link: isFriday ? '/mushaf/18' : '/mushaf/67' // Surah 18 is Kahf, 67 is Mulk
    };

    // 3. Sunnah Prayer Recommendation
    const isDhuhaTime = hours >= 7 && hours < 11;
    const isNight = hours >= 20 || hours < 3;
    let prayerTitle = 'Sholat Rawatib';
    let prayerSub = 'Pengiring sholat wajib';
    let prayerDesc = 'Sempurnakan amal sholat fardhu dengan mendirikan sholat sunnah rawatib.';
    let prayerLink = '/sholat';

    if (isDhuhaTime) {
      prayerTitle = 'Sholat Dhuha';
      prayerSub = 'Pagi hari (07.00 - 11.00)';
      prayerDesc = 'Membuka rezeki dan bernilai sedekah bagi seluruh persendian tubuh.';
    } else if (isNight) {
      prayerTitle = 'Sholat Tahajjud';
      prayerSub = 'Sepertiga malam terakhir';
      prayerDesc = 'Ibadah mulia di saat manusia terlelap, sarana dikabulkannya doa.';
    }

    const prayerRec = {
      title: prayerTitle,
      subtitle: prayerSub,
      desc: prayerDesc,
      icon: Clock,
      colorClass: 'rec-card--cyan',
      link: prayerLink
    };

    return [dzikirRec, quranRec, prayerRec];
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className="daily-rec-section">
      <div className="daily-rec-header">
        <h2 className="daily-rec-title">Pilihan Hari Ini</h2>
        <p className="daily-rec-subtitle">Rekomendasi amalan utama berdasarkan waktu dan hari Anda</p>
      </div>

      <div className="daily-rec-container">
        {recommendations.map((rec, index) => {
          const IconComp = rec.icon;
          return (
            <motion.div
              key={rec.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: '0 12px 24px -10px rgba(0,0,0,0.3)' }}
              onClick={() => navigate(rec.link, { state: rec.state })}
              className={`daily-rec-card ${rec.colorClass}`}
            >
              <div className="daily-rec-card__glow" />
              
              <div className="daily-rec-card__icon-wrap">
                <IconComp size={22} className="daily-rec-card__icon" />
              </div>

              <div className="daily-rec-card__body">
                <span className="daily-rec-card__badge">{rec.subtitle}</span>
                <h3 className="daily-rec-card__title">{rec.title}</h3>
                <p className="daily-rec-card__desc">{rec.desc}</p>
              </div>

              <div className="daily-rec-card__action">
                Amalkan <ChevronRight size={14} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
