import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Main App Store
 */
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      // User
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Settings
      settings: {
        notifications: true,
        autoSave: true,
        syncCloud: false,
        language: 'en',
      },
      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),

      // Onboarding
      onboardingCompleted: false,
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Design Store
 */
export const useDesignStore = create(
  persist(
    (set, get) => ({
      // Current design
      currentDesign: null,
      setCurrentDesign: (design) => set({ currentDesign: design }),

      // Design history (for undo/redo)
      history: [],
      historyIndex: -1,

      // Save design to history
      saveToHistory: (design) =>
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(design);
          
          // Keep only last 50 history items
          if (newHistory.length > 50) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
            currentDesign: design,
          };
        }),

      // Undo
      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              historyIndex: newIndex,
              currentDesign: state.history[newIndex],
            };
          }
          return state;
        }),

      // Redo
      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              historyIndex: newIndex,
              currentDesign: state.history[newIndex],
            };
          }
          return state;
        }),

      // Can undo/redo
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      // Saved designs
      savedDesigns: [],
      addDesign: (design) =>
        set((state) => ({
          savedDesigns: [design, ...state.savedDesigns],
        })),
      updateDesign: (id, updates) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      deleteDesign: (id) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.filter((d) => d.id !== id),
        })),
      clearDesigns: () => set({ savedDesigns: [] }),

      // Design versions (auto-save)
      versions: {},
      saveVersion: (designId, version) =>
        set((state) => {
          const designVersions = state.versions[designId] || [];
          const newVersions = [version, ...designVersions].slice(0, 10); // Keep last 10 versions
          return {
            versions: {
              ...state.versions,
              [designId]: newVersions,
            },
          };
        }),
      getVersions: (designId) => get().versions[designId] || [],
    }),
    {
      name: STORAGE_KEYS.DESIGNS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Measurements Store
 */
export const useMeasurementsStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfile: null,

      addProfile: (profile) =>
        set((state) => ({
          profiles: [profile, ...state.profiles],
        })),

      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates }
              : state.currentProfile,
        })),

      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
        })),

      setCurrentProfile: (profile) => set({ currentProfile: profile }),
    }),
    {
      name: STORAGE_KEYS.MEASUREMENTS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Templates Store
 */
export const useTemplatesStore = create((set, get) => ({
  favorites: [],
  recentlyUsed: [],

  addToFavorites: (templateId) =>
    set((state) => ({
      favorites: state.favorites.includes(templateId)
        ? state.favorites
        : [...state.favorites, templateId],
    })),

  removeFromFavorites: (templateId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== templateId),
    })),

  isFavorite: (templateId) => get().favorites.includes(templateId),

  addToRecentlyUsed: (templateId) =>
    set((state) => {
      const recent = state.recentlyUsed.filter((id) => id !== templateId);
      return {
        recentlyUsed: [templateId, ...recent].slice(0, 10), // Keep last 10
      };
    }),
}));

/**
 * Collaboration Store
 */
export const useCollaborationStore = create((set, get) => ({
  projects: [],
  activeProject: null,

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      activeProject:
        state.activeProject?.id === id
          ? { ...state.activeProject, ...updates }
          : state.activeProject,
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    })),

  setActiveProject: (project) => set({ activeProject: project }),

  inviteMember: (projectId, member) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, members: [...(p.members || []), member] }
          : p
      ),
    })),
}));

/**
 * Notifications Store
 */
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { id: Date.now().toString(), timestamp: new Date(), unread: true, ...notification },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false })),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification?.unread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

/**
 * Tutorial Store
 */
export const useTutorialStore = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      completedSteps: [],
      showTutorial: false,

      startTutorial: () => set({ showTutorial: true, currentStep: 0, completedSteps: [] }),
      closeTutorial: () => set({ showTutorial: false, currentStep: 0 }),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
          completedSteps: [...state.completedSteps, state.currentStep],
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      resetTutorial: () => set({ currentStep: 0, completedSteps: [], showTutorial: false }),
    }),
    {
      name: '@tutorial_state',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Export all stores
export default {
  useAppStore,
  useDesignStore,
  useMeasurementsStore,
  useTemplatesStore,
  useCollaborationStore,
  useNotificationStore,
  useTutorialStore,
};
