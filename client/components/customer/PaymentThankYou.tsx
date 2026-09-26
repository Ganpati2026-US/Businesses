'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';
import { contrastTextColor } from '@/lib/color';
import styles from './PaymentThankYou.module.css';
import { BrandFooter } from '@/components/BrandFooter';

interface PaymentThankYouProps {
    orderId: string;
    amount?: number;
    restaurantName: string;
    logoUrl?: string;
    accent: string;
    menuHref: string;
    onClose: () => void;
}

export function PaymentThankYou({ orderId, amount, restaurantName, logoUrl, accent, menuHref, onClose }: PaymentThankYouProps) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-thank-you-title"
            className={`fixed inset-0 z-[70] overflow-y-auto bg-[#faf9f6] text-zinc-900 ${styles.backdrop}`}
            style={{ backgroundImage: `radial-gradient(circle at 50% 35%, ${accent}18, transparent 55%)` }}
        >
            <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        {logoUrl ? <img src={logoUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" /> :
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold" style={{ backgroundColor: accent, color: contrastTextColor(accent) }}>{restaurantName.charAt(0)}</div>}
                        <span className="truncate text-sm font-bold">{restaurantName}</span>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close payment confirmation" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                    <div className={`relative grid h-32 w-32 place-items-center rounded-full ${styles.seal}`} style={{ backgroundColor: `${accent}16`, color: accent, boxShadow: `0 0 0 1px ${accent}25, 0 18px 55px ${accent}22` }}>
                        <div className={`absolute inset-3 rounded-full border-2 ${styles.ring}`} style={{ borderColor: `${accent}55` }} />
                        <svg viewBox="0 0 64 64" fill="none" className="relative h-16 w-16" aria-hidden="true">
                            <path className={styles.check} d="M15 33.5 27 45 50 20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={`absolute -left-5 top-4 h-2 w-2 rounded-full ${styles.sparkleOne}`} style={{ backgroundColor: accent }} />
                        <span className={`absolute -right-4 top-11 h-1.5 w-1.5 rounded-full ${styles.sparkleTwo}`} style={{ backgroundColor: accent }} />
                        <span className={`absolute bottom-1 -right-1 h-2 w-2 rounded-full ${styles.sparkleThree}`} style={{ backgroundColor: accent }} />
                    </div>

                    <div className={styles.message}>
                        <p role="status" className="mt-9 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>Payment received</p>
                        <h1 id="payment-thank-you-title" className="mt-4 font-serif text-[clamp(3.5rem,14vw,6rem)] leading-none tracking-tight">Thank you<span style={{ color: accent }}>.</span></h1>
                        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-zinc-600">It was a pleasure having you at <span className="font-semibold text-zinc-900">{restaurantName}</span>.</p>
                        <p className="mt-2 font-serif text-2xl italic" style={{ color: accent }}>Please come again.</p>
                        <p className="mt-2 text-sm text-zinc-500">We look forward to welcoming you back.</p>
                    </div>

                    <div className={`mt-9 w-full max-w-sm rounded-[22px] border border-zinc-200 bg-white/80 px-5 py-4 shadow-sm ${styles.message}`}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-zinc-500">Order #{orderId.slice(-6).toUpperCase()}</span>
                            <span className="font-bold" style={{ color: accent }}>Paid</span>
                        </div>
                        {typeof amount === 'number' && <p className="mt-2 border-t border-zinc-100 pt-2 text-left text-sm font-semibold">{formatCurrency(amount)} received</p>}
                    </div>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-2">
                    <button type="button" onClick={onClose} autoFocus className="min-h-12 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[0.98]" style={{ backgroundColor: accent, color: contrastTextColor(accent) }}>View your order</button>
                    <Link href={menuHref} onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50">Back to menu <ArrowRightIcon className="h-4 w-4" /></Link>
                </div>
                <BrandFooter className="mt-8 pt-4" showDivider={false} />
            </div>
        </div>
    );
}
