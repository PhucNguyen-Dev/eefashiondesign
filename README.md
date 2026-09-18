# 🎨 eefashionita — 3D Fashion Design Atelier

**A cross-platform 3D fashion-design application built with React Native + Expo + TypeScript.** Full 3D canvas on web/desktop, graceful fallback on tablet and mobile.

---

## 🌟 Overview

eefashionita brings 3D garment design to web, desktop, tablet, and mobile. The design canvas runs on React Three Fiber / Three.js on the surfaces that support WebGL well, with platform-specific degradation elsewhere.

### Features

- **🎨 3D Design Atelier** — 3D garment canvas with material editing (web/desktop)
- **📱 Cross-platform** — Expo 50, same codebase across web, desktop, tablet, mobile
- **🧩 Feature-first architecture** — `core` / `features` / `shared` / `navigation` split, see below
- **⚡ Platform-aware** — smart feature gating so mobile/tablet degrade cleanly
- **🔄 Auto-save** — local persistence via AsyncStorage + expo-file-system

### Status

**Shipped:** project structure, core utilities, platform detection, Zustand store, Supabase client scaffold, feature-folder layout, 3D canvas mount point, CI to CDN.

**On roadmap:** backend API integration, real-time collaboration, physics simulation, material library expansion, multi-format export, cloud storage, user auth flow, template marketplace. Auth and AR exist as feature-folder skeletons, not yet implemented.

This is a personal portfolio project — a case study for cross-platform 3D app architecture with React Native + Three.js + Supabase + Zustand. Not a production deployment.

---

## 🏗️ Architecture

### Project structure

```
eefashionita/
├── src/
│   ├── core/                  # business logic & utilities
│   │   ├── state/             # Zustand store
│   │   ├── services/          # API, storage, export services
│   │   └── utils/             # platform detection, constants, performance
│   │
│   ├── features/              # one folder per vertical slice
│   │   ├── design3D/          # 3D Atelier (main feature)
│   │   ├── design2D/          # 2D design tools
│   │   ├── ar/                # AR features (stub)
│   │   ├── home/              # home screen
│   │   └── auth/              # authentication (stub)
│   │
│   ├── shared/                # cross-cutting UI layer
│   │   ├── components/        # reusable UI components
│   │   ├── hooks/             # custom React hooks
│   │   ├── assets/            # images, models, textures
│   │   └── styles/            # shared styles
│   │
│   └── navigation/            # app navigation graph
│
├── docs/                      # documentation
├── android/                   # committed Android scaffold (Expo)
└── App.js                     # app entry point
```

The split is intentional: `core` is the substrate (state, services, utilities), `features` owns its own screens + hooks + components per domain, `shared` is the cross-cutting UI layer. Adding a new domain means a new folder under `features/` plus a router entry — no changes to `core`.

### Technology stack

**Shell**
- Expo 50, React 18.2, React Native 0.73
- Tamagui 1.135 (UI + theme system)
- React Navigation (stack + bottom tabs)
- Zustand 4 (state)

**3D (web/desktop only)**
- Three.js 0.160, @react-three/fiber 8.15, @react-three/drei 9.95

**Data + persistence**
- Supabase (`@supabase/supabase-js` 2.75) — auth + data scaffold
- @react-native-async-storage/async-storage for local state
- expo-file-system + expo-sharing for exports

**AR + media primitives** (wired, not yet full flows)
- expo-camera, expo-gl, expo-image-picker, expo-media-library

### Platform support

- ✅ Web — full 3D, all features
- ✅ Desktop — full 3D, all features
- ⚠️ Tablet — limited 3D (feature-gated)
- ⚠️ Mobile — view-only 3D, no editing

---

## 🚀 Getting started

### Prerequisites

- Node.js v18+
- npm or pnpm
- Expo CLI (optional, for mobile development)

### Install & run

```bash
git clone https://github.com/PhucNguyen-Dev/eefashiondesign.git
cd eefashiondesign
npm install
npm start
```

Platform targets:

```bash
npm run web      # web browser (full 3D)
npm run android  # Android emulator
npm run ios      # iOS simulator (Mac only)
npm run build:web  # production web export (CI target)
```

> `npm install` runs a `postinstall` step (`node patch-tamagui.js`) — keep that script around or the Tamagui build will break.

### Quick start

1. Open the app in a browser (web) or device
2. Navigate to **3D Atelier** from the home screen
3. Select a garment type
4. Use the tools panel to edit materials and colors
5. Adjust properties in the right sidebar
6. Export your design when ready

---

## 🔧 Development

### Project commands

```bash
npm start          # Expo dev server
npm run web        # web
npm run ios        # iOS
npm run android    # Android
npm run build:web  # production web export
```

### Environment variables

Create `.env` at the root:

```env
REACT_APP_API_URL=https://api.3datelier.com
REACT_APP_WS_URL=wss://api.3datelier.com/ws
REACT_APP_CDN_URL=https://cdn.3datelier.com
```

> Those URLs are placeholders from the initial scaffold — the backend API integration is still on the roadmap. The Supabase client in `src/core/services` is the real data path until then.

### Adding a new feature

1. Create a folder under `src/features/`
2. Add `screens/`, `hooks/`, `components/` inside it
3. Export from `src/features/<name>/index.js`
4. Register the route in `src/navigation/`

---

## 📚 Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — detailed architecture guide
- Sprint-tracking docs in the root: `CURRENT_STRUCTURE.md`, `DEPENDENCY_ANALYSIS.md`, `FIXES_SUMMARY.md`, `MIGRATION_MAPPING.md`, `MIGRATION_PRIORITY.md`, `PHASE1_COMPLETE.md`, `WEEK1_COMPLETE.md`, `WEEK1_TESTING_REPORT.md`, `WEEK2_3_INFRASTRUCTURE_COMPLETE.md`, `WORKING_FEATURES.md`, `UI_UX_ENHANCEMENTS_SUMMARY.md`

Several of those were written between sprint phases during the initial build — they show how the project evolved over the two-week initial push.

---

## 🤝 Contributing

1. Fork the repo
2. `git checkout -b feature/<name>`
3. `git commit -m "feat: …"` (Conventional Commits)
4. `git push -u origin feature/<name>`
5. Open a PR

Style: ESLint + Prettier, follow React Native conventions, add tests for new features.

---

## 🐛 Troubleshooting

**App won't start:**
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

**3D features not working:**
- Confirm you're on web or desktop
- Verify WebGL support in the browser
- Check the console for Three.js errors

**Performance issues:**
- Reduce render quality in settings
- Close other GPU-heavy apps
- Check device performance tier

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 🙏 Acknowledgments

- **React Native + Expo teams** — for the framework
- **Three.js + React Three Fiber community** — for 3D rendering
- **Tamagui, Zustand, Supabase** — for the state/data/UI stack

---

## 📞 Contact

- **Author:** Nguyen Phuc Nguyen
- **GitHub:** github.com/PhucNguyen-Dev
- **Email:** nguyen.phuc.nguyen.dev@gmail.com

---

**Last updated: 2026-09-18**
