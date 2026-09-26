import Link from 'next/link';
import { BrandFooter } from '@/components/BrandFooter';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-xl font-black bg-gradient-to-r from-indigo-400 to-sky-500 bg-clip-text text-transparent tracking-wider select-none">
                        BITBYTE
                    </div>
                    <div className="flex gap-6 items-center">
                        <Link href="/auth/signin" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/onboarding" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-indigo-400 mb-10 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        SaaS Platform for Modern Cafes & Restaurants
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
                        TRANSFORM YOUR <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-500 bg-clip-text text-transparent">
                            DINING EXPERIENCE
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
                        A robust, high-performance SaaS engine for cafes and restaurants.
                        Real-time orders, powerful analytics, and seamless multi-tenancy.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/onboarding" className="bg-white text-black text-lg font-black px-10 py-4 rounded-xl transition-transform hover:scale-105">
                            Launch Your Business
                        </Link>
                        <button className="bg-slate-900 text-white text-lg font-black px-10 py-4 rounded-xl border border-white/10 hover:bg-slate-800 transition-transform hover:scale-105">
                            View Demo
                        </button>
                    </div>
                </div>
            </main>

            {/* Features Glass Card Grid */}
            <section className="py-32 px-6 bg-gradient-to-b from-black to-slate-950">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Real-Time Sync', desc: 'Instant order updates with zero-latency Socket.io integration.' },
                        { title: 'Smart Analytics', desc: 'Track revenue, popular items, and customer behavior in real-time.' },
                        { title: 'Multi-Tenancy', desc: 'Independent restaurant instances with secure data isolation.' }
                    ].map((f, i) => (
                        <div key={i} className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-colors">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl mb-6 flex items-center justify-center text-blue-400 font-bold">
                                0{i + 1}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-400 text-lg leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            <BrandFooter className="mx-auto max-w-7xl px-6 pb-8 pt-6" color="#94a3b8" borderColor="#334155" />
        </div>
    );
}
