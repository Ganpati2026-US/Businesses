import Order, { IOrder } from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import Table from '@/models/Table';
import mongoose from 'mongoose';

export class OrderService {
    /**
     * Create a new order ensure it's linked to a restaurant and table
     */
    static async createOrder(data: any): Promise<IOrder> {
        // Validate restaurantId and tableId are valid ObjectIds
        if (!data.restaurantId || !mongoose.Types.ObjectId.isValid(data.restaurantId)) {
            throw new Error('Invalid restaurant ID');
        }
        if (!data.tableId || !mongoose.Types.ObjectId.isValid(data.tableId)) {
            throw new Error('Invalid table ID');
        }

        const table = await Table.findOne({ _id: data.tableId, restaurantId: data.restaurantId, isActive: true });
        if (!table) throw new Error('This ordering QR is unavailable');

        const menuItemIds = data.items.map((item: any) => item.menuItemId);
        
        // Strictly fetch items matching specified IDs AND belonging to this restaurant
        const menuItems = await MenuItem.find({
            _id: { $in: menuItemIds },
            restaurantId: data.restaurantId
        });

        let calculatedTotal = 0;
        data.items = data.items.map((item: any) => {
            const dbItem = menuItems.find((m) => m._id.toString() === item.menuItemId.toString());
            
            // Reject the order if the menu item doesn't exist or is not available for this restaurant
            if (!dbItem) {
                throw new Error(`Menu item ${item.name || item.menuItemId} is invalid or not available at this restaurant.`);
            }

            const price = dbItem.price;
            calculatedTotal += price * item.quantity;
            return {
                ...item,
                price, // Overwrite/enforce database price
                name: dbItem.name,
                dietaryType: dbItem.dietaryType || 'unknown',
                itemType: dbItem.itemType || 'food',
            };
        });

        const order = new Order({
            restaurantId: data.restaurantId,
            tableId: data.tableId,
            orderType: table.isTakeaway ? 'takeaway' : 'dine-in',
            items: data.items,
            total: calculatedTotal,
            status: 'pending',
            paymentStatus: 'pending',
            sessionId: data.sessionId,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            notes: data.notes,
        });
        return order.save();
    }

    /**
     * Get recent orders for a restaurant dashboard.
     * Always scoped by restaurantId.
     * @param restaurantId - The restaurant to fetch orders for
     * @param limit        - Max number of orders to return (default 50)
     * @param status       - Optional status filter (e.g. 'pending', 'preparing')
     * @param before       - Optional cursor: return orders created before this Date (for pagination)
     */
    static async getRestaurantOrders(
        restaurantId: string,
        limit = 50,
        status?: string,
        before?: Date
    ): Promise<IOrder[]> {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) return [];

        const filter: Record<string, any> = { restaurantId };
        if (status) filter.status = status;
        if (before) filter.createdAt = { $lt: before };

        return Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(Math.min(limit, 100)) // Hard cap at 100 to protect DB
            .populate('tableId', 'tableNumber')
            .lean() as unknown as IOrder[];
    }

    /** Keep every outstanding completed bill in the dashboard, even when it is older than recent orders. */
    static async getDashboardOrders(restaurantId: string): Promise<IOrder[]> {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) return [];

        const [recent, unpaid, takeaway] = await Promise.all([
            this.getRestaurantOrders(restaurantId, 100),
            Order.find({ restaurantId, status: 'completed', paymentStatus: { $ne: 'paid' } })
                .sort({ createdAt: -1 })
                .populate('tableId', 'tableNumber')
                .lean() as unknown as Promise<IOrder[]>,
            Order.find({ restaurantId, orderType: 'takeaway' })
                .sort({ createdAt: -1 })
                .populate('tableId', 'tableNumber')
                .lean() as unknown as Promise<IOrder[]>,
        ]);

        const byId = new Map<string, IOrder>();
        for (const order of [...recent, ...unpaid, ...takeaway]) byId.set(String(order._id), order);
        return [...byId.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * Update order status with validation
     */
    static async updateStatus(orderId: string, restaurantId: string, status: IOrder['status']): Promise<IOrder | null> {
        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(restaurantId)) {
            return null;
        }
        return Order.findOneAndUpdate(
            { _id: orderId, restaurantId },
            { status },
            { new: true }
        );
    }

    /**
     * Update payment status
     */
    static async updatePaymentStatus(orderId: string, restaurantId: string, paymentMethod: 'upi' | 'cash'): Promise<IOrder | null> {
        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(restaurantId)) {
            return null;
        }
        return Order.findOneAndUpdate(
            { _id: orderId, restaurantId, status: 'completed', paymentStatus: { $ne: 'paid' } },
            { $set: { paymentStatus: 'paid', paymentMethod, paidAt: new Date() } },
            { new: true }
        );
    }

    /**
     * Get analytics for restaurant
     */
    static async getStats(restaurantId: string) {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
        }
        const stats = await Order.aggregate([
            { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    orderCount: { $count: {} },
                    avgOrderValue: { $avg: '$total' }
                }
            }
        ]);
        return stats[0] || { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
    }
}
