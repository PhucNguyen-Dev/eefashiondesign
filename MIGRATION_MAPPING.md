# Migration Mapping: Current → New Structure

**Date:** November 9, 2025  
**Phase:** 1 - Task 3  
**Purpose:** Map every file to its new location in the modular architecture

---

## Migration Strategy

### Key Principle: **Move Tamagui Components into Feature Modules**

**Current:**
```
src/
├── components/tamagui/  ← 34 implementation files
├── screens/             ← 7 wrapper files
└── features/            ← 5 incomplete modules
```

**Target:**
```
src/
├── modules/             ← Feature-sliced modules
├── shared/              ← Cross-cutting components
└── app/                 ← Navigation, providers, config
```

---

## File Migration Table

### Authentication Module (`modules/auth`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `features/auth/screens/LoginScreen.tsx` | `modules/auth/screens/LoginScreen.tsx` | ✅ Keep | Already TS |
| `features/auth/screens/SignUpScreen.tsx` | `modules/auth/screens/SignUpScreen.tsx` | ✅ Keep | Already TS |
| `features/auth/screens/ForgotPasswordScreen.tsx` | `modules/auth/screens/ForgotPasswordScreen.tsx` | ✅ Keep | Already TS |
| `components/tamagui/AuthContainer.tsx` | `modules/auth/components/AuthContainer.tsx` | 🔄 Move | UI component |
| `components/tamagui/AuthInput.tsx` | `modules/auth/components/AuthInput.tsx` | 🔄 Move | UI component |
| `core/services/api/auth.api.js` | `modules/auth/api/authApi.ts` | 🔄 Move + TS | API calls |
| `context/AuthContext.js` | `modules/auth/store/authStore.ts` | 🔄 Refactor | Convert to Zustand |
| `core/state/hooks/useAuth` | `modules/auth/hooks/useAuth.ts` | 🔄 Move | Custom hook |

**Module Complete Structure:**
```
modules/auth/
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   └── index.ts
├── components/
│   ├── AuthContainer.tsx
│   ├── AuthInput.tsx
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   └── index.ts
├── api/
│   ├── authApi.ts
│   └── index.ts
├── store/
│   ├── authStore.ts
│   └── index.ts
└── index.ts
```

---

### Home Module (`modules/home`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `features/home/screens/HomeScreen.js` | `modules/home/screens/HomeScreen.tsx` | 🔄 TS | Wrapper only |
| `components/tamagui/HomeScreen.tsx` | `modules/home/screens/HomeScreen.tsx` | 🔄 Move | Actual implementation |

**Module Structure:**
```
modules/home/
├── screens/
│   ├── HomeScreen.tsx
│   └── index.ts
└── index.ts
```

---

### 2D Design Module (`modules/design2D`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `features/design2D/screens/DesignStudioScreen.js` | `modules/design2D/screens/DesignStudioScreen.tsx` | 🔄 TS | Wrapper |
| `components/tamagui/DesignStudioScreen.tsx` | `modules/design2D/screens/DesignStudioScreen.tsx` | 🔄 Move | Implementation |
| `components/ColorPicker.js` | ❌ Delete | Duplicate | |
| `components/tamagui/ColorPicker.tsx` | `modules/design2D/components/ColorPicker.tsx` | 🔄 Move | Keep TS version |
| `components/FabricSelector.js` | ❌ Delete | Duplicate | |
| `components/tamagui/FabricSelector.tsx` | `modules/design2D/components/FabricSelector.tsx` | 🔄 Move | Keep TS version |
| `components/PatternSelector.js` | ❌ Delete | Duplicate | |
| `components/tamagui/PatternSelector.tsx` | `modules/design2D/components/PatternSelector.tsx` | 🔄 Move | Keep TS version |
| `components/DesignTips.js` | ❌ Delete | Duplicate | |
| `components/tamagui/DesignTips.tsx` | `modules/design2D/components/DesignTips.tsx` | 🔄 Move | Keep TS version |
| `services/autoSaveService.js` | `modules/design2D/lib/autoSave.ts` | 🔄 Move + TS | Business logic |
| `services/colorHistoryService.js` | `modules/design2D/lib/colorHistory.ts` | 🔄 Move + TS | Business logic |
| `services/exportService.js` | `modules/design2D/api/exportApi.ts` | 🔄 Move + TS | API integration |

**Module Complete Structure:**
```
modules/design2D/
├── screens/
│   ├── DesignStudioScreen.tsx
│   └── index.ts
├── components/
│   ├── ColorPicker.tsx
│   ├── FabricSelector.tsx
│   ├── PatternSelector.tsx
│   ├── DesignTips.tsx
│   └── index.ts
├── lib/
│   ├── autoSave.ts
│   ├── colorHistory.ts
│   └── index.ts
├── api/
│   ├── exportApi.ts
│   └── index.ts
└── index.ts
```

---

### 3D Design Module (`modules/design3D`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `features/design3D/screens/Design3DAtelierScreen.js` | `modules/design3D/screens/Design3DAtelierScreen.tsx` | 🔄 TS | Wrapper |
| `components/tamagui/Design3DAtelierScreen.tsx` | `modules/design3D/screens/Design3DAtelierScreen.tsx` | 🔄 Move | Implementation |
| `features/design3D/components/layout/*` | `modules/design3D/components/layout/*` | ✅ Move | Already organized |
| `features/design3D/components/ui/*` | `modules/design3D/components/ui/*` | ✅ Move | Already organized |
| `features/design3D/components/viewport/*` | `modules/design3D/components/viewport/*` | ✅ Move | Already organized |
| `components/tamagui/BottomBar3D.tsx` | `modules/design3D/components/BottomBar3D.tsx` | 🔄 Move | UI component |
| `components/tamagui/Header3D.tsx` | `modules/design3D/components/Header3D.tsx` | 🔄 Move | UI component |
| `components/tamagui/LeftSidebar.tsx` | `modules/design3D/components/LeftSidebar.tsx` | 🔄 Move | UI component |
| `components/tamagui/RightSidebar.tsx` | `modules/design3D/components/RightSidebar.tsx` | 🔄 Move | UI component |
| `components/tamagui/LayerPanel.tsx` | `modules/design3D/components/LayerPanel.tsx` | 🔄 Move | UI component |
| `components/tamagui/PropertiesPanel.tsx` | `modules/design3D/components/PropertiesPanel.tsx` | 🔄 Move | UI component |
| `components/tamagui/PropertySlider.tsx` | `modules/design3D/components/PropertySlider.tsx` | 🔄 Move | UI component |
| `components/tamagui/Toolbar.tsx` | `modules/design3D/components/Toolbar.tsx` | 🔄 Move | UI component |

**Module Complete Structure:**
```
modules/design3D/
├── screens/
│   ├── Design3DAtelierScreen.tsx
│   └── index.ts
├── components/
│   ├── layout/           # From features/design3D
│   ├── ui/               # From features/design3D
│   ├── viewport/         # From features/design3D
│   ├── BottomBar3D.tsx
│   ├── Header3D.tsx
│   ├── LeftSidebar.tsx
│   ├── RightSidebar.tsx
│   ├── LayerPanel.tsx
│   ├── PropertiesPanel.tsx
│   ├── PropertySlider.tsx
│   ├── Toolbar.tsx
│   └── index.ts
├── lib/
│   ├── ThreeLoader.ts     # ⭐ NEW - Lazy load Three.js
│   ├── GLCapabilityGuard.ts # ⭐ NEW - Device checks
│   └── index.ts
└── index.ts
```

---

### AR Module (`modules/ar`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `features/ar/screens/ARViewScreen.js` | `modules/ar/screens/ARViewScreen.tsx` | 🔄 TS | Convert to TS |

**Module Complete Structure:**
```
modules/ar/
├── screens/
│   ├── ARViewScreen.tsx
│   └── index.ts
├── lib/
│   ├── ARCapabilityGuard.ts  # ⭐ NEW - Platform checks
│   ├── ARLoader.ts            # ⭐ NEW - Lazy load AR
│   └── index.ts
└── index.ts
```

---

### Templates Module (`modules/templates`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/TemplateLibraryScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/TemplateLibraryScreen.tsx` | `modules/templates/screens/TemplateLibraryScreen.tsx` | 🔄 Move | Implementation |
| `components/TemplateQuickPreview.js` | ❌ Delete | Duplicate | |
| `components/tamagui/TemplateQuickPreview.tsx` | `modules/templates/components/TemplateQuickPreview.tsx` | 🔄 Move | Component |
| `data/templates.js` | `modules/templates/data/templates.ts` | 🔄 Move + TS | Static data |

**Module Complete Structure:**
```
modules/templates/
├── screens/
│   ├── TemplateLibraryScreen.tsx
│   └── index.ts
├── components/
│   ├── TemplateQuickPreview.tsx
│   └── index.ts
├── data/
│   ├── templates.ts
│   └── index.ts
└── index.ts
```

---

### Measurements Module (`modules/measurements`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/MeasurementsScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/MeasurementsScreen.tsx` | `modules/measurements/screens/MeasurementsScreen.tsx` | 🔄 Move | Implementation |

**Module Complete Structure:**
```
modules/measurements/
├── screens/
│   ├── MeasurementsScreen.tsx
│   └── index.ts
├── lib/
│   ├── UnitConverter.ts       # ⭐ NEW - Unit conversion
│   ├── MeasurementSerializer.ts # ⭐ NEW - Canonical format
│   └── index.ts
└── index.ts
```

---

### AI Assistant Module (`modules/ai`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/AIAssistantScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/AIAssistantScreen.tsx` | `modules/ai/screens/AIAssistantScreen.tsx` | 🔄 Move | Implementation |

**Module Complete Structure:**
```
modules/ai/
├── screens/
│   ├── AIAssistantScreen.tsx
│   └── index.ts
├── api/
│   ├── aiApi.ts              # ⭐ NEW - AI backend calls
│   └── index.ts
└── index.ts
```

---

### Profile Module (`modules/profile`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/ProfileScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/ProfileScreen.tsx` | `modules/profile/screens/ProfileScreen.tsx` | 🔄 Move | Implementation |

**Module Complete Structure:**
```
modules/profile/
├── screens/
│   ├── ProfileScreen.tsx
│   └── index.ts
└── index.ts
```

---

### Trends Module (`modules/trends`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/TrendExplorerScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/TrendExplorerScreen.tsx` | `modules/trends/screens/TrendExplorerScreen.tsx` | 🔄 Move | Implementation |

**Module Complete Structure:**
```
modules/trends/
├── screens/
│   ├── TrendExplorerScreen.tsx
│   └── index.ts
├── api/
│   ├── trendsApi.ts          # ⭐ NEW - Trends data
│   └── index.ts
└── index.ts
```

---

### Collaboration Module (`modules/collaboration`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/CollaborationScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/CollaborationScreen.tsx` | `modules/collaboration/screens/CollaborationScreen.tsx` | 🔄 Move | Implementation |
| `services/socialService.js` | `modules/collaboration/api/collabApi.ts` | 🔄 Move + TS | API calls |

**Module Complete Structure:**
```
modules/collaboration/
├── screens/
│   ├── CollaborationScreen.tsx
│   └── index.ts
├── api/
│   ├── collabApi.ts
│   └── index.ts
├── lib/
│   ├── CRDTSync.ts           # ⭐ NEW - Automerge integration
│   └── index.ts
└── index.ts
```

---

### Onboarding Module (`modules/onboarding`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `screens/OnboardingScreen.js` | ❌ Delete | Wrapper | |
| `components/tamagui/OnboardingScreen.tsx` | `modules/onboarding/screens/OnboardingScreen.tsx` | 🔄 Move | Implementation |

**Module Complete Structure:**
```
modules/onboarding/
├── screens/
│   ├── OnboardingScreen.tsx
│   └── index.ts
└── index.ts
```

---

## Shared Components (`shared/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `shared/components/ErrorBoundary.js` | ❌ Delete | Old version | |
| `components/tamagui/ErrorBoundary.tsx` | `shared/components/ErrorBoundary.tsx` | 🔄 Move | Keep TS |
| `shared/components/TutorialOverlay.js` | ❌ Delete | Old version | |
| `components/tamagui/TutorialOverlay.tsx` | `shared/components/TutorialOverlay.tsx` | 🔄 Move | Keep TS |
| `shared/components/PremiumButton.js` | ❌ Delete | Old version | |
| `components/tamagui/PremiumButton.tsx` | `shared/components/PremiumButton.tsx` | 🔄 Move | Keep TS |
| `components/ThemeToggle.js` | ❌ Delete | Old version | |
| `components/tamagui/ThemeToggle.tsx` | `shared/components/ThemeToggle.tsx` | 🔄 Move | Keep TS |
| `components/tamagui/MobileFallback.tsx` | `shared/components/MobileFallback.tsx` | 🔄 Move | Platform fallback |
| `components/tamagui/Container.tsx` | `shared/components/layout/Container.tsx` | 🔄 Move | Layout |
| `components/tamagui/Card.tsx` | `shared/components/layout/Card.tsx` | 🔄 Move | Layout |
| `components/tamagui/Button.tsx` | `shared/components/ui/Button.tsx` | 🔄 Move | UI primitive |
| `components/tamagui/Input.tsx` | `shared/components/ui/Input.tsx` | 🔄 Move | UI primitive |
| `components/tamagui/Text.tsx` | `shared/components/ui/Text.tsx` | 🔄 Move | UI primitive |
| `shared/assets/*` | `shared/assets/*` | ✅ Keep | Static assets |
| `shared/hooks/*` | `shared/hooks/*` | ✅ Keep | Shared hooks |

**Shared Structure:**
```
shared/
├── components/
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Text.tsx
│   │   └── index.ts
│   ├── ErrorBoundary.tsx
│   ├── TutorialOverlay.tsx
│   ├── PremiumButton.tsx
│   ├── ThemeToggle.tsx
│   ├── MobileFallback.tsx
│   └── index.ts
├── assets/
├── hooks/
└── index.ts
```

---

## App Layer (`app/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `App.js` | `app/App.tsx` | 🔄 TS | Root component |
| N/A | `app/navigation/RootNavigator.tsx` | ⭐ NEW | Extract from App.js |
| N/A | `app/navigation/guards/*` | ⭐ NEW | Route guards |
| N/A | `app/providers/QueryProvider.tsx` | ⭐ NEW | React Query |
| N/A | `app/providers/ThemeProvider.tsx` | 🔄 Move | From context/ |
| N/A | `app/bootstrap/initApp.ts` | ⭐ NEW | Initialization |
| `core/config/features.config.js` | `app/config/featureFlags.ts` | 🔄 Move + TS | Feature flags |
| `config/constants.js` | `app/config/constants.ts` | 🔄 Move + TS | App constants |

**App Structure:**
```
app/
├── App.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   ├── guards/
│   └── routes/
├── providers/
│   ├── QueryProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── StoreProvider.tsx
│   └── index.ts
├── bootstrap/
│   ├── initApp.ts
│   └── index.ts
└── config/
    ├── featureFlags.ts
    ├── constants.ts
    └── index.ts
```

---

## Infrastructure Layer (`infrastructure/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `core/services/api/supabase.client.js` | `infrastructure/api/supabase/client.ts` | 🔄 Move + TS | Supabase setup |
| `core/services/api/sync.api.js` | `infrastructure/sync/syncApi.ts` | 🔄 Move + TS | Sync logic |
| `core/services/api/upload.api.js` | `infrastructure/storage/uploadApi.ts` | 🔄 Move + TS | File uploads |
| `core/services/offline/offlineManager.js` | `infrastructure/sync/offlineManager.ts` | 🔄 Move + TS | Offline handling |
| `services/performanceService.js` | `infrastructure/monitoring/performance.ts` | 🔄 Move + TS | Performance |
| `services/errorHandler.js` | `infrastructure/monitoring/errorHandler.ts` | 🔄 Move + TS | Error tracking |
| `core/utils/logger.js` | `infrastructure/monitoring/logger.ts` | 🔄 Move + TS | Logging |
| `core/utils/platform.js` | `infrastructure/platform/detection.ts` | 🔄 Move + TS | Platform utils |
| `core/config/env.config.js` | `infrastructure/config/env.ts` | 🔄 Move + TS | Environment |

**Infrastructure Structure:**
```
infrastructure/
├── api/
│   ├── supabase/
│   │   └── client.ts
│   └── index.ts
├── sync/
│   ├── syncApi.ts
│   ├── offlineManager.ts
│   └── index.ts
├── storage/
│   ├── uploadApi.ts
│   └── index.ts
├── monitoring/
│   ├── performance.ts
│   ├── errorHandler.ts
│   ├── logger.ts
│   └── index.ts
├── platform/
│   ├── detection.ts
│   ├── GLCapabilityGuard.ts
│   ├── ARCapabilityGuard.ts
│   └── index.ts
└── config/
    ├── env.ts
    └── index.ts
```

---

## State Management (`state/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `store/index.js` | `state/appStore.ts` | 🔄 Move + TS | Main Zustand store |
| `context/ThemeContext.js/.tsx` | `state/themeStore.ts` | 🔄 Migrate | Convert to Zustand |

**State Structure:**
```
state/
├── appStore.ts          # Global app state
├── themeStore.ts        # Theme state
└── index.ts
```

---

## Utils (`utils/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `utils/accessibility.js/.ts` | `utils/accessibility.ts` | ✅ Keep TS | Delete .js |
| `utils/helpers.js/.ts` | `utils/helpers.ts` | ✅ Keep TS | Delete .js |
| `utils/responsive.js/.ts` | `utils/responsive.ts` | ✅ Keep TS | Delete .js |
| `utils/socialMediaPresets.js` | `utils/socialMediaPresets.ts` | 🔄 TS | Convert |
| `utils/validation.js` | `utils/validation.ts` | 🔄 TS | Convert |
| `utils/viewCapture.js` | `utils/viewCapture.ts` | 🔄 TS | Convert |
| `core/utils/constants.js` | ❌ Delete | Duplicate of config/ | |
| `core/utils/performance.js` | → `infrastructure/` | See above | |
| `core/utils/logger.js` | → `infrastructure/` | See above | |
| `core/utils/platform.js` | → `infrastructure/` | See above | |

---

## Hooks (`hooks/`)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `hooks/useAnimation.js/.ts` | `hooks/useAnimation.ts` | ✅ Keep TS | Delete .js |
| `hooks/useGestureShortcuts.js/.ts` | `hooks/useGestureShortcuts.ts` | ✅ Keep TS | Delete .js |
| `hooks/useKeyboardShortcuts.js/.ts` | `hooks/useKeyboardShortcuts.ts` | ✅ Keep TS | Delete .js |

---

## Services (To Delete/Migrate)

| Current Location | New Location | Status | Notes |
|-----------------|--------------|--------|-------|
| `services/autoSaveService.js` | → `modules/design2D/lib/` | Moved | |
| `services/colorHistoryService.js` | → `modules/design2D/lib/` | Moved | |
| `services/exportService.js` | → `modules/design2D/api/` | Moved | |
| `services/marketplaceService.js` | ⭐ NEW MODULE | Decide | Marketplace feature? |
| `services/socialService.js` | → `modules/collaboration/api/` | Moved | |
| `services/themeService.js` | → `state/themeStore.ts` | Migrate | |
| `services/performanceService.js` | → `infrastructure/monitoring/` | Moved | |
| `services/errorHandler.js` | → `infrastructure/monitoring/` | Moved | |

---

## Summary Statistics

### Files to Move: **81 files**
### Files to Delete: **24 files** (wrappers + duplicates)
### Files to Create: **15 files** (new guards/loaders)
### Folders to Delete: **3 folders**
- `src/screens/` (after migration)
- `src/components/` (after migration)
- `src/features/` (restructure to `modules/`)

### Folders to Create: **14 modules**
- `modules/auth`
- `modules/home`
- `modules/design2D`
- `modules/design3D`
- `modules/ar`
- `modules/templates`
- `modules/measurements`
- `modules/ai`
- `modules/profile`
- `modules/trends`
- `modules/collaboration`
- `modules/onboarding`
- `infrastructure/`
- `app/`

---

**Status:** ✅ **Task 3 Complete - Migration mapping created**

**Next:** Task 4 - Identify dependencies and circular refs
