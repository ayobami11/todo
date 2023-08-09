import { NextResponse, type NextRequest } from 'next/server';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongoose';

import Task from '@/models/Task';


export async function PATCH(request: NextRequest, { params }: { params: { taskId: string } }) {
    try {

        // checks if the provided message input is valid
        const data = await request.json();

        data.message = data.message.trim();

        if (data.message.length === 0) {
            return NextResponse.json({ message: 'Message input cannot be empty' }, { status: 400 });
        }

        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // searches the database for the task, if any
        const updatedTask = await Task.findOneAndUpdate(
            { _id: params.taskId, userId: session.user.id },
            { message: data.message },
            { new: true }
        ).select('message completed');

        if (!updatedTask) {
            return NextResponse.json({ message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task updated successfully', task: updatedTask }, { status: 200 });

    } catch (error) {
        console.log(error);
    }
}