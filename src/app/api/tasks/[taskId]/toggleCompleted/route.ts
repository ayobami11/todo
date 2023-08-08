import { NextResponse, type NextRequest } from 'next/server';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongoose';

import Task from '@/models/Task';


export async function PATCH(request: NextRequest, { params }: { params: { taskId: string } }) {
    try {

        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // searches the database for the task, if any
        const taskToUpdate = await Task.findOne({ _id: params.taskId, userId: session.user.id });

        if (!taskToUpdate) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        taskToUpdate.completed = !taskToUpdate.completed;

        await taskToUpdate.save();

        return NextResponse.json({ success: true, message: 'Task updated successfully' }, { status: 200 });

    } catch (error) {
        console.log(error);
    }
}