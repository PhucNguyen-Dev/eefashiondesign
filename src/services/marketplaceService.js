import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/helpers';
import errorHandler from './errorHandler';

/**
 * Marketplace Service for buying/selling designs
 */
class MarketplaceService {
  constructor() {
    this.STORAGE_KEY = '@marketplace_data';
  }

  /**
   * Get marketplace data
   */
  async getMarketplaceData() {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getInitialData();
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      return this.getInitialData();
    }
  }

  /**
   * Save marketplace data
   */
  async saveMarketplaceData(data) {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      errorHandler.handleStorageError(error, 'save marketplace data');
      return false;
    }
  }

  /**
   * Get initial data structure
   */
  getInitialData() {
    return {
      listings: [],
      purchases: [],
      sales: [],
      cart: [],
      favorites: [],
    };
  }

  /**
   * List design for sale
   */
  async listDesign(designData, pricing) {
    try {
      const data = await this.getMarketplaceData();
      
      const listing = {
        id: generateId(),
        designId: designData.id,
        title: designData.name,
        description: designData.description || '',
        price: pricing.price,
        currency: pricing.currency || 'USD',
        category: designData.category || 'general',
        tags: designData.tags || [],
        sellerId: designData.userId,
        thumbnail: designData.thumbnail,
        images: designData.images || [],
        license: pricing.license || 'standard', // standard, extended, exclusive
        downloads: 0,
        rating: 0,
        reviews: [],
        status: 'active', // active, sold, removed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.listings.push(listing);
      await this.saveMarketplaceData(data);

      return { success: true, listing };
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to list design',
      });
      return { success: false, error };
    }
  }

  /**
   * Update listing
   */
  async updateListing(listingId, updates) {
    try {
      const data = await this.getMarketplaceData();
      const index = data.listings.findIndex((l) => l.id === listingId);

      if (index === -1) {
        return { success: false, message: 'Listing not found' };
      }

      data.listings[index] = {
        ...data.listings[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.saveMarketplaceData(data);
      return { success: true, listing: data.listings[index] };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Remove listing
   */
  async removeListing(listingId, userId) {
    try {
      const data = await this.getMarketplaceData();
      const listing = data.listings.find((l) => l.id === listingId);

      if (!listing) {
        return { success: false, message: 'Listing not found' };
      }

      if (listing.sellerId !== userId) {
        return { success: false, message: 'Unauthorized' };
      }

      listing.status = 'removed';
      listing.updatedAt = new Date().toISOString();

      await this.saveMarketplaceData(data);
      return { success: true };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Search listings
   */
  async searchListings(query, filters = {}) {
    try {
      const data = await this.getMarketplaceData();
      let results = data.listings.filter((l) => l.status === 'active');

      // Text search
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(
          (l) =>
            l.title.toLowerCase().includes(lowerQuery) ||
            l.description.toLowerCase().includes(lowerQuery) ||
            l.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      }

      // Apply filters
      if (filters.category) {
        results = results.filter((l) => l.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        results = results.filter((l) => l.price >= filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        results = results.filter((l) => l.price <= filters.maxPrice);
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'popular':
            results.sort((a, b) => b.downloads - a.downloads);
            break;
          case 'recent':
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      return { success: true, results };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, results: [] };
    }
  }

  /**
   * Get listing details
   */
  async getListingDetails(listingId) {
    try {
      const data = await this.getMarketplaceData();
      const listing = data.listings.find((l) => l.id === listingId);

      if (!listing) {
        return { success: false, message: 'Listing not found' };
      }

      return { success: true, listing };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Add to cart
   */
  async addToCart(listingId, userId) {
    try {
      const data = await this.getMarketplaceData();
      const listing = data.listings.find((l) => l.id === listingId);

      if (!listing) {
        return { success: false, message: 'Listing not found' };
      }

      if (data.cart.some((item) => item.listingId === listingId)) {
        return { success: false, message: 'Already in cart' };
      }

      data.cart.push({
        listingId,
        userId,
        addedAt: new Date().toISOString(),
      });

      await this.saveMarketplaceData(data);
      return { success: true, cartCount: data.cart.length };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Remove from cart
   */
  async removeFromCart(listingId) {
    try {
      const data = await this.getMarketplaceData();
      data.cart = data.cart.filter((item) => item.listingId !== listingId);

      await this.saveMarketplaceData(data);
      return { success: true, cartCount: data.cart.length };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get cart items
   */
  async getCart() {
    try {
      const data = await this.getMarketplaceData();
      const cartItems = data.cart.map((item) => {
        const listing = data.listings.find((l) => l.id === item.listingId);
        return { ...item, listing };
      });

      const total = cartItems.reduce((sum, item) => sum + (item.listing?.price || 0), 0);

      return { success: true, items: cartItems, total };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, items: [], total: 0 };
    }
  }

  /**
   * Purchase design
   */
  async purchaseDesign(listingId, userId, paymentMethod) {
    try {
      const data = await this.getMarketplaceData();
      const listing = data.listings.find((l) => l.id === listingId);

      if (!listing) {
        return { success: false, message: 'Listing not found' };
      }

      // In a real app, this would process payment
      const purchase = {
        id: generateId(),
        listingId,
        designId: listing.designId,
        buyerId: userId,
        sellerId: listing.sellerId,
        price: listing.price,
        currency: listing.currency,
        paymentMethod,
        status: 'completed',
        purchasedAt: new Date().toISOString(),
        downloadUrl: `design_${listing.designId}_download`,
      };

      data.purchases.push(purchase);
      
      // Update listing stats
      listing.downloads++;
      
      // Record sale for seller
      data.sales.push({
        id: purchase.id,
        listingId,
        buyerId: userId,
        amount: listing.price,
        soldAt: new Date().toISOString(),
      });

      await this.saveMarketplaceData(data);

      return { success: true, purchase };
    } catch (error) {
      errorHandler.handleError(error, {
        customMessage: 'Failed to complete purchase',
      });
      return { success: false, error };
    }
  }

  /**
   * Get user purchases
   */
  async getUserPurchases(userId) {
    try {
      const data = await this.getMarketplaceData();
      const purchases = data.purchases.filter((p) => p.buyerId === userId);

      return { success: true, purchases };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, purchases: [] };
    }
  }

  /**
   * Get user sales
   */
  async getUserSales(userId) {
    try {
      const data = await this.getMarketplaceData();
      const sales = data.sales.filter((s) => {
        const listing = data.listings.find((l) => l.id === s.listingId);
        return listing?.sellerId === userId;
      });

      const totalEarnings = sales.reduce((sum, sale) => sum + sale.amount, 0);

      return { success: true, sales, totalEarnings };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, sales: [], totalEarnings: 0 };
    }
  }

  /**
   * Add review
   */
  async addReview(listingId, userId, rating, comment) {
    try {
      const data = await this.getMarketplaceData();
      const listing = data.listings.find((l) => l.id === listingId);

      if (!listing) {
        return { success: false, message: 'Listing not found' };
      }

      const review = {
        id: generateId(),
        userId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      listing.reviews.push(review);
      
      // Update average rating
      listing.rating =
        listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length;

      await this.saveMarketplaceData(data);

      return { success: true, review, averageRating: listing.rating };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, error };
    }
  }

  /**
   * Get seller stats
   */
  async getSellerStats(userId) {
    try {
      const data = await this.getMarketplaceData();
      
      const listings = data.listings.filter((l) => l.sellerId === userId);
      const sales = data.sales.filter((s) => {
        const listing = data.listings.find((l) => l.id === s.listingId);
        return listing?.sellerId === userId;
      });

      const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
      const totalDownloads = listings.reduce((sum, l) => sum + l.downloads, 0);
      const averageRating =
        listings.reduce((sum, l) => sum + (l.rating || 0), 0) / listings.length || 0;

      return {
        success: true,
        stats: {
          activeListings: listings.filter((l) => l.status === 'active').length,
          totalSales: sales.length,
          totalRevenue,
          totalDownloads,
          averageRating: Math.round(averageRating * 10) / 10,
        },
      };
    } catch (error) {
      errorHandler.handleError(error);
      return { success: false, stats: {} };
    }
  }
}

// Create singleton instance
const marketplaceService = new MarketplaceService();

export default marketplaceService;
