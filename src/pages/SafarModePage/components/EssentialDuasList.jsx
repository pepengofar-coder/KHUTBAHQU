import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Check } from 'lucide-react';

const DUAS = [
  {
    id: 'doa-keluar-rumah',
    title: 'Doa Keluar Rumah',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu \'alallah, laa hawla wa laa quwwata illaa billaah.',
    translation: 'Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan (pertolongan) Allah.',
    source: 'HR. Abu Daud no. 5095'
  },
  {
    id: 'doa-naik-kendaraan',
    title: 'Doa Naik Kendaraan',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhaanal-ladzii sakh-khara lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa Rabbinaa lamunqalibuun.',
    translation: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    source: 'HR. Muslim no. 1342'
  },
  {
    id: 'doa-safar',
    title: 'Doa Safar (Perjalanan Jauh)',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: 'Allahumma inna nas-aluka fii safarinaa haadzal birra wat taqwa, wa minal \'amali maa tardho. Allahumma hawwin \'alainaa safaranaa haadzaa wathwi \'annaa bu\'dahu. Allahumma antash shaahibu fis safari, wal khaliifatu fil ahli.',
    translation: 'Ya Allah, kami memohon kepada-Mu kebaikan dan ketakwaan dalam perjalanan ini, serta amal yang Engkau ridhai. Ya Allah, mudahkanlah perjalanan kami ini dan dekatkanlah jaraknya. Ya Allah, Engkau adalah teman dalam perjalanan dan penjaga keluarga (yang ditinggalkan).',
    source: 'HR. Muslim no. 1342'
  },
  {
    id: 'doa-singgah',
    title: 'Doa Saat Singgah / Istirahat',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'uudzu bikalimaatillaahit taammaati min syarri maa khalaq.',
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.',
    source: 'HR. Muslim no. 2708'
  },
  {
    id: 'doa-macet',
    title: 'Doa Saat Kesulitan / Macet',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً',
    transliteration: 'Allahumma laa sahla illaa maa ja\'altahu sahlan, wa anta taj\'alul hazna idzaa syi\'ta sahlan.',
    translation: 'Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah. Dan apabila Engkau berkehendak, Engkau akan menjadikan kesusahan menjadi kemudahan.',
    source: 'HR. Ibnu Hibban'
  },
  {
    id: 'doa-kembali',
    title: 'Doa Kembali dari Safar',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Aayibuuna taa-ibuuna \'aabiduuna lirabbinaa haamiduun.',
    translation: 'Kami kembali dengan bertaubat, tetap beribadah dan selalu memuji kepada Tuhan kami.',
    source: 'HR. Muslim'
  }
];

export default function EssentialDuasList() {
  const [openId, setOpenId] = useState('doa-safar');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handleOpenDua = (e) => {
      if (e.detail?.duaId) {
        setOpenId(e.detail.duaId);
      }
    };
    window.addEventListener('safar-open-dua', handleOpenDua);
    return () => window.removeEventListener('safar-open-dua', handleOpenDua);
  }, []);

  const toggleDua = (id) => {
    setOpenId(prev => prev === id ? null : id);
  };

  const handleCopy = (e, dua) => {
    e.stopPropagation();
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\nArtinya:\n${dua.translation}\n\n${dua.source}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="essential-duas" className="w-full scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          <span className="text-indigo-400 mr-2">🤲</span>Doa Essential Safar
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
          Kumpulan doa perlindungan dan kebaikan selama perjalanan.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {DUAS.map((dua, index) => {
          const isOpen = openId === dua.id;
          return (
            <motion.div
              key={dua.id}
              id={dua.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`safar-dua-card ${isOpen ? 'safar-dua-card--open' : ''}`}
            >
              <button
                onClick={() => toggleDua(dua.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl min-h-[72px]"
                aria-expanded={isOpen}
                aria-controls={`${dua.id}-content`}
              >
                <span className="font-bold text-white text-base md:text-lg tracking-wide pr-4">{dua.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {isOpen && (
                    <span
                      onClick={(e) => handleCopy(e, dua)}
                      className="p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-700/60 transition-colors"
                      title="Salin Doa"
                      role="button"
                      tabIndex={0}
                      aria-label="Salin doa"
                    >
                      {copiedId === dua.id ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                    </span>
                  )}
                  <span className={`text-indigo-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={22} />
                  </span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`${dua.id}-content`}
                    role="region"
                    aria-labelledby={dua.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 md:px-6 md:pb-7 pt-0 border-t border-slate-700/50 flex flex-col gap-6">
                      {/* Arabic */}
                      <div className="mt-5">
                        <p
                          dir="rtl"
                          className="text-right text-2xl sm:text-3xl md:text-4xl leading-[2.4] md:leading-[2.6] text-white"
                          style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif" }}
                        >
                          {dua.arabic}
                        </p>
                      </div>

                      {/* Transliteration */}
                      <p className="text-indigo-300 text-base md:text-lg font-medium italic leading-relaxed">
                        "{dua.transliteration}"
                      </p>

                      {/* Translation */}
                      <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                        <strong className="text-slate-200">Artinya:</strong> {dua.translation}
                      </p>

                      {/* Source */}
                      <div className="flex justify-end pt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                          {dua.source}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
