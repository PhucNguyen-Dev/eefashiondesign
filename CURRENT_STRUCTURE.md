# Current Project Structure Analysis

**Date:** November 9, 2025  
**Phase:** 1 - Documentation (No Code Changes)  
**Purpose:** Understand what exists before migrating

---

## Top-Level Structure

```
src/
├── app/              # ???
├── assets/           # Images, fonts, icons
├── components/       # Reusable UI components
├── config/           # Configuration files
├── context/          # React Context providers
├── core/             # ???
├── data/             # Static data (templates?)
├── features/         # Feature modules (partial)
├── hooks/            # Custom React hooks
├── screens/          # Screen components (some)
├── services/         # Business logic services
├── shared/           # Shared utilities
├── store/            # State management
├── types/            # TypeScript types
└── utils/            # Helper functions
```

---

## Detailed Inventory

### 1. `/screens` - Screen Components
**Current Files:**
- `AIAssistantScreen.js` - AI assistance feature
- `CollaborationScreen.js` - Real-time collaboration
- `MeasurementsScreen.js` - User measurements
- `OnboardingScreen.js` - First-time user experience
- `ProfileScreen.js` - User profile
- `TemplateLibraryScreen.js` - Design templates
- `TrendExplorerScreen.js` - Fashion trends

**Status:** ⚠️ Mixed location (some screens here, some in features/)

---

### 2. `/features` - Feature Modules (Partial)
**Current Folders:**
- `ar/` - Augmented Reality features
- `auth/` - Authentication
- `design2D/` - 2D design canvas
- `design3D/` - 3D modeling
- `home/` - Home screen

**Status:** ⚠️ Partially modularized (good pattern, incomplete)

---

### 3. `/components` - Reusable Components
**Current Files:**
- `ColorPicker.js`
- `DesignTips.js`
- `FabricSelector.js`
- `PatternSelector.js`
- `TemplateQuickPreview.js`
- `ThemeToggle.js`
- `index.js`

**Current Folders:**
- `DesignStudio/` - Design studio components
- `tamagui/` - Tamagui custom components

**Status:** ⚠️ Flat structure, no organization by domain

---

### 4. `/services` - Business Logic
**Current Files:**
- `autoSaveService.js` - Auto-save functionality
- `colorHistoryService.js` - Color history tracking
- `errorHandler.js` (.d.ts) - Error handling
- `exportService.js` (.d.ts) - Design export
- `marketplaceService.js` - Marketplace integration
- `performanceService.js` (.d.ts) - Performance monitoring
- `socialService.js` - Social features
- `themeService.js` - Theme management
- `index.js`

**Status:** ✅ Well organized services

---

### 5. `/context` - React Context
**Current Files:**
- `AuthContext.js` - Authentication state
- `ThemeContext.js` - Theme state (legacy)
- `ThemeContext.tsx` - Theme state (TypeScript version)

**Status:** ⚠️ Mix of JS/TS, migrating to TS

---

### 6. `/store` - State Management
**Current Files:**
- `index.js` (349 lines)

**Zustand Stores:**
- `useAppStore` - Theme, user, settings, onboarding
- `useDesignStore` - Current design state
- Persisted to AsyncStorage

**Status:** ✅ **Centralized Zustand store with persistence**

---

### 7. `/hooks` - Custom Hooks
**Current Files (with .js/.ts duplicates):**
- `useAnimation.js/.ts` - Animation hook
- `useGestureShortcuts.js/.ts` - Gesture controls
- `useKeyboardShortcuts.js/.ts` - Keyboard shortcuts
- `index.js` - Barrel export

**Status:** ⚠️ **Migrating JS → TS** (duplicates exist)

---

### 8. `/config` - Configuration
**Current Files:**
- `constants.js` - App constants (STORAGE_KEYS, etc.)
- `index.js` - Barrel export

**Status:** ✅ Basic configuration

---

### 9. `/utils` - Helper Functions
**Current Files (with .js/.ts duplicates):**
- `accessibility.js/.ts` - Accessibility helpers
- `helpers.js/.ts` - General utilities
- `responsive.js/.ts` - Responsive design
- `socialMediaPresets.js` - Social sharing
- `validation.js` - Form validation
- `viewCapture.js` - Screenshot/export

**Status:** ⚠️ **Migrating JS → TS** (duplicates exist)

---

### 10. `/data` - Static Data
**Current Files:**
- `templates.js` - Design templates (219 lines, 20+ templates)

**Status:** ✅ Static template data (Classic T-Shirt, Summer Dress, etc.)

---

### 11. `/types` - TypeScript Definitions
**Current Files:**
- `expo-vector-icons.d.ts` - Icon type definitions
- `react-native-svg.d.ts` - SVG type definitions

**Status:** ✅ Custom type declarations

---

### 12. `/app` - App Bootstrap
**Current Status:** 📁 **Empty folder** (planned for future use)

---

### 13. `/core` - Core Infrastructure ⭐
**Detailed Structure:**
```
core/
├── config/
│   ├── env.config.js           # Environment variables
│   └── features.config.js      # Feature flags (already exists!)
├── services/
│   ├── api/
│   │   ├── auth.api.js         # Auth API calls
│   │   ├── supabase.client.js  # ✅ Supabase client setup
│   │   ├── sync.api.js         # Sync API
│   │   └── upload.api.js       # File upload
│   └── offline/
│       └── offlineManager.js   # ✅ Offline support already built
├── state/
│   └── hooks/                  # State-related hooks
└── utils/
    ├── constants.js            # Core constants
    ├── logger.js               # Logging utility
    ├── performance.js          # Performance monitoring
    ├── platform.js             # Platform detection
    └── index.js
```

**Status:** ✅ **Well-structured infrastructure layer**
- ✅ Already has Supabase integration
- ✅ Already has offline support
- ✅ API layer abstracted
- ✅ Feature flags config exists

---

### 14. `/shared` - Shared Resources
**Current Structure:**
```
shared/
├── assets/                     # Shared images/icons
├── components/
│   ├── ErrorBoundary.js       # ✅ Error handling
│   ├── TutorialOverlay.js     # ✅ Onboarding
│   ├── PremiumButton.js       # ✅ Premium features
│   ├── viewCapture.js         # Screenshot helper
│   └── index.js
└── hooks/
    └── index.js
```

**Status:** ✅ Good pattern for cross-feature resources

---

### 9. `/utils` - Helper Functions

**Location:** `src/utils/`
- *Need to list files*

---

### 10. `/core` - Core Infrastructure
**Current Folders:**
- `config/` - Core configuration
- `services/` - Core services
- `state/` - Core state management
- `utils/` - Core utilities

**Status:** ⚠️ Overlap with top-level folders? Need investigation

---

### 11. `/shared` - Shared Resources
**Current Folders:**
- `assets/` - Shared assets
- `components/` - Shared components (ErrorBoundary, TutorialOverlay)
- `hooks/` - Shared hooks

**Status:** ✅ Good pattern for shared resources

---

## Next Steps

1. **Drill into each folder** to understand file contents
2. **Map dependencies** between folders
3. **Identify what works** vs what needs fixing
4. **Create migration plan** for each file

---

## App.js - Root Component

**Location:** `./App.js` (548 lines)

**Current Structure:**
- ✅ Using NavigationContainer
- ✅ Bottom tabs + Stack navigation
- ✅ TamaguiProvider for UI
- ✅ ThemeProvider from context
- ✅ ErrorBoundary wrapper
- ✅ Mixed imports: features/ (new) + screens/ (legacy)

**Import Pattern:**
```javascript
// NEW Structure (features/)
import HomeScreen from "./src/features/home/screens/HomeScreen";
import DesignStudioScreen from "./src/features/design2D/screens/DesignStudioScreen";
import ARViewScreen from "./src/features/ar/screens/ARViewScreen";
import { Design3DAtelierScreen } from "./src/features/design3D";
import { LoginScreen, SignUpScreen, ForgotPasswordScreen } from "./src/features/auth/screens";

// LEGACY Structure (screens/)
import TemplateLibraryScreen from "./src/screens/TemplateLibraryScreen";
import MeasurementsScreen from "./src/screens/MeasurementsScreen";
import AIAssistantScreen from "./src/screens/AIAssistantScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TrendExplorerScreen from "./src/screens/TrendExplorerScreen";
import CollaborationScreen from "./src/screens/CollaborationScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
```

**Status:** ⚠️ **Hybrid - Partial Migration in Progress**

---

## Feature Modules Detail

### `/features/auth` - Authentication ✅
**Structure:**
```
auth/
└── screens/
    ├── LoginScreen.tsx         # ✅ TypeScript
    ├── SignUpScreen.tsx        # ✅ TypeScript
    ├── ForgotPasswordScreen.tsx # ✅ TypeScript
    └── index.js                # Barrel export
```
**Status:** ⭐ **Best migrated** - Screens in TS, organized
**Missing:** components/, hooks/, lib/, api/, store/

---

### `/features/design2D` - 2D Design Canvas
**Structure:**
```
design2D/
├── index.js
└── screens/
    ├── DesignStudioScreen.js   # Main canvas
    └── tamagui/                # Tamagui components
```
**Status:** ⚠️ Partial - Only screens, needs components extracted
**Missing:** components/, hooks/, lib/, api/, store/

---

### `/features/design3D` - 3D Modeling ⭐
**Structure:**
```
design3D/
├── index.js
├── screens/
│   └── Design3DAtelierScreen.js
└── components/
    ├── layout/                 # Layout components
    ├── ui/                     # UI elements
    └── viewport/               # 3D viewport components
```
**Status:** ✅ **Most complete** - Has components organized!
**Missing:** hooks/, lib/, api/, store/

---

### `/features/ar` - Augmented Reality
**Structure:**
```
ar/
└── screens/
    ├── ARViewScreen.js
    └── tamagui/                # Tamagui components
```
**Status:** ⚠️ Partial - Only screens
**Missing:** components/, hooks/, lib/, api/, store/

---

### `/features/home` - Home Screen
**Structure:**
```
home/
└── screens/
    └── HomeScreen.js
```
**Status:** ⚠️ Minimal - Just one screen
**Missing:** components/, hooks/, lib/, api/, store/

---

**Migration Pattern Discovery:**
- ✅ You've **started** the feature-slice migration
- ✅ Auth is most complete (TypeScript)
- ✅ Design3D has component organization
- ⚠️ Others are incomplete (only screens moved)
- ⚠️ No module-level hooks, lib, api, or store yet

---

## Key Findings

### ✅ What's Already Good
1. **Core Infrastructure Exists**
   - `core/services/api/` - Supabase client, auth, sync, upload
   - `core/services/offline/offlineManager.js` - Offline support
   - `core/config/features.config.js` - Feature flags
   - `core/utils/` - Logger, performance, platform detection

2. **State Management Setup**
   - Zustand store with persistence (`store/index.js`)
   - Context for auth and theme
   - AsyncStorage integration

3. **Partial Feature Migration**
   - `/features/auth` - Best example (TypeScript screens)
   - `/features/design3D` - Has component organization
   - Barrel exports (index.js) in place

4. **Shared Resources Pattern**
   - ErrorBoundary, TutorialOverlay, PremiumButton
   - Cross-cutting concerns handled

5. **TypeScript Migration Started**
   - Auth screens in .tsx
   - Type definitions added
   - Duplicate .js/.ts files (migration in progress)

### ⚠️ What Needs Work
1. **Split Locations**
   - 7 screens still in `/screens/` (legacy)
   - Should be in feature modules

2. **Incomplete Feature Modules**
   - Only screens migrated, missing:
     - Module-level components
     - Module-level hooks
     - Module-level lib (business logic)
     - Module-level API calls
     - Module-level state

3. **Overlap/Duplication**
   - `src/config/` vs `src/core/config/`
   - `src/utils/` vs `src/core/utils/`
   - `src/hooks/` vs `src/shared/hooks/`
   - JS/TS duplicates during migration

4. **No Tests**
   - No `__tests__/` folders
   - No `.test.js` files
   - Testing infrastructure needed

5. **Components Not Organized**
   - Flat `/components/` folder
   - Should be in feature modules or shared/

### 🎯 Migration Priorities

**Critical (Must Keep & Migrate):**
- ✅ `core/` - Already good, just needs documentation
- ✅ `store/index.js` - Central Zustand store
- ✅ `context/` - Auth & Theme contexts
- ✅ `services/` - All service files
- ✅ `features/auth` - Already in good shape
- ⚠️ `screens/` - Move to feature modules
- ⚠️ `components/` - Split into features/X/components or shared/

**Important (Migrate):**
- `features/design2D`, `design3D`, `ar`, `home` - Complete the structure
- `data/templates.js` - Move to appropriate module
- `utils/`, `hooks/` - Merge duplicates, organize

**Optional (Can Consolidate):**
- JS/TS duplicates - Keep only .ts versions
- Config overlap - Merge into `core/config/`
- Empty folders - Remove `src/app/`

---

## Questions to Answer

- [x] What's in `src/app/`? → **Empty folder**
- [x] What's in `src/core/`? → **Excellent infrastructure layer**
- [x] What's in `src/data/`? → **Templates data**
- [x] What's in `src/shared/`? → **Cross-cutting components**
- [x] What's in `src/types/`? → **Custom type definitions**
- [x] How is navigation structured? → **App.js with Bottom Tabs + Stack**
- [x] What state management is used? → **Zustand (main) + Context (auth/theme)**
- [x] Is there existing backend integration? → **✅ Yes! Supabase + offline support**
- [x] Are there existing tests? → **❌ No tests yet**

---

## Next Steps (Phase 1 Tasks)

### Task 1: ✅ Document Current Structure (DONE)
- [x] Created CURRENT_STRUCTURE.md
- [x] Mapped all folders and files
- [x] Identified patterns and issues

### Task 2: Inventory Working Features
- [ ] Test each screen to verify functionality
- [ ] Document which features are production-ready
- [ ] List incomplete/broken features

### Task 3: Map Current → New Structure
- [ ] Create migration table: `screens/X.js` → `modules/Y/screens/X.tsx`
- [ ] Map components to their feature modules
- [ ] Map services to module APIs
- [ ] Identify what stays in shared/

### Task 4: Identify Dependencies
- [ ] Analyze import statements in each file
- [ ] Find circular dependencies
- [ ] Document coupling between modules
- [ ] Identify breaking changes needed

### Task 5: Create Migration Priority
- [ ] Rank files: Critical / Important / Optional
- [ ] Create migration order (dependencies first)
- [ ] Identify quick wins vs complex refactors

---

**Status:** 🔍 **Phase 1 Task 1 Complete - Ready for Task 2**
