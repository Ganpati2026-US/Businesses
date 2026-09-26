'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { BrandFooter } from '@/components/BrandFooter';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        restaurantName: '',
        slug: '',
        description: '',
        themeColor: '#38bdf8',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/restaurant/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6">
            <div className="max-w-xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-black mb-2">Claim Your Spot</h1>
                        <p className="text-slate-400 mb-8 font-medium">Choose a unique name and URL for your restaurant.</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Business/Restaurant Name</label>
                                <input
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Blue Lagoon Cafe"
                                    value={formData.restaurantName}
                                    onChange={e => setFormData({ ...formData, restaurantName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">URL Slug</label>
                                <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all">
                                    <span className="text-slate-500 font-medium">bitbyte.com/r/</span>
                                    <input
                                        className="flex-1 bg-transparent border-none outline-none"
                                        placeholder="blue-lagoon"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    />
                                </div>
                            </div>
                            <Button variant="primary" className="w-full py-4 text-lg font-bold bg-indigo-600 hover:bg-indigo-700" onClick={handleNext} disabled={!formData.restaurantName || !formData.slug}>
                                Continue
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-black mb-2">Build Your Identity</h1>
                        <p className="text-slate-400 mb-8 font-medium">Add a description and pick your brand color.</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                                    placeholder="Tell your customers what makes you special..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Brand Color</label>
                                <div className="flex gap-4">
                                    {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 ${formData.themeColor === color ? 'border-white' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData({ ...formData, themeColor: color })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 py-4 font-bold border-white/10" onClick={handleBack}>Back</Button>
                                <Button variant="primary" className="flex-1 py-4 font-bold bg-indigo-600 hover:bg-indigo-700" onClick={handleNext}>Last Step</Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in text-center">
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h1 className="text-3xl font-black mb-2">Ready to Launch?</h1>
                        <p className="text-slate-400 mb-10 font-medium">Confirm your details and start managing your business.</p>

                        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-left mb-10">
                            <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                                <span className="text-slate-500">Name</span>
                                <span className="font-bold">{formData.restaurantName}</span>
                            </div>
                            <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                                <span className="text-slate-500">URL</span>
                                <span className="font-bold text-indigo-400">/r/{formData.slug}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Theme</span>
                                <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: formData.themeColor }} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1 py-4 font-bold border-white/10" onClick={handleBack}>Back</Button>
                            <Button
                                variant="primary"
                                className="flex-1 py-4 font-bold bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Launching...' : 'Create My Business'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <BrandFooter className="mx-auto mt-12 w-full max-w-xl pb-6 pt-5" color="#94a3b8" borderColor="#334155" />
        </div>
    );
}
