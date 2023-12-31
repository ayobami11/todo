import { NextResponse, type NextRequest } from 'next/server';

import { getServerSession } from 'next-auth/next';

import { connectToDatabase, disconnectFromDatabase } from '@/lib/database';
import { authOptions } from '@/lib/auth';

import Task from '@/models/Task';

export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
    try {

        // checks if a valid taskId is provided
        if (!params.taskId) {
            return NextResponse.json({ message: 'Invalid taskId' }, { status: 400 });
        }

        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // searches the database for the task, if any
        await Task.deleteOne({ _id: params.taskId, userId: session.user.id });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    } finally {
        await disconnectFromDatabase();
    }
}