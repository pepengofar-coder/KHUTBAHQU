import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ChevronLeft, ChevronRight, BookmarkPlus, BookmarkCheck } from 'lucide-react';

const ArabicNumerals = (number) => {
  return number.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
};

export default function QuranMushaf() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jumpPage, setJumpPage] = useState('');
  
  // Bookmark logic
  const [bookmarkedPage, setBookmarkedPage] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  
  // Fetch logic
  useEffect(() => {
    // Initial load
    const savedLastRead = localStorage.getItem('isladiaku_last_read');
    const savedBookmark = localStorage.getItem('isladiaku_bookmark');
    
    if (savedBookmark) setBookmarkedPage(Number(savedBookmark));
    
    if (savedLastRead && Number(savedLastRead) !== 1) {
      setLastRead(Number(savedLastRead));
      setShowPrompt(true);
      fetchPage(1); // Load page 1 first while prompting
    } else {
      fetchPage(1);
    }
  }, []);
  
  const fetchPage = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`);
      const result = await res.json();
      if (result.code === 200) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching Quran data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > 604) return;
    setPage(newPage);
    setJumpPage('');
    localStorage.setItem('isladiaku_last_read', newPage.toString());
    fetchPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleJump = (e) => {
    e.preventDefault();
    const target = parseInt(jumpPage, 10);
    if (!isNaN(target)) {
      changePage(target);
    }
  };
  
  const toggleBookmark = () => {
    if (bookmarkedPage === page) {
      setBookmarkedPage(null);
      localStorage.removeItem('isladiaku_bookmark');
    } else {
      setBookmarkedPage(page);
      localStorage.setItem('isladiaku_bookmark', page.toString());
    }
  };

  const isBookmarked = bookmarkedPage === page;

  // Deriving Info from data
  const firstAyah = data?.ayahs?.[0];
  const surahName = firstAyah?.surah?.name || '';
  const juzNum = firstAyah?.juz || '';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-24 font-sans">
      {/* Resume Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white shadow-xl rounded-xl p-4 flex flex-col items-center gap-3 border border-amber-100"
          >
            <p className="text-sm font-medium text-gray-700">Lanjutkan dari halaman {lastRead}?</p>
            <div className="flex gap-2">
              <button 
                onClick={() => { changePage(lastRead); setShowPrompt(false); }}
                className="px-4 py-1.5 bg-[#0083B0] text-white text-sm rounded-lg hover:bg-[#00B4DB] transition-colors"
              >
                Ya, Lanjutkan
              </button>
              <button 
                onClick={() => setShowPrompt(false)}
                className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">Juz {juzNum}</span>
            <span className="text-sm font-semibold text-[#0083B0]">Halaman {page}</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-gray-800 font-arabic">
            {surahName}
          </div>
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full transition-all duration-300 ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
            title="Tandai Halaman"
          >
            <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-[#fffcf4] min-h-[65vh] rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-amber-900/10 p-6 md:p-10 relative overflow-hidden flex flex-col"
          >
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                <p className="text-amber-700/60 font-medium">Memuat halaman {page}...</p>
              </div>
            ) : (
              <div 
                dir="rtl"
                className="relative z-10 text-justify text-[28px] md:text-[34px] leading-[2.5] md:leading-[3] text-gray-800 flex-1"
                style={{ 
                  fontFamily: "'Uthmani', 'Amiri', 'Traditional Arabic', serif",
                  textAlignLast: 'center' 
                }}
              >
                {data?.ayahs.map((ayah) => (
                  <React.Fragment key={ayah.number}>
                    <span className="hover:bg-amber-50/50 transition-colors rounded cursor-text">{ayah.text}</span>
                    <span className="inline-flex items-center justify-center mx-1.5 text-amber-600 relative w-8 h-8 align-middle select-none">
                      <span className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl opacity-80">۝</span>
                      <span className="relative z-10 text-[10px] md:text-xs mt-1 font-sans font-bold">{ArabicNumerals(ayah.numberInSurah)}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {/* Page Number Bottom Center of Page */}
            {!loading && (
              <div className="text-center mt-12 mb-2 text-sm font-bold text-amber-800/40">
                {page}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] pb-safe">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4 order-2 md:order-1">
            <button 
              onClick={() => changePage(page + 1)}
              disabled={page >= 604}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
              <span className="hidden sm:inline">Berikutnya</span>
            </button>
            
            <button 
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <span className="hidden sm:inline">Sebelumnya</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleJump} className="flex items-center gap-2 w-full md:w-auto order-1 md:order-2">
            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Lompat ke:</label>
            <input 
              type="number" 
              min="1" 
              max="604"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder={page.toString()}
              className="w-full md:w-20 text-center py-2 px-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0083B0] focus:ring-2 focus:ring-[#0083B0]/20 rounded-xl outline-none transition-all"
            />
            <button type="submit" className="hidden">Go</button>
          </form>

          <button 
            onClick={toggleBookmark}
            className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all order-3 ${isBookmarked ? 'bg-amber-100 text-amber-700' : 'bg-[#0083B0] text-white hover:bg-[#006A8F]'}`}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
