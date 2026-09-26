import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { MenuList } from '@/components/dashboard/MenuList';

export default async function MenuPage() {
    const session = await auth();

    if (!session || !session.user.restaurantId) {
        redirect('/auth/signin');
    }

    await dbConnect();

    const menuItems = await MenuItem.find({
        restaurantId: session.user.restaurantId,
    })
        .select('-imageUrl -aestheticImageUrl')
        .sort({ category: 1, createdAt: -1 })
        .lean();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-display">
                    Menu Management
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage your restaurant menu items
                </p>
            </div>

            <MenuList initialMenuItems={JSON.parse(JSON.stringify(menuItems))} />
        </div>
    );
}
