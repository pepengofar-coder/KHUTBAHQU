import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Copy, Bookmark, Share2, ChevronRight, Check } from 'lucide-react';
import { useTilawahAudio } from '../../../context/TilawahContext';

const STATIC_DUAS = [
  {
    id: 'doa-keluar-rumah',
    title: 'Doa Keluar Rumah',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu \'alallah, laa hawla wa laa quwwata illaa billaah.',
    translation: 'Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan (pertolongan) Allah.',
    source: 'HR. Abu Daud no. 5095',
    audioUrl: 'https://server8.mp3quran.net/afs/114.mp3'
  },
  {
    id: 'doa-naik-kendaraan',
    title: 'Doa Naik Kendaraan',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhaanal-ladzii sakh-khara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa Rabbinaa lamunqalibuun.',
    translation: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    source: 'HR. Muslim no. 1342',
    audioUrl: 'https://server8.mp3quran.net/afs/113.mp3'
  },
  {
    id: 'doa-safar',
    title: 'Doa Safar (Perjalanan Jauh)',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: 'Allahumma inna nas-aluka fii safarinaa haadzal birra wat taqwa, wa minal \'amali maa tardho. Allahumma hawwin \'alainaa safaranaa haadzaa wathwi \'annaa bu\'dahu. Allahumma antash shaahibu fis safari, wal khaliifatu fil ahli.',
    translation: 'Ya Allah, kami memohon kepada-Mu kebaikan dan ketakwaan dalam perjalanan ini, serta amal yang Engkau ridhai. Ya Allah, mudahkanlah perjalanan kami ini dan dekatkanlah jaraknya. Ya Allah, Engkau adalah teman dalam perjalanan dan penjaga keluarga (yang ditinggalkan).',
    source: 'HR. Muslim no. 1342',
    audioUrl: 'https://server8.mp3quran.net/afs/112.mp3'
  },
  {
    id: 'doa-singgah',
    title: 'Doa Saat Singgah / Istirahat',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'uudzu bikalimaatillaahit taammaati min syarri maa khalaq.',
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.',
    source: 'HR. Muslim no. 2708',
    audioUrl: 'https://server8.mp3quran.net/afs/111.mp3'
  },
  {
    id: 'doa-macet',
    title: 'Doa Saat Kesulitan / Macet',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً',
    transliteration: 'Allahumma laa sahla illaa maa ja\'altahu sahlan, wa anta taj\'alul hazna idzaa syi\'ta sahlan.',
    translation: 'Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah. Dan apabila Engkau berkehendak, Engkau akan menjadikan kesusahan menjadi kemudahan.',
    source: 'HR. Ibnu Hibban',
    audioUrl: 'https://server8.mp3quran.net/afs/110.mp3'
  },
  {
    id: 'doa-kembali',
    title: 'Doa Kembali dari Safar',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Aayibuuna taa-ibuuna \'aabiduuna lirabbinaa haamiduun.',
    translation: 'Kami kembali dengan bertaubat, tetap beribadah dan selalu memuji kepada Tuhan kami.',
    source: 'HR. Muslim',
    audioUrl: 'https://server8.mp3quran.net/afs/109.mp3'
  }
];

export default function DoaSafar({ showToast }) {
  const [activeId, setActiveId] = useState('doa-safar');
  const [copiedId, setCopiedId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const { playTrack, playing, activeRadio } = useTilawahAudio();

  const duas = useMemo(() => STATIC_DUAS, []);
  const activeDua = useMemo(() => duas.find(d => d.id === activeId) || duas[2], [duas, activeId]);

  useEffect(() => {
    const handleOpenDua = (e) => {
      if (e.detail?.duaId) {
        setActiveId(e.detail.duaId);
      }
    };
    window.addEventListener('safar-open-dua', handleOpenDua);
    return () => window.removeEventListener('safar-open-dua', handleOpenDua);
  }, []);

  const handleCopy = (dua) => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\nArtinya:\n${dua.translation}\n\nSumber: ${dua.source}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(dua.id);
      showToast('Doa berhasil disalin ke papan klip! 📋');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSave = (dua) => {
    if (savedIds.includes(dua.id)) {
      setSavedIds(prev => prev.filter(id => id !== dua.id));
      showToast('Doa dihapus dari bookmark safar.');
    } else {
      setSavedIds(prev => [...prev, dua.id]);
      showToast('Doa disimpan ke bookmark safar! 💾');
    }
  };

  const handleShare = (dua) => {
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: `Baca doa safar: ${dua.title}\n\n${dua.arabic}\n\nArtinya: ${dua.translation}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${dua.title}: ${window.location.href}`);
      showToast('Link doa disalin untuk dibagikan! 🔗');
    }
  };

  const handlePlayAudio = (dua) => {
    const track = {
      id: `dua-audio-${dua.id}`,
      type: 'audio',
      title: dua.title,
      subtitle: 'Bimbingan Doa Safar',
      audioUrl: dua.audioUrl,
      enabled: true
    };
    
    if (playing && activeRadio?.id === track.id) {
      window.dispatchEvent(new CustomEvent('imk-pause-track'));
      showToast('Audio doa dihentikan.');
    } else {
      playTrack(track, [track]);
      showToast(`Memutar audio: ${dua.title} 🔊`);
    }
  };

  const isDuaPlaying = (dua) => {
    return playing && activeRadio?.id === `dua-audio-${dua.id}`;
  };

  return (
    <section id="duas" className="safar-duas scroll-mt-24">
      <div className="safar-section-header">
        <span className="safar-section-badge">Travel Supplications</span>
        <h2 className="safar-section-title">Essential Travel Du’a</h2>
        <p className="safar-section-desc">Kumpulan doa harian musafir agar perjalanan Anda senantiasa dalam perlindungan Allah.</p>
      </div>

      <div className="safar-duas-layout">
        {/* Left Column: Sidebar list of Du'as */}
        <div className="safar-duas-list">
          {duas.map((dua) => {
            const isActive = activeId === dua.id;
            const isPlaying = isDuaPlaying(dua);
            return (
              <div
                key={dua.id}
                onClick={() => setActiveId(dua.id)}
                className={`safar-dua-item ${isActive ? 'safar-dua-item--active' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveId(dua.id)}
              >
                <div className="safar-dua-item__number">
                  {isPlaying ? (
                    <div className="safar-dua-item__waves">
                      <span /><span /><span />
                    </div>
                  ) : (
                    <span>🤲</span>
                  )}
                </div>
                <div className="safar-dua-item__info">
                  <h4 className="safar-dua-item__title">{dua.title}</h4>
                  <p className="safar-dua-item__source">{dua.source}</p>
                </div>
                <ChevronRight size={16} className="safar-dua-item__chevron" />

                {/* Mobile Expandable Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="safar-dua-item__mobile-panel"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="safar-dua-detail__mobile-inner">
                        <p dir="rtl" className="safar-dua-detail__arabic text-right mb-4">
                          {dua.arabic}
                        </p>
                        <p className="safar-dua-detail__transliteration mb-3">
                          "{dua.transliteration}"
                        </p>
                        <p className="safar-dua-detail__translation mb-4">
                          <strong>Artinya:</strong> {dua.translation}
                        </p>
                        
                        <div className="safar-dua-detail__actions mt-3">
                          <button onClick={() => handlePlayAudio(dua)} className="safar-dua-action-btn" aria-label="Play">
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button onClick={() => handleCopy(dua)} className="safar-dua-action-btn" aria-label="Copy">
                            {copiedId === dua.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                          </button>
                          <button onClick={() => handleSave(dua)} className="safar-dua-action-btn" aria-label="Save">
                            <Bookmark size={16} fill={savedIds.includes(dua.id) ? '#F59E0B' : 'none'} className={savedIds.includes(dua.id) ? 'text-amber-500' : 'text-slate-400'} />
                          </button>
                          <button onClick={() => handleShare(dua)} className="safar-dua-action-btn" aria-label="Share">
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right Column: Premium Active Du'a Details Card */}
        <div className="safar-duas-detail-panel">
          <motion.div
            key={activeDua.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="safar-dua-detail-card"
          >
            {/* Header info */}
            <div className="safar-dua-detail__header">
              <div>
                <h3 className="safar-dua-detail__title">{activeDua.title}</h3>
                <span className="safar-dua-detail__source-badge">{activeDua.source}</span>
              </div>
              <div className="safar-dua-detail__actions">
                <button 
                  onClick={() => handlePlayAudio(activeDua)} 
                  className={`safar-dua-action-btn safar-dua-action-btn--primary ${isDuaPlaying(activeDua) ? 'safar-dua-action-btn--playing' : ''}`}
                  title="Putar Audio"
                >
                  {isDuaPlaying(activeDua) ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  <span>{isDuaPlaying(activeDua) ? 'Jeda Audio' : 'Dengarkan'}</span>
                </button>
                <button 
                  onClick={() => handleCopy(activeDua)} 
                  className="safar-dua-action-btn"
                  title="Salin Teks"
                >
                  {copiedId === activeDua.id ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
                <button 
                  onClick={() => handleSave(activeDua)} 
                  className="safar-dua-action-btn"
                  title="Simpan Doa"
                >
                  <Bookmark size={18} fill={savedIds.includes(activeDua.id) ? '#F59E0B' : 'none'} className={savedIds.includes(activeDua.id) ? 'text-amber-500' : 'text-slate-400'} />
                </button>
                <button 
                  onClick={() => handleShare(activeDua)} 
                  className="safar-dua-action-btn"
                  title="Bagikan Doa"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="safar-dua-detail__body">
              <div className="safar-dua-detail__arabic-wrapper">
                <p dir="rtl" className="safar-dua-detail__arabic">
                  {activeDua.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div className="safar-dua-detail__section" style={{ marginTop: '16px' }}>
                <span className="safar-dua-detail__section-label">Transliterasi</span>
                <p className="safar-dua-detail__transliteration">
                  "{activeDua.transliteration}"
                </p>
              </div>

              {/* Translation */}
              <div className="safar-dua-detail__section" style={{ marginTop: '16px' }}>
                <span className="safar-dua-detail__section-label">Terjemahan</span>
                <p className="safar-dua-detail__translation">
                  {activeDua.translation}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
