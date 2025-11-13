# Phase 1 Migration Priority & Execution Plan

**Date:** November 9, 2025  
**Phase:** 1 - Task 5 (FINAL)  
**Purpose:** Prioritize all migration work with week-by-week timeline to MVP

---

## Executive Summary

**Total Migration Scope:**
- **81 files to move**
- **24 files to delete** (wrappers + duplicates)
- **15 new files to create** (guards, loaders, APIs)
- **4 critical bugs to fix** (circular deps, constants dupe)

**Timeline to MVP:** **6 weeks** (based on newlookimplement.md Phase 1-6)

**Risk Level:** **MEDIUM**
- 🚨 HIGH RISK: Circular dependency refactor (store ↔ services)
- ⚠️ MEDIUM RISK: Breaking wrapper pattern (navigation updates)
- ✅ LOW RISK: Moving files with no dependents

---

## Priority Classification System

### 🔴 CRITICAL (Must Fix - Week 1)
**Blockers that prevent clean migration**

1. **Break Circular Dependencies** (store ↔ services)
   - `services/autoSaveService.js` imports `store/index.js`
   - `services/errorHandler.js` imports `store/index.js`
   - **Impact:** Prevents modular architecture
   - **Effort:** 4-6 hours
   - **Files:** 3 files

2. **Merge Duplicate Constants**
   - `config/constants.js` vs `core/utils/constants.js`
   - **Impact:** Import confusion, maintenance overhead
   - **Effort:** 2 hours
   - **Files:** 2 files → 1 file

3. **Consolidate `.js`/`.ts` Duplicates**
   - `utils/helpers.js` + `.ts`
   - `utils/accessibility.js` + `.ts`
   - `utils/responsive.js` + `.ts`
   - `hooks/useAnimation.js` + `.ts`
   - `hooks/useGestureShortcuts.js` + `.ts`
   - `hooks/useKeyboardShortcuts.js` + `.ts`
   - `context/ThemeContext.js` + `.tsx`
   - **Impact:** Import confusion
   - **Effort:** 3 hours
   - **Files:** 12 files → 6 files

**Week 1 Total:** 3 tasks, ~10 hours, 17 files affected

---

### 🟡 HIGH PRIORITY (Core Infrastructure - Week 2-3)
**Foundation that other modules depend on**

4. **Setup Infrastructure Layer**
   - Move `core/config/` → `infrastructure/config/`
   - Move `core/services/api/` → `infrastructure/api/`
   - Move `core/services/offline/` → `infrastructure/sync/`
   - Move `core/utils/platform.js` → `infrastructure/platform/`
   - **Impact:** Enables all modules to use centralized services
   - **Effort:** 8-10 hours
   - **Files:** 12 files

5. **Create State Layer**
   - Move `store/index.js` → `state/appStore.ts`
   - Merge `context/ThemeContext` → `state/themeStore.ts`
   - Create facade hooks (`useAuthFacade`, `useDesignFacade`)
   - **Impact:** Clean state management, no circular deps
   - **Effort:** 6-8 hours
   - **Files:** 3 files

6. **Setup TypeScript Path Aliases**
   - Configure `tsconfig.json` with `@/` aliases
   - `@/shared`, `@/modules`, `@/infrastructure`, `@/state`
   - **Impact:** No more `../../../../` imports
   - **Effort:** 2 hours
   - **Files:** 1 file (tsconfig.json)

7. **Create Platform Capability Guards** (Per newlookimplement.md Phase 2)
   - `platform/guards/GLCapabilityGuard.ts`
   - `platform/guards/ARCapabilityGuard.ts`
   - `platform/loaders/ThreeLoader.ts`
   - `platform/loaders/ARLoader.ts`
   - **Impact:** Prevents 3D/AR bundle crashes
   - **Effort:** 10-12 hours
   - **Files:** 4 NEW files

**Week 2-3 Total:** 4 tasks, ~30 hours, 20 files

---

### 🟢 MEDIUM PRIORITY (Feature Modules - Week 3-4)

8. **Migrate Auth Module** (Cleanest, no circular deps)
   - Move `features/auth/` → `modules/auth/`
   - Move `context/AuthContext.js` → `modules/auth/store/authStore.ts`
   - Move `core/state/hooks/useAuth.js` → `modules/auth/hooks/`
   - Move `components/tamagui/AuthContainer.tsx` → `modules/auth/components/`
   - Move `components/tamagui/AuthInput.tsx` → `modules/auth/components/`
   - Move `core/services/api/auth.api.js` → `modules/auth/api/authApi.ts`
   - **Impact:** Proves module pattern works
   - **Effort:** 6-8 hours
   - **Files:** 9 files

9. **Create Shared Components Library**
   - Move `components/tamagui/ErrorBoundary.tsx` → `shared/components/`
   - Move `components/tamagui/TutorialOverlay.tsx` → `shared/components/`
   - Move `components/tamagui/PremiumButton.tsx` → `shared/components/`
   - Move `components/tamagui/ThemeToggle.tsx` → `shared/components/`
   - Move `components/tamagui/Button.tsx` → `shared/components/ui/`
   - Move `components/tamagui/Input.tsx` → `shared/components/ui/`
   - Move `components/tamagui/Text.tsx` → `shared/components/ui/`
   - Move `components/tamagui/Container.tsx` → `shared/components/layout/`
   - Move `components/tamagui/Card.tsx` → `shared/components/layout/`
   - **Impact:** Reusable UI library for all modules
   - **Effort:** 4-6 hours
   - **Files:** 9 files

10. **Migrate Home Module**
    - Move `features/home/` → `modules/home/`
    - Move `components/tamagui/HomeScreen.tsx` → `modules/home/screens/`
    - Delete `features/home/screens/HomeScreen.js` wrapper
    - **Impact:** Simple module, quick win
    - **Effort:** 2-3 hours
    - **Files:** 3 files

11. **Migrate Templates Module**
    - Move `data/templates.js` → `modules/templates/data/templates.ts`
    - Move `components/tamagui/TemplateLibraryScreen.tsx` → `modules/templates/screens/`
    - Move `components/tamagui/TemplateQuickPreview.tsx` → `modules/templates/components/`
    - Delete `screens/TemplateLibraryScreen.js` wrapper
    - Create `modules/templates/api/templateApi.ts` (NEW)
    - **Impact:** Self-contained module with data
    - **Effort:** 4-5 hours
    - **Files:** 5 files

**Week 3-4 Total:** 4 tasks, ~20 hours, 26 files

---

### 🔵 LOWER PRIORITY (Complex Modules - Week 4-5)

12. **Migrate Design2D Module**
    - Move `features/design2D/` → `modules/design2D/`
    - Move `components/tamagui/DesignStudioScreen.tsx` → `modules/design2D/screens/`
    - Move `components/tamagui/ColorPicker.tsx` → `modules/design2D/components/`
    - Move `components/tamagui/FabricSelector.tsx` → `modules/design2D/components/`
    - Move `components/tamagui/PatternSelector.tsx` → `modules/design2D/components/`
    - Move `components/tamagui/DesignTips.tsx` → `modules/design2D/components/`
    - Move `services/autoSaveService.js` → `modules/design2D/lib/autoSave.ts`
    - Move `services/colorHistoryService.js` → `modules/design2D/lib/colorHistory.ts`
    - Move `services/exportService.js` → `modules/design2D/api/exportApi.ts`
    - Delete 5 `.js` wrappers
    - **Impact:** Most complex module, auto-save critical
    - **Effort:** 12-15 hours
    - **Files:** 14 files

13. **Migrate Design3D Module**
    - Move `features/design3D/` → `modules/design3D/`
    - Move `components/tamagui/Design3DAtelierScreen.tsx` → `modules/design3D/screens/`
    - Move `components/tamagui/Header3D.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/LeftSidebar.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/RightSidebar.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/BottomBar3D.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/LayerPanel.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/PropertiesPanel.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/PropertySlider.tsx` → `modules/design3D/components/`
    - Move `components/tamagui/Toolbar.tsx` → `modules/design3D/components/`
    - Keep all `features/design3D/components/` substructure
    - Integrate `platform/loaders/ThreeLoader.ts`
    - Delete `features/design3D/screens/Design3DAtelierScreen.js` wrapper
    - **Impact:** Lazy loading, capability guards critical
    - **Effort:** 12-15 hours
    - **Files:** 20+ files

14. **Migrate AR Module**
    - Move `features/ar/` → `modules/ar/`
    - Convert `features/ar/screens/ARViewScreen.js` → `.tsx`
    - Integrate `platform/loaders/ARLoader.ts`
    - Create `modules/ar/lib/ARCapabilityGuard.ts`
    - **Impact:** Platform-specific, high risk
    - **Effort:** 8-10 hours
    - **Files:** 4 files

**Week 4-5 Total:** 3 tasks, ~40 hours, 38+ files

---

### ⚪ OPTIONAL (Quick Wins - Week 5-6)

15. **Migrate Remaining Simple Modules**
    - Measurements → `modules/measurements/`
    - AI Assistant → `modules/ai/`
    - Profile → `modules/profile/`
    - Trends → `modules/trends/`
    - Collaboration → `modules/collaboration/`
    - Onboarding → `modules/onboarding/`
    - **Impact:** Complete module structure
    - **Effort:** 10-12 hours
    - **Files:** 12 files

16. **Delete All Wrapper Files** (After all migrations)
    - Delete `screens/*.js` (7 files)
    - Delete `components/*.js` (8 files)
    - Delete `shared/components/*.js` (3 files)
    - Delete `features/*/components/ui/*.js` (4 files)
    - Delete `features/*/components/layout/*.js` (2 files)
    - **Impact:** Clean codebase
    - **Effort:** 2 hours
    - **Files:** 24 files

17. **Cleanup Empty Folders**
    - Delete `src/screens/`
    - Delete `src/components/`
    - Delete `src/features/`
    - Delete `src/services/`
    - **Impact:** Clean structure
    - **Effort:** 1 hour
    - **Folders:** 4 folders

**Week 5-6 Total:** 3 tasks, ~15 hours, 36 files + 4 folders

---

## Week-by-Week Execution Plan

### **Week 1: Foundation & Critical Fixes** (Nov 9-15)
**Goal:** Fix blockers, no new features

| Day | Task | Files | Effort |
|-----|------|-------|--------|
| Mon | Break circular dependency (store ↔ services) | 3 | 5h |
| Tue | Merge duplicate constants | 2 | 2h |
| Wed | Consolidate `.js`/`.ts` duplicates | 12→6 | 3h |
| Thu | Testing & validation | - | 4h |
| Fri | Buffer / documentation | - | 2h |

**Deliverables:**
- ✅ No circular dependencies
- ✅ Single source of truth for constants
- ✅ All TypeScript, no `.js` duplicates
- ✅ PHASE1_FOUNDATION_COMPLETE.md

**Risk Mitigation:**
- Keep old files until tests pass
- Use feature flag to toggle refactored services
- Monitor error rates

---

### **Week 2-3: Infrastructure & Platform Guards** (Nov 16-29)
**Goal:** Build core infrastructure (per newlookimplement.md Phase 1-2)

| Task | Files | Effort | Priority |
|------|-------|--------|----------|
| Setup infrastructure layer | 12 | 10h | 🟡 HIGH |
| Create state layer | 3 | 8h | 🟡 HIGH |
| TypeScript path aliases | 1 | 2h | 🟡 HIGH |
| Platform capability guards | 4 | 12h | 🟡 HIGH |
| Testing infrastructure | - | 8h | 🟡 HIGH |

**Deliverables:**
- ✅ `infrastructure/` layer operational
- ✅ `state/` with clean stores
- ✅ `@/` path aliases working
- ✅ GL/AR capability guards tested
- ✅ PHASE2_INFRASTRUCTURE_COMPLETE.md

**Risk Mitigation:**
- Test on physical iOS/Android devices
- Verify bundle sizes (main < 5MB)
- Check Three.js NOT in main bundle

---

### **Week 3-4: Core Feature Modules** (Nov 30 - Dec 13)
**Goal:** Prove module pattern with Auth, Home, Templates

| Module | Files | Effort | Dependencies |
|--------|-------|--------|--------------|
| Auth | 9 | 8h | Infrastructure ready |
| Shared Components | 9 | 6h | None |
| Home | 3 | 3h | Shared components |
| Templates | 5 | 5h | Shared components |
| Testing | - | 8h | All above |

**Deliverables:**
- ✅ `modules/auth/` complete with tests
- ✅ `shared/components/` library
- ✅ `modules/home/` + `modules/templates/`
- ✅ 4 modules working end-to-end
- ✅ PHASE3_MODULES_COMPLETE.md

**Risk Mitigation:**
- Auth is most critical - test thoroughly
- Keep old navigation as fallback
- A/B test module vs legacy

---

### **Week 4-5: Complex Modules (Design2D/3D, AR)** (Dec 14-27)
**Goal:** Migrate design engines with lazy loading

| Module | Files | Effort | Risk |
|--------|-------|--------|------|
| Design2D | 14 | 15h | 🚨 HIGH (auto-save) |
| Design3D | 20+ | 15h | 🚨 HIGH (Three.js) |
| AR | 4 | 10h | 🚨 HIGH (platform) |
| Integration testing | - | 10h | 🚨 HIGH |

**Deliverables:**
- ✅ `modules/design2D/` with auto-save working
- ✅ `modules/design3D/` lazy-loaded
- ✅ `modules/ar/` with capability checks
- ✅ No design data loss
- ✅ PHASE4_DESIGN_COMPLETE.md

**Risk Mitigation:**
- Test auto-save crash recovery
- Verify 3D lazy loading on low-end devices
- Check AR only loads on capable devices
- Monitor memory usage

---

### **Week 5-6: Cleanup & Polish** (Dec 28 - Jan 10)
**Goal:** Complete remaining modules, delete legacy

| Task | Files | Effort | Priority |
|------|-------|--------|----------|
| Migrate 6 simple modules | 12 | 12h | ⚪ OPTIONAL |
| Delete all wrappers | 24 | 2h | ⚪ OPTIONAL |
| Delete empty folders | 4 | 1h | ⚪ OPTIONAL |
| Update documentation | - | 5h | 🟡 HIGH |
| Final testing | - | 10h | 🟡 HIGH |

**Deliverables:**
- ✅ All modules migrated
- ✅ No legacy wrappers
- ✅ Clean folder structure
- ✅ Updated README.md
- ✅ PHASE1_MIGRATION_COMPLETE.md

**Success Criteria:**
- ✅ All tests passing
- ✅ No circular dependencies
- ✅ Bundle size < 5MB
- ✅ App loads < 3s
- ✅ No data loss bugs

---

## Risk Assessment Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Circular dep refactor breaks app** | Medium | High | Feature flag, keep old code, gradual rollout |
| **3D/AR bundle crashes** | Medium | High | Capability guards, lazy loading, device testing |
| **Auto-save data loss** | Low | Critical | Transaction log, extensive testing, backup old code |
| **Navigation breaks after wrapper deletion** | Medium | Medium | Update navigation first, test all routes |
| **Deep link regression** | Low | Medium | Legacy route map, CI tests (per newlookimplement.md) |
| **Performance degradation** | Low | Medium | Bundle analysis, profiling, performance tests |
| **Type errors after migration** | High | Low | TypeScript strict mode, gradual migration |

---

## Success Metrics

### Technical Metrics
- [ ] **Zero circular dependencies** (analyzed via madge)
- [ ] **Bundle size < 5MB** (main bundle)
- [ ] **App load time < 3s** (on mid-range device)
- [ ] **Test coverage > 80%** (critical paths)
- [ ] **Type safety 100%** (no `any` types)
- [ ] **Zero wrapper files** (all deleted)
- [ ] **Clean imports** (all use `@/` aliases)

### Production Safety (Per newlookimplement.md)
- [ ] **3D/AR Bundle Crash** → PROTECTED (capability guards)
- [ ] **Offline Design Loss** → PROTECTED (transaction log - Phase 3)
- [ ] **Privilege Escalation** → PROTECTED (permission system - Phase 4)
- [ ] **Locale Sync Issues** → PROTECTED (canonical format - Phase 5)
- [ ] **Deep Link Regression** → PROTECTED (legacy map - Phase 4)

### Business Metrics
- [ ] **Zero data loss incidents**
- [ ] **< 1% crash rate**
- [ ] **App store rating maintained**
- [ ] **Development velocity increased 20%**

---

## Rollback Plan

### If Critical Bug Detected

**Immediate (< 1 hour):**
1. Disable feature flag → revert to old code
2. Alert team via Slack
3. Roll back last deployment

**Short-term (< 24 hours):**
1. Identify root cause
2. Fix in isolated branch
3. Test fix thoroughly
4. Re-enable feature flag at 10%

**Long-term (< 1 week):**
1. Post-mortem analysis
2. Add missing tests
3. Gradual rollout: 10% → 50% → 100%
4. Monitor for 7 days before declaring success

### Data Recovery
- Transaction log keeps last 30 days
- Backup database before major migrations
- Supabase has point-in-time recovery

---

## Phase 1 Definition of Done

**Documentation Complete:**
- [x] CURRENT_STRUCTURE.md
- [x] WORKING_FEATURES.md
- [x] MIGRATION_MAPPING.md
- [x] DEPENDENCY_ANALYSIS.md
- [x] MIGRATION_PRIORITY.md (this file)

**Code Ready for Phase 2:**
- [ ] All circular dependencies documented
- [ ] Migration order established
- [ ] Risk assessment complete
- [ ] Team reviewed and approved plan

**Next Phase:** Phase 2 - Infrastructure & Platform Guards (Week 2-3)

---

## Quick Reference: File Priority

### 🔴 CRITICAL (Fix First)
- `services/autoSaveService.js` (circular dep)
- `services/errorHandler.js` (circular dep)
- `config/constants.js` + `core/utils/constants.js` (merge)
- 12 `.js`/`.ts` duplicates (consolidate)

### 🟡 HIGH (Week 2-3)
- `core/services/api/*` (12 files → infrastructure)
- `store/index.js` (→ state layer)
- Platform guards (4 NEW files)

### 🟢 MEDIUM (Week 3-4)
- `features/auth/*` (9 files → modules/auth)
- `components/tamagui/*` shared (9 files → shared/components)
- `features/home/*` (3 files → modules/home)

### 🔵 LOWER (Week 4-5)
- `features/design2D/*` (14 files)
- `features/design3D/*` (20+ files)
- `features/ar/*` (4 files)

### ⚪ OPTIONAL (Week 5-6)
- 6 simple modules (12 files)
- Delete wrappers (24 files)
- Cleanup folders (4 folders)

---

## Alignment with newlookimplement.md

| newlookimplement.md Phase | This Plan | Timeline | Match |
|--------------------------|-----------|----------|-------|
| **Phase 1:** Foundation & Safety Infrastructure | Week 1: Critical Fixes | Week 1 | ✅ Aligned |
| **Phase 2:** Platform Capability Guards | Week 2-3: Infrastructure | Week 2-3 | ✅ Aligned |
| **Phase 3:** Offline-First Sync Engine | NOT in Phase 1 | Future | ✅ Deferred |
| **Phase 4:** Route Guards & Deep Link Safety | NOT in Phase 1 | Future | ✅ Deferred |
| **Phase 5:** Locale-Safe Data Layer | NOT in Phase 1 | Future | ✅ Deferred |
| **Phase 6:** Tamagui Design System | Week 3-4: Shared Components | Week 3-4 | ✅ Aligned |

**Note:** This Phase 1 focuses on **code structure migration only**. The production safety features (offline sync, route guards, locale safety) are in newlookimplement.md Phases 3-5 and will be tackled AFTER structure migration is complete.

---

**Status:** ✅ **Phase 1 Documentation COMPLETE**

**Next Steps:**
1. Review all 5 documents with team
2. Get approval for migration plan
3. Start Week 1: Critical Fixes
4. Create feature flags for gradual rollout
5. Set up monitoring for rollback safety

**Estimated Total Effort:** ~140 hours (6 weeks, 1 developer)

**MVP Ready:** End of Week 6 (Jan 10, 2026)
