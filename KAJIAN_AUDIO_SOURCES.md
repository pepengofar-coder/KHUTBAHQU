# Kajian & Audio Candidate Sources Report

This document audits and classifies candidate audio and lecture sources for the **Mode Perjalanan** (Travel Mode) feature in Islamediaku. All sources are evaluated against strict safety, copyright, and verified access standards to prevent copyright infringement, scraping, or hidden stream violations.

---

## 📻 1. MP3Quran.net Live Radios (Verified API)
*   **Source Name:** MP3Quran.net
*   **URL:** `https://mp3quran.net/api/v3/radios?language=id`
*   **Source Type:** `mp3quran` (official public API)
*   **Safety Assessment:** **HIGH** ✅
    *   This is the official public API of MP3Quran.net, a global charity platform distributing Quran recitations.
    *   They provide public streams specifically for developers and Islamic app integration.
    *   Does not violate any terms of service and does not scrape HTML.
*   **Status:** **ENABLED**
*   **UI Attribution:** `"Sumber audio: MP3Quran.net"`
*   **Notes:** Integrated dynamically. If the API fails, the app falls back to a locally cached list of standard Quran radio streams.

---

## 🎙️ 2. Radio Rodja 756 AM Live Stream (Official Public Stream)
*   **Source Name:** Radio Rodja 756 AM
*   **URL:** `https://radio.rodjaam.com:8000/stream` (Direct Official MP3 Stream)
*   **Source Type:** `radio_live` (public official stream)
*   **Safety Assessment:** **HIGH** ✅
    *   Radio Rodja distributes this stream link publicly on their official website (`radiorodja.com`) and mobile applications.
    *   It is an official live broadcast, and linking to it with clear name attribution is safe and conforms to copyright standards.
    *   No scraping is performed; it is a direct icecast stream.
*   **Status:** **ENABLED**
*   **UI Attribution:** `"Sumber audio: Radio Rodja 756 AM"`
*   **Notes:** Played as a live stream (shows "LIVE" badge and hides duration sliders).

---

## 📺 3. Yufid.TV YouTube Channel (Official)
*   **Source Name:** Yufid.TV
*   **URL:** `https://www.youtube.com/@YufidTV`
*   **Source Type:** `youtube_channel` / `external_link`
*   **Safety Assessment:** **MEDIUM-HIGH** (Playback restricted) ⚠️
    *   Yufid.TV is a verified Islamic educational media organization.
    *   While the content is official, direct audio extraction (converting YouTube to MP3 streams) is strictly **forbidden** under YouTube's Terms of Service.
    *   To remain compliant, we **do not extract or play direct MP3s** from YouTube.
*   **Status:** **DISABLED FOR DIRECT PLAY** (Link only)
*   **UI Action:** Displays a card under "Kajian Ringan" with a "Tonton di YouTube" button that safely opens the official YouTube channel or playlist in a new browser tab/app.
*   **Permission Status:** `"needs_review"` for inline audio playback.
*   **Notes:** Ensures 100% compliance with YouTube's developer policies.

---

## 📺 4. Khalid Basalamah Official YouTube Channel
*   **Source Name:** Khalid Basalamah Official
*   **URL:** `https://www.youtube.com/@khalidbasalamahofficial`
*   **Source Type:** `youtube_channel` / `external_link`
*   **Safety Assessment:** **MEDIUM-HIGH** (Playback restricted) ⚠️
    *   Official dakwah channel of Ustadz Khalid Basalamah.
    *   Direct MP3 extraction is prohibited.
*   **Status:** **DISABLED FOR DIRECT PLAY** (Link only)
*   **UI Action:** Displays an info card with a redirect button to the official video source.
*   **Permission Status:** `"needs_review"` for inline audio playback.

---

## 📺 5. Dr. Firanda Andirja Official YouTube Channel
*   **Source Name:** Dr. Firanda Andirja
*   **URL:** `https://www.youtube.com/@DrFirandaAndirja`
*   **Source Type:** `youtube_channel` / `external_link`
*   **Safety Assessment:** **MEDIUM-HIGH** (Playback restricted) ⚠️
    *   Official channel of Ustadz Firanda Andirja.
    *   Direct audio stream extraction is prohibited.
*   **Status:** **DISABLED FOR DIRECT PLAY** (Link only)
*   **UI Action:** Displays an info card with an external link button to the official source.
*   **Permission Status:** `"needs_review"` for inline audio playback.

---

## 📖 6. MP3Quran CDN Quran Recitations (Murottal)
*   **Source Name:** MP3Quran CDNs
*   **URLs:**
    *   Saad Al-Ghamdi (Surah An-Nas): `https://server7.mp3quran.net/s_gmd/114.mp3`
    *   Mishary Rashid Alafasy (Surah An-Naba): `https://server8.mp3quran.net/afs/078.mp3`
    *   Abdurrahman As-Sudais (Surah Al-Mulk): `https://server11.mp3quran.net/sds/067.mp3`
*   **Source Type:** `tilawah` (official direct MP3 file CDN)
*   **Safety Assessment:** **HIGH** ✅
    *   MP3Quran operates high-availability public CDNs specifically designed to host and serve Quran MP3 recitations worldwide.
    *   These endpoints are open, static, secure, and officially intended for integration.
*   **Status:** **ENABLED**
*   **UI Attribution:** `"Sumber audio: MP3Quran.net"`
*   **Notes:** Shows full duration sliders, and tracks last played status.

---

## 📖 7. Dzikir & Doa Perjalanan (Self-hosted or Route shortcut)
*   **Source Name:** Islamediaku Content DB
*   **URL:** `/doa-dzikir` (App Route)
*   **Source Type:** `external` / `route`
*   **Safety Assessment:** **HIGH** ✅
    *   Uses verified, compiled local text databases for Dzikir and Doa (such as the Almanhaj-compliant Dzikir Pagi Petang).
    *   No network resources are requested.
*   **Status:** **ENABLED**
*   **UI Action:** Instead of playing audio, clicking these items navigates the user directly to the app's verified `/doa-dzikir` text views.

---

## Summary of Safeguards
1. **Zero Scraping:** No HTML parsers or hidden crawler agents are used.
2. **Zero Fake URLs:** Placeholder sources are explicitly marked and show "Audio belum tersedia."
3. **No Direct YouTube Playback:** All YouTube sources are redirected via deep links or official external URLs to honor platform terms.
4. **Attribution Guarantee:** Every track lists its original provider in both the playlist listing and active player view.
