# 🏗️ Architecture Documentation

**eefashionita - 3D Fashion Design Atelier**

This document describes the technical architecture and design principles of the application.

## 📁 Folder Structure

```
eefashionita/
├── src/
│   ├── core/                          # Core business logic (platform-agnostic)
│   │   ├── state/                     # State management
│   │   │   └── stores/                # Zustand stores
│   │   ├── models/                    # Data models
│   │   ├── services/                  # Business logic services
│   │   │   ├── api/                   # Backend API integration
│   │   │   ├── storage/               # Local/cloud storage
│   │   │   └── export/                # Export services
│   │   └── utils/                     # Core utilities
│   │       ├── platform.js            # Platform detection
│   │       ├── constants.js           # App constants
│   │       ├── performance.js         # Performance utilities
│   │       └── index.js
│   │
│   ├── features/                      # Feature modules (organized by domain)
│   │   ├── design2D/                  # 2D Design features
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── screens/
│   │   │   │   └── DesignStudioScreen.js
│   │   │   └── index.js
│   │   │
│   │   ├── design3D/                  # 3D Design features (MAIN FOCUS)
│   │   │   ├── components/            # 3D-specific components
│   │   │   │   ├── common/            # Shared 3D components
│   │   │   │   ├── layout/            # Layout components
│   │   │   │   ├── viewport/          # 3D Viewport (WEB ONLY)
│   │   │   │   ├── tools/             # Tool panels
│   │   │   │   ├── properties/        # Properties panel
│   │   │   │   └── ui/                # UI elements
│   │   │   ├── hooks/                 # 3D-specific hooks
│   │   │   ├── engine/                # 3D Engine (WEB ONLY)
│   │   │   │   ├── core/              # Renderer, scene manager
│   │   │   │   ├── materials/         # Material system
│   │   │   │   ├── physics/           # Physics simulation
│   │   │   │   └── utils/             # 3D utilities
│   │   │   ├── screens/
│   │   │   │   └── Design3DAtelierScreen.js
│   │   │   ├── styles/                # 3D-specific styles
│   │   │   └── index.js
│   │   │
│   │   ├── ar/                        # AR features
│   │   │   └── screens/
│   │   │       └── ARViewScreen.js
│   │   │
│   │   ├── home/                      # Home features
│   │   │   └── screens/
│   │   │       └── HomeScreen.js
│   │   │
│   │   └── auth/                      # Authentication
│   │       ├── components/
│   │       └── screens/
│   │
│   ├── shared/                        # Shared across features
│   │   ├── components/                # Reusable components
│   │   │   ├── TutorialOverlay.js
│   │   │   ├── ErrorBoundary.js
│   │   │   └── index.js
│   │   ├── hooks/                     # Shared hooks
│   │   │   ├── useAnimation.js
│   │   │   └── index.js
│   │   ├── assets/                    # Organized assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── fonts/
│   │   │   ├── models/                # 3D models
│   │   │   │   ├── garments/
│   │   │   │   └── mannequins/
│   │   │   └── textures/              # Fabric textures
│   │   │       ├── denim/
│   │   │       ├── cotton/
│   │   │       └── leather/
│   │   └── styles/
│   │       ├── theme.js
│   │       └── responsive.js
│   │
│   ├── navigation/
│   │   └── AppNavigator.js
│   │
│   └── [legacy folders]               # Old structure (to be migrated)
│       ├── components/
│       ├── screens/
│       ├── services/
│       └── utils/
│
├── assets/                            # Root assets (Expo)
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md                # This file
│   ├── 3D_SETUP.md                    # 3D setup guide
│   ├── API_INTEGRATION.md             # API integration guide
│   └── PERFORMANCE.md                 # Performance optimization
└── App.js
```

## 🎯 Design Principles

### 1. Feature-Based Organization
- Code organized by feature/domain, not by type
- Each feature is self-contained with its own components, hooks, and logic
- Easy to find and modify related code

### 2. Platform-Agnostic Core
- Core business logic works on all platforms
- Platform-specific code isolated in separate files
- Use `.web.js` and `.native.js` extensions for platform-specific implementations

### 3. Separation of Concerns
- **Core:** Business logic, state, services
- **Features:** UI and feature-specific logic
- **Shared:** Reusable components and utilities

### 4. Scalability
- Easy to add new features
- Clear boundaries between modules
- Minimal coupling between features

## 🔧 Platform-Specific Code

### File Naming Convention

```javascript
// Shared logic (all platforms)
Component.js

// Web-specific (3D features)
Component.web.js

// Mobile-specific (fallback)
Component.native.js
```

### Example: 3D Viewport

**Scene3D.web.js** (Full 3D with React Three Fiber):
```javascript
import { Canvas } from '@react-three/fiber';
export const Scene3D = () => <Canvas>...</Canvas>;
```

**Scene3D.native.js** (Fallback for mobile):
```javascript
import { View, Text } from 'react-native';
export const Scene3D = () => <View><Text>3D on desktop only</Text></View>;
```

**Usage** (automatic platform selection):
```javascript
import { Scene3D } from './Scene3D'; // Loads correct version
```

## 📦 Module Exports

### Clean Imports
```javascript
// ✅ Good: Import from feature module
import { HomeScreen } from '@/features/home';
import { Design3DAtelierScreen } from '@/features/design3D';

// ✅ Good: Import from shared
import { TutorialOverlay, ErrorBoundary } from '@/shared/components';

// ✅ Good: Import from core
import { platformUtils, constants } from '@/core/utils';

// ❌ Bad: Deep imports
import HomeScreen from '@/features/home/screens/HomeScreen';
```

## 🚀 State Management

### Zustand Stores

Located in `src/core/state/stores/`:

- **designStore.js:** Design state (colors, materials, garments)
- **userStore.js:** User authentication and profile
- **projectStore.js:** Projects and collaboration
- **uiStore.js:** UI state (sidebar open/closed, etc.)

### Usage Example
```javascript
import { useDesignStore } from '@/core/state/stores';

const MyComponent = () => {
  const { currentGarment, setMaterial } = useDesignStore();
  // ...
};
```

## 🔌 API Integration

### Service Layer

Located in `src/core/services/api/`:

- **client.js:** Base API client with auth
- **garmentAPI.js:** Garment endpoints
- **materialAPI.js:** Material endpoints
- **projectAPI.js:** Project endpoints

### Backdoor Pattern
```javascript
// All API services return mock data initially
// Easy to swap with real API later

export const garmentAPI = {
  async fetchAll() {
    // 🚪 BACKDOOR: Replace with real API call
    // return await apiClient.get('/garments');
    
    // Mock data for now
    return mockGarments;
  },
};
```

## 🎨 3D Engine Architecture

### Engine Structure

Located in `src/features/design3D/engine/`:

- **core/:** Renderer, scene manager, asset loader
- **materials/:** Material library and PBR materials
- **physics/:** Cloth simulation and physics
- **utils/:** 3D-specific utilities

### Web-Only Implementation
```javascript
// Engine only loads on web
if (Platform.OS === 'web') {
  const { Renderer } = await import('./engine/core/Renderer');
  // Initialize 3D engine
}
```

## 📱 Cross-Platform Strategy

### Platform Support Matrix

| Feature | Web | Desktop | Mobile | Tablet |
|---------|-----|---------|--------|--------|
| UI Shell | ✅ | ✅ | ✅ | ✅ |
| 2D Design | ✅ | ✅ | ✅ | ✅ |
| 3D Viewport | ✅ | ✅ | ❌ | ⚠️ |
| Material Editing | ✅ | ✅ | ❌ | ⚠️ |
| Physics Sim | ✅ | ✅ | ❌ | ❌ |
| Export | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Full support
- ⚠️ Limited support
- ❌ Not supported (graceful fallback)

## 📝 Naming Conventions

- **Components:** PascalCase (`DesignTools.js`)
- **Utilities:** camelCase (`platform.js`)
- **Constants:** UPPER_SNAKE_CASE (`API_CONFIG`)
- **Folders:** camelCase (`design3D/`)

## 🧪 Testing

Tests are organized alongside components:
```
src/features/design3D/
├── components/
│   ├── DesignTools.js
│   └── __tests__/
│       └── DesignTools.test.js
```

---

**Last Updated:** 2025-10-11
**Version:** 1.0.0

