# Islamediaku Android APK Setup Guide

This project is now configured as a **Progressive Web App (PWA)** and a **Native Android Application** using **Capacitor**.

## Capacitor Setup
Capacitor has been initialized and the Android scaffolding has been generated.
*   **App Name:** Islamediaku
*   **Package ID:** `id.islamediaku.app`
*   **Project Root:** `/android`

## Compiling the APK
Because the current development environment does not have Java or the Android SDK (`ANDROID_HOME`) installed, the APK must be built on a machine that has Android Studio installed.

### Steps to Build (Debug APK)
1. Ensure you have **Android Studio** installed.
2. Open your terminal in the root of this project.
3. Run the following command to sync your web assets (HTML/CSS/JS) into the Android native folder:
   ```bash
   npm run build
   npx cap sync android
   ```
4. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```
5. In Android Studio, wait for Gradle to finish syncing.
6. Navigate to `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
7. Once finished, Android Studio will show a popup with a "Locate" link. Click it. 
   *(Alternatively, find the file at: `android/app/build/outputs/apk/debug/app-debug.apk`)*

### Serving the APK
To make the APK available for download on the website:
1. Rename the `app-debug.apk` to `islamediaku.apk`.
2. Move it into the `public/downloads/` folder inside your Next.js/Vite root directory:
   ```
   KHUTBAHQU/public/downloads/islamediaku.apk
   ```
3. Ensure your `.env` or Vercel Environment Variables contain the correct URL:
   ```env
   NEXT_PUBLIC_APK_URL=https://islamediaku.vercel.app/downloads/islamediaku.apk
   ```
4. Commit the new APK and the updated `.env` to GitHub and push to Vercel. 
5. The `ApkDownloadBar` will automatically activate once it detects the `NEXT_PUBLIC_APK_URL` is populated.

## Building a Release APK
For publishing to the Google Play Store or general distribution without debug warnings, you must build a signed Release APK.
1. Open Android Studio (`npx cap open android`).
2. Go to `Build` > `Generate Signed Bundle / APK`.
3. Choose `APK`, create or select a Keystore, and complete the wizard.
4. Rename the output `app-release.apk` to `islamediaku.apk` and deploy it using the same steps as above.
