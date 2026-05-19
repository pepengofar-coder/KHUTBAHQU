# Islamediaku App Install Setup

This guide explains how the Smart App Install Popup works for Android, iOS, and Desktop users, and how to configure the APK and iOS app links.

## 1. Environment Variables Configuration

Since Islamediaku is built using **Vite**, environment variables must be prefixed with `VITE_` to be readable by the client-side code.

Open or create the `.env` file in the root directory and set the following:

```env
# URL for the Android APK download
VITE_APK_URL=/downloads/islamediaku.apk

# URL for the iOS App (App Store or TestFlight)
VITE_IOS_APP_URL=
```

*(Note: If your hosting provider requires `NEXT_PUBLIC_` for some reason, the app also checks for `NEXT_PUBLIC_APK_URL` and `NEXT_PUBLIC_IOS_APP_URL` as fallbacks, but `VITE_` is the standard).*

## 2. Setting Up the Android APK

If you want to host the APK file directly on the Islamediaku domain:
1. Create a folder named `downloads` inside the `public` directory: `public/downloads/`
2. Place your APK file there: `public/downloads/islamediaku.apk`
3. Set `VITE_APK_URL=/downloads/islamediaku.apk`

If you are hosting the APK externally (e.g., Google Drive, MediaFire):
1. Set `VITE_APK_URL=https://link-to-your-apk.com`

**What happens if the APK URL is empty?**
If `VITE_APK_URL` is empty, the "Download APK" button will disappear. Instead, a small message saying "APK belum tersedia" will be shown to Android users.

## 3. How the Smart Popup Works

The popup intelligently detects the user's device and connection environment to provide the best experience without being annoying.

### Android Users
1. **PWA Install (Web App):** If the Android browser supports PWA installation (via the `beforeinstallprompt` event), the primary button will be **"Install Web App"**.
2. **APK Download:** If `VITE_APK_URL` is configured, a secondary button **"Download APK"** is shown. 
3. If both are unavailable, it says "APK belum tersedia."

### iPhone / iPad (iOS) Users
1. **App Store Link:** If `VITE_IOS_APP_URL` is configured, a button saying **"Buka App Store"** will appear.
2. **PWA Install (Safari):** If the URL is empty, iOS users will see a 4-step instruction guide teaching them how to add the web app to their home screen using Safari's "Share -> Add to Home Screen" feature.
3. *Note: iOS users will NEVER see the "Download APK" button.*

### Desktop Users
Desktop users will see a small, non-intrusive floating card in the bottom right corner suggesting they install the app on their phone, rather than a massive screen-blocking modal.

### Standalone (Installed) Mode
If a user has already installed the app and opens it from their home screen, the popup **will never show**.

## 4. Popup Frequency Control (localStorage)

To prevent spamming the user, the popup uses `localStorage` to hide itself after user interaction:

| Action | LocalStorage Key | Hide Duration |
|--------|------------------|---------------|
| User clicks "Nanti Saja" / "Tutup" | `islamediaku_install_popup_dismissed_until` | 7 Days |
| iOS user reads instructions & clicks "Mengerti" | `islamediaku_ios_install_instruction_seen` | 14 Days |
| Android user downloads APK | `islamediaku_apk_downloaded` | 30 Days |
| User accepts PWA install | `islamediaku_pwa_installed` | 90 Days |

## 5. How to Test

**1. Test Empty APK State:**
Clear `VITE_APK_URL=` in `.env`, restart the dev server, and open on an Android device to see the "APK belum tersedia" state.

**2. Test LocalStorage Reset:**
To force the popup to show again for testing, open your browser's Developer Tools -> Application -> Local Storage, and delete all keys starting with `islamediaku_`.

**3. Test Device Detection in Chrome Desktop:**
1. Open Developer Tools (F12).
2. Click the "Toggle device toolbar" (Ctrl+Shift+M).
3. Select an iPhone (e.g., iPhone 14) from the top dropdown and refresh the page to test the iOS UI.
4. Select an Android phone (e.g., Pixel 7) and refresh to test the Android UI.
