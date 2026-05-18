const GREETINGS = [
  "Assalamu'alaikum, semoga harimu dipenuhi keberkahan.",
  "Hari baru, niat baru. Mulai dengan mengingat Allah.",
  "Semoga langkah kecil hari ini menjadi amal besar di sisi Allah.",
  "Yuk jaga sholat, dzikir, dan tilawah hari ini.",
  "Mulai hari ini dengan hati tenang dan niat yang baik.",
  "Satu ayat, satu dzikir, satu kebaikan. Mulai sekarang.",
  "Tersenyumlah, karena senyummu adalah sedekah.",
  "Awali hari dengan bismillah, agar setiap langkah bernilai ibadah.",
  "Semoga Allah memudahkan segala urusanmu hari ini.",
  "Jangan lupa bersyukur atas nikmat nafas hari ini."
];

export function getDailyGreeting() {
  try {
    const isReturning = localStorage.getItem('kq_returning_user');
    const now = new Date();
    
    // Seed based on the day of the year to change daily
    const dayOfYear = Math.floor(
      (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const seed = now.getFullYear() * 1000 + dayOfYear;
    
    const greeting = GREETINGS[seed % GREETINGS.length];
    
    // Save state for future visits
    if (!isReturning) {
      localStorage.setItem('kq_returning_user', 'true');
    }

    // Occasionally show "Selamat datang kembali" if they are a returning user
    if (isReturning && seed % 4 === 0) {
      return "Assalamu'alaikum, selamat datang kembali! " + greeting;
    }

    return greeting;
  } catch (error) {
    console.warn("Failed to get daily greeting, using fallback.", error);
    return "Assalamu'alaikum, semoga harimu penuh keberkahan.";
  }
}
