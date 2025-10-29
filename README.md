# 🎨 eefashionita - 3D Fashion Design Atelier

**A cross-platform 3D fashion design application with real-time collaboration, AR visualization, and advanced material editing.**

---

## 🌟 Overview

eefashionita is a modern fashion design platform that brings professional 3D garment design tools to web, desktop, and mobile devices. Built with React Native and Expo, it features a powerful 3D design interface (web/desktop) with graceful fallbacks for mobile devices.

### Key Features

- **🎨 3D Design Atelier** - Full 3D garment design with real-time material editing (web/desktop)
- **📱 Cross-Platform** - Works on web, desktop, tablet, and mobile
- **🤝 Real-Time Collaboration** - Work together with team members
- **🎭 AR Try-On** - Augmented reality garment visualization
- **🎯 Material System** - Advanced fabric materials (denim, cotton, leather, silk)
- **⚡ Performance Optimized** - Smart loading and platform-specific features
- **🔄 Auto-Save** - Never lose your work

---

## 🏗️ Architecture

### Project Structure

```
eefashionita/
├── src/
│   ├── core/                  # Business logic & utilities
│   │   ├── state/             # State management (Zustand)
│   │   ├── services/          # API, storage, export services
│   │   └── utils/             # Platform detection, constants, performance
│   │
│   ├── features/              # Feature modules
│   │   ├── design3D/          # 3D Atelier (main feature)
│   │   ├── design2D/          # 2D design tools
│   │   ├── ar/                # AR features
│   │   ├── home/              # Home screen
│   │   └── auth/              # Authentication
│   │
│   ├── shared/                # Shared components & assets
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── assets/            # Images, models, textures
│   │   └── styles/            # Shared styles
│   │
│   └── navigation/            # App navigation
│
├── docs/                      # Documentation
│   └── ARCHITECTURE.md        # Detailed architecture guide
│
└── App.js                     # App entry point
```

### Technology Stack

**Core:**
- React Native + Expo
- React Navigation
- React Native Paper (UI)
- Zustand (State Management)

**3D Features (Web/Desktop Only):**
- React Three Fiber
- @react-three/drei
- Three.js

**Platform Support:**
- ✅ Web (full features)
- ✅ Desktop (full features)
- ⚠️ Tablet (limited 3D)
- ⚠️ Mobile (view-only 3D)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI** (optional, for mobile development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/eefashionita.git
   cd eefashionita
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on specific platform:**
   ```bash
   npm run web      # Web browser
   npm run ios      # iOS simulator (Mac only)
   npm run android  # Android emulator
   ```

### Quick Start

1. Open the app in your browser (web) or device
2. Navigate to **3D Atelier** from the home screen
3. Select a garment type (jumpsuit, dress, etc.)
4. Use the tools panel to edit materials and colors
5. Adjust properties in the right sidebar
6. Click **Simulate** to see fabric physics
7. Export your design when ready

---

## 📱 Platform-Specific Features

### Web & Desktop (Full Features)
- ✅ Full 3D viewport with WebGL
- ✅ Real-time material editing
- ✅ Physics simulation
- ✅ Advanced rendering
- ✅ Export to multiple formats

### Tablet (Limited Features)
- ⚠️ Basic 3D viewing
- ⚠️ Material preview
- ✅ Project management
- ✅ Collaboration

### Mobile (View-Only)
- ❌ 3D editing (fallback UI shown)
- ✅ View saved projects
- ✅ Collaboration
- ✅ AR try-on

---

## 🎨 3D Atelier Features

### Design Tools
- **Material Editor** - Change fabric types and textures
- **Color Picker** - Advanced color selection with HSV
- **Pattern Tools** - Apply patterns and designs
- **Drawing Tools** - Freehand drawing on garments
- **Text Tools** - Add text and labels

### Advanced Tools
- **Lighting Control** - Adjust scene lighting
- **Seam Editor** - Modify garment seams
- **Measurements** - Precise garment measurements
- **Pleating** - Add pleats and folds
- **UV Mapping** - Advanced texture mapping
- **Pose Editor** - Change mannequin poses

### Properties Panel
- **View Orientation** - Front, back, side, top, walking
- **Material Properties** - Roughness, shininess, thickness
- **Physics Settings** - Wind, gravity, stiffness
- **Render Settings** - Quality, resolution, format

---

## 🔧 Development

### Project Commands

```bash
npm start          # Start Expo dev server
npm run web        # Run on web
npm run ios        # Run on iOS
npm run android    # Run on Android
npm test           # Run tests
npm run lint       # Lint code
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_API_URL=https://api.3datelier.com
REACT_APP_WS_URL=wss://api.3datelier.com/ws
REACT_APP_CDN_URL=https://cdn.3datelier.com
```

### Adding New Features

1. Create feature folder in `src/features/`
2. Add components, hooks, and screens
3. Export from `index.js`
4. Add to navigation

Example:
```javascript
// src/features/myFeature/index.js
export { default as MyFeatureScreen } from './screens/MyFeatureScreen';
```

---

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - Detailed architecture documentation
- **[API Integration](docs/API_INTEGRATION.md)** - Backend API integration guide (coming soon)
- **[3D Setup](docs/3D_SETUP.md)** - 3D engine setup guide (coming soon)
- **[Performance](docs/PERFORMANCE.md)** - Performance optimization guide (coming soon)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier
- Follow React Native best practices
- Write meaningful commit messages
- Add tests for new features

---

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

**3D features not working:**
- Check if you're on web/desktop
- Verify WebGL support in browser
- Check console for errors

**Performance issues:**
- Reduce render quality in settings
- Close other applications
- Check device performance tier

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native Team** - For the amazing framework
- **Expo Team** - For simplifying mobile development
- **Three.js Community** - For 3D rendering capabilities
- **Fashion Designers** - For inspiration and feedback

---

## 📞 Contact

- **Project Lead:** [Your Name]
- **Email:** contact@eefashionita.com
- **Website:** https://eefashionita.com
- **Discord:** [Join our community](https://discord.gg/eefashionita)

---

## 🗺️ Roadmap

### Current Version (v1.0.0)
- ✅ Project restructure
- ✅ Core utilities
- ✅ Platform detection
- ⏳ 3D Atelier UI (in progress)

### Upcoming Features
- 🔜 Backend API integration
- 🔜 Real-time collaboration
- 🔜 Physics simulation
- 🔜 Material library expansion
- 🔜 Export to multiple formats
- 🔜 Cloud storage
- 🔜 User authentication
- 🔜 Template marketplace

---

**Made with ❤️ by the eefashionita team**

*Last updated: 2025-10-11*

