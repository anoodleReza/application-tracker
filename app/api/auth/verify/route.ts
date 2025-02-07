// src/app/api/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const token = cookies().get('token')?.value;

        if (!token) {
            return NextResponse.json({ isValid: false }, { status: 401 });
        }

        const decoded = verify(token, process.env.JWT_SECRET!);
        return NextResponse.json({ isValid: true, user: decoded }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ isValid: false }, { status: 401 });
    }
}