import { motion } from 'framer-motion';
import { Play, Headphones, Radio, Sparkles, Heart } from 'lucide-react';
import { getPlaylistItems } from '../../../data/travelAudioContent';

const PLAYLIST_MAPPING = [
  {
    id: 'murottal-juz-amma',
    displayTitle: 'Juz Amma Murottal',
    desc: 'Hafalan surat pendek dari Juz 30 menenangkan jiwa.',
    icon: Headphones,
    colorClass: 'safar-audio-card--emerald'
  },
  {
    id: 'dzikir-doa',
    displayTitle: 'Dhikr & Travel Du’a',
    desc: 'Lantunan doa & dzikir safar penjaga keselamatan.',
    icon: Heart,
    colorClass: 'safar-audio-card--rose'
  },
  {
    id: 'kajian-ringan',
    displayTitle: 'Short Islamic Reminder',
    desc: 'Kajian audio pendek penyejuk kalbu sepanjang perjalanan.',
    icon: Sparkles,
    colorClass: 'safar-audio-card--indigo'
  },
  {
    id: 'radio-dakwah',
    displayTitle: 'Islamic Radio',
    desc: 'Siaran live kajian Sunnah & tilawah Quran 24 jam.',
    icon: Radio,
    colorClass: 'safar-audio-card--cyan'
  }
];

export default function SafarAudioPlaylist({ onOpenPlaylist }) {
  return (
    <section id="audio" className="safar-audio scroll-mt-24">
      <div className="safar-section-header">
        <span className="safar-section-badge">Travel Companion Audio</span>
        <h2 className="safar-section-title">Audio & Travel Playlist</h2>
        <p className="safar-section-desc">Kumpulan lantunan ayat suci, dzikir safar, dan kajian ringan untuk menemani perjalanan Anda.</p>
      </div>

      <div className="safar-audio-grid">
        {PLAYLIST_MAPPING.map((playlist) => {
          const IconComp = playlist.icon;
          const tracks = getPlaylistItems(playlist.id);
          const trackCount = tracks.length;

          return (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              onClick={() => onOpenPlaylist(playlist.id)}
              className={`safar-audio-card ${playlist.colorClass}`}
            >
              <div className="safar-audio-card__icon-box">
                <IconComp size={20} className="safar-audio-card__icon" />
              </div>

              <div className="safar-audio-card__body">
                <span className="safar-audio-card__count">{trackCount} Audio</span>
                <h3 className="safar-audio-card__title">{playlist.displayTitle}</h3>
                <p className="safar-audio-card__desc">{playlist.desc}</p>
              </div>

              <button
                className="safar-audio-card__play-btn"
                aria-label={`Play ${playlist.displayTitle}`}
              >
                <Play size={16} fill="currentColor" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
