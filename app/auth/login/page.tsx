'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            console.log('🔵 Starting login request...');
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            console.log('🔵 Login response status:', res.status);
            const data = await res.json();
            console.log('🔵 Login response data:', data);

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Wait a moment for cookie to be set
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('🔵 Login successful! Attempting redirect...');

            // Try multiple redirect approaches
            try {
                router.push('/dashboard');
                router.refresh();
                console.log('🔵 Router push completed');
            } catch (routerError) {
                console.log('🔴 Router push failed, trying window.location:', routerError);
                window.location.href = '/dashboard';
            }

        } catch (err) {
            console.error('🔴 Login error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <p className="text-sm text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-blue-600 hover:underline">
                                Create one
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}