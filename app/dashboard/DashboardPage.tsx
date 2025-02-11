// src/app/dashboard/DashboardPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardStats from "@/components/dashboard/DashboardStats";
import ApplicationList from '@/components/dashboard/ApplicationList';
import UserNav from "@/components/UserNavigation";

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

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch('/api/applications', {credentials: 'include'});
                if (!res.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await res.json();
                setApplications(data);
            }catch (e) {
                setError(e.message)
            }finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

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
                <UserNav />
            </div>
            <div className="space-y-4">
                <DashboardStats applications={applications} />
                <ApplicationList applications={applications} />
            </div>
        </div>
    );
}