import MenuItem, { IMenuItem } from '@/models/MenuItem';
import mongoose from 'mongoose';

export class MenuService {
    /**
     * Get all menu items for a restaurant, grouped by category
     */
    static async getMenu(restaurantId: string): Promise<IMenuItem[]> {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) return [];
        return MenuItem.find({ restaurantId, isAvailable: true }).sort({ category: 1, name: 1 });
    }

    /**
     * Add or update an item
     */
    static async upsertItem(restaurantId: string, data: Partial<IMenuItem>): Promise<IMenuItem> {
        if (data.category) {
            data.category = data.category
                .trim()
                .split(/\s+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
        if (data._id) {
            const item = await MenuItem.findOneAndUpdate(
                { _id: data._id, restaurantId },
                data,
                { new: true }
            );
            if (!item) throw new Error('Item not found or unauthorized');
            return item;
        }
        const newItem = new MenuItem({ ...data, restaurantId });
        return newItem.save();
    }

    /**
     * Delete an item
     */
    static async deleteItem(restaurantId: string, itemId: string): Promise<boolean> {
        const result = await MenuItem.deleteOne({ _id: itemId, restaurantId });
        return result.deletedCount > 0;
    }
}
