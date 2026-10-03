'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { DivineTransition } from '@/components/DivineTransition';
import {
    HomeIcon,
    DocumentTextIcon,
    TableCellsIcon,
    ShoppingBagIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    ArchiveBoxIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Menu', href: '/dashboard/menu', icon: DocumentTextIcon },
    { name: 'Tables', href: '/dashboard/tables', icon: TableCellsIcon },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Inventory', href: '/dashboard/inventory', icon: ArchiveBoxIcon },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = () => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        window.setTimeout(() => {
            void signOut({ callbackUrl: '/auth/signin' });
        }, 2200);
    };

    return (
        <div className="flex h-full w-64 shrink-0 flex-col border-r border-sky-100 bg-sky-50 text-slate-900">
            {isSigningOut && <DivineTransition deity="lakshmi" />}
            <div className="px-6 py-7 border-b border-sky-100">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tight text-slate-900 select-none">BitByte</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-sky-200/60 text-sky-700'
                                : 'text-slate-600 hover:bg-sky-100 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-sky-600' : ''}`} />
                            <span>{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="flex h-24 shrink-0 items-center border-t border-slate-200 px-3">
                <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
