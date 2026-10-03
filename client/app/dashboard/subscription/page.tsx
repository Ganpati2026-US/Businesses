import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default async function SubscriptionPage() {
    const session = await auth();
    if (!session) redirect('/auth/signin');
    if (session.user.role !== 'restaurant_owner' || !session.user.restaurantId) redirect('/dashboard');

    return (
        <div className="mx-auto max-w-3xl space-y-7">
            <div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"><ArrowLeftIcon className="h-4 w-4" /> Dashboard</Link>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Owner billing</h1>
                <p className="mt-2 text-sm text-slate-600">Manage your BitByte subscription and renewal settings here.</p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-4 border-b border-slate-100 p-6 sm:p-8">
                    <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><CreditCardIcon className="h-7 w-7" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Subscription renewal</h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">Your renewal plan and price will appear here once BitByte publishes them.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-6 sm:p-8">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><ShieldCheckIcon className="h-7 w-7" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">PhonePe UPI AutoPay</h2>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">AutoPay setup will open here when the renewal plan is published. You will review the amount and schedule and approve the mandate in your UPI app before any recurring payment starts.</p>
                        <p className="mt-3 text-xs font-medium text-slate-500">AutoPay is currently unavailable. No recurring payment is active through this page.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
