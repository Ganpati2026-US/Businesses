'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function signInAction(email: string, password: string) {
    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return { success: false, error: 'Invalid credentials' };
        }
        return { success: false, error: 'An error occurred' };
    }
}

export async function signUpAction(data: {
    name: string;
    email: string;
    password: string;
    restaurantName: string;
    secretKey: string;
}) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const res = await fetch(`${backendUrl}/api/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Failed to create account' };
        }

        return { success: true };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: 'Failed to create account' };
    }
}

