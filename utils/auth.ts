// utils/auth.ts
import { useEffect, useState } from 'react';

interface User {
    email: string | null;
    userId: string | null;
}

export function useAuth() {
    const [user, setUser] = useState<User>({ email: null, userId: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                // Since the token is in an HTTP-only cookie, we need to validate it server-side
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        email: userData.email,
                        userId: userData.userId
                    });
                } else {
                    setUser({ email: null, userId: null });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser({ email: null, userId: null });
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return {
        user,
        isAuthenticated: !!user.email,
        email: user.email,
        userId: user.userId,
        loading
    };
}