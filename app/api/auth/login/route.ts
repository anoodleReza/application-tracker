// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        console.log('Login request received');
        const { email, password } = await req.json();

        if (!email || !password) {
            console.log('Missing email or password');
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValidPassword = await compare(password, user.passwordHash);
        if (!isValidPassword) {
            console.log('Invalid password');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        console.log('Login successful, generating token');
        const token = sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Create response with success message
        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        // Set cookie using NextResponse
        console.log('Setting auth cookie');
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours in seconds
            path: '/',
        });

        console.log('Returning response');
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}