import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@infrastructure/config/constants';

type ThemePreference = 'light' | 'dark';

interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
  syncCloud: boolean;
  language: string;
}

type AppUser = Record<string, unknown> & { id?: string };

interface AppState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  user: AppUser | null;
  isAuthenticated: boolean;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
}

const defaultSettings: AppSettings = {
  notifications: true,
  autoSave: true,
  syncCloud: false,
  language: 'en',
};

/**
 * Main App Store
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      settings: { ...defaultSettings },
      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
      onboardingCompleted: false,
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

type DesignSnapshot = Record<string, unknown>;

interface DesignRecord extends DesignSnapshot {
  id: string;
}

interface DesignState {
  currentDesign: DesignSnapshot | null;
  setCurrentDesign: (design: DesignSnapshot | null) => void;
  history: DesignSnapshot[];
  historyIndex: number;
  saveToHistory: (design: DesignSnapshot) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  savedDesigns: DesignRecord[];
  addDesign: (design: DesignRecord) => void;
  updateDesign: (id: string, updates: Partial<DesignRecord>) => void;
  deleteDesign: (id: string) => void;
  clearDesigns: () => void;
  versions: Record<string, DesignSnapshot[]>;
  saveVersion: (designId: string, version: DesignSnapshot) => void;
  getVersions: (designId: string) => DesignSnapshot[];
}

/**
 * Design Store
 */
export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
      currentDesign: null,
      setCurrentDesign: (design) => set({ currentDesign: design }),
      history: [],
      historyIndex: -1,
      saveToHistory: (design) =>
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(design);

          if (newHistory.length > 50) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
            currentDesign: design,
          };
        }),
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
      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },
      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
      savedDesigns: [],
      addDesign: (design) =>
        set((state) => ({
          savedDesigns: [design, ...state.savedDesigns],
        })),
      updateDesign: (id, updates) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.map((design) =>
            design.id === id ? { ...design, ...updates } : design
          ),
        })),
      deleteDesign: (id) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.filter((design) => design.id !== id),
        })),
      clearDesigns: () => set({ savedDesigns: [] }),
      versions: {},
      saveVersion: (designId, version) =>
        set((state) => {
          const designVersions = state.versions[designId] ?? [];
          const newVersions = [version, ...designVersions].slice(0, 10);
          return {
            versions: {
              ...state.versions,
              [designId]: newVersions,
            },
          };
        }),
      getVersions: (designId) => {
        const state = get();
        return state.versions[designId] ?? [];
      },
    }),
    {
      name: STORAGE_KEYS.DESIGNS,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface MeasurementProfile extends Record<string, unknown> {
  id: string;
}

interface MeasurementsState {
  profiles: MeasurementProfile[];
  currentProfile: MeasurementProfile | null;
  addProfile: (profile: MeasurementProfile) => void;
  updateProfile: (id: string, updates: Partial<MeasurementProfile>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (profile: MeasurementProfile | null) => void;
}

/**
 * Measurements Store
 */
export const useMeasurementsStore = create<MeasurementsState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfile: null,
      addProfile: (profile) =>
        set((state) => ({
          profiles: [profile, ...state.profiles],
        })),
      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === id ? { ...profile, ...updates } : profile
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates }
              : state.currentProfile,
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((profile) => profile.id !== id),
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

interface TemplatesState {
  favorites: string[];
  recentlyUsed: string[];
  addToFavorites: (templateId: string) => void;
  removeFromFavorites: (templateId: string) => void;
  isFavorite: (templateId: string) => boolean;
  addToRecentlyUsed: (templateId: string) => void;
}

/**
 * Templates Store
 */
export const useTemplatesStore = create<TemplatesState>()((set, get) => ({
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
  isFavorite: (templateId) => {
    const state = get();
    return state.favorites.includes(templateId);
  },
  addToRecentlyUsed: (templateId) =>
    set((state) => {
      const recent = state.recentlyUsed.filter((id) => id !== templateId);
      return {
        recentlyUsed: [templateId, ...recent].slice(0, 10),
      };
    }),
}));

interface CollaborationMember extends Record<string, unknown> {
  id?: string;
}

interface CollaborationProject extends Record<string, unknown> {
  id: string;
  members?: CollaborationMember[];
}

interface CollaborationState {
  projects: CollaborationProject[];
  activeProject: CollaborationProject | null;
  addProject: (project: CollaborationProject) => void;
  updateProject: (id: string, updates: Partial<CollaborationProject>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: CollaborationProject | null) => void;
  inviteMember: (projectId: string, member: CollaborationMember) => void;
}

/**
 * Collaboration Store
 */
export const useCollaborationStore = create<CollaborationState>()((set, get) => ({
  projects: [],
  activeProject: null,
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
      activeProject:
        state.activeProject?.id === id
          ? { ...state.activeProject, ...updates }
          : state.activeProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    })),
  setActiveProject: (project) => set({ activeProject: project }),
  inviteMember: (projectId, member) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, members: [...(project.members ?? []), member] }
          : project
      ),
    })),
}));

interface NotificationEntry extends Record<string, unknown> {
  id: string;
  timestamp: Date;
  unread: boolean;
}

type NotificationPayload = Omit<NotificationEntry, 'id' | 'timestamp' | 'unread'>;

interface NotificationState {
  notifications: NotificationEntry[];
  unreadCount: number;
  addNotification: (notification: NotificationPayload) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

/**
 * Notifications Store
 */
export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          unread: true,
          ...notification,
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, unread: false })),
      unreadCount: 0,
    })),
  deleteNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((item) => item.id === id);
      return {
        notifications: state.notifications.filter((item) => item.id !== id),
        unreadCount: notification?.unread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

interface TutorialState {
  currentStep: number;
  completedSteps: number[];
  showTutorial: boolean;
  startTutorial: () => void;
  closeTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: number) => void;
  resetTutorial: () => void;
}

/**
 * Tutorial Store
 */
export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
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

export default {
  useAppStore,
  useDesignStore,
  useMeasurementsStore,
  useTemplatesStore,
  useCollaborationStore,
  useNotificationStore,
  useTutorialStore,
};
