// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardStats from "@/components/dashboard/DashboardStats";
import ApplicationList from '@/components/dashboard/ApplicationList';

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await fetch('/api/auth/verify', {
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error('Not authenticated');
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Authentication failed:', error);
                router.replace('/auth/login');
            }
        };

        verifyAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="space-y-4">
                <DashboardStats />
                <ApplicationList />
            </div>
        </div>
    );
}