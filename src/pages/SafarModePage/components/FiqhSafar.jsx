import { useState } from 'react';
import { 
  BookOpen, ChevronDown, CheckCircle2, ShieldCheck, 
  MapPin, Clock, Compass, Sun, Info, Sparkles, Search
} from 'lucide-react';

const FIQH_CATEGORIES = [
  { id: 'all', label: 'Semua Topik' },
  { id: 'ketentuan', label: 'Syarat & Batas Safar' },
  { id: 'jamak-qashar', label: 'Jamak & Qashar' },
  { id: 'kendaraan', label: 'Sholat di Kendaraan' },
  { id: 'thaharah', label: 'Thaharah & Khuff' },
  { id: 'puasa', label: 'Puasa Musafir' },
  { id: 'adab', label: 'Adab Safar' }
];

const FIQH_ARTICLES = [
  {
    id: 'syarat-safar',
    category: 'ketentuan',
    title: 'Syarat & Ketentuan Berlaku Hukum Safar',
    subtitle: 'Kapan seseorang dianggap musafir dan mendapat keringanan (rukhshah)?',
    badge: 'Dasar Safar',
    icon: MapPin,
    dalil: 'HR. Bukhari no. 1086 & Muslim no. 690',
    summary: 'Safar yang membolehkan rukhshah adalah perjalanan mubah/ibadah dengan jarak tertentu dan telah keluar dari batas daerah tempat tinggal.',
    points: [
      {
        head: 'Jarak Minimum Safar',
        body: 'Mayoritas ulama (Jumhur: Syafi’i, Maliki, Hanbali) menetapkan jarak minimum safar sekitar 4 burud atau ± 80 - 89 km. Sebagian ulama (Ibn Taimiyah) berpendapat jarak disesuaikan dengan urf (kebiasaan masyarakat setempat yang menganggapnya safar).'
      },
      {
        head: 'Tujuan Safar yang Mubah',
        body: 'Safar yang mendapat keringanan ibadah adalah perjalanan untuk kebaikan, silaturahmi, rekreasi halal, dagang, atau ibadah. Perjalanan maksiat tidak mendapat rukhshah.'
      },
      {
        head: 'Batas Mulai & Berakhirnya Safar',
        body: 'Hukum safar berlaku sejak musafir keluar melewati batas pemukiman/bangunan terluar dari desanya/kotanya, bukan saat masih berada di dalam rumah. Safar berakhir saat kembali memasuki pemukiman asal.'
      }
    ]
  },
  {
    id: 'jamak-qashar',
    category: 'jamak-qashar',
    title: 'Panduan Lengkap Sholat Jamak & Qashar',
    subtitle: 'Tata cara meringkas dan menggabungkan sholat fardhu bagi musafir',
    badge: 'Utama',
    icon: Clock,
    dalil: 'QS. An-Nisa: 101 & HR. Muslim no. 686',
    summary: 'Mengqashar (meringkas 4 rakaat jadi 2 rakaat) adalah hadiah (sedekah) dari Allah SWT yang sangat dianjurkan untuk diambil oleh musafir.',
    points: [
      {
        head: 'Sholat Yang Boleh Di-Qashar',
        body: 'Hanya sholat 4 rakaat yang diqashar menjadi 2 rakaat: Dzuhur, Ashar, dan Isya. Sholat Subuh (tetap 2 rakaat) dan Maghrib (tetap 3 rakaat) TIDAK BISA diqashar.'
      },
      {
        head: 'Jamak Taqdim vs Jamak Takhir',
        body: 'Jamak Taqdim: Mengerjakan Dzuhur & Ashar di waktu Dzuhur, atau Maghrib & Isya di waktu Maghrib. Niat jamak dilakukan di awal sholat pertama. Jamak Takhir: Mengerjakan Dzuhur & Ashar di waktu Ashar, atau Maghrib & Isya di waktu Isya. Niat takhir dilakukan sebelum waktu sholat pertama habis.'
      },
      {
        head: 'Batas Lama Tinggal di Tempat Tujuan',
        body: 'Jika musafir berniat tinggal di kota tujuan <= 4 hari (di luar hari tiba & berangkat), ia tetap boleh mengqashar sholat. Jika berniat tinggal > 4 hari sejak awal, maka begitu tiba ia diwajibkan sholat sempurna (sitmam).'
      },
      {
        head: 'Bermakmum Kepada Imam Mukim',
        body: 'Jika musafir sholat berjamaah di belakang imam yang mukim (warga lokal), musafir WAJIB mengikuti imam sholat 4 rakaat secara sempurna, tidak boleh mengqashar.'
      }
    ]
  },
  {
    id: 'sholat-kendaraan',
    category: 'kendaraan',
    title: 'Tata Cara Sholat di Atas Kendaraan',
    subtitle: 'Panduan sholat di pesawat, kereta api, bus, maupun mobil pribadi',
    badge: 'Praktis',
    icon: Compass,
    dalil: 'HR. Bukhari no. 1098 & Muslim no. 701',
    summary: 'Sholat sunnah boleh di atas kendaraan menghadap ke mana saja arah kendaraan. Untuk sholat fardhu, diusahakan berdiri & menghadap kiblat jika memungkinkan.',
    points: [
      {
        head: 'Sholat Sunnah di Kendaraan',
        body: 'Boleh dilakukan secara mutlak sambil duduk di atas kendaraan (mobil/bus/kereta/pesawat) dengan menghadap ke arah melajunya kendaraan. Ruku dan sujud dilakukan dengan isyarat menundukkan kepala (sujud lebih rendah dari ruku).'
      },
      {
        head: 'Sholat Fardhu di Kereta / Pesawat / Kapal',
        body: 'Jika kendaraan memiliki ruang berdiri dan bisa menghadap kiblat (seperti di kapal laut atau lorong khusus pesawat/kereta), wajib sholat dengan berdiri dan menghadap kiblat.'
      },
      {
        head: 'Jika Kendaraan Terus Berjalan & Tidak Bisa Berdiri/Kiblat',
        body: 'Musafir sebaiknya meng-jamak sholatnya saat berhenti di rest area/stasiun. Jika waktu sholat akan habis dan kendaraan tidak berhenti, lakukan sholat sebisanya di kursi (Lihurmatil Waqti) atau sesuai kemampuan.'
      }
    ]
  },
  {
    id: 'thaharah-safar',
    category: 'thaharah',
    title: 'Thaharah: Tayammum & Mengusap Kaos Kaki / Sepatu (Khuff)',
    subtitle: 'Keringanan berwudhu bagi musafir tanpa perlu melepas sepatu atau kaos kaki',
    badge: 'Rukhshah',
    icon: ShieldCheck,
    dalil: 'HR. Muslim no. 276 & HR. Tirmidzi no. 95',
    summary: 'Musafir diberikan keringanan mengusap bagian atas kaos kaki/sepatu saat wudhu selama 3 hari 3 malam (72 jam).',
    points: [
      {
        head: 'Syarat Mengusap Kaos Kaki / Khuff',
        body: 'Kaos kaki/sepatu dipasang setelah berwudhu sempurna dalam keadaan suci dari hadats. Kaos kaki menutupi bagian mata kaki.'
      },
      {
        head: 'Durasi Keringanan untuk Musafir',
        body: 'Jangka waktu berlaku 3 hari 3 malam (72 jam) terhitung sejak pertama kali kentut/batal wudhu lalu mengusapnya saat wudhu berikutnya.'
      },
      {
        head: 'Tata Cara Mengusap Khuff',
        body: 'Saat membasuh kaki pada wudhu biasa, cukup basahi jari tangan lalu usapkan SEKALI di atas permukaan PUNGGUNG (bagian atas) kaos kaki/sepatu. Tidak perlu membasuh bagian bawah atau melepas sepatu.'
      },
      {
        head: 'Tata Cara Tayammum di Perjalanan',
        body: 'Jika tidak menemukan air atau kesulitan air di perjalanan, tepukkan kedua telapak tangan ke permukaan berdebu suci (dinding/jok bersih), tiup perlahan, usap ke wajah sekali lalu kedua telapak tangan hingga pergelangan.'
      }
    ]
  },
  {
    id: 'puasa-safar',
    category: 'puasa',
    title: 'Hukum Puasa Ramadhan Bagi Musafir',
    subtitle: 'Antara memilih tetap berpuasa atau mengambil keringanan tidak puasa',
    badge: 'Ramadhan',
    icon: Sun,
    dalil: 'QS. Al-Baqarah: 185 & HR. Muslim no. 1115',
    summary: 'Allah memberikan pilihan kepada musafir untuk berpuasa atau mengqadhanya di hari lain setelah Ramadhan.',
    points: [
      {
        head: 'Kapan Sebaiknya Berpuasa?',
        body: 'Jika perjalanan terasa ringan, tidak menimbulkan keletihan berlebihan, dan tidak membahayakan kesehatan, berpuasa di bulan Ramadhan lebih utama.'
      },
      {
        head: 'Kapan Sebaiknya Berbuka (Membatalkan Puasa)?',
        body: 'Jika perjalanan sangat menguras fisik, membuat lemas parah atau dehidrasi, maka mengambil rukhshah untuk tidak berpuasa (dan menggantinya di hari lain) lebih utama dan disukai Allah.'
      }
    ]
  },
  {
    id: 'adab-safar',
    category: 'adab',
    title: 'Adab-Adab Perjalanan Sesuai Sunnah',
    subtitle: 'Amalan pembawa keberkahan dan keselamatan di sepanjang jalan',
    badge: 'Sunnah',
    icon: Sparkles,
    dalil: 'HR. Tirmidzi no. 3448 & Abu Daud no. 2608',
    summary: 'Mengikuti adab sunnah safar menghadirkan perlindungan malaikat dan menjadikan perjalanan bernilai pahala.',
    points: [
      {
        head: 'Sholat Sunnah Safar',
        body: 'Disunnahkan sholat 2 rakaat sebelum keluar rumah dan sholat Qudum (2 rakaat di masjid dekat rumah) saat baru kembali dari perjalanan.'
      },
      {
        head: 'Memilih Pemimpin Rombongan (Amirus Safar)',
        body: 'Jika berpergian bertiga atau lebih, disunnahkan menunjuk satu orang sebagai ketua/pemimpin rombongan agar perjalanan tertata rapi.'
      },
      {
        head: 'Dua Musafir Mustajab',
        body: 'Perbanyak berdoa di sepanjang perjalanan, terutama saat kendaraan melaju atau saat singgah, karena doa musafir termasuk salah satu doa yang maqbul (pasti dikabulkan).'
      }
    ]
  }
];

export default function FiqhSafar() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openCardId, setOpenCardId] = useState('jamak-qashar');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = FIQH_ARTICLES.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.points.some(p => p.head.toLowerCase().includes(searchQuery.toLowerCase()) || p.body.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setOpenCardId(prev => prev === id ? null : id);
  };

  return (
    <div id="fiqh" className="fiqh-safar-container">
      {/* Header Banner */}
      <div className="fiqh-safar-hero">
        <div className="fiqh-safar-hero__badge">
          <BookOpen size={14} /> Fiqih Perjalanan (Safar)
        </div>
        <h2 className="fiqh-safar-hero__title">Panduan Fiqih Safar Lengkap & Autentik</h2>
        <p className="fiqh-safar-hero__desc">
          Pelajari hukum-hukum sholat jamak qashar, thaharah, puasa, dan adab perjalanan berdasarkan Qur'an & Sunnah Sahih.
        </p>

        {/* Quick Search */}
        <div className="fiqh-safar-search">
          <Search size={18} className="fiqh-safar-search__icon" />
          <input 
            type="text"
            placeholder="Cari topik fiqih (misal: qashar, kaos kaki, tayammum, pesawat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fiqh-safar-search__input"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="fiqh-safar-categories">
        {FIQH_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`fiqh-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="fiqh-safar-list">
        {filteredArticles.length === 0 ? (
          <div className="fiqh-empty-state">
            <Info size={32} />
            <p>Tidak ada topik fiqih yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          filteredArticles.map(article => {
            const isOpen = openCardId === article.id;
            const IconComponent = article.icon;

            return (
              <div 
                key={article.id} 
                className={`fiqh-card ${isOpen ? 'fiqh-card--open' : ''}`}
              >
                <button 
                  className="fiqh-card__header"
                  onClick={() => toggleAccordion(article.id)}
                  aria-expanded={isOpen}
                >
                  <div className="fiqh-card__header-left">
                    <div className="fiqh-card__icon-box">
                      <IconComponent size={20} />
                    </div>
                    <div className="fiqh-card__title-box">
                      <div className="fiqh-card__meta">
                        <span className="fiqh-card__badge">{article.badge}</span>
                        <span className="fiqh-card__dalil">{article.dalil}</span>
                      </div>
                      <h3 className="fiqh-card__title">{article.title}</h3>
                    </div>
                  </div>
                  <ChevronDown className={`fiqh-card__arrow ${isOpen ? 'rotated' : ''}`} size={20} />
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="fiqh-card__body">
                    <div className="fiqh-card__summary">
                      <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>{article.summary}</span>
                    </div>

                    <div className="fiqh-card__points">
                      {article.points.map((pt, idx) => (
                        <div key={idx} className="fiqh-point-item">
                          <h4 className="fiqh-point-head">
                            <span className="fiqh-point-num">{idx + 1}</span>
                            {pt.head}
                          </h4>
                          <p className="fiqh-point-body">{pt.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
