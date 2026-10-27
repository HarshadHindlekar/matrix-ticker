# 🚆 Matrix Ticker (PWA)

A Next.js application simulating realistic **Train Station Announcement Displays**, **24/7 Medical & Pharmacy Store Signs**, and **Landscape Advertisement Banners**. Fully responsive, customizable, and installable as a native standalone app on mobile devices (Android & iOS).

![LED Marquee Banner](/icon.svg)

---

## ✨ Features

- **Realistic LED Matrix & Bezel Aesthetics**:
  - Authentic dot-matrix diode grid textures (Classic 8px & Fine 5px).
  - High-intensity bloom neon glow and scanline overlays.
  - Industrial metallic chassis enclosure with corner hex screws and glass reflection.
- **Full Typography & Color Customization**:
  - Multiple digital transit fonts: **VT323** (Iconic 1990s Railway Board), **Share Tech Mono** (Medical store / Clinic), **Silkscreen** (Matrix Pixel art), **System Monospace**, and **Heavy Sans Display**.
  - Vibrant LED color swatches: Amber Orange (Train), Pharmacy Green, Emergency Red, Cyber Cyan, Highway Yellow, Neon Pink, and Pure White LED.
  - Custom Hex color pickers for both text and background.
- **Landscape Marquee Scroller (Right-to-Left)**:
  - Smooth infinite marquee scrolling from right to left (standard transit & commercial direction) with left-to-right reverse option.
  - Live speed control (5s high speed to 40s slow crawl) and text scaling (8vh to 28vh).
  - Automatic landscape lock request (`screen.orientation.lock`) and full-screen mode.
  - One-tap 90° Force Landscape rotation toggle (for mobile devices with portrait lock enabled).
  - Auto-hiding HUD controls (Play/Pause, Speed, Size, Orientation, Fullscreen).
- **Mobile PWA App Installation**:
  - Web App Manifest (`manifest.webmanifest`) and Service Worker (`sw.js`).
  - Native "Download App / Install on Mobile" button with prompt interception for Android / Chrome.
  - Interactive iOS Safari "Add to Home Screen" visual walkthrough.
  - Runs in standalone full-screen mode without browser address bars.
- **Quick Presets**:
  - 🚆 Railway Station Announcement (Amber LED)
  - ⚕️ 24/7 Emergency Pharmacy (Medical Green)
  - 🚨 Caution / Track Work Alert (Ruby Red)
  - 🚇 Airport Express Metro (Cyber Cyan)
  - 🏷️ Supermarket Weekend Sale (Highway Yellow)

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure **Node.js** (v18 or higher) is installed.

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📱 Installing on Mobile Devices

1. **Android (Chrome / Samsung Internet / Edge)**:
   - Tap the **Download App** button in the header, or open the browser menu (⋮) and tap **Install App**.
2. **iPhone / iPad (Safari)**:
   - Tap the **Share** button (box with upward arrow) at the bottom of the screen.
   - Tap **Add to Home Screen**.
   - Tap **Add** in the top right.
3. Open the app from your home screen for full-screen landscape operation!
