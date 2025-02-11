// src/app/api/interviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

async function getUserFromToken() {
    const token = (await cookies()).get('token')?.value;
    if (!token) throw new Error('Not authenticated');

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId;
    } catch {
        throw new Error('Invalid token');
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getUserFromToken();
        const data = await req.json();

        // Verify application ownership
        const application = await prisma.application.findFirst({
            where: {
                id: data.applicationId,
                userId,
            },
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Create interview
        const interview = await prisma.interview.create({
            data: {
                applicationId: data.applicationId,
                interviewDate: new Date(data.interviewDate),
                interviewType: data.interviewType,
                notes: data.notes,
            },
        });

        return NextResponse.json(interview, { status: 201 });
    } catch (error) {
        console.error('Create interview error:', error);

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