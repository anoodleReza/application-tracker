// src/app/api/applications/[id]/route.ts
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

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserFromToken();
        const { id } = params;

        const application = await prisma.application.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                interviews: {
                    orderBy: {
                        interviewDate: 'asc',
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error('Get application error:', error);

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

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = await getUserFromToken();
        const { id } = params;
        const data = await req.json();

        // Verify ownership
        const existingApplication = await prisma.application.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingApplication) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Update application
        const updatedApplication = await prisma.application.update({
            where: { id },
            data: {
                companyName: data.companyName,
                positionTitle: data.positionTitle,
                status: data.status,
                applicationDate: new Date(data.applicationDate),
                notes: data.notes,
                jobUrl: data.jobUrl,
            },
            include: {
                interviews: true,
            },
        });

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Update application error:', error);

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

        // Verify ownership
        const existingApplication = await prisma.application.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingApplication) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Delete related interviews first
        await prisma.interview.deleteMany({
            where: {
                applicationId: id,
            },
        });

        // Delete the application
        await prisma.application.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Delete application error:', error);

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