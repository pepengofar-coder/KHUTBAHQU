import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

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
  const [openId, setOpenId] = useState('doa-safar'); // Default open
  const [copiedId, setCopiedId] = useState(null);

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
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight text-balance">
          <span className="text-indigo-400">🤲</span> Doa Essential Safar
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed text-balance">
          Kumpulan doa perlindungan dan kebaikan selama perjalanan.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {DUAS.map((dua) => {
          const isOpen = openId === dua.id;
          return (
            <div 
              key={dua.id} 
              id={dua.id}
              className={`bg-slate-800/80 rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-indigo-500/50 shadow-lg shadow-indigo-900/20 ring-1 ring-indigo-500/20' : 'border-slate-700 shadow-md hover:border-slate-600'
              }`}
            >
              <button 
                onClick={() => toggleDua(dua.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none min-h-[80px]"
              >
                <span className="font-bold text-white text-lg tracking-wide text-balance">{dua.title}</span>
                <div className="flex items-center gap-3">
                  {isOpen && (
                    <span 
                      onClick={(e) => handleCopy(e, dua)}
                      className="p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-700 transition-colors"
                      title="Salin Doa"
                    >
                      {copiedId === dua.id ? <Check size={22} className="text-emerald-400" /> : <Copy size={22} />}
                    </span>
                  )}
                  <span className={`text-indigo-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={24} />
                  </span>
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 md:p-6 pt-0 border-t border-slate-700/50 bg-slate-900/30 flex flex-col gap-6">
                  
                  {/* Arabic Section */}
                  <div className="mt-6">
                    <p 
                      dir="rtl" 
                      className="text-right text-3xl md:text-4xl leading-[3] md:leading-[3] font-arabic text-white" 
                      style={{ fontFamily: "'Uthmani', 'Traditional Arabic', serif" }}
                    >
                      {dua.arabic}
                    </p>
                  </div>
                  
                  {/* Latin & Translation Section */}
                  <div className="flex flex-col gap-3">
                    <p className="text-indigo-300 text-sm md:text-base font-medium italic leading-relaxed text-balance">
                      "{dua.transliteration}"
                    </p>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed text-balance">
                      <strong className="text-slate-200">Artinya:</strong> {dua.translation}
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                      {dua.source}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
