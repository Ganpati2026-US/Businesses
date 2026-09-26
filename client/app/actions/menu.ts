'use server';

import { apiFetch } from '@/client-lib/api';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { auth } from '@/lib/auth';

export type ScannedMenuItem = {
    name: string;
    description: string;
    price: number;
    category: string;
};

const cleanScannedItem = (item: any): ScannedMenuItem | null => {
    const name = typeof item?.name === 'string' ? item.name.trim().slice(0, 120) : '';
    const description = typeof item?.description === 'string' ? item.description.trim().slice(0, 500) : '';
    const category = typeof item?.category === 'string' ? item.category.trim().slice(0, 80) : '';
    const price = Number(item?.price);
    if (!name || !category || !Number.isFinite(price) || price < 0 || price > 100000) return null;
    return { name, description, category, price: Math.round(price * 100) / 100 };
};

export async function importScannedMenuItems(items: ScannedMenuItem[]) {
    const session = await auth();
    if (!session?.user?.restaurantId) return { success: false, error: 'Please sign in again.' };
    if (!Array.isArray(items) || items.length < 1 || items.length > 100) {
        return { success: false, error: 'Select between 1 and 100 valid items.' };
    }

    const cleaned = items.map(cleanScannedItem).filter(Boolean) as ScannedMenuItem[];
    if (cleaned.length !== items.length) return { success: false, error: 'Check every selected item name, category, and price.' };

    try {
        const currentResponse = await apiFetch('/api/v1/menu');
        const current = currentResponse.ok ? await currentResponse.json() : [];
        const existing = new Set((Array.isArray(current) ? current : []).map((item: any) =>
            `${String(item.name || '').trim().toLowerCase()}::${String(item.category || '').trim().toLowerCase()}`
        ));
        const unique = cleaned.filter((item) => {
            const key = `${item.name.toLowerCase()}::${item.category.toLowerCase()}`;
            if (existing.has(key)) return false;
            existing.add(key);
            return true;
        });

        const results = [];
        for (const item of unique) {
            const response = await apiFetch('/api/v1/menu', {
                method: 'POST',
                body: JSON.stringify({ ...item, imageUrl: '', aestheticImageUrl: '', isAvailable: true }),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                return { success: false, error: body.error || `Could not import ${item.name}.` };
            }
            results.push(await response.json());
        }

        revalidatePath('/dashboard/menu');
        revalidatePath('/table/[restaurantId]/[tableId]', 'page');
        return { success: true, imported: results.length, skipped: cleaned.length - unique.length };
    } catch (error) {
        console.error('Bulk menu import error:', error);
        return { success: false, error: 'Could not import the scanned menu.' };
    }
}


export async function createMenuItem(data: any) {
    try {
        const res = await apiFetch('/api/v1/menu', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to create menu item' };
        }

        const menuItem = await res.json();
        revalidatePath('/dashboard/menu');
        return { success: true, data: menuItem };
    } catch (error) {
        console.error('Error creating menu item:', error);
        return { success: false, error: 'Failed to create menu item' };
    }
}

export async function updateMenuItem(id: string, data: any) {
    try {
        const res = await apiFetch(`/api/v1/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to update menu item' };
        }

        const menuItem = await res.json();
        revalidatePath('/dashboard/menu');
        return { success: true, data: menuItem };
    } catch (error) {
        console.error('Error updating menu item:', error);
        return { success: false, error: 'Failed to update menu item' };
    }
}

export async function deleteMenuItem(id: string) {
    try {
        const res = await apiFetch(`/api/v1/menu/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to delete menu item' };
        }

        revalidatePath('/dashboard/menu');
        return { success: true };
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return { success: false, error: 'Failed to delete menu item' };
    }
}

export async function toggleMenuItemAvailability(id: string) {
    try {
        const res = await apiFetch(`/api/v1/menu/${id}/toggle`, {
            method: 'PATCH',
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to toggle availability' };
        }

        const result = await res.json();
        revalidatePath('/dashboard/menu');
        revalidatePath('/table/[restaurantId]/[tableId]', 'page');
        return { success: true, isAvailable: result.isAvailable };
    } catch (error) {
        console.error('Error toggling availability:', error);
        return { success: false, error: 'Failed to toggle availability' };
    }
}

export async function getPublicMenu(restaurantId: string) {
    try {
        await dbConnect();
        const items = await MenuItem.find({ restaurantId, isAvailable: true })
            .sort({ category: 1, name: 1 })
            .lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error('Error fetching public menu:', error);
        return [];
    }
}
