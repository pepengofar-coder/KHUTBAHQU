export interface ArticleSource {
  id: string;
  name: string;
  url: string;
  license: string;
  licenseUrl: string;
  description: string;
  attributionRequired: boolean;
}

export const OPEN_ARTICLE_SOURCES: ArticleSource[] = [
  {
    id: 'wikipedia',
    name: 'Wikipedia Indonesia',
    url: 'https://id.wikipedia.org',
    license: 'CC BY-SA 4.0 / GFDL',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.id',
    description: 'Ensiklopedia bebas dengan materi sejarah Islam, biografi tokoh Muslim, dan khazanah peradaban Islam.',
    attributionRequired: true
  },
  {
    id: 'wikibooks',
    name: 'Wikibooks Indonesia',
    url: 'https://id.wikibooks.org',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.id',
    description: 'Buku pelajaran dan teks bebas mengenai pendidikan Islam, fiqih dasar, dan bahasa Arab.',
    attributionRequired: true
  },
  {
    id: 'openstax',
    name: 'OpenStax Core History',
    url: 'https://openstax.org',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    description: 'Buku teks akademik dengan lisensi terbuka mengenai sejarah peradaban dunia dan perkembangan peradaban Islam.',
    attributionRequired: true
  },
  {
    id: 'cc-journals',
    name: 'Jurnal Ilmiah Open Access (CC-BY)',
    url: 'https://doaj.org',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    description: 'Artikel ilmiah dari jurnal keislaman bereputasi yang dipublikasikan dengan lisensi Creative Commons.',
    attributionRequired: true
  }
];

export const LEGAL_DISCLAIMER = "Islamediaku berkomitmen menggunakan data dari API terbuka/terdokumentasi, sumber berlisensi terbuka, public domain, atau konten dengan izin tertulis. Islamediaku tidak menyalin artikel penuh dari website pihak ketiga tanpa izin.";
