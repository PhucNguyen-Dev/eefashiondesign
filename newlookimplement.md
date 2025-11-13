# EE Fashion Design — Production-Ready Implementation Plan

**Last Updated:** 2025-11-09  
**Status:** Comprehensive Blueprint with Production Safety Guarantees

---

## Table of Contents
1. [Vision & Guiding Principles](#vision--guiding-principles)
2. [Complete Folder Structure](#complete-folder-structure)
3. [Production Safety Scenarios](#production-safety-scenarios)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Backend Integration Patterns](#backend-integration-patterns)
6. [Database Schema & Migrations](#database-schema--migrations)
7. [Safety Mechanisms & Protocols](#safety-mechanisms--protocols)
8. [Success Criteria](#success-criteria)
9. [Open Questions](#open-questions)

---

## Vision & Guiding Principles

### Core Objectives
- **Production-First**: Build with offline-first sync, crash recovery, and graceful degradation from day one
- **Type-Safe Contracts**: Enforce API contracts, database schemas, and permission models at compile time
- **Modular Architecture**: Feature slices with clear boundaries, isolated services, and testable components
- **Platform Safety**: Lazy-load heavy modules (3D/AR), guard against capability mismatches, protect bundle sizes
- **Data Integrity**: Transaction logs, canonical formats, conflict resolution, and rollback capabilities

### Key Improvements vs. Legacy Structure
- ✅ **No More Design Loss**: Append-only transaction logs + force-save on background
- ✅ **No Bundle Crashes**: Platform capability guards + dynamic imports for 3D/AR
- ✅ **No Permission Bypass**: Centralized permission system with route + API guards
- ✅ **No Locale Issues**: Always store in canonical format (meters, ISO dates)
- ✅ **No Deep-Link Breaks**: Legacy route map + automatic migration + CI tests

---

## Complete Folder Structure

```
src/
├── app/                          # Application Bootstrap & Configuration
│   ├── App.tsx                   # Root component with error boundary
│   ├── bootstrap/                # App initialization
│   │   ├── initApp.ts           # ⭐ Initialize DB → Recover → Load fonts → Backend
│   │   ├── initBackend.ts       # Backend connection setup
│   │   ├── initOfflineSync.ts   # Offline sync initialization
│   │   ├── loadFonts.ts
│   │   ├── setupAnalytics.ts
│   │   └── index.ts
│   ├── navigation/               # Navigation configuration
│   │   ├── RootNavigator.tsx    # Main navigator
│   │   ├── AuthNavigator.tsx    # Auth flow
│   │   ├── MainNavigator.tsx    # Post-auth flow (filters routes by permissions)
│   │   ├── guards/              # ⭐ NEW - Centralized guards
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── PremiumGuard.tsx    # Check subscription before routing
│   │   │   ├── FeatureGuard.tsx    # Check feature flags
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── routeConfig.ts      # Current routes + permissions
│   │   │   ├── legacyRouteMap.ts   # ⭐ NEVER DELETE - All historical routes
│   │   │   ├── routeMigration.ts   # ⭐ Auto-migrate old → new routes
│   │   │   └── index.ts
│   │   ├── DeepLinkHandler.tsx     # ⭐ Handle legacy deep links
│   │   ├── deepLinking.ts       
│   │   ├── linking.ts           
│   │   └── index.ts
│   ├── providers/                # Global providers
│   │   ├── ThemeProvider.tsx
│   │   ├── QueryProvider.tsx    # React Query
│   │   ├── StoreProvider.tsx    # State management
│   │   ├── ErrorBoundary.tsx
│   │   ├── NetworkProvider.tsx  # ⭐ Network status monitoring
│   │   ├── SyncProvider.tsx     # ⭐ Sync status display
│   │   └── index.ts
│   └── config/
│       ├── env.ts               # Environment variables
│       ├── featureFlags.ts      # ⭐ Feature toggles for gradual rollout
│       ├── api.ts               # API endpoints config
│       ├── constants.ts         # App-level constants
│       └── deepLinks.test.ts    # ⭐ CI test for all active deep links
│
├── modules/                      # Feature Modules (Domain-Driven)
│   ├── auth/
│   │   ├── components/          # Auth-specific UI
│   │   ├── screens/             # Auth screens
│   │   ├── hooks/               # Auth hooks
│   │   ├── lib/                 # Pure business logic
│   │   │   ├── validation.ts
│   │   │   ├── tokens.ts
│   │   │   └── index.ts
│   │   ├── api/                 # ⭐ API endpoints
│   │   │   ├── authApi.ts       # REST/GraphQL calls
│   │   │   ├── endpoints.ts     
│   │   │   └── index.ts
│   │   ├── store/               # Module state
│   │   │   ├── authStore.ts
│   │   │   └── index.ts
│   │   ├── sync/                # ⭐ Offline sync logic
│   │   │   ├── authSync.ts
│   │   │   └── index.ts
│   │   ├── types/               # TypeScript types
│   │   │   ├── api.ts           # ⭐ API request/response types
│   │   │   ├── domain.ts        
│   │   │   └── index.ts
│   │   ├── permissions.ts       # ⭐ Module-specific permissions
│   │   ├── tests/
│   │   └── index.ts             # Public API
│   │
│   ├── design2d/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   ├── lib/                 # Complex algorithms
│   │   │   ├── drawing/
│   │   │   │   ├── bezier.ts
│   │   │   │   ├── transforms.ts
│   │   │   │   └── pathOps.ts
│   │   │   ├── export/
│   │   │   │   ├── svg.ts
│   │   │   │   ├── png.ts
│   │   │   │   └── pdf.ts
│   │   │   └── index.ts
│   │   ├── models/              # Domain models
│   │   │   ├── Layer.ts
│   │   │   ├── Shape.ts
│   │   │   ├── Tool.ts
│   │   │   └── index.ts
│   │   ├── api/                 # ⭐ Backend integration
│   │   │   ├── designApi.ts     # CRUD with optimistic updates
│   │   │   ├── collaborationApi.ts  
│   │   │   ├── storageApi.ts    
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   ├── canvasStore.ts
│   │   │   ├── layersStore.ts
│   │   │   └── index.ts
│   │   ├── sync/                # ⭐ Offline-first sync
│   │   │   ├── designSync.ts    
│   │   │   ├── AutoSaveManager.ts  # ⭐ Debounced + transaction log
│   │   │   ├── conflictResolver.ts  
│   │   │   └── index.ts
│   │   ├── workers/             # Heavy computation
│   │   │   ├── exportWorker.ts
│   │   │   └── renderWorker.ts
│   │   ├── types/
│   │   │   ├── api.ts           # ⭐ API contracts
│   │   │   ├── domain.ts
│   │   │   └── index.ts
│   │   ├── permissions.ts       
│   │   ├── tests/
│   │   └── index.ts
│   │
│   ├── design3d/
│   │   ├── index.ts             # ⚠️ LAZY LOAD ONLY
│   │   ├── index.native.ts      
│   │   ├── index.web.ts
│   │   ├── core/
│   │   │   ├── ThreeLoader.ts   # ⭐ Safe Three.js loader
│   │   │   ├── GLContextGuard.ts # ⭐ Check GL before loading
│   │   │   └── index.ts
│   │   ├── permissions.ts       # ⭐ Requires Permission.USE_3D
│   │   └── ...
│   │
│   ├── ar/
│   │   ├── index.ts             # ⚠️ LAZY LOAD ONLY
│   │   ├── index.native.ts
│   │   ├── core/
│   │   │   ├── ARLoader.ts      # ⭐ Check AR availability
│   │   │   └── index.ts
│   │   ├── permissions.ts       # ⭐ Requires Permission.USE_AR
│   │   └── ...
│   │
│   ├── measurements/
│   │   ├── lib/
│   │   │   ├── units.ts         # ⭐ Unit conversion (always store meters)
│   │   │   ├── parser.ts        # ⭐ Locale-aware parsing
│   │   │   ├── formatter.ts     # ⭐ Locale-aware formatting
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── measurement.ts   # ⭐ Canonical format
│   │   └── ...
│   │
│   ├── templates/
│   │   ├── api/                 
│   │   │   ├── templateApi.ts
│   │   │   ├── purchaseApi.ts   
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── collaboration/
│   │   ├── api/                 # ⭐ Real-time collaboration
│   │   │   ├── roomApi.ts       
│   │   │   ├── presenceApi.ts   
│   │   │   ├── commentsApi.ts   
│   │   │   └── index.ts
│   │   ├── realtime/            # ⭐ Real-time handlers
│   │   │   ├── CursorManager.ts 
│   │   │   ├── selections.ts
│   │   │   └── index.ts
│   │   ├── permissions.ts       
│   │   └── ...
│   │
│   ├── aiAssistant/
│   │   ├── api/                 # ⭐ AI backend integration
│   │   │   ├── chatApi.ts       
│   │   │   ├── generationApi.ts 
│   │   │   ├── suggestionApi.ts 
│   │   │   └── index.ts
│   │   ├── permissions.ts       
│   │   └── ...
│   │
│   ├── settings/
│   ├── onboarding/
│   ├── home/
│   └── trends/
│
├── shared/                       # Shared Across Modules
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Primitive components (Tamagui)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Text.tsx
│   │   │   └── index.ts
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── feedback/
│   │   ├── media/
│   │   └── navigation/
│   │
│   ├── domain/                  # Domain-specific shared components
│   │   ├── design/
│   │   ├── collaboration/
│   │   └── index.ts
│   │
│   ├── hooks/                   # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useNetwork.ts        # ⭐ Network status hook
│   │   ├── useSync.ts           # ⭐ Sync status hook
│   │   ├── useOptimistic.ts     # ⭐ Optimistic updates
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── string.ts
│   │   ├── date.ts
│   │   ├── retry.ts             # ⭐ Retry logic
│   │   ├── queue.ts             # ⭐ Queue management
│   │   └── index.ts
│   │
│   ├── permissions/             # ⭐ NEW - Centralized permissions
│   │   ├── permissions.ts       # Permission enum + tier mappings
│   │   ├── PermissionChecker.ts # Runtime checks
│   │   └── index.ts
│   │
│   ├── localization/
│   │   ├── formats/             # ⭐ NEW - Locale formats
│   │   │   ├── number.ts
│   │   │   ├── date.ts
│   │   │   ├── measurement.ts   
│   │   │   └── index.ts
│   │   ├── serialization/       # ⭐ NEW - Canonical serialization
│   │   │   ├── serialize.ts     
│   │   │   ├── deserialize.ts   
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   ├── theme/                   # Tamagui theme tokens
│   ├── animations/
│   ├── icons/
│   └── types/
│       ├── common.ts
│       ├── api.ts               # Shared API types
│       └── index.ts
│
├── platform/                     # Platform-Specific Code
│   ├── guards/                  # ⭐ NEW - Platform capability guards
│   │   ├── GLCapabilityGuard.ts 
│   │   ├── ARCapabilityGuard.ts 
│   │   ├── CameraCapabilityGuard.ts
│   │   └── index.ts
│   │
│   ├── loaders/                 # ⭐ NEW - Safe dynamic loaders
│   │   ├── ThreeLoader.ts       
│   │   ├── ARLoader.ts          
│   │   └── index.ts
│   │
│   ├── native/
│   │   ├── camera/
│   │   ├── haptics/
│   │   ├── gestures/
│   │   └── index.ts
│   │
│   ├── web/
│   │   ├── wasm/
│   │   ├── webgl/
│   │   └── index.ts
│   │
│   └── adapters/                
│       ├── CameraAdapter.ts
│       ├── FileSystemAdapter.ts
│       ├── NotificationAdapter.ts
│       └── index.ts
│
├── infrastructure/               # Infrastructure Services
│   ├── api/                     # ⭐ API Clients
│   │   ├── rest/
│   │   │   ├── client.ts        # Axios with interceptors
│   │   │   ├── interceptors.ts  # Auth + refresh
│   │   │   ├── retry.ts         # Backoff retry
│   │   │   ├── cache.ts         
│   │   │   └── index.ts
│   │   ├── graphql/
│   │   │   ├── client.ts        
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   ├── subscriptions/   
│   │   │   ├── cache.ts         
│   │   │   └── index.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── realtime.ts      
│   │   │   ├── storage.ts       
│   │   │   ├── auth.ts          
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── sync/                    # ⭐ Offline-First Sync Engine
│   │   ├── SyncManager.ts       
│   │   ├── OperationQueue.ts    
│   │   ├── ConflictResolver.ts  
│   │   ├── ChangeTracker.ts     
│   │   ├── TransactionLog.ts    # ⭐ NEW - Append-only log
│   │   ├── RecoveryManager.ts   # ⭐ NEW - Crash recovery
│   │   ├── strategies/
│   │   │   ├── optimistic.ts    
│   │   │   ├── pessimistic.ts   
│   │   │   └── hybrid.ts        
│   │   └── index.ts
│   │
│   ├── storage/                 
│   │   ├── asyncStorage.ts
│   │   ├── secureStorage.ts
│   │   ├── fileSystem.ts
│   │   ├── cache.ts             
│   │   └── index.ts
│   │
│   ├── database/                # ⭐ Local Database
│   │   ├── sqlite/
│   │   │   ├── connection.ts    
│   │   │   ├── schema.ts        
│   │   │   ├── MigrationRunner.ts # ⭐ Migration orchestrator
│   │   │   ├── migrations/      # ⭐ Schema migrations
│   │   │   │   ├── 001_initial.ts
│   │   │   │   ├── 002_add_sync_metadata.ts
│   │   │   │   ├── 003_add_collaboration.ts
│   │   │   │   └── index.ts
│   │   │   ├── repositories/    # ⭐ Data access layer
│   │   │   │   ├── BaseRepository.ts
│   │   │   │   ├── DesignRepository.ts
│   │   │   │   ├── SyncQueueRepository.ts
│   │   │   │   ├── TransactionLogRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── serializers/     # ⭐ Type-safe serialization
│   │   │   │   ├── MeasurementSerializer.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── messaging/               # ⭐ Real-time Messaging
│   │   ├── websocket/
│   │   │   ├── client.ts        
│   │   │   ├── reconnection.ts  
│   │   │   ├── heartbeat.ts     
│   │   │   └── index.ts
│   │   ├── sse/                 
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   ├── push/                
│   │   │   ├── notifications.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── queue/                   # ⭐ Background Job Queue
│   │   ├── JobQueue.ts          
│   │   ├── workers/
│   │   │   ├── syncWorker.ts    
│   │   │   ├── exportWorker.ts  
│   │   │   ├── uploadWorker.ts  
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── analytics/               
│   │   ├── logger.ts
│   │   ├── analytics.ts
│   │   ├── metrics.ts
│   │   ├── deepLinkTracker.ts   # ⭐ Track deep link usage
│   │   └── index.ts
│   │
│   ├── monitoring/              
│   │   ├── sentry.ts
│   │   ├── crashlytics.ts
│   │   ├── performance.ts
│   │   ├── SafetyMonitor.ts     # ⭐ Real-time safety checks
│   │   └── index.ts
│   │
│   ├── auth/                    
│   │   ├── session.ts           
│   │   ├── tokens.ts            
│   │   ├── biometrics.ts
│   │   ├── tokenRefresh.ts      # ⭐ Auto token refresh
│   │   └── index.ts
│   │
│   └── network/                 # ⭐ Network Management
│       ├── NetworkMonitor.ts    
│       ├── bandwidth.ts         
│       ├── retry.ts             
│       └── index.ts
│
├── state/                        # Global State Management
│   ├── stores/                  
│   │   ├── authStore.ts         
│   │   ├── syncStore.ts         # ⭐ Sync status & queue
│   │   ├── networkStore.ts      # ⭐ Network status
│   │   ├── uiStore.ts           
│   │   └── index.ts
│   │
│   ├── middleware/              
│   │   ├── persistence.ts       
│   │   ├── analytics.ts         
│   │   ├── sync.ts              # ⭐ Auto-sync middleware
│   │   ├── logger.ts            
│   │   └── index.ts
│   │
│   ├── selectors/               
│   │   ├── authSelectors.ts
│   │   ├── syncSelectors.ts     # ⭐ Sync status selectors
│   │   └── index.ts
│   │
│   └── hooks/                   
│       ├── useAuthFacade.ts
│       ├── useDesignFacade.ts
│       ├── useSyncFacade.ts     # ⭐ Sync facade
│       └── index.ts
│
├── tests/                        
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── mocks/
│   │   ├── handlers.ts          # MSW handlers
│   │   ├── server.ts            # Mock server
│   │   ├── data/                # Mock data
│   │   │   ├── users.ts
│   │   │   ├── designs.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── fixtures/
│   └── utils/
│       ├── render.tsx           
│       ├── navigation.ts        
│       ├── api.ts               # API test utils
│       └── index.ts
│
├── scripts/                      
│   ├── build/
│   ├── release/
│   ├── profiling/
│   ├── pre-deploy-checks.ts     # ⭐ Pre-deployment checks
│   ├── check-deep-links.ts      # ⭐ Deep link health
│   ├── migrations/              # Database migrations
│   │   └── fix-locale-measurements.ts # ⭐ Data fix
│   └── seed/                    
│
├── assets/
│   ├── images/
│   ├── fonts/
│   ├── lottie/
│   └── splash/
│
└── types/
    ├── global.d.ts
    ├── navigation.d.ts
    ├── env.d.ts
    ├── api.d.ts                 # Global API types
    └── vendor/
        ├── expo-vector-icons.d.ts
        └── react-native-svg.d.ts
```

---

## 🚨 Production Safety Scenarios

### Scenario 1: 3D/AR Bundle Crash Prevention

**Problem:** Three.js/camera modules loaded in common bundle → iOS/Android crash due to GL context unavailable

**Solution:**
- Platform capability guards (`GLCapabilityGuard`, `ARCapabilityGuard`)
- Dynamic imports with lazy loading (`ThreeLoader`, `ARLoader`)
- Metro config prevents Three.js leakage into main bundle
- Navigation only adds 3D/AR routes if capabilities detected
- Feature availability checks before routing

**Implementation Files:**
- `platform/guards/GLCapabilityGuard.ts` - Check WebGL availability
- `platform/loaders/ThreeLoader.ts` - Safe dynamic import wrapper
- `modules/design3d/index.ts` - Lazy-load only, exports `isAvailable()` check
- `app/navigation/MainNavigator.tsx` - Conditional route registration
- `metro.config.js` - Prevent unintended Three.js inclusion

---

### Scenario 2: Offline Design Loss Prevention

**Problem:** Race condition during auto-save: app regains connectivity → pending edits wiped

**Solution:**
- Append-only transaction log (never delete until server confirms)
- Force-save on app background
- Recovery manager replays unsynced operations on startup
- Debounced auto-save writes to transaction log FIRST, API call SECOND
- Network failures queue operations for retry

**Implementation Files:**
- `infrastructure/sync/TransactionLog.ts` - Append-only log
- `infrastructure/sync/RecoveryManager.ts` - Startup recovery
- `modules/design2d/sync/AutoSaveManager.ts` - Debounced save + transaction log
- `app/bootstrap/initApp.ts` - Recovery before app init
- `App.tsx` - Force-save on background event

---

### Scenario 3: Privilege Escalation Prevention

**Problem:** Route guards scattered → free users access premium flows → billable jobs triggered

**Solution:**
- Centralized permission system with enum + tier mappings
- Route-level guards filter navigation options
- API-level checks before any billable operation
- Backend validates user tier matches JWT claims
- Permission violations logged for monitoring

**Implementation Files:**
- `shared/permissions/permissions.ts` - Permission enum + `TIER_PERMISSIONS`
- `shared/permissions/PermissionChecker.ts` - Runtime checks
- `app/navigation/routes/routeConfig.ts` - Routes with required permissions
- `app/navigation/guards/PremiumGuard.tsx` - Subscription check
- `app/navigation/MainNavigator.tsx` - Filter routes by permissions
- `modules/design2d/api/designApi.ts` - API permission checks

---

### Scenario 4: Locale-Heavy Sync Protection

**Problem:** Measurements/templates stored with locale-specific formatting → parsing breaks for non-US locales

**Solution:**
- Always store in canonical format (meters, ISO dates)
- Locale-aware parser for user input
- Locale-aware formatter for display
- Serializer ensures only canonical values reach database/API
- Migration script to fix existing data

**Implementation Files:**
- `modules/measurements/types/measurement.ts` - Canonical format definition
- `modules/measurements/lib/units.ts` - Unit conversion utilities
- `modules/measurements/lib/parser.ts` - Locale-aware input parsing
- `modules/measurements/lib/formatter.ts` - Locale-aware display formatting
- `infrastructure/database/sqlite/serializers/MeasurementSerializer.ts` - DB serialization
- `scripts/migrations/fix-locale-measurements.ts` - One-time data migration

---

### Scenario 5: Push Deep-Link Regression Prevention

**Problem:** Marketing pushes use legacy route names → navigation refactor breaks deep links → users see blank screens

**Solution:**
- Legacy route map (NEVER DELETE - keeps all historical routes)
- Automatic migration from old → new routes
- Deep-link handler migrates legacy paths transparently
- CI tests validate all active marketing campaign links
- Usage tracker monitors which legacy routes are still active

**Implementation Files:**
- `app/navigation/routes/legacyRouteMap.ts` - All historical routes
- `app/navigation/routes/routeMigration.ts` - Migration logic
- `app/navigation/DeepLinkHandler.tsx` - Handle legacy links
- `infrastructure/analytics/deepLinkTracker.ts` - Track usage
- `app/config/deepLinks.test.ts` - CI tests for active campaigns
- `scripts/check-deep-links.ts` - Health check script

## Implementation Roadmap

### Phase 1: Foundation & Safety Infrastructure (Week 1-2)
**Goal:** Build safety nets before touching production code

**Tasks:**
1. **Database Setup**
   - [ ] Implement `MigrationRunner` in `infrastructure/database/sqlite/`
   - [ ] Create migrations 001-003 (initial, sync metadata, collaboration)
   - [ ] Build `BaseRepository` pattern
   - [ ] Create `DesignRepository`, `SyncQueueRepository`, `TransactionLogRepository`

2. **Transaction Log System**
   - [ ] Implement `TransactionLog` class
   - [ ] Add `RecoveryManager` for startup recovery
   - [ ] Integrate with `initApp()` bootstrap
   - [ ] Test crash recovery scenarios

3. **Permission System**
   - [ ] Define `Permission` enum in `shared/permissions/`
   - [ ] Create `TIER_PERMISSIONS` mappings
   - [ ] Build `PermissionChecker` utility
   - [ ] Add `permissions.ts` to each module

4. **Feature Flags**
   - [ ] Set up `featureFlags.ts` configuration
   - [ ] Create remote config integration
   - [ ] Add feature flag middleware

**Success Criteria:**
- ✅ Database migrations run successfully
- ✅ Transaction log captures all operations
- ✅ Recovery manager tested with crashes
- ✅ Permission checks enforce tiers

---

### Phase 2: Platform Capability Guards (Week 2-3)
**Goal:** Prevent bundle bloat and capability crashes

**Tasks:**
1. **Create Guard Infrastructure**
   - [ ] Implement `GLCapabilityGuard`
   - [ ] Implement `ARCapabilityGuard`
   - [ ] Implement `CameraCapabilityGuard`

2. **Safe Module Loaders**
   - [ ] Create `ThreeLoader`
   - [ ] Create `ARLoader`
   - [ ] Refactor `modules/design3d/index.ts` for lazy loading
   - [ ] Refactor `modules/ar/index.ts` for lazy loading

3. **Metro Configuration**
   - [ ] Update `metro.config.js` to prevent Three.js leakage
   - [ ] Add bundle analyzer script
   - [ ] Set up bundle size checks in CI

**Success Criteria:**
- ✅ Three.js not in main bundle
- ✅ App runs without GL context
- ✅ 3D/AR routes only when supported
- ✅ Bundle size under 5MB

---

### Phase 3: Offline-First Sync Engine (Week 3-4)
**Goal:** Never lose user data

**Tasks:**
1. **Sync Manager**
   - [ ] Implement `SyncManager`
   - [ ] Build `OperationQueue` with persistence
   - [ ] Create `ConflictResolver` (CRDT, LWW, manual)
   - [ ] Add network monitoring integration

2. **Auto-Save System**
   - [ ] Build `AutoSaveManager`
   - [ ] Implement debounced save with transaction log
   - [ ] Add force-save on background
   - [ ] Test offline scenarios

3. **API Integration**
   - [ ] Update `designApi` with optimistic updates
   - [ ] Add retry logic with backoff
   - [ ] Implement conflict resolution UI

**Success Criteria:**
- ✅ All edits survive crashes
- ✅ Changes sync when online
- ✅ Conflicts resolved gracefully
- ✅ No data loss

---

### Phase 4: Route Guards & Deep Link Safety (Week 4-5)
**Goal:** Protect routes and deep links

**Tasks:**
1. **Route Configuration**
   - [ ] Create `routeConfig.ts` with permissions
   - [ ] Build `legacyRouteMap.ts`
   - [ ] Implement `RouteMigration` class
   - [ ] Add route filtering in `MainNavigator`

2. **Navigation Guards**
   - [ ] Create `AuthGuard.tsx`
   - [ ] Create `PremiumGuard.tsx`
   - [ ] Create `FeatureGuard.tsx`

3. **Deep Link Handler**
   - [ ] Implement `DeepLinkHandler.tsx`
   - [ ] Add legacy route migration
   - [ ] Create `DeepLinkTracker`
   - [ ] Write CI tests for campaigns

**Success Criteria:**
- ✅ Free users can't access premium
- ✅ All deep links work (CI tested)
- ✅ Legacy routes auto-migrate
- ✅ Violations logged

---

### Phase 5: Locale-Safe Data Layer (Week 5)
**Goal:** Store measurements in canonical format

**Tasks:**
1. **Canonical Format**
   - [ ] Define `Measurement` type
   - [ ] Build `UnitConverter`
   - [ ] Implement `MeasurementParser`
   - [ ] Implement `MeasurementFormatter`

2. **Serialization**
   - [ ] Create `MeasurementSerializer`
   - [ ] Update DB schema
   - [ ] Add validation

3. **Migration**
   - [ ] Write migration script
   - [ ] Test multiple locales
   - [ ] Validate parsing

**Success Criteria:**
- ✅ All measurements in meters
- ✅ Display respects locale
- ✅ Parsing works globally
- ✅ Data migrated

---

### Phase 6: Tamagui Design System (Week 6)
**Goal:** Unified theming

**Tasks:**
- [ ] Consolidate `tamagui.config.ts`
- [ ] Define tokens (colors, spacing, typography)
- [ ] Migrate components to `shared/components/ui/`
- [ ] Update all screens to use Tamagui
- [ ] Add dark mode support

**Success Criteria:**
- ✅ Consistent theme everywhere
- ✅ Dark mode works
- ✅ Responsive on all sizes

---

### Phase 7-12: Additional Phases
- **Phase 7**: API Client Infrastructure (REST, GraphQL, Supabase)
- **Phase 8**: Real-Time Collaboration (WebSocket, cursors, presence)
- **Phase 9**: State Management (stores, middleware, selectors)
- **Phase 10**: Testing Infrastructure (unit, integration, E2E)
- **Phase 11**: Performance Optimization (bundle, rendering, caching)
- **Phase 12**: Security Hardening (auth, API, data encryption)

---

## Backend Integration Patterns (Reference for Future Implementation)

### API Client Setup
```typescript
// infrastructure/api/rest/client.ts - Axios with interceptors
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await authStore.getState().refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Module API Pattern
```typescript
// modules/design2d/api/designApi.ts - CRUD with optimistic updates
export const designApi = {
  async createDesign(dto: CreateDesignDto): Promise<Design> {
    const tempId = `temp-${Date.now()}`;
    const optimisticDesign = { ...dto, id: tempId, syncStatus: 'pending' };
    
    // Update UI immediately
    designStore.getState().addDesign(optimisticDesign);
    
    try {
      const { data } = await apiClient.post('/designs', dto);
      designStore.getState().replaceDesign(tempId, data);
      return data;
    } catch (error) {
      if (!navigator.onLine) {
        await syncManager.queueOperation({
          type: 'create',
          entity: 'design',
          data: dto,
          tempId,
        });
      }
      throw error;
    }
  },
};
```

### Offline Sync Engine
```typescript
// infrastructure/sync/SyncManager.ts
export class SyncManager {
  private queue: Queue;
  private syncing = false;

  constructor() {
    networkStore.subscribe((state) => {
      if (state.isOnline && !this.syncing) {
        this.syncAll();
      }
    });
  }

  async queueOperation(operation: SyncOperation) {
    await db.syncQueue.insert({
      ...operation,
      queuedAt: new Date(),
      attempts: 0,
    });
    
    if (networkStore.getState().isOnline) {
      this.syncAll();
    }
  }
}
```

### Real-Time Collaboration
```typescript
// modules/collaboration/realtime/CursorManager.ts
export class CursorManager {
  async join(designId: string, userId: string) {
    this.channel = supabase.channel(`design:${designId}`);
    
    this.channel
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        if (payload.userId !== userId) {
          collaborationStore.getState().updateCursor(payload.userId, {
            x: payload.x,
            y: payload.y,
          });
        }
      })
      .subscribe();
  }

  broadcastCursor(x: number, y: number) {
    this.channel?.send({
      type: 'broadcast',
      event: 'cursor',
      payload: { x, y, userId: authStore.getState().user.id },
    });
  }
}
```

---

## Database Schema & Migrations (Reference for Future Implementation)

### Migration 001: Initial Schema
```typescript
// infrastructure/database/sqlite/migrations/001_initial.ts
export const migration001 = {
  version: 1,
  name: 'initial_schema',
  
  up: async (db: Database) => {
    await db.execAsync(`
      CREATE TABLE designs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL,
        thumbnail TEXT,
        version INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT,
        deleted_at TEXT
      );
      
      CREATE TABLE sync_queue (
        id TEXT PRIMARY KEY,
        entity TEXT NOT NULL,
        operation TEXT NOT NULL,
        data TEXT NOT NULL,
        temp_id TEXT,
        attempts INTEGER DEFAULT 0,
        queued_at TEXT NOT NULL,
        last_error TEXT,
        status TEXT DEFAULT 'pending'
      );
      
      CREATE TABLE transaction_log (
        id TEXT PRIMARY KEY,
        entity TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        before_data TEXT,
        after_data TEXT,
        timestamp INTEGER NOT NULL,
        synced INTEGER DEFAULT 0,
        synced_at INTEGER,
        user_id TEXT NOT NULL
      );
    `);
  },
};
```

### Repository Pattern
```typescript
// infrastructure/database/sqlite/repositories/BaseRepository.ts
export abstract class BaseRepository<T extends { id: string }> {
  async findById(id: string): Promise<T | null> {
    // Implementation
  }
  
  async findAll(): Promise<T[]> {
    // Implementation
  }
  
  async insert(item: T): Promise<T> {
    // Implementation
  }
  
  async update(id: string, updates: Partial<T>): Promise<T> {
    // Implementation
  }
  
  async delete(id: string): Promise<void> {
    // Implementation
  }
}
```

---

## Safety Mechanisms & Protocols

### Pre-Deployment Checks
```typescript
// scripts/pre-deploy-checks.ts
export async function runSafetyChecks() {
  const checks = [
    checkBundleSizes,      // Verify Three.js not in main bundle
    checkPermissions,      // All routes have permission checks
    checkDeepLinks,        // All active campaigns work
    checkLocaleFormats,    // Measurements in canonical format
    checkOfflineSync,      // Sync queue operational
  ];

  for (const check of checks) {
    try {
      await check();
      console.log(`✅ ${check.name} passed`);
    } catch (error) {
      console.error(`❌ ${check.name} failed:`, error);
      process.exit(1);
    }
  }
}
```

### Refactoring Safety Protocol
1. **Add Feature Flags** - Enable gradual rollout
2. **Add Monitoring** - Track old vs new behavior
3. **Build New Parallel** - Keep old code working
4. **Gradual Rollout** - 10% → 50% → 100%
5. **Monitor Errors** - Rollback if error rate spikes
6. **Delete Old Code** - After 30 days of stable monitoring

### Emergency Rollback Plan
- Feature flag instant disable via remote config
- Transaction log enables data rollback
- Keep old data for 30 days
- Communication plan for users

---

## Success Criteria

### Technical Metrics
- ✅ Unified theme across all screens
- ✅ Decoupled services with clear contracts
- ✅ 80%+ test coverage on critical paths
- ✅ Supabase config abstracted securely
- ✅ Onboarding-to-export validated end-to-end
- ✅ Bundle size under 5MB for main bundle
- ✅ App loads in <3 seconds
- ✅ 60fps during interactions

### Production Safety Guarantees
- ✅ **3D/AR Bundle Crash** → PROTECTED (capability guards + lazy loading)
- ✅ **Offline Design Loss** → PROTECTED (transaction log + recovery)
- ✅ **Privilege Escalation** → PROTECTED (permission system + guards)
- ✅ **Locale Sync Issues** → PROTECTED (canonical format storage)
- ✅ **Deep Link Regression** → PROTECTED (legacy map + migration)

---

## Open Questions
- ~~Final decision between Zustand, Redux, or Recoil for global store implementation~~ ✅ **DECIDED: Zustand + React Query**
- ~~Alignment on analytics provider integration~~ ✅ **DECIDED: Posthog**
- Need for web support parity and any platform-specific component overrides

---

## 🎯 Final Technology Stack

### Core Dependencies
```json
{
  "dependencies": {
    "@tamagui/core": "latest",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0",
    
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    
    "@nozbe/watermelondb": "^0.27.0",
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.0",
    
    "@automerge/automerge": "^2.0.0",
    
    "expo-task-manager": "~11.8.0",
    "expo-background-fetch": "~12.0.0",
    "p-queue": "^8.0.0",
    
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.93.0",
    "expo-gl": "~14.0.0",
    
    "posthog-react-native": "^3.0.0",
    "@sentry/react-native": "^5.15.0",
    
    "date-fns": "^3.0.0",
    "lodash": "^4.17.21",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@nozbe/watermelondb-babel-plugin": "latest",
    "jest": "^29.0.0",
    "@testing-library/react-native": "^12.4.0",
    "detox": "^20.0.0"
  }
}
```

### Technology Choices Rationale

**State Management: Zustand + React Query**
- Zustand for UI/app state (minimal boilerplate, TypeScript-friendly)
- React Query for server state (automatic caching, optimistic updates, sync)

**Database: WatermelonDB**
- Built for React Native offline-first
- Lazy loading, observables, built-in sync engine

**Backend: Supabase + Axios**
- Supabase for realtime, auth, storage
- Axios for REST API with interceptors

**Conflict Resolution: Automerge**
- CRDT-based automatic conflict resolution
- No data loss in concurrent edits

**Background Jobs: Expo Task Manager + p-queue**
- Native background fetch
- Configurable queue with retry logic

**3D/AR: React Three Fiber + Expo GL**
- Lazy-loaded with capability guards
- Declarative 3D with React

**Analytics: Posthog**
- Self-hostable, privacy-first
- Feature flags built-in

**Monitoring: Sentry**
- Best-in-class error tracking
- Source maps, performance monitoring

---

_Last updated: 2025-11-09_
