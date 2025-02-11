// src/app/api/interviews/[id]/route.ts
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

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserFromToken();
        const { id } = params;
        const data = await req.json();

        // Verify application ownership
        const interview = await prisma.interview.findFirst({
            where: {
                id,
                application: {
                    userId,
                },
            },
        });

        if (!interview) {
            return NextResponse.json(
                { error: 'Interview not found' },
                { status: 404 }
            );
        }

        // Update interview
        const updatedInterview = await prisma.interview.update({
            where: { id },
            data: {
                interviewDate: new Date(data.interviewDate),
                interviewType: data.interviewType,
                notes: data.notes,
            },
        });

        return NextResponse.json(updatedInterview);
    } catch (error) {
        console.error('Update interview error:', error);

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

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserFromToken();
        const { id } = params;

        // Verify application ownership
        const interview = await prisma.interview.findFirst({
            where: {
                id,
                application: {
                    userId,
                },
            },
        });

        if (!interview) {
            return NextResponse.json(
                { error: 'Interview not found' },
                { status: 404 }
            );
        }

        // Delete the interview
        await prisma.interview.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Delete interview error:', error);

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