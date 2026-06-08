import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, AlertCircle } from 'lucide-react';
import { useTilawahAudio } from '../../../context/TilawahContext';

const STREAMS = {
  high: [
    'https://radioislamindonesia.com/rodja.mp3',
    'https://live2.radiorodja.com/rodja.mp3'
  ],
  low: [
    'https://radioislamindonesia.com/rodja-low.mp3',
    'https://live2.radiorodja.com/rodja-low.mp3'
  ]
};

export default function RadioRodjaPlayer() {
  const { playing: globalPlaying, stopAudio } = useTilawahAudio();

  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('high'); // 'high' or 'low'
  const [streamIndex, setStreamIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  // Fallback function: tries next stream or stops if none left
  const handleFallback = useCallback(() => {
    const streamsList = STREAMS[quality];
    if (streamIndex < streamsList.length - 1) {
      setErrorMessage('Stream sedang tidak tersedia, mencoba server lain...');
      setStreamIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage('Radio Rodja saat ini offline atau server tidak tersedia.');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [quality, streamIndex]);

  // Loading timeout: tries fallback if stream hangs
  const startLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (audioRef.current && (audioRef.current.paused || audioRef.current.seeking)) {
        console.warn('Rodja loading timed out, trying fallback...');
        handleFallback();
      }
    }, 9000); // 9 seconds timeout to buffer
  }, [handleFallback]);

  // Toggle play/pause
  const handlePlayToggle = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      // Stop global audio player to prevent double sound
      stopAudio();

      setIsPlaying(true);
      setIsLoading(true);
      setErrorMessage(null);
      
      // Re-load to get fresh live stream
      audioRef.current.src = STREAMS[quality][streamIndex];
      audioRef.current.load();
      audioRef.current.play()
        .then(() => startLoadingTimeout())
        .catch(() => handleFallback());
    }
  }, [quality, streamIndex, isPlaying, stopAudio, startLoadingTimeout, handleFallback]);

  // Sync with global player: pause Rodja if global audio starts
  useEffect(() => {
    if (globalPlaying && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [globalPlaying, isPlaying]);

  // Handle source changes based on quality and streamIndex
  useEffect(() => {
    if (audioRef.current) {
      const activeStream = STREAMS[quality][streamIndex];
      const wasPlaying = isPlaying;
      
      // Update src
      audioRef.current.src = activeStream;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play()
          .then(() => startLoadingTimeout())
          .catch(() => handleFallback());
      }
    }
  }, [quality, streamIndex, isPlaying, startLoadingTimeout, handleFallback]);

  // Handle volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleQualityChange = (newQuality) => {
    if (newQuality === quality) return;
    setQuality(newQuality);
    setStreamIndex(0); // Reset fallback index for the new quality
    setErrorMessage(null);
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onWaiting = () => {
    setIsLoading(true);
    startLoadingTimeout();
  };

  const onPlaying = () => {
    setIsLoading(false);
    setErrorMessage(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const onError = () => {
    if (isPlaying) {
      handleFallback();
    }
  };

  return (
    <div className="safar-radio-player-card">
      <audio
        ref={audioRef}
        onLoadStart={onLoadStart}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onError={onError}
        preload="none"
      />

      <div className="safar-radio-player-card__inner">
        {/* Left Side: Broadcast Icon & Badges */}
        <div className="safar-radio-player-card__left">
          <div className="safar-radio-player-card__icon-wrap">
            <Radio className={`safar-radio-player-card__radio-icon ${isPlaying && !isLoading ? 'playing' : ''}`} size={24} />
            {isPlaying && !isLoading && (
              <div className="safar-radio-player-card__equalizer">
                <span /><span /><span /><span />
              </div>
            )}
          </div>
          
          <div className="safar-radio-player-card__badge-row">
            <span className={`safar-radio-player-card__live-badge ${isPlaying ? 'active' : ''}`}>
              <span className="live-dot" /> LIVE
            </span>
          </div>
        </div>

        {/* Center: Details & Controls */}
        <div className="safar-radio-player-card__center">
          <h3 className="safar-radio-player-card__title">Radio Rodja Live</h3>
          <p className="safar-radio-player-card__subtitle">Siaran kajian Islam dan tilawah 24 jam</p>

          {/* Quality Selector */}
          <div className="safar-radio-player-card__quality-selector">
            <button
              onClick={() => handleQualityChange('high')}
              className={`quality-btn ${quality === 'high' ? 'active' : ''}`}
            >
              High Quality
            </button>
            <button
              onClick={() => handleQualityChange('low')}
              className={`quality-btn ${quality === 'low' ? 'active' : ''}`}
            >
              Data Saver
            </button>
          </div>

          {/* Volume Control */}
          <div className="safar-radio-player-card__volume-box">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="volume-btn"
              aria-label="Mute Toggle"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="volume-slider"
              aria-label="Volume Slider"
            />
          </div>

          {/* Error / Fallback message */}
          {errorMessage && (
            <div className="safar-radio-player-card__error">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Circular Play Button */}
        <div className="safar-radio-player-card__right">
          <button
            onClick={handlePlayToggle}
            className={`safar-radio-player-card__play-btn ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
            aria-label="Play Radio"
            disabled={isLoading && !isPlaying}
          >
            {isLoading ? (
              <span className="radio-spinner" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
