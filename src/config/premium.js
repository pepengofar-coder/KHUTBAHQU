// Premium Configuration & Feature Flags

export const PLANS = {
  FREE: {
    id: 'plan_free',
    name: 'Free',
    price: 0,
    priceLabel: 'Rp0',
    interval: 'Bulan',
    features: [
      'Mushaf dasar',
      'Kalender Hijriah',
      'Jadwal sholat dasar',
      'Kiblat dasar',
      'Dzikir pagi petang & Doa harian',
      'Khutbah gratis',
      'Bookmark lokal'
    ],
    isPremium: false,
  },
  MONTHLY: {
    id: 'plan_monthly',
    name: 'Premium Monthly',
    price: 19000,
    priceLabel: 'Rp19.000',
    interval: '/bulan',
    features: [
      'Semua fitur Free',
      'Tracker ibadah lanjutan',
      'Tema premium',
      'Mode fokus Mushaf',
      'Bookmark cloud',
      'Riwayat baca cloud',
      'Koleksi khutbah premium',
      'Download PDF khutbah',
      'Reminder khusus',
      'Tanpa iklan'
    ],
    isPremium: true,
  },
  YEARLY: {
    id: 'plan_yearly',
    name: 'Premium Yearly',
    price: 179000,
    priceLabel: 'Rp179.000',
    interval: '/tahun',
    features: [
      'Semua fitur Premium Monthly',
      'Harga lebih hemat',
      'Badge "Best Value"'
    ],
    isPremium: true,
    bestValue: true,
  }
};

export const FEATURES = {
  ADVANCED_TRACKER: 'advanced_ibadah_tracker',
  PREMIUM_THEMES: 'premium_themes',
  QURAN_FOCUS: 'quran_focus_mode',
  CLOUD_BOOKMARKS: 'cloud_bookmarks',
  CLOUD_HISTORY: 'cloud_reading_history',
  PREMIUM_KHUTBAH: 'premium_khutbah_collection',
  PDF_DOWNLOAD: 'khutbah_pdf_download',
  CUSTOM_REMINDERS: 'custom_reminders',
  NO_ADS: 'ad_free'
};
