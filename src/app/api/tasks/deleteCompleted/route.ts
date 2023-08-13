import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth/next';

import { connectToDatabase, disconnectFromDatabase } from '@/lib/database';
import { authOptions } from '@/lib/auth';

import Task from '@/models/Task';

export async function DELETE() {
    try {

        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // searches the database for the task, if any
        await Task.deleteMany({ userId: session.user.id, completed: true });

        return NextResponse.json({ message: 'Tasks deleted successfully' }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 }); 
    } finally {
        await disconnectFromDatabase();
    }
}