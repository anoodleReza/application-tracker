// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Get the token from the cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = verify(token.value, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
        };

        return NextResponse.json({
            userId: decoded.userId,
            email: decoded.email
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }
}