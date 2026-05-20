import { greetingsList } from '../data/dailyGreetings';

export function getDailyGreeting() {
  try {
    const isReturning = localStorage.getItem('kq_returning_user');
    if (!isReturning) {
      localStorage.setItem('kq_returning_user', 'true');
    }

    const now = Date.now();
    // 30-minute slot
    const slotDuration = 30 * 60 * 1000;
    const currentSlot = Math.floor(now / slotDuration);
    
    // Check if we already calculated the greeting for this slot
    const lastSlot = localStorage.getItem('islamediaku_greeting_last_slot');
    const lastIndexStr = localStorage.getItem('islamediaku_greeting_last_index');
    let lastIndex = lastIndexStr ? parseInt(lastIndexStr, 10) : -1;

    let selectedIndex = currentSlot % greetingsList.length;

    // Prevent immediate repetition if the slot changed but index somehow is the same
    if (lastSlot !== currentSlot.toString()) {
      if (selectedIndex === lastIndex) {
        selectedIndex = (selectedIndex + 1) % greetingsList.length;
      }
      
      // Update local storage for the new slot
      localStorage.setItem('islamediaku_greeting_last_slot', currentSlot.toString());
      localStorage.setItem('islamediaku_greeting_last_index', selectedIndex.toString());
    } else {
      // Within the same slot, return the previously selected index to be deterministic
      if (lastIndex >= 0 && lastIndex < greetingsList.length) {
        selectedIndex = lastIndex;
      }
    }
    
    const greetingObj = greetingsList[selectedIndex];

    // Seed based on the day of the year for the "Selamat datang kembali" logic
    const dayOfYear = Math.floor(
      (now - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const seed = new Date().getFullYear() * 1000 + dayOfYear;

    let text = greetingObj.text;
    
    // Occasionally show "Selamat datang kembali" if they are a returning user
    if (isReturning && seed % 4 === 0) {
      text = "Assalamu'alaikum, selamat datang kembali! " + text;
    }

    return {
      text: text,
      category: greetingObj.category
    };

  } catch (error) {
    console.warn("Failed to get daily greeting, using fallback.", error);
    return {
      text: "Assalamu'alaikum, semoga harimu penuh keberkahan.",
      category: "Umum"
    };
  }
}
