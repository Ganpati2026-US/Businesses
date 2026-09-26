'use client';

import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, GiftIcon, SparklesIcon, ClockIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const diningOffers = [
    { eyebrow: 'A little something for you', title: '10% off your order', detail: 'Use DINE10 when you pay', icon: GiftIcon },
    { eyebrow: 'Made for your table', title: 'Fresh from the kitchen', detail: 'Order here, relax, and follow every step', icon: SparklesIcon },
    { eyebrow: 'Stay in the moment', title: 'Pay when you are ready', detail: 'UPI opens after your order is complete', icon: ClockIcon },
];

const takeawayOffers = [
    { eyebrow: 'A simple way to order', title: 'Your favourites, ready to go', detail: 'Browse the menu and order for pickup', icon: ShoppingBagIcon },
    { eyebrow: 'Made fresh for pickup', title: 'Great food, on your schedule', detail: 'Order now and follow every step', icon: SparklesIcon },
    { eyebrow: 'A simple final step', title: 'Pay when your order is ready', detail: 'UPI opens after your order is complete', icon: ClockIcon },
];

export function OfferCarousel({ accent = '#2563eb', dark = false, takeaway = false }: { accent?: string; dark?: boolean; takeaway?: boolean }) {
    const [active, setActive] = useState(0);
    const offers = takeaway ? takeawayOffers : diningOffers;
    const offer = offers[active];
    const Icon = offer.icon;

    return (
        <section aria-label={takeaway ? 'Takeaway highlights' : 'Dining highlights'} aria-roledescription="carousel" className={`rounded-[22px] border px-4 py-3 shadow-sm ${dark ? 'border-slate-700 bg-slate-800' : 'border-zinc-200/80 bg-white/90'}`}>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}16`, color: accent }}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1" aria-live="polite">
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${dark ? 'text-slate-400' : 'text-zinc-400'}`}>{offer.eyebrow}</p>
                    <p className={`truncate text-sm font-bold ${dark ? 'text-white' : 'text-zinc-900'}`}>{offer.title}</p>
                    <p className={`truncate text-xs ${dark ? 'text-slate-300' : 'text-zinc-500'}`}>{offer.detail}</p>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" aria-label="Previous highlight" onClick={() => setActive((active + offers.length - 1) % offers.length)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2" style={{ outlineColor: accent }}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Next highlight" onClick={() => setActive((active + 1) % offers.length)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2" style={{ outlineColor: accent }}>
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="mt-2 flex justify-center gap-1.5" aria-label={`Highlight ${active + 1} of ${offers.length}`}>
                {offers.map((item, index) => (
                    <button key={item.title} type="button" aria-label={`Show highlight ${index + 1}`} onClick={() => setActive(index)} className="h-1.5 rounded-full transition-all" style={{ width: active === index ? 19 : 6, backgroundColor: active === index ? accent : '#d4d4d8' }} />
                ))}
            </div>
        </section>
    );
}
