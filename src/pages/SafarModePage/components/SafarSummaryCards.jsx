import { motion } from 'framer-motion';
import { Compass, Clock, Route, Headphones, Play, Pause, ChevronRight } from 'lucide-react';
import { useTilawahAudio } from '../../../context/TilawahContext';

export default function SafarSummaryCards({ onPlayLastAudio, lastPlayed }) {
  const { playing, activeRadio } = useTilawahAudio();

  const isAudioPlaying = playing && activeRadio;

  const cardData = [
    {
      title: 'Traveler Status',
      value: 'Musafir Aktif',
      desc: 'Syarat safar (81+ km) terpenuhi',
      icon: Route,
      color: 'teal',
    },
    {
      title: 'Qibla Direction',
      value: '294° Northwest',
      desc: 'Arah Ka\'bah presisi',
      icon: Compass,
      color: 'gold',
    },
    {
      title: 'Next Prayer',
      value: 'Ashar — 15:14',
      desc: 'Waktu shalat setempat',
      icon: Clock,
      color: 'purple',
    },
    {
      title: 'Active Audio',
      value: lastPlayed ? (lastPlayed.title || lastPlayed.name) : 'Doa Safar',
      desc: isAudioPlaying ? 'Sedang memutar audio...' : 'Klik untuk putar audio',
      icon: Headphones,
      color: 'blue',
      clickable: true,
      action: onPlayLastAudio,
    },
  ];

  const colors = {
    teal: 'safar-summary-card--teal',
    gold: 'safar-summary-card--gold',
    purple: 'safar-summary-card--purple',
    blue: 'safar-summary-card--blue',
  };

  return (
    <section className="safar-summary-grid">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        const isAudioCard = card.title === 'Active Audio';
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`safar-summary-card ${colors[card.color]} ${card.clickable ? 'safar-summary-card--clickable' : 'safar-summary-card--static'}`}
            onClick={card.clickable ? card.action : undefined}
          >
            <div className="safar-summary-card__icon-box">
              <Icon size={20} className="safar-summary-card__icon" />
            </div>
            <div className="safar-summary-card__content">
              <span className="safar-summary-card__title">{card.title}</span>
              <h4 className="safar-summary-card__value">{card.value}</h4>
              <p className="safar-summary-card__desc">{card.desc}</p>
            </div>
            {isAudioCard && (
              <>
                <button 
                  className="safar-summary-card__audio-btn"
                  aria-label={isAudioPlaying ? 'Pause Audio' : 'Play Audio'}
                >
                  {isAudioPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </button>
                <ChevronRight size={18} className="safar-summary-card__chevron" />
              </>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
