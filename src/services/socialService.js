import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/helpers';
import errorHandler from './errorHandler';

/**
 * Social Service for managing social interactions
 */
class SocialService {
  constructor() {
    this.STORAGE_KEY = '@social_data';
  }

  /**
   * Get social data from storage
   */
  async getSocialData() {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getInitialData();
    } catch (error) {
      console.error('Failed to load social data:', error);
      return this.getInitialData();
    }
  }

  /**
   * Save social data to storage
   */
  async saveSocialData(data) {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      errorHandler.handleStorageError(error, 'save social data');
      return false;
    }
  }

  /**
   * Get initial social data structure
   */
  getInitialData() {
    return {
      likes: {},
      comments: {},
      shares: {},
      follows: [],
      followers: [],
      bookmarks: [],
    };
  }

  /**
   * Like a design
   */
  async likeDesign(designId, userId) {
    try {
      const data = await this.getSocialData();
      
      if (!data.likes[designId]) {
        data.likes[designId] = [];
      }

      if (!data.likes[designId].includes(userId)) {
        data.likes[designId].push(userId);
        await this.saveSocialData(data);
        return { success: true, count: data.likes[designId].length };
      }

      return { success: false, message: 'Already liked' };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Unlike a design
   */
  async unlikeDesign(designId, userId) {
    try {
      const data = await this.getSocialData();
      
      if (data.likes[designId]) {
        data.likes[designId] = data.likes[designId].filter((id) => id !== userId);
        await this.saveSocialData(data);
        return { success: true, count: data.likes[designId].length };
      }

      return { success: false, message: 'Not liked yet' };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get like count for a design
   */
  async getLikeCount(designId) {
    try {
      const data = await this.getSocialData();
      return data.likes[designId]?.length || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Check if user liked a design
   */
  async isLiked(designId, userId) {
    try {
      const data = await this.getSocialData();
      return data.likes[designId]?.includes(userId) || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Add comment to a design
   */
  async addComment(designId, userId, text) {
    try {
      const data = await this.getSocialData();
      
      if (!data.comments[designId]) {
        data.comments[designId] = [];
      }

      const comment = {
        id: generateId(),
        userId,
        text,
        timestamp: new Date().toISOString(),
        likes: [],
      };

      data.comments[designId].push(comment);
      await this.saveSocialData(data);

      return { success: true, comment };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get comments for a design
   */
  async getComments(designId) {
    try {
      const data = await this.getSocialData();
      return data.comments[designId] || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(designId, commentId, userId) {
    try {
      const data = await this.getSocialData();
      
      if (data.comments[designId]) {
        data.comments[designId] = data.comments[designId].filter(
          (comment) => comment.id !== commentId || comment.userId === userId
        );
        await this.saveSocialData(data);
        return { success: true };
      }

      return { success: false, message: 'Comment not found' };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Share design
   */
  async shareDesign(designId, userId, platform) {
    try {
      const data = await this.getSocialData();
      
      if (!data.shares[designId]) {
        data.shares[designId] = [];
      }

      const share = {
        id: generateId(),
        userId,
        platform,
        timestamp: new Date().toISOString(),
      };

      data.shares[designId].push(share);
      await this.saveSocialData(data);

      return { success: true, count: data.shares[designId].length };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get share count
   */
  async getShareCount(designId) {
    try {
      const data = await this.getSocialData();
      return data.shares[designId]?.length || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Follow user
   */
  async followUser(userId, targetUserId) {
    try {
      const data = await this.getSocialData();
      
      if (!data.follows.includes(targetUserId)) {
        data.follows.push(targetUserId);
        await this.saveSocialData(data);
        return { success: true, count: data.follows.length };
      }

      return { success: false, message: 'Already following' };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId, targetUserId) {
    try {
      const data = await this.getSocialData();
      data.follows = data.follows.filter((id) => id !== targetUserId);
      await this.saveSocialData(data);
      return { success: true, count: data.follows.length };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Check if following user
   */
  async isFollowing(userId, targetUserId) {
    try {
      const data = await this.getSocialData();
      return data.follows.includes(targetUserId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get following count
   */
  async getFollowingCount() {
    try {
      const data = await this.getSocialData();
      return data.follows.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get followers count
   */
  async getFollowersCount() {
    try {
      const data = await this.getSocialData();
      return data.followers.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Bookmark design
   */
  async bookmarkDesign(designId, userId) {
    try {
      const data = await this.getSocialData();
      
      if (!data.bookmarks.includes(designId)) {
        data.bookmarks.push(designId);
        await this.saveSocialData(data);
        return { success: true };
      }

      return { success: false, message: 'Already bookmarked' };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(designId) {
    try {
      const data = await this.getSocialData();
      data.bookmarks = data.bookmarks.filter((id) => id !== designId);
      await this.saveSocialData(data);
      return { success: true };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get bookmarks
   */
  async getBookmarks() {
    try {
      const data = await this.getSocialData();
      return data.bookmarks;
    } catch (error) {
      return [];
    }
  }

  /**
   * Check if design is bookmarked
   */
  async isBookmarked(designId) {
    try {
      const data = await this.getSocialData();
      return data.bookmarks.includes(designId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get design stats
   */
  async getDesignStats(designId) {
    try {
      const data = await this.getSocialData();
      
      return {
        likes: data.likes[designId]?.length || 0,
        comments: data.comments[designId]?.length || 0,
        shares: data.shares[designId]?.length || 0,
      };
    } catch (error) {
      return { likes: 0, comments: 0, shares: 0 };
    }
  }

  /**
   * Get user activity feed
   */
  async getActivityFeed(userId, limit = 20) {
    try {
      // This would normally fetch from a backend API
      // For now, return mock data
      return {
        activities: [],
        hasMore: false,
      };
    } catch (error) {
      return { activities: [], hasMore: false };
    }
  }

  /**
   * Report content
   */
  async reportContent(contentId, contentType, reason, userId) {
    try {
      // In a real app, this would send to a moderation system
      const report = {
        id: generateId(),
        contentId,
        contentType,
        reason,
        userId,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      console.log('[SocialService] Content reported:', report);
      return { success: true, report };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }
}

// Create singleton instance
const socialService = new SocialService();

export default socialService;
