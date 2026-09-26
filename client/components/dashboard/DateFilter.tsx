'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CalendarDaysIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPeriod = searchParams?.get('period') || 'month';
    const [isOpen, setIsOpen] = useState(false);

    const periods = [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 Days', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'This Year', value: 'year' },
    ];

    const handleSelect = (period: string) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('period', period);
        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 hover:shadow transition-all text-sm font-medium text-slate-700"
            >
                <CalendarDaysIcon className="w-4 h-4 text-slate-500" />
                <span>{periods.find(p => p.value === currentPeriod)?.label || 'Filter Date'}</span>
                <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 py-1.5 z-20">
                        {periods.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => handleSelect(period.value)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors rounded-lg mx-auto ${currentPeriod === period.value
                                    ? 'text-sky-600 font-semibold bg-sky-50'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
