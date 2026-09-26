'use client';

import Image from 'next/image';

type DivineTransitionProps = {
    deity: 'ganesha' | 'lakshmi';
};

const content = {
    ganesha: {
        image: '/launch/ganesha.webp',
        alt: 'Lord Ganesha in a blessing pose',
        eyebrow: 'An auspicious beginning',
        title: 'Welcome to BitByte',
        message: 'May wisdom guide every decision and every service begin beautifully.',
        glow: 'from-amber-200/70 via-orange-100/50 to-transparent',
    },
    lakshmi: {
        image: '/launch/lakshmi.webp',
        alt: 'Goddess Lakshmi seated on a lotus in a blessing pose',
        eyebrow: 'With gratitude',
        title: 'Prosperity on your path',
        message: 'May your work continue to grow with abundance, care, and success.',
        glow: 'from-rose-200/70 via-amber-100/50 to-transparent',
    },
} as const;

export function DivineTransition({ deity }: DivineTransitionProps) {
    const view = content[deity];

    return (
        <div
            className="divine-transition fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#fffaf1]/95 px-6 text-center backdrop-blur-xl"
            role="status"
            aria-live="polite"
        >
            <div className={`absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial ${view.glow} blur-3xl`} />
            <div className="divine-transition-content relative flex max-w-lg flex-col items-center">
                <div className="divine-transition-image relative h-64 w-64 sm:h-72 sm:w-72">
                    <Image src={view.image} alt={view.alt} fill priority sizes="288px" className="object-contain drop-shadow-[0_24px_45px_rgba(146,64,14,0.18)]" />
                </div>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-700">{view.eyebrow}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{view.title}</h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">{view.message}</p>
                <div className="mt-7 h-1 w-28 overflow-hidden rounded-full bg-amber-100">
                    <div className="divine-transition-progress h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                </div>
            </div>
        </div>
    );
}
