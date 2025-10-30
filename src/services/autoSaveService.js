import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTO_SAVE, STORAGE_KEYS } from '../config/constants';
import { generateId } from '../utils/helpers';
import errorHandler from './errorHandler';
import { useDesignStore } from '../store';

/**
 * Auto-Save Service
 */
class AutoSaveService {
  constructor() {
    this.saveTimer = null;
    this.isEnabled = AUTO_SAVE.ENABLED;
    this.saveInterval = AUTO_SAVE.INTERVAL;
    this.maxVersions = AUTO_SAVE.MAX_VERSIONS;
    this.lastSaveTime = null;
    this.pendingChanges = false;
  }

  /**
   * Start auto-save
   */
  start(designId, getCurrentDesign) {
    if (!this.isEnabled) return;

    this.stop(); // Clear any existing timer

    // Store references for manual save()
    this.currentDesignId = designId;
    this.getCurrentDesign = getCurrentDesign;

    this.saveTimer = setInterval(() => {
      if (this.pendingChanges) {
        this.saveVersion(designId, getCurrentDesign());
      }
    }, this.saveInterval);

    if (__DEV__) {
      console.log('[AutoSave] Started auto-save');
    }
  }

  /**
   * Stop auto-save
   */
  stop() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
      if (__DEV__) {
        console.log('[AutoSave] Stopped auto-save');
      }
    }
  }

  /**
   * Mark that there are pending changes
   */
  markDirty() {
    this.pendingChanges = true;
  }

  /**
   * Manually trigger save (force save even if no pending changes)
   */
  async save() {
    if (!this.currentDesignId || !this.getCurrentDesign) {
      console.warn('[AutoSave] Cannot save: no design ID or getter configured');
      return null;
    }

    // Force save regardless of pendingChanges state
    return await this.saveVersion(this.currentDesignId, this.getCurrentDesign());
  }

  /**
   * Save current version
   */
  async saveVersion(designId, designData) {
    try {
      const version = {
        id: generateId(),
        designId,
        timestamp: new Date().toISOString(),
        data: designData,
        size: JSON.stringify(designData).length,
      };

      // Get existing versions
      const versions = await this.getVersions(designId);

      // Add new version at the beginning
      versions.unshift(version);

      // Keep only max versions
      const trimmedVersions = versions.slice(0, this.maxVersions);

      // Save to storage
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.DESIGNS}_versions_${designId}`,
        JSON.stringify(trimmedVersions)
      );

      // Update store
      const designStore = useDesignStore.getState();
      designStore.saveVersion(designId, version);

      this.lastSaveTime = new Date();
      this.pendingChanges = false;

      if (__DEV__) {
        console.log(`[AutoSave] Saved version for design ${designId}`);
      }

      return version;
    } catch (error) {
      errorHandler.handleStorageError(error, 'auto-save');
      return null;
    }
  }

  /**
   * Get all versions for a design
   */
  async getVersions(designId) {
    try {
      const versionsJson = await AsyncStorage.getItem(
        `${STORAGE_KEYS.DESIGNS}_versions_${designId}`
      );

      if (!versionsJson) return [];

      return JSON.parse(versionsJson);
    } catch (error) {
      console.error('[AutoSave] Failed to load versions:', error);
      return [];
    }
  }

  /**
   * Restore a specific version
   */
  async restoreVersion(designId, versionId) {
    try {
      const versions = await this.getVersions(designId);
      const version = versions.find((v) => v.id === versionId);

      if (!version) {
        throw new Error('Version not found');
      }

      return version.data;
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to restore version',
      });
      return null;
    }
  }

  /**
   * Delete a version
   */
  async deleteVersion(designId, versionId) {
    try {
      const versions = await this.getVersions(designId);
      const filteredVersions = versions.filter((v) => v.id !== versionId);

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.DESIGNS}_versions_${designId}`,
        JSON.stringify(filteredVersions)
      );

      return true;
    } catch (error) {
      errorHandler.handleStorageError(error, 'delete version');
      return false;
    }
  }

  /**
   * Clear all versions for a design
   */
  async clearVersions(designId) {
    try {
      await AsyncStorage.removeItem(
        `${STORAGE_KEYS.DESIGNS}_versions_${designId}`
      );
      return true;
    } catch (error) {
      errorHandler.handleStorageError(error, 'clear versions');
      return false;
    }
  }

  /**
   * Get version history info
   */
  async getVersionInfo(designId) {
    try {
      const versions = await this.getVersions(designId);

      if (versions.length === 0) {
        return {
          count: 0,
          oldestVersion: null,
          newestVersion: null,
          totalSize: 0,
        };
      }

      const totalSize = versions.reduce((sum, v) => sum + (v.size || 0), 0);

      return {
        count: versions.length,
        oldestVersion: versions[versions.length - 1].timestamp,
        newestVersion: versions[0].timestamp,
        totalSize,
      };
    } catch (error) {
      console.error('[AutoSave] Failed to get version info:', error);
      return null;
    }
  }

  /**
   * Export version history
   */
  async exportVersionHistory(designId) {
    try {
      const versions = await this.getVersions(designId);
      const history = {
        designId,
        exportedAt: new Date().toISOString(),
        versionCount: versions.length,
        versions: versions.map((v) => ({
          id: v.id,
          timestamp: v.timestamp,
          size: v.size,
          // Don't include the full data to keep export size manageable
        })),
      };

      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('[AutoSave] Failed to export history:', error);
      return null;
    }
  }

  /**
   * Compare two versions
   */
  compareVersions(version1, version2) {
    const changes = {
      added: [],
      removed: [],
      modified: [],
    };

    // Compare elements
    const elements1 = version1.data?.elements || [];
    const elements2 = version2.data?.elements || [];

    // Find added elements
    elements2.forEach((elem2) => {
      const found = elements1.find((elem1) => elem1.id === elem2.id);
      if (!found) {
        changes.added.push(elem2);
      }
    });

    // Find removed and modified elements
    elements1.forEach((elem1) => {
      const found = elements2.find((elem2) => elem2.id === elem1.id);
      if (!found) {
        changes.removed.push(elem1);
      } else if (JSON.stringify(elem1) !== JSON.stringify(found)) {
        changes.modified.push({ before: elem1, after: found });
      }
    });

    return changes;
  }

  /**
   * Enable/disable auto-save
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  /**
   * Set save interval
   */
  setSaveInterval(interval) {
    this.saveInterval = interval;
    // Restart timer if it's running
    if (this.saveTimer) {
      const currentDesignId = this.currentDesignId;
      const getCurrentDesign = this.getCurrentDesign;
      this.start(currentDesignId, getCurrentDesign);
    }
  }

  /**
   * Get last save time
   */
  getLastSaveTime() {
    return this.lastSaveTime;
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges() {
    return this.pendingChanges;
  }
}

// Create singleton instance
const autoSaveService = new AutoSaveService();

export default autoSaveService;
