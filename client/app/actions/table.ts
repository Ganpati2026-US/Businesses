'use server';

import { apiFetch } from '@/client-lib/api';
import { revalidatePath } from 'next/cache';

export async function getPublicTable(id: string) {
    try {
        const res = await apiFetch(`/api/v1/tables/public/${encodeURIComponent(id)}`);
        return res.ok ? await res.json() : null;
    } catch { return null; }
}

export async function createTable(tableNumber: string) {
    try {
        const res = await apiFetch('/api/v1/tables', {
            method: 'POST',
            body: JSON.stringify({ tableNumber }),
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to create table' };
        }

        const table = await res.json();
        revalidatePath('/dashboard/tables');
        return { success: true, data: table };
    } catch (error) {
        console.error('Error creating table:', error);
        return { success: false, error: 'Failed to create table' };
    }
}

export async function createTables(count: number) {
    try {
        const res = await apiFetch('/api/v1/tables/batch', {
            method: 'POST',
            body: JSON.stringify({ count }),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            return { success: false, error: error.error || 'Failed to add tables' };
        }
        const result = await res.json();
        revalidatePath('/dashboard/tables');
        revalidatePath('/dashboard');
        return { success: true, tables: result.tables };
    } catch (error) {
        console.error('Error adding tables:', error);
        return { success: false, error: 'Failed to add tables' };
    }
}

export async function deleteTable(id: string) {
    try {
        const res = await apiFetch(`/api/v1/tables/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to delete table' };
        }

        revalidatePath('/dashboard/tables');
        return { success: true };
    } catch (error) {
        console.error('Error deleting table:', error);
        return { success: false, error: 'Failed to delete table' };
    }
}

export async function toggleTableStatus(id: string) {
    try {
        const res = await apiFetch(`/api/v1/tables/${id}/toggle`, {
            method: 'PATCH',
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to toggle table status' };
        }

        revalidatePath('/dashboard/tables');
        return { success: true };
    } catch (error) {
        console.error('Error toggling table status:', error);
        return { success: false, error: 'Failed to toggle table status' };
    }
}
