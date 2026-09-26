import mongoose from 'mongoose';
import Restaurant, { IRestaurant } from '@/models/Restaurant';

export class TenantService {
    /**
     * Get restaurant context by slug
     * Used for customer-facing pages and API isolation
     */
    static async getBySlug(slug: string): Promise<IRestaurant | null> {
        return Restaurant.findOne({ slug, status: 'active' }).populate('ownerId', 'name email');
    }

    /**
     * Get restaurant context by ID
     * Used for authenticated dashboard actions
     */
    static async getById(id: string): Promise<IRestaurant | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Restaurant.findById(id);
    }

    /**
     * Get restaurant context by custom domain
     */
    static async getByDomain(domain: string): Promise<IRestaurant | null> {
        return Restaurant.findOne({ customDomain: domain, status: 'active' });
    }

    /**
     * Verify if a user belongs to a tenant
     */
    static async verifyAccess(userId: string, restaurantId: string): Promise<boolean> {
        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            ownerId: userId,
        });
        return !!restaurant;
    }
}
