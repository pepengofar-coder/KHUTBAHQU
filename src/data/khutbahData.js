/**
 * Sample khutbah data for the KhutbahQu application.
 * In production, this would come from an API or Supabase database.
 */

export const categories = [
  { id: 'jumat', label: "Jum'at", icon: '🕌', color: 'var(--color-tag-jumat)' },
  { id: 'nikah', label: 'Nikah', icon: '💍', color: 'var(--color-tag-nikah)' },
  { id: 'idul-fitri', label: 'Idul Fitri', icon: '🌙', color: 'var(--color-tag-idul-fitri)' },
  { id: 'idul-adha', label: 'Idul Adha', icon: '🐑', color: 'var(--color-tag-idul-adha)' },
  { id: 'jenazah', label: 'Jenazah', icon: '🤲', color: 'var(--color-tag-jenazah)' },
  { id: 'umum', label: 'Umum', icon: '📖', color: 'var(--color-tag-umum)' },
];

export const khutbahList = [
  {
    id: 1,
    title: 'Keutamaan Menjaga Lisan',
    author: 'Ustadz M. Abduh Tuasikal',
    source: 'Rumaysho.com',
    category: 'jumat',
    readTime: 10,
    date: '2026-05-02',
    bookmarked: false,
    excerpt: 'Jamaah sekalian, lisan adalah organ tubuh yang sangat kecil namun dampaknya sangat besar. Rasulullah shallallahu alaihi wasallam bersabda tentang bahaya lisan...',
    content: {
      opening: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلاَ مُضِلَّ لَهُ وَمَنْ يُضْلِلْ فَلاَ هَادِيَ لَهُ. أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Segala puji bagi Allah yang telah memberikan kita nikmat iman dan Islam. Shalawat serta salam semoga tercurah kepada Nabi Muhammad shallallahu 'alaihi wasallam, keluarga, dan para sahabatnya."
        },
        {
          type: 'paragraph',
          text: "Jamaah Jum'at yang dirahmati Allah. Pada kesempatan kali ini, khatib ingin mengingatkan diri khatib sendiri dan para jamaah sekalian tentang pentingnya menjaga lisan kita."
        },
        {
          type: 'quran',
          arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا',
          translation: '"Hai orang-orang yang beriman, bertakwalah kamu kepada Allah dan katakanlah perkataan yang benar."',
          reference: 'QS. Al-Ahzab: 70'
        },
        {
          type: 'paragraph',
          text: 'Allah Subhanahu wa Ta\'ala memerintahkan kita untuk berkata yang benar (qaulan sadida). Perkataan yang benar adalah perkataan yang tepat sasaran, tidak menyakiti, dan membawa kebaikan.'
        },
        {
          type: 'hadith',
          arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
          translation: '"Barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah ia berkata baik atau diam."',
          reference: 'HR. Bukhari & Muslim'
        },
        {
          type: 'paragraph',
          text: 'Jamaah sekalian, lisan adalah organ tubuh yang sangat kecil namun dampaknya sangat besar. Rasulullah shallallahu alaihi wasallam menjelaskan bahwa mayoritas penyebab seseorang masuk neraka adalah karena lisannya. Betapa banyak persahabatan yang hancur, keluarga yang retak, dan masyarakat yang terpecah belah hanya karena perkataan yang tidak dijaga.'
        },
        {
          type: 'paragraph',
          text: 'Maka marilah kita menjaga lisan kita, berbicara hanya yang bermanfaat, menghindari ghibah, namimah, dan perkataan dusta. Semoga Allah menjadikan kita hamba-Nya yang senantiasa menjaga lisan.'
        }
      ],
      closing: `بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ، وَنَفَعَنِي وَإِيَّاكُمْ بِمَا فِيهِ مِنَ الْآيَاتِ وَالذِّكْرِ الْحَكِيمِ، أَقُولُ قَوْلِي هَذَا وَأَسْتَغْفِرُ اللَّهَ الْعَظِيمَ لِي وَلَكُمْ وَلِسَائِرِ الْمُسْلِمِينَ مِنْ كُلِّ ذَنْبٍ فَاسْتَغْفِرُوهُ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ`
    }
  },
  {
    id: 2,
    title: 'Hukum Riba di Era Modern',
    author: 'Ustadz Yazid bin Abdul Qadir Jawas',
    source: 'Almanhaj.or.id',
    category: 'jumat',
    readTime: 15,
    date: '2026-04-25',
    bookmarked: false,
    excerpt: 'Riba merupakan dosa besar yang diharamkan dalam Al-Quran dan Sunnah. Di era modern ini, praktik riba semakin tersebar luas dalam berbagai bentuk transaksi...',
    content: {
      opening: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Pada hari yang mulia ini, marilah kita meningkatkan ketakwaan kepada Allah Subhanahu wa Ta'ala dengan menjalankan segala perintah-Nya dan menjauhi segala larangan-Nya."
        },
        {
          type: 'quran',
          arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا إِنْ كُنْتُمْ مُؤْمِنِينَ',
          translation: '"Hai orang-orang yang beriman, bertakwalah kepada Allah dan tinggalkanlah sisa riba (yang belum dipungut) jika kamu orang-orang yang beriman."',
          reference: 'QS. Al-Baqarah: 278'
        },
        {
          type: 'paragraph',
          text: 'Riba merupakan dosa besar yang diharamkan oleh Allah dan Rasul-Nya. Di era modern ini, praktik riba telah menyebar dalam berbagai bentuk: kredit berbunga, pinjaman online ilegal, dan berbagai skema investasi yang mengandung unsur riba.'
        },
        {
          type: 'paragraph',
          text: 'Marilah kita berhati-hati dalam muamalah, memilih transaksi yang syar\'i, dan menjauhi segala bentuk riba agar kehidupan kita penuh berkah dari Allah Subhanahu wa Ta\'ala.'
        }
      ],
      closing: `بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ`
    }
  },
  {
    id: 3,
    title: 'Panduan Keluarga Sakinah',
    author: 'Ustadz Syafiq Riza Basalamah',
    source: 'Muslim.or.id',
    category: 'nikah',
    readTime: 12,
    date: '2026-04-20',
    bookmarked: true,
    excerpt: 'Keluarga sakinah, mawaddah, warahmah adalah dambaan setiap muslim. Bagaimana cara membangun fondasi keluarga yang kokoh berdasarkan Al-Quran dan Sunnah...',
    content: {
      opening: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Keluarga sakinah, mawaddah, warahmah adalah dambaan setiap muslim. Allah Subhanahu wa Ta'ala telah menjadikan pernikahan sebagai salah satu tanda kebesaran-Nya."
        },
        {
          type: 'quran',
          arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
          translation: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."',
          reference: 'QS. Ar-Rum: 21'
        },
        {
          type: 'paragraph',
          text: 'Fondasi keluarga yang kokoh dibangun atas dasar ketakwaan, saling menghormati, komunikasi yang baik, dan menunaikan hak dan kewajiban masing-masing. Suami sebagai pemimpin rumah tangga hendaklah berlaku adil dan bijaksana. Istri sebagai mitra hendaklah mendukung dan menjaga kehormatan keluarga.'
        }
      ],
      closing: `بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ`
    }
  },
  {
    id: 4,
    title: 'Tafsir Surat Al-Asr',
    author: 'Ustadz Firanda Andirja',
    source: 'IslamQA',
    category: 'jumat',
    readTime: 8,
    date: '2026-04-18',
    bookmarked: false,
    excerpt: 'Surat Al-Asr yang pendek namun padat dengan hikmah. Imam Syafi\'i berkata: seandainya manusia merenungkan surat ini saja, niscaya itu sudah cukup bagi mereka...',
    content: {
      opening: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Imam Asy-Syafi'i rahimahullah pernah berkata: \"Seandainya Allah hanya menurunkan surat ini saja kepada manusia, niscaya itu sudah cukup bagi mereka.\" Betapa agung dan padatnya surat Al-Asr ini dengan pesan-pesan kehidupan."
        },
        {
          type: 'quran',
          arabic: 'وَالْعَصْرِ ○ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ○ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
          translation: '"Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan amal saleh dan nasihat-menasihati supaya menaati kebenaran dan nasihat-menasihati supaya menetapi kesabaran."',
          reference: 'QS. Al-Asr: 1-3'
        },
        {
          type: 'paragraph',
          text: 'Empat syarat keselamatan menurut surat ini: iman, amal saleh, saling menasihati dalam kebenaran, dan saling menasihati dalam kesabaran. Keempat hal ini saling terkait dan tidak bisa dipisahkan.'
        }
      ],
      closing: `بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ`
    }
  },
  {
    id: 5,
    title: 'Keutamaan Hari Raya Idul Fitri',
    author: 'Ustadz Abdul Somad',
    source: 'UAS Official',
    category: 'idul-fitri',
    readTime: 11,
    date: '2026-03-30',
    bookmarked: false,
    excerpt: 'Hari raya Idul Fitri adalah hari kemenangan bagi orang-orang yang telah berjuang menahan hawa nafsu selama bulan Ramadhan...',
    content: {
      opening: `اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ اَللهُ أَكْبَرُ، لاَ إِلَهَ إِلاَّ اللهُ وَاللهُ أَكْبَرُ، اَللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Hari ini adalah hari kemenangan, hari kebahagiaan, hari di mana kita kembali kepada fitrah. Setelah sebulan penuh kita berjuang menahan hawa nafsu di bulan Ramadhan, Allah memberikan kita hadiah berupa hari raya Idul Fitri."
        },
        {
          type: 'hadith',
          arabic: 'لِلصَّائِمِ فَرْحَتَانِ: فَرْحَةٌ عِنْدَ فِطْرِهِ، وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ',
          translation: '"Bagi orang yang berpuasa ada dua kegembiraan: kegembiraan ketika berbuka dan kegembiraan ketika berjumpa dengan Tuhannya."',
          reference: 'HR. Bukhari & Muslim'
        },
        {
          type: 'paragraph',
          text: 'Marilah kita menjaga amal-amal kita setelah Ramadhan. Jangan sampai Ramadhan berlalu begitu saja tanpa meninggalkan bekas kebaikan dalam diri kita.'
        }
      ],
      closing: `تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ، كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ`
    }
  },
  {
    id: 6,
    title: 'Adab Bertetangga dalam Islam',
    author: 'Ustadz Khalid Basalamah',
    source: 'Yufid.TV',
    category: 'jumat',
    readTime: 9,
    date: '2026-04-11',
    bookmarked: false,
    excerpt: 'Islam sangat menekankan pentingnya menjaga hubungan baik dengan tetangga. Rasulullah SAW bersabda bahwa Jibril terus menerus menasihati beliau tentang tetangga...',
    content: {
      opening: `إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ`,
      body: [
        {
          type: 'paragraph',
          text: "Ma'asyiral muslimin rahimakumullah. Islam adalah agama yang sempurna, mengatur seluruh aspek kehidupan termasuk hubungan sosial kita dengan tetangga."
        },
        {
          type: 'hadith',
          arabic: 'مَا زَالَ جِبْرِيلُ يُوصِينِي بِالْجَارِ حَتَّى ظَنَنْتُ أَنَّهُ سَيُوَرِّثُهُ',
          translation: '"Jibril senantiasa berpesan kepadaku tentang tetangga, hingga aku menyangka tetangga itu akan mendapatkan warisan."',
          reference: 'HR. Bukhari & Muslim'
        },
        {
          type: 'paragraph',
          text: 'Hadits ini menunjukkan betapa pentingnya kedudukan tetangga dalam Islam. Hak-hak tetangga antara lain: tidak menyakitinya, menjaga keamanannya, berbagi makanan dengannya, dan menjenguknya saat sakit.'
        }
      ],
      closing: `بَارَكَ اللَّهُ لِي وَلَكُمْ فِي الْقُرْآنِ الْعَظِيمِ`
    }
  }
];
