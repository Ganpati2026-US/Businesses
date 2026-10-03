'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpAction, signInAction } from '@/app/actions/auth';
import toast, { Toaster } from 'react-hot-toast';
import { BrandFooter } from '@/components/BrandFooter';
import { RestaurantAddressField } from '@/components/RestaurantAddressField';

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        restaurantName: '',
        fssaiNumber: '',
        phone: '',
        address: '',
        secretKey: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUpAction({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                restaurantName: formData.restaurantName,
                fssaiNumber: formData.fssaiNumber,
                phone: formData.phone,
                address: formData.address,
                secretKey: formData.secretKey,
            });

            if (result.success) {
                toast.success('Account created successfully!');
                await signInAction(formData.email, formData.password);
                router.push('/dashboard');
            } else {
                toast.error(result.error || 'Failed to create account');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-zinc-900">
            <Toaster position="top-center" toastOptions={{
                style: { background: '#18181b', color: '#f4f4f5', borderRadius: '10px', fontSize: '14px' },
            }} />

            {/* Left Pane - Marketing Showcase */}
            <div className="relative hidden md:flex md:w-[45%] lg:w-[42%] xl:w-[45%] border-r border-zinc-200/60 p-12 lg:p-16 flex-col justify-between overflow-hidden min-h-screen select-none" style={{
                backgroundImage: 'url(/showcase_bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                
                {/* Branding & Marketing Headline */}
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl lg:text-4xl font-black text-indigo-600 tracking-tight">BitByte</span>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-zinc-900">
                            Smart Ordering. <br />
                            <span className="text-indigo-600">Smarter Dining.</span>
                        </h1>
                    </div>
                </div>

                {/* Stacked Feature Cards */}
                <div className="relative z-10 space-y-4 max-w-sm my-auto py-8">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 p-4.5 bg-white/95 border border-zinc-200/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.01]">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14v2m-3-3h6m-3 3h3m-6 0v3.75M14 20h3.75M16.5 16.5h.008v.008h-.008v-.008z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-900">Scan QR</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Scan the QR code on your table</p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-4 p-4.5 bg-white/95 border border-zinc-200/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.01]">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-900">Browse Menu</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Explore dishes and place your order</p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-4 p-4.5 bg-white/95 border border-zinc-200/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-transform duration-200 hover:scale-[1.01]">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.61 3.51a14.993 14.993 0 0 0-6.16 12.12 14.98 14.98 0 0 0 12.14 8.74v-4.8m5.84-2.58c-1.2.9-2.73 1.44-4.38 1.44s-3.18-.54-4.38-1.44" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-900">Quick Delivery</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Order goes straight to the kitchen</p>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="relative z-10 text-xs text-zinc-400">
                    <p>© 2026 <span className="text-violet-600">BitByte</span>. All rights reserved.</p>
                    <p>A product of Appetiser India.</p>
                </div>
            </div>

            {/* Right Pane - Form Card */}
            <div className="flex-1 bg-white min-h-screen flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-y-auto">
                
                {/* Navigation Toggle */}
                <div className="absolute top-8 right-8 text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-indigo-600 font-semibold hover:underline">
                        Login
                    </Link>
                </div>
                <div className="w-full max-w-[420px] mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Create your account</h2>
                        <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                            Join BitByte and simplify your restaurant operations.
                        </p>
                    </div>

                    {/* Workspace Indicator Card */}
                    <div className="flex items-center gap-3.5 p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-2xl">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06 1.44l1.19 1.189a3 3 0 1 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-zinc-900">Restaurant</h4>
                            <p className="text-[10.5px] text-indigo-700/85 mt-0.5">Manage your restaurant operations and menus.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Restaurant Name */}
                            <div>
                                <label htmlFor="restaurantName" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                    Restaurant Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06 1.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.5a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="restaurantName"
                                        type="text"
                                        placeholder="Enter restaurant name"
                                        value={formData.restaurantName}
                                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                        required
                                        autoComplete="organization"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Owner Name */}
                            <div>
                                <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                    Owner Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        autoComplete="name"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label htmlFor="fssaiNumber" className="block text-xs font-semibold text-zinc-700 mb-1.5">FSSAI Number <span className="font-normal text-zinc-400">(optional)</span></label>
                                <input id="fssaiNumber" type="text" inputMode="numeric" maxLength={30} value={formData.fssaiNumber} onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })} placeholder="Enter FSSAI number" className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
                            </div>
                            <div>
                                <label htmlFor="restaurantPhone" className="block text-xs font-semibold text-zinc-700 mb-1.5">Restaurant Contact <span className="font-normal text-zinc-400">(optional)</span></label>
                                <input id="restaurantPhone" type="tel" autoComplete="tel" maxLength={30} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="For printed KOT only" className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
                            </div>
                        </div>

                        <RestaurantAddressField id="restaurantAddress" value={formData.address} onChange={(address) => setFormData((current) => ({ ...current, address }))} labelClassName="block text-xs font-semibold text-zinc-700 mb-1.5" inputClassName="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Secret Registration Key */}
                        <div>
                            <label htmlFor="secretKey" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                Registration Secret Key
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H3.75v-2.25A2.25 2.25 0 0 1 6 17.25V15h2.25a2.25 2.25 0 0 1 2.25-2.25V10.5h2.25a2.25 2.25 0 0 1 2.25-2.25M18 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div>
                                <input
                                    id="secretKey"
                                    type="password"
                                    placeholder="Enter signup secret code"
                                    value={formData.secretKey}
                                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                    required
                                    autoComplete="off"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-450 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.863 7.863 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-150 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-455 hover:text-zinc-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.863 7.863 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-[0_1px_2px_rgba(99,102,241,0.2)]"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                </div>
                <BrandFooter className="mt-10 pt-5 md:hidden" />
            </div>
        </div>
    );
}
