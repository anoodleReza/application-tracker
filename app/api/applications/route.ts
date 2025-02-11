// src/app/api/applications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper function to get user from token
async function getUserFromToken() {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch {
        throw new Error('Invalid token');
    }
}

export async function POST(req: Request) {
    try {
        // Get authenticated user's ID
        const userId = await getUserFromToken();

        // Parse request body
        const {
            companyName,
            positionTitle,
            status,
            applicationDate,
            jobUrl,
            notes
        } = await req.json();

        // Validate required fields
        if (!companyName || !positionTitle || !status || !applicationDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create application in database
        const application = await prisma.application.create({
            data: {
                userId,
                companyName,
                positionTitle,
                status,
                applicationDate: new Date(applicationDate),
                notes,
                jobUrl
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error('Create application error:', error);

        if (error instanceof Error && error.message === 'Not authenticated') {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const userId = await getUserFromToken();

        const applications = await prisma.application.findMany({
            where: {
                userId,
            },
            orderBy: {
                applicationDate: 'desc',
            },
            include: {
                interviews: true,
            },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);

        if (error instanceof Error && error.message === 'Not authenticated') {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}