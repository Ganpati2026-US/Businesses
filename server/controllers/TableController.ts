import { Request, Response } from 'express';
import Table from '../models/Table';
import { generateQRCode } from '../lib/qrcode';
import mongoose from 'mongoose';

export class TableController {
    /**
     * Get all tables for the owner's restaurant
     */
    static async getTables(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const tables = await Table.find({ restaurantId: user.restaurantId }).sort({ tableNumber: 1 });
            res.json(tables);
        } catch (error: any) {
            console.error('Get tables error:', error);
            res.status(500).json({ error: 'Failed to fetch tables' });
        }
    }

    /**
     * Create a new table and generate its QR code
     */
    static async create(req: Request, res: Response) {
        try {
            const user = req.user;
            const { tableNumber } = req.body;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            if (typeof tableNumber !== 'string' || !tableNumber.trim()) {
                return res.status(400).json({ error: 'Table number is required' });
            }
            if (tableNumber.trim().toLowerCase() === '__takeaway__') {
                return res.status(400).json({ error: 'This table number is reserved' });
            }

            const restaurantId = user.restaurantId;

            // Check if table number already exists
            const existingTable = await Table.findOne({ restaurantId, tableNumber });
            if (existingTable) {
                return res.status(400).json({ error: 'Table number already exists' });
            }

            // Create table
            const table = await Table.create({
                restaurantId,
                tableNumber,
            });

            // Generate QR code pointing to the frontend customer interface
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const tableUrl = `${baseUrl}/table/${restaurantId}/${table._id}`;
            const qrCodeDataUrl = await generateQRCode(tableUrl);

            table.qrCodeDataUrl = qrCodeDataUrl;
            await table.save();

            res.status(201).json(table);
        } catch (error: any) {
            console.error('Create table error:', error);
            res.status(500).json({ error: 'Failed to create table' });
        }
    }

    /** Create consecutively numbered physical tables and their QR codes in one request. */
    static async createBatch(req: Request, res: Response) {
        const user = req.user;
        if (!user?.restaurantId) {
            return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
        }
        const count = Number(req.body?.count);
        if (!Number.isInteger(count) || count < 1 || count > 50) {
            return res.status(400).json({ error: 'Choose between 1 and 50 tables' });
        }

        const restaurantId = user.restaurantId;
        const created: Array<{ _id: mongoose.Types.ObjectId; tableNumber: string }> = [];
        try {
            const existing = await Table.find({ restaurantId, isTakeaway: { $ne: true } }).select('tableNumber').lean();
            let nextNumber = existing.reduce((highest, table) => {
                    const value = Number(table.tableNumber);
                    return /^\d+$/.test(table.tableNumber) && Number.isSafeInteger(value) ? Math.max(highest, value) : highest;
                }, existing.length) + 1;
            const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

            while (created.length < count) {
                const tableNumber = String(nextNumber++);
                const _id = new mongoose.Types.ObjectId();
                const qrCodeDataUrl = await generateQRCode(`${baseUrl}/table/${restaurantId}/${_id}`);
                try {
                    const table = await Table.create({ _id, restaurantId, tableNumber, qrCodeDataUrl });
                    created.push({ _id: table._id as mongoose.Types.ObjectId, tableNumber });
                } catch (error: any) {
                    if (error?.code === 11000) continue;
                    throw error;
                }
            }
            res.status(201).json({ tables: created });
        } catch (error) {
            if (created.length) {
                await Table.deleteMany({ restaurantId, _id: { $in: created.map((table) => table._id) } }).catch(console.error);
            }
            console.error('Create tables error:', error);
            res.status(500).json({ error: 'Failed to add tables' });
        }
    }

    /**
     * Delete a table
     */
    static async delete(req: Request, res: Response) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const result = await Table.findOneAndDelete({
                _id: id,
                restaurantId: user.restaurantId,
                isTakeaway: { $ne: true },
            });

            if (!result) {
                return res.status(404).json({ error: 'Table not found or unauthorized' });
            }

            res.json({ success: true });
        } catch (error: any) {
            console.error('Delete table error:', error);
            res.status(500).json({ error: 'Failed to delete table' });
        }
    }

    /**
     * Toggle active status of a table
     */
    static async toggleStatus(req: Request, res: Response) {
        try {
            const user = req.user;
            const { id } = req.params;
            if (!user || !user.restaurantId) {
                return res.status(401).json({ error: 'Unauthorized: No restaurant associated' });
            }

            const table = await Table.findOne({
                _id: id,
                restaurantId: user.restaurantId,
                isTakeaway: { $ne: true },
            });

            if (!table) {
                return res.status(404).json({ error: 'Table not found or unauthorized' });
            }

            table.isActive = !table.isActive;
            await table.save();

            res.json({ success: true, isActive: table.isActive });
        } catch (error: any) {
            console.error('Toggle table status error:', error);
            res.status(500).json({ error: 'Failed to toggle table status' });
        }
    }

    /**
     * Fetch public table info for customers
     */
    static async getPublicTable(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id as string)) {
                return res.status(400).json({ error: 'Invalid table ID' });
            }

            const table = await Table.findById(id).lean();
            if (!table) {
                return res.status(404).json({ error: 'Table not found' });
            }

            res.json(table);
        } catch (error: any) {
            console.error('Get public table error:', error);
            res.status(500).json({ error: 'Failed to fetch table info' });
        }
    }
}
