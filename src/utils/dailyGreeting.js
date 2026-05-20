import { bilingualGreetings } from '../data/dailyGreetings';

export function getLocalizedGreeting(locale = 'id') {
  try {
    const isReturning = localStorage.getItem('kq_returning_user');
    if (!isReturning) {
      localStorage.setItem('kq_returning_user', 'true');
    }

    const now = Date.now();
    // 30-minute slot
    const slotDuration = 30 * 60 * 1000;
    const currentSlot = Math.floor(now / slotDuration);
    
    const lastSlotStr = localStorage.getItem('islamediaku_greeting_last_slot');
    const lastIndexStr = localStorage.getItem('islamediaku_greeting_last_index');
    let lastIndex = lastIndexStr ? parseInt(lastIndexStr, 10) : -1;

    let selectedIndex = currentSlot % bilingualGreetings.length;

    if (lastSlotStr !== currentSlot.toString()) {
      // It's a new slot, ensure we don't repeat the exact same greeting
      if (selectedIndex === lastIndex) {
        selectedIndex = (selectedIndex + 1) % bilingualGreetings.length;
      }
      localStorage.setItem('islamediaku_greeting_last_slot', currentSlot.toString());
      localStorage.setItem('islamediaku_greeting_last_index', selectedIndex.toString());
    } else {
      // Same slot, return the previously computed index
      if (lastIndex >= 0 && lastIndex < bilingualGreetings.length) {
        selectedIndex = lastIndex;
      }
    }
    
    const greetingObj = bilingualGreetings[selectedIndex];

    // Seed based on the day of the year for the "Selamat datang kembali" logic occasionally
    const dayOfYear = Math.floor(
      (now - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const seed = new Date().getFullYear() * 1000 + dayOfYear;

    let text = locale === 'en' ? greetingObj.enText : greetingObj.idText;
    
    // Very occasionally (1 in 4 days) prepend Assalamu'alaikum for returning users
    if (isReturning && seed % 4 === 0 && !text.includes("Assalamu'alaikum")) {
      text = "Assalamu'alaikum, " + text.charAt(0).toLowerCase() + text.slice(1);
    }

    return {
      text: text,
      category: greetingObj.category
    };

  } catch (error) {
    console.warn("Failed to get daily greeting, using fallback.", error);
    if (locale === 'en') {
      return {
        text: "May your day be filled with goodness and blessings.",
        category: "Umum"
      };
    }
    return {
      text: "Semoga harimu dipenuhi kebaikan dan keberkahan.",
      category: "Umum"
    };
  }
}
