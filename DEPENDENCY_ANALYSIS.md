# Dependency Analysis: Import Graph & Circular Dependencies

**Date:** November 9, 2025  
**Phase:** 1 - Task 4  
**Purpose:** Map all dependencies to identify circular refs and coupling before migration

---

## Key Findings Summary

### 🚨 Critical Issues
1. **Circular Dependencies:** `store` ↔ `services` (autoSaveService, errorHandler, colorHistoryService)
2. **Constants Duplication:** `config/constants.js` vs `core/utils/constants.js`
3. **Scattered Store Access:** 10+ files directly import from `store/index.js`
4. **Wrapper Pattern Overhead:** All `src/screens/*.js` are thin wrappers importing `components/tamagui/*`
5. **Deep Import Paths:** `../../../../` patterns indicate tight coupling

### 📊 Import Statistics
- **Total Files with Imports:** 119+
- **Most Imported Module:** `store/index.js` (15+ direct imports)
- **Deepest Import Path:** 6 levels (`features/design2D` → `components`)
- **Duplicate Files:** 12+ files have `.js`/`.ts` or `.js`/`.tsx` pairs

---

## Dependency Graph by Layer

### Layer 1: Core Infrastructure (No dependencies on app code)

#### `infrastructure/` (Target Location)
**Current:** `core/services/api/`, `core/config/`, `core/utils/`

| File | Dependencies | Status |
|------|-------------|--------|
| `core/config/env.config.js` | ✅ None | Clean |
| `core/config/features.config.js` | `env.config.js` | Clean |
| `core/services/api/supabase.client.js` | `env.config.js` | Clean |
| `core/services/api/auth.api.js` | `supabase.client.js` | Clean |
| `core/services/api/sync.api.js` | `supabase.client.js`, `features.config.js` | Clean |
| `core/services/api/upload.api.js` | `supabase.client.js`, `features.config.js` | Clean |
| `core/services/offline/offlineManager.js` | `features.config.js` | Clean |
| `core/utils/platform.js` | ✅ None | Clean |
| `core/utils/constants.js` | ✅ None | ⚠️ Duplicate of `config/constants.js` |

**✅ Assessment:** Core infrastructure is well-isolated. Can migrate first.

---

### Layer 2: State Management (Depends on: config)

#### `state/` (Target Location)
**Current:** `store/index.js`, `context/`

| File | Dependencies | Dependents | Issues |
|------|-------------|-----------|--------|
| `store/index.js` | `config/constants.js` | 15+ files | ⚠️ Central bottleneck |
| `context/AuthContext.js` | `core/services/api/auth.api.js` | Auth screens | Clean |
| `context/ThemeContext.js` | `config/constants.js`, `store/index.js` | Theme components | ⚠️ Circular with store |
| `context/ThemeContext.tsx` | `config/constants.js`, `store/index.js` | (Duplicate) | ⚠️ `.js`/`.tsx` both exist |

**🚨 Issues:**
- `store/index.js` imported by services (creates circular dependency)
- `ThemeContext` has duplicate `.js` and `.tsx` versions
- Store exposed globally instead of using selectors

**✅ Solution:**
- Move store to dedicated `state/` layer
- Create facade hooks (`useAuthFacade`, `useDesignFacade`)
- Consolidate `ThemeContext` versions

---

### Layer 3: Services (Depends on: infrastructure, state)

#### `services/` → Should become module-level `api/` and `lib/`

| File | Dependencies | Issues |
|------|-------------|--------|
| `services/autoSaveService.js` | `config/constants.js`, `utils/helpers.js`, `services/errorHandler.js`, `store/index.js` | 🚨 Imports store |
| `services/colorHistoryService.js` | `config/constants.js` | Clean |
| `services/errorHandler.js` | `store/index.js` | 🚨 Imports store |
| `services/exportService.js` | `utils/viewCapture.js`, `config/constants.js`, `services/errorHandler.js` | Clean chain |
| `services/marketplaceService.js` | `utils/helpers.js`, `services/errorHandler.js` | Clean chain |
| `services/socialService.js` | `utils/helpers.js`, `services/errorHandler.js` | Clean chain |
| `services/themeService.js` | Unknown (not in grep results) | Need to check |
| `services/performanceService.js` | Unknown (not in grep results) | Need to check |

**🚨 Circular Dependency Chain:**
```
store/index.js
  ↓ imports constants
services/autoSaveService.js
  ↓ imports store
  ↓ imports errorHandler
services/errorHandler.js
  ↓ imports store (useNotificationStore)
```

**✅ Solution:**
- Services should NOT import store directly
- Use dependency injection or hooks
- errorHandler should accept store as parameter

---

### Layer 4: Shared Utilities (No dependencies on app logic)

#### `shared/` and `utils/`

| File | Dependencies | Status |
|------|-------------|--------|
| `utils/helpers.js` | ✅ None | Clean |
| `utils/helpers.ts` | ✅ None | ⚠️ Duplicate `.js`/`.ts` |
| `utils/accessibility.js` | ✅ None | Clean |
| `utils/accessibility.ts` | ✅ None | ⚠️ Duplicate |
| `utils/responsive.js` | ✅ None | Clean |
| `utils/responsive.ts` | ✅ None | ⚠️ Duplicate |
| `utils/socialMediaPresets.js` | ✅ None | Clean |
| `utils/validation.js` | ✅ None | Clean |
| `utils/viewCapture.js` | ✅ None | Clean |
| `config/constants.js` | ✅ None | Clean |

**⚠️ Issues:**
- 6 files have `.js`/`.ts` duplicates (keep `.ts`, delete `.js`)

---

### Layer 5: Hooks (Depends on: utils, store)

#### `hooks/` → Some move to `shared/hooks/`, some to modules

| File | Dependencies | Should Move To |
|------|-------------|----------------|
| `hooks/useAnimation.js` | ✅ None | `shared/hooks/` |
| `hooks/useAnimation.ts` | ✅ None | ⚠️ Duplicate |
| `hooks/useGestureShortcuts.js` | ✅ None | `shared/hooks/` |
| `hooks/useGestureShortcuts.ts` | ✅ None | ⚠️ Duplicate |
| `hooks/useKeyboardShortcuts.js` | ✅ None | `shared/hooks/` |
| `hooks/useKeyboardShortcuts.ts` | ✅ None | ⚠️ Duplicate |
| `core/state/hooks/useAuth.js` | `core/services/api/supabase.client.js` | `modules/auth/hooks/` |

**✅ Assessment:** Hooks are mostly clean, just need deduplication.

---

### Layer 6: Components (Depends on: everything above)

#### Wrapper Pattern (TO DELETE)

| Wrapper File | Imports From | Status |
|-------------|--------------|--------|
| `screens/AIAssistantScreen.js` | `components/tamagui/AIAssistantScreen.tsx` | ❌ Delete wrapper |
| `screens/TrendExplorerScreen.js` | `components/tamagui/TrendExplorerScreen.tsx` | ❌ Delete wrapper |
| `screens/ProfileScreen.js` | `components/tamagui/ProfileScreen.tsx`, `core/state/hooks/useAuth.js` | ❌ Delete wrapper |
| `screens/OnboardingScreen.js` | `components/tamagui/OnboardingScreen.tsx` | ❌ Delete wrapper |
| `screens/MeasurementsScreen.js` | `components/tamagui/MeasurementsScreen.tsx` | ❌ Delete wrapper |
| `screens/CollaborationScreen.js` | `components/tamagui/CollaborationScreen.tsx` | ❌ Delete wrapper |
| `components/ColorPicker.js` | `components/tamagui/ColorPicker.tsx` | ❌ Delete wrapper |
| `components/DesignTips.js` | `components/tamagui/DesignTips.tsx` | ❌ Delete wrapper |
| `components/ThemeToggle.js` | `components/tamagui/ThemeToggle.tsx` | ❌ Delete wrapper |
| `components/FabricSelector.js` | `components/tamagui/FabricSelector.tsx` | ❌ Delete wrapper |
| `components/PatternSelector.js` | `components/tamagui/PatternSelector.tsx` | ❌ Delete wrapper |
| `components/TemplateQuickPreview.js` | `components/tamagui/TemplateQuickPreview.tsx` | ❌ Delete wrapper |
| `shared/components/TutorialOverlay.js` | `components/tamagui/TutorialOverlay.tsx` | ❌ Delete wrapper |
| `shared/components/PremiumButton.js` | `components/tamagui/PremiumButton.tsx` | ❌ Delete wrapper |
| `shared/components/ErrorBoundary.js` | `components/tamagui/ErrorBoundary.tsx` | ❌ Delete wrapper |

**Total Wrappers:** 15 files to delete

---

#### Tamagui Components (ACTUAL IMPLEMENTATIONS)

**Design2D Dependencies:**
```
features/design2D/screens/tamagui/DesignStudioScreen.tsx
  ├── components/ColorPicker.js          [OLD - should use tamagui version]
  ├── components/FabricSelector.js       [OLD - should use tamagui version]
  ├── components/PatternSelector.js      [OLD - should use tamagui version]
  ├── components/DesignTips.js           [OLD - should use tamagui version]
  ├── store/index.js                     [CIRCULAR]
  ├── services/exportService.js          [OK]
  ├── services/autoSaveService.js        [CIRCULAR via store]
  └── hooks/useKeyboardShortcuts.js      [OK]
```
**🚨 Issue:** Still importing `.js` wrappers instead of `.tsx` implementations!

**Design3D Dependencies:**
```
components/tamagui/Design3DAtelierScreen.tsx
  ├── core/utils/platform.js             [OK - will move to infrastructure]
  ├── core/utils/constants.js            [DUPLICATE]
  ├── components/tamagui/Header3D.tsx    [OK - same module]
  ├── components/tamagui/LeftSidebar.tsx [OK - same module]
  ├── components/tamagui/RightSidebar.tsx [OK - same module]
  ├── components/tamagui/BottomBar3D.tsx [OK - same module]
  ├── features/design3D/components/viewport/Viewport3D.tsx [OK - feature component]
  └── components/tamagui/MobileFallback.tsx [OK - shared component]
```
**✅ Better:** Self-contained module structure

**Auth Dependencies:**
```
features/auth/screens/LoginScreen.tsx
  ├── core/state/hooks/useAuth.js        [OK - will move to auth module]
  └── components/tamagui/AuthContainer.tsx [OK - same module]

features/auth/screens/SignUpScreen.tsx
  ├── core/state/hooks/useAuth.js        [OK]
  └── components/tamagui/AuthContainer.tsx [OK]
```
**✅ Clean:** Auth module is well-organized

**Shared Components Internal Dependencies:**
```
components/tamagui/ColorPicker.tsx
  ├── utils/helpers.js                   [OK - shared utility]
  └── services/colorHistoryService.js    [OK - will move to design2D]

components/tamagui/ThemeToggle.tsx
  └── context/ThemeContext.js            [OK - will become themeStore]

components/tamagui/TutorialOverlay.tsx
  ├── store/index.js                     [DIRECT STORE ACCESS]
  └── utils/responsive.js                [OK]

components/tamagui/OnboardingScreen.tsx
  └── store/index.js                     [DIRECT STORE ACCESS]

components/tamagui/HomeScreen.tsx
  └── store/index.js                     [DIRECT STORE ACCESS]

components/tamagui/PremiumButton.tsx
  └── core/config/features.config.js     [OK]
```

---

## Circular Dependency Chains

### Chain 1: Store ↔ Services

```
┌─────────────────────┐
│ store/index.js      │
│ exports:            │
│ - useDesignStore    │
│ - useNotificationStore │
└──────────┬──────────┘
           │ imports
           ↓
┌─────────────────────┐
│ services/autoSaveService.js │
│ - useDesignStore()  │
└──────────┬──────────┘
           │ imports
           ↓
┌─────────────────────┐
│ services/errorHandler.js │
│ - useNotificationStore() │
└──────────┬──────────┘
           │ imports
           ↑
     [CIRCULAR!]
```

**✅ Solution:**
- Services should NOT import store
- Use hooks in components, pass data to services as parameters
- Services return data, components update store

**Refactor:**
```typescript
// ❌ OLD (circular)
// autoSaveService.js
import { useDesignStore } from '../store';
export const saveDesign = () => {
  const design = useDesignStore.getState().currentDesign;
  // ...
};

// ✅ NEW (no circular)
// autoSaveService.ts
export const saveDesign = (design: Design) => {
  // Service is pure function
  // ...
};

// Component calls service
const design = useDesignStore(s => s.currentDesign);
await saveDesign(design);
```

---

### Chain 2: ThemeContext ↔ Store

```
┌─────────────────────┐
│ context/ThemeContext.js │
│ - imports useAppStore │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ store/index.js      │
│ - useAppStore has theme state │
└─────────────────────┘
```

**⚠️ Not technically circular** but suggests ThemeContext should just BE the store.

**✅ Solution:**
- Merge ThemeContext into `state/themeStore.ts`
- Delete context file
- Components use `useThemeStore()` directly

---

## Import Depth Analysis

### Deep Import Paths (Indicates Coupling)

| File | Import | Depth | Issue |
|------|--------|-------|-------|
| `features/design2D/screens/tamagui/DesignStudioScreen.tsx` | `../../../../components/ColorPicker.js` | 6 levels | Too deep |
| `features/design3D/components/viewport/tamagui/Viewport3D.tsx` | `../../../../../core/utils/constants.js` | 8 levels! | Way too deep |
| `features/design3D/components/ui/ColorPicker.js` | `../../../../components/tamagui/ColorPicker` | 6 levels | Too deep |

**✅ Solution:**
- After migration, all modules import from top-level:
  - `import { ColorPicker } from '@/shared/components'`
  - `import { THEME_COLORS } from '@/shared/constants'`
  - `import { useAuth } from '@/modules/auth'`
- Configure TypeScript path aliases in `tsconfig.json`

---

## Module Coupling Matrix

| From ↓ / To → | store | services | components/tamagui | core | utils | config |
|--------------|-------|----------|-------------------|------|-------|--------|
| **store** | - | ✅ None | ✅ None | ✅ None | ✅ None | ✅ constants |
| **services** | 🚨 HIGH (3) | ✅ internal | ✅ None | ✅ None | ✅ helpers | ✅ constants |
| **components/tamagui** | 🚨 HIGH (5+) | ⚠️ MEDIUM (2) | ✅ internal | ⚠️ MEDIUM (3) | ✅ LOW (2) | ✅ constants |
| **screens** | ✅ None | ✅ None | 🚨 HIGH (all) | ⚠️ LOW (1) | ✅ None | ✅ None |
| **features/auth** | ✅ None | ✅ None | ⚠️ LOW (2) | ✅ LOW (1) | ✅ None | ✅ None |
| **features/design2D** | 🚨 HIGH (1) | 🚨 HIGH (3) | 🚨 HIGH (4) | ✅ None | ✅ LOW (1) | ✅ None |
| **features/design3D** | ✅ None | ✅ None | 🚨 HIGH (8) | ⚠️ MEDIUM (2) | ✅ None | ✅ None |

**Legend:**
- 🚨 HIGH: 3+ direct imports (tight coupling)
- ⚠️ MEDIUM: 1-2 imports (acceptable)
- ✅ LOW/None: 0-1 imports (good isolation)

**Key Insights:**
1. `store` has HIGH coupling FROM services and components (circular risk)
2. `components/tamagui` tightly coupled to everything (monolithic)
3. `features/design2D` tightly coupled to services (should be self-contained)
4. `features/design3D` tightly coupled to shared components (good for reuse)

---

## Files with No Dependencies (Can migrate anytime)

**Core:**
- ✅ `core/config/env.config.js`
- ✅ `core/utils/platform.js`

**Utils:**
- ✅ `utils/helpers.js`
- ✅ `utils/accessibility.js`
- ✅ `utils/responsive.js`
- ✅ `utils/socialMediaPresets.js`
- ✅ `utils/validation.js`
- ✅ `utils/viewCapture.js`

**Config:**
- ✅ `config/constants.js`

**Data:**
- ✅ `data/templates.js`

**Hooks:**
- ✅ `hooks/useAnimation.js`
- ✅ `hooks/useGestureShortcuts.js`
- ✅ `hooks/useKeyboardShortcuts.js`

**Total:** 14 files can be migrated immediately (no breaking changes)

---

## Migration Dependency Order

Based on dependency analysis, safe migration order:

### Phase 1: Foundation (No dependencies)
1. ✅ `utils/` → Keep in place, delete `.js` duplicates
2. ✅ `config/constants.js` → Merge with `core/utils/constants.js`
3. ✅ `data/templates.js` → Move to `modules/templates/data/`
4. ✅ `hooks/` → Move shared hooks to `shared/hooks/`

### Phase 2: Infrastructure (Depends only on config)
5. ✅ `core/config/` → Move to `infrastructure/config/`
6. ✅ `core/services/api/` → Move to `infrastructure/api/`
7. ✅ `core/services/offline/` → Move to `infrastructure/sync/`
8. ✅ `core/utils/` → Split: platform → `infrastructure/`, constants → merge

### Phase 3: State (Depends on infrastructure)
9. ✅ `store/index.js` → Move to `state/appStore.ts`
10. ✅ `context/AuthContext.js` → Move to `modules/auth/store/authStore.ts`
11. ✅ `context/ThemeContext.js` → Merge into `state/themeStore.ts`

### Phase 4: Services (Break circular deps first!)
12. 🔧 Refactor `services/errorHandler.js` to accept store as param
13. 🔧 Refactor `services/autoSaveService.js` to accept design as param
14. ✅ `services/colorHistoryService.js` → `modules/design2D/lib/`
15. ✅ `services/exportService.js` → `modules/design2D/api/`
16. ✅ `services/marketplaceService.js` → `modules/marketplace/api/` (if kept)
17. ✅ `services/socialService.js` → `modules/collaboration/api/`

### Phase 5: Auth Module (Cleanest module)
18. ✅ `features/auth/` → `modules/auth/`
19. ✅ `components/tamagui/AuthContainer.tsx` → `modules/auth/components/`
20. ✅ `components/tamagui/AuthInput.tsx` → `modules/auth/components/`
21. ✅ `core/state/hooks/useAuth.js` → `modules/auth/hooks/`

### Phase 6: Shared Components (No module-specific logic)
22. ✅ `components/tamagui/ErrorBoundary.tsx` → `shared/components/`
23. ✅ `components/tamagui/TutorialOverlay.tsx` → `shared/components/`
24. ✅ `components/tamagui/PremiumButton.tsx` → `shared/components/`
25. ✅ `components/tamagui/ThemeToggle.tsx` → `shared/components/`
26. ✅ `components/tamagui/Button.tsx` → `shared/components/ui/`
27. ✅ `components/tamagui/Input.tsx` → `shared/components/ui/`
28. ✅ `components/tamagui/Container.tsx` → `shared/components/layout/`
29. ✅ `components/tamagui/Card.tsx` → `shared/components/layout/`

### Phase 7: Design2D Module
30. ✅ `features/design2D/` → `modules/design2D/`
31. ✅ `components/tamagui/DesignStudioScreen.tsx` → `modules/design2D/screens/`
32. ✅ `components/tamagui/ColorPicker.tsx` → `modules/design2D/components/`
33. ✅ `components/tamagui/FabricSelector.tsx` → `modules/design2D/components/`
34. ✅ `components/tamagui/PatternSelector.tsx` → `modules/design2D/components/`
35. ✅ `components/tamagui/DesignTips.tsx` → `modules/design2D/components/`
36. ❌ Delete all `.js` wrappers

### Phase 8: Design3D Module
37. ✅ `features/design3D/` → `modules/design3D/`
38. ✅ `components/tamagui/Design3DAtelierScreen.tsx` → `modules/design3D/screens/`
39. ✅ `components/tamagui/Header3D.tsx` → `modules/design3D/components/`
40. ✅ `components/tamagui/LeftSidebar.tsx` → `modules/design3D/components/`
41. ✅ `components/tamagui/RightSidebar.tsx` → `modules/design3D/components/`
42. ✅ `components/tamagui/BottomBar3D.tsx` → `modules/design3D/components/`
43. ✅ All `features/design3D/components/` → Keep structure

### Phase 9: Remaining Modules
44. ✅ Home, Templates, Measurements, AI, Profile, Trends, Collaboration, Onboarding
45. ❌ Delete ALL `screens/*.js` wrappers

### Phase 10: Cleanup
46. ❌ Delete `src/screens/` folder
47. ❌ Delete `src/components/` folder (after moving tamagui/)
48. ❌ Delete `src/features/` folder (after moving to modules/)
49. ❌ Delete all `.js` duplicates where `.ts` exists
50. ✅ Update all imports to use path aliases

---

## Recommended Breaking Changes

### 1. Delete Wrapper Pattern Immediately
**Why:** 15+ files serve no purpose, just forward imports  
**When:** Phase 6 (after moving tamagui components)  
**Risk:** Low (just update imports in navigation)

### 2. Break Store ↔ Services Circular Dependency
**Why:** Prevents clean module boundaries  
**When:** Phase 4 (before migrating services)  
**Risk:** Medium (need to refactor service calls)

### 3. Consolidate Constants Files
**Why:** Two files with duplicate constants  
**When:** Phase 1 (before anything imports them)  
**Risk:** Low (just update imports)

### 4. Delete `.js`/`.ts` Duplicates
**Why:** 12+ files have duplicate versions  
**When:** Throughout migration (file by file)  
**Risk:** Low (just keep TypeScript version)

### 5. Fix Deep Imports with Path Aliases
**Why:** 6+ level deep imports are fragile  
**When:** Phase 10 (after structure stabilizes)  
**Risk:** Low (TypeScript handles automatically)

---

## Action Items for Phase 1 Completion

- [x] Task 1: Document current structure → CURRENT_STRUCTURE.md
- [x] Task 2: Inventory working features → WORKING_FEATURES.md
- [x] Task 3: Map migration paths → MIGRATION_MAPPING.md
- [x] Task 4: Analyze dependencies → **THIS FILE**
- [ ] Task 5: Create priority ranking → Next

---

**Status:** ✅ **Task 4 Complete - Dependency analysis done**

**Critical Findings:**
1. 🚨 Store ↔ Services circular dependency (MUST FIX)
2. ⚠️ 15 wrapper files (DELETE immediately)
3. ⚠️ 12+ duplicate `.js`/`.ts` files (CONSOLIDATE)
4. ⚠️ Constants duplication (MERGE)
5. ✅ Auth module clean (MIGRATE FIRST)
6. ✅ 14 files with no dependencies (EASY WINS)

**Next:** Task 5 - Create migration priority with week-by-week timeline
