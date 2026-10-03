import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import OrderAlerts from '@/components/dashboard/OrderAlerts';
import { BrandFooter } from '@/components/BrandFooter';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/auth/signin');
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-y-auto">
                <div className="flex min-h-full flex-col">
                    <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
                        <OrderAlerts restaurantId={session.user.restaurantId ? String(session.user.restaurantId) : undefined} baselineTime={Date.now()} />
                        {children}
                    </div>
                    <BrandFooter className="mx-auto w-full max-w-7xl px-6 pb-6 pt-5" borderColor="#e2e8f0" />
                </div>
            </main>
        </div>
    );
}
