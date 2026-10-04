import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import { MenuService } from '../services/MenuService';
import mongoose from 'mongoose';

export class MenuController {
    /**
     * Get all menu items for the owner's restaurant
     */
    static async getMenu(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const items = await MenuItem.find({ restaurantId: user.restaurantId }).sort({ category: 1, name: 1 });
            res.json(items);
        } catch (error: any) {
            console.error('Get menu error:', error);
            res.status(500).json({ error: 'Failed to fetch menu items' });
        }
    }

    /**
     * Create a menu item
     */
    static async create(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const item = await MenuService.upsertItem(user.restaurantId, req.body);
            res.status(201).json(item);
        } catch (error: any) {
            console.error('Create menu item error:', error);
            res.status(400).json({ error: error.message || 'Failed to create menu item' });
        }
    }

    /**
     * Update a menu item
     */
    static async update(req: Request, res: Response) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const item = await MenuService.upsertItem(user.restaurantId, { ...req.body, _id: id });
            res.json(item);
        } catch (error: any) {
            console.error('Update menu item error:', error);
            res.status(400).json({ error: error.message || 'Failed to update menu item' });
        }
    }

    /**
     * Delete a menu item
     */
    static async delete(req: Request, res: Response) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const success = await MenuService.deleteItem(user.restaurantId, id as string);
            if (!success) {
                return res.status(404).json({ error: 'Menu item not found or unauthorized' });
            }

            res.json({ success: true });
        } catch (error: any) {
            console.error('Delete menu item error:', error);
            res.status(500).json({ error: 'Failed to delete menu item' });
        }
    }

    /**
     * Toggle availability of a menu item
     */
    static async toggleAvailability(req: Request, res: Response) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const menuItem = await MenuItem.findOne({ _id: id, restaurantId: user.restaurantId });
            if (!menuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }

            menuItem.isAvailable = !menuItem.isAvailable;
            await menuItem.save();

            res.json({ success: true, isAvailable: menuItem.isAvailable });
        } catch (error: any) {
            console.error('Toggle availability error:', error);
            res.status(500).json({ error: 'Failed to toggle availability' });
        }
    }

    /**
     * Get menu for public customer view
     * Cached at CDN/browser for 60s, stale-while-revalidate for 5 minutes.
     * Cache is busted on menu item update/create/delete via menuRoutes.
     */
    static async getPublicMenu(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(restaurantId as string)) {
                return res.status(400).json({ error: 'Invalid restaurant ID' });
            }

            const items = await MenuItem.find({ restaurantId, isAvailable: true })
                .select('-recipe')
                .lean()
                .sort({ category: 1, name: 1 });

            // Allow CDN/browser caching for 60s, with a 5-minute stale-while-revalidate window.
            res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
            res.json(items);
        } catch (error: any) {
            console.error('Get public menu error:', error);
            res.status(500).json({ error: 'Failed to fetch menu' });
        }
    }
}
