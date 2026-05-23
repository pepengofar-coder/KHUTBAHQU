import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTilawahAudio } from '../../context/TilawahContext';
import { useAuth } from '../../context/AuthContext';
import { trackUserActivity } from '../../lib/syncService';
import { useSEO } from '../../utils/seo';
import { quranMetadata } from '../../data/quranMetadata';
import { JUZ_RANGES } from '../../data/juzRanges';
import { ArrowLeft, Play, Pause, Headphones, AlertCircle, Search, Clock } from 'lucide-react';
import './Murottal30JuzPage.css';

export default function Murottal30JuzPage() {
  useSEO({
    title: 'Murottal 30 Juz | Islamediaku',
    description: 'Dengarkan murottal Al-Qur\'an 30 Juz lengkap dari berbagai Qari pilihan.',
    path: '/murottal-30-juz'
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, playing, activeRadio, togglePlay } = useTilawahAudio();

  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // By default select Mishary Alafasy (often ID 7 in MP3Quran, but we'll find him)
  const [selectedReciterId, setSelectedReciterId] = useState('');
  
  const [surahs, setSurahs] = useState([]); // localized surah names

  // Navigation and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRange, setFilterRange] = useState('Semua');

  // Continue Listening State
  const [lastPlayed, setLastPlayed] = useState(() => {
    try {
      const stored = localStorage.getItem('islamediaku_tilawah_last_juz');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Fetch Surah Names from Quran.com for localized names
  useEffect(() => {
    fetch('https://api.quran.com/api/v4/chapters?language=id')
      .then(res => res.json())
      .then(data => setSurahs(data.chapters))
      .catch(console.error);
  }, []);

  // Fetch Reciters from MP3Quran
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch('https://www.mp3quran.net/api/v3/reciters?language=id')
      .then(res => res.json())
      .then(data => {
        const sortedReciters = data.reciters.sort((a, b) => a.name.localeCompare(b.name));
        setReciters(sortedReciters);
        
        // Find Mishary or default to first
        const mishary = sortedReciters.find(r => r.name.toLowerCase().includes('mishary') || r.name.toLowerCase().includes('afasy'));
        if (mishary) {
          setSelectedReciterId(mishary.id.toString());
        } else if (sortedReciters.length > 0) {
          setSelectedReciterId(sortedReciters[0].id.toString());
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Gagal memuat daftar Qari. Periksa koneksi internet Anda.');
        setLoading(false);
      });
  }, []);

  const selectedReciter = useMemo(() => {
    if (!selectedReciterId || !reciters.length) return null;
    return reciters.find(r => r.id.toString() === selectedReciterId);
  }, [selectedReciterId, reciters]);

  const activeMoshaf = useMemo(() => {
    if (!selectedReciter) return null;
    // Prefer Murattal (Moshaf type 1) or just the first one
    return selectedReciter.moshaf.find(m => m.moshaf_type === 1) || selectedReciter.moshaf[0];
  }, [selectedReciter]);

  const availableSurahs = useMemo(() => {
    if (!activeMoshaf) return [];
    return activeMoshaf.surah_list.split(',').map(s => parseInt(s));
  }, [activeMoshaf]);

  const handlePlayJuz = (juzNumber) => {
    if (!activeMoshaf || !surahs.length) return;

    const startSurahId = quranMetadata.juzs[juzNumber].start.surah;

    // Filter available surahs for this reciter starting from the startSurahId
    const surahsToPlay = availableSurahs.filter(s => s >= startSurahId);

    if (surahsToPlay.length === 0) {
      alert("Qari ini belum memiliki audio untuk bagian ini.");
      return;
    }

    // Build Playlist
    const playlist = surahsToPlay.map(surahId => {
      const surahInfo = surahs.find(s => s.id === surahId);
      const paddedSurah = String(surahId).padStart(3, '0');
      return {
        id: `mp3quran-${selectedReciter.id}-${surahId}`,
        name: surahInfo ? surahInfo.name_simple : `Surah ${surahId}`,
        subtitle: selectedReciter.name,
        title: surahInfo ? `Surah ${surahInfo.name_simple}` : `Surah ${surahId}`, // for player display
        sourceName: 'MP3Quran.net',
        audioUrl: `${activeMoshaf.server}${paddedSurah}.mp3`,
        type: 'murottal',
        attribution: 'Sumber audio: MP3Quran.net',
        enabled: true,
        // Meta data used to identify Juz playback
        juzNumber: juzNumber
      };
    });

    // Save Last Played to LocalStorage
    const lastPlayedData = {
      juzNumber,
      reciterId: selectedReciter.id,
      reciterName: selectedReciter.name,
      timestamp: new Date().toISOString()
    };
    setLastPlayed(lastPlayedData);
    localStorage.setItem('islamediaku_tilawah_last_juz', JSON.stringify(lastPlayedData));

    // Play first track of the playlist
    playTrack(playlist[0], playlist);

    if (user) {
      trackUserActivity(user.id, 'murottal_30_juz', 'play_juz', {
        juz: juzNumber,
        reciterId: selectedReciter.id,
        reciterName: selectedReciter.name
      });
    }
  };

  const activeJuz = activeRadio?.type === 'murottal' ? activeRadio.juzNumber : null;

  const filteredJuzList = useMemo(() => {
    let list = Array.from({ length: 30 }, (_, i) => i + 1);

    // Apply Range Filter
    if (filterRange === '1-10') list = list.filter(j => j >= 1 && j <= 10);
    else if (filterRange === '11-20') list = list.filter(j => j >= 11 && j <= 20);
    else if (filterRange === '21-30') list = list.filter(j => j >= 21 && j <= 30);

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(juzNum => {
        if (juzNum.toString().includes(q) || `juz ${juzNum}`.includes(q)) return true;
        const range = JUZ_RANGES[juzNum - 1];
        if (range && (range.start.toLowerCase().includes(q) || range.end.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return list;
  }, [filterRange, searchQuery]);

  return (
    <div className="murottal-juz-page">
      <header className="murottal-juz-header container">
        <button className="btn-back" onClick={() => navigate(-1)} aria-label="Kembali">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="murottal-juz-title">Murottal 30 Juz</h1>
          <p className="murottal-juz-subtitle">Dengarkan Al-Qur'an lengkap dari Qari pilihan</p>
        </div>
      </header>

      <main className="container murottal-juz-main">
        {/* Continue Listening Card */}
        {lastPlayed && (
          <div className="murottal-continue-card">
            <div className="murottal-continue-card__icon"><Clock size={24} /></div>
            <div className="murottal-continue-card__info">
              <h4>Lanjutkan Tilawah</h4>
              <p>Juz {lastPlayed.juzNumber} • {lastPlayed.reciterName}</p>
            </div>
            <button 
              className="btn btn--primary btn--sm"
              onClick={() => {
                if (selectedReciterId !== lastPlayed.reciterId.toString()) {
                  setSelectedReciterId(lastPlayed.reciterId.toString());
                  // Will play after reciter loads, handled by a separate effect if we wanted perfectly,
                  // but simple click to set reciter is fine, user clicks again. Let's just play if it's the same reciter.
                  if (selectedReciterId === lastPlayed.reciterId.toString()) {
                    handlePlayJuz(lastPlayed.juzNumber);
                  } else {
                    alert("Mengganti Qari ke " + lastPlayed.reciterName + ", silakan klik putar Juz " + lastPlayed.juzNumber + " di bawah setelah dimuat.");
                  }
                } else {
                  handlePlayJuz(lastPlayed.juzNumber);
                }
              }}
            >
              Putar
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="murottal-info-banner">
          <AlertCircle size={20} className="info-icon" />
          <div>
            <strong>Catatan Audio (Pemisah Juz)</strong>
            <p>Audio MP3Quran dipisahkan per Surah, bukan pas per ayat. Memutar Juz yang dimulai di tengah surah akan memulai audio dari awal surah tersebut. <i>[TODO: Exact Ayah Split]</i></p>
          </div>
        </div>

        {/* Qari Selection */}
        <div className="murottal-qari-select">
          <label htmlFor="qari-select">Pilih Qari:</label>
          <div className="select-wrapper">
            <Headphones size={18} className="select-icon" />
            <select 
              id="qari-select"
              value={selectedReciterId}
              onChange={(e) => setSelectedReciterId(e.target.value)}
              disabled={loading}
            >
              {loading && <option value="">Memuat Qari...</option>}
              {reciters.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="murottal-error">{error}</div>}

        {/* Search and Filter */}
        <div className="murottal-filter-section">
          <div className="murottal-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari Juz atau Surah..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="murottal-chips">
            {['Semua', '1-10', '11-20', '21-30'].map(range => (
              <button 
                key={range}
                className={`murottal-chip ${filterRange === range ? 'active' : ''}`}
                onClick={() => setFilterRange(range)}
              >
                {range !== 'Semua' ? `Juz ${range}` : range}
              </button>
            ))}
          </div>
        </div>

        {/* 30 Juz Grid */}
        <div className="juz-grid">
          {filteredJuzList.length === 0 && (
            <div className="murottal-empty">Tidak ada Juz yang sesuai pencarian.</div>
          )}
          {filteredJuzList.map(juzNum => {
            const isPlayingThisJuz = activeJuz === juzNum && playing;
            const rangeInfo = JUZ_RANGES[juzNum - 1];
            
            return (
              <div 
                key={juzNum} 
                className={`juz-card ${activeJuz === juzNum ? 'active' : ''}`}
                onClick={() => handlePlayJuz(juzNum)}
              >
                <div className="juz-card-header">
                  <div className="juz-number">
                    <span>{juzNum}</span>
                  </div>
                  <button className="juz-play-btn" onClick={(e) => { e.stopPropagation(); activeJuz === juzNum ? togglePlay() : handlePlayJuz(juzNum); }}>
                    {isPlayingThisJuz ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                </div>
                <div className="juz-card-body">
                  <h3 className="juz-title">Juz {juzNum}</h3>
                  <p className="juz-desc">{rangeInfo ? `${rangeInfo.start} – ${rangeInfo.end}` : ''}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="tilawah-attribution" style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--muted-text)' }}>Sumber audio: <a href="https://mp3quran.net" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>MP3Quran.net</a></p>
      </main>
    </div>
  );
}
