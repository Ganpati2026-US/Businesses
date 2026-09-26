import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Restaurant from '@/models/Restaurant';
import { OrdersList } from '@/components/dashboard/OrdersList';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default async function OrdersPage() {
    const session = await auth();

    if (!session || !session.user.restaurantId) {
        redirect('/auth/signin');
    }

    await dbConnect();

    const [recentOrders, unpaidOrders, takeawayOrders, restaurant] = await Promise.all([
        Order.find({
            restaurantId: session.user.restaurantId,
        })
            .populate('tableId', '-qrCodeDataUrl')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean(),
        Order.find({
            restaurantId: session.user.restaurantId,
            status: 'completed',
            paymentStatus: { $ne: 'paid' },
        })
            .populate('tableId', '-qrCodeDataUrl')
            .sort({ createdAt: -1 })
            .lean(),
        Order.find({ restaurantId: session.user.restaurantId, orderType: 'takeaway' })
            .populate('tableId', '-qrCodeDataUrl')
            .sort({ createdAt: -1 })
            .lean(),
        Restaurant.findById(session.user.restaurantId).select('name gstNumber gstPercentage sgstPercentage packagingCharge address phone').lean()
    ]);
    const ordersById = new Map([...recentOrders, ...unpaidOrders, ...takeawayOrders].map(order => [String(order._id), order]));
    const orders = [...ordersById.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Orders
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Manage and track customer orders in real-time
                </p>
            </div>

            <OrdersList
                initialOrders={JSON.parse(JSON.stringify(orders))}
                restaurant={JSON.parse(JSON.stringify(restaurant))}
            />
        </div>
    );
}
