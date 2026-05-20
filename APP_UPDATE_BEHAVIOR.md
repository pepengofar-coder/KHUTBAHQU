# App Update Behavior

This document explains how updates are delivered to the installed Android APK for Islamediaku. The application uses a hybrid Capacitor approach with a live web wrapper.

## Web Updates (No APK Reinstall Required)
When the following changes are made and deployed to Vercel, users who have already installed the APK will **automatically** receive the update upon opening the app or when the app checks for version changes in the background:
- UI changes and bug fixes
- Homepage changes
- Mushaf web UI changes and fixes
- Dzikir content changes
- Tilawah web logic and audio players
- Tracker web changes
- Mode Perjalanan content/UI
- Settings web UI
- Theme changes
- New React components or pages

*Note: The app checks `version.json` automatically on startup, every 5 minutes, and whenever the app resumes from the background. Users will see a subtle "Versi baru tersedia" banner prompting them to reload gracefully.*

## Native Updates (APK Rebuild Required)
The following changes affect the native Android runtime layer and therefore **require a new APK build** to be generated and distributed to users:
- App icon (`logo-icon.png` used by Capacitor asset generation)
- Splash screen image
- Modifications to `AndroidManifest.xml`
- Adding or changing Android Permissions (e.g., Camera, Location)
- Package ID changes (`id.islamediaku.app`)
- App Name changes for the Android launcher
- Installing or updating native Capacitor plugins
- Any configuration in `capacitor.config.json` that affects native runtime (excluding `server.url`)
