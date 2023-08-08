import { getServerSession } from 'next-auth/next';

import { NextResponse, type NextRequest } from 'next/server';

import Task from '@/models/Task';

import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';


export async function GET() {

    try {
        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        /* 
            session would always have the appropriate value because it has
            been handled by the next-auth middleware; this is just precautionary
        */
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // checks if the user exists
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User does not exist' }, { status: 404 });
        }

        // saves the new task to the database
        const tasks = await Task.find({ userId: session.user.id });

        return NextResponse.json({ success: true, tasks }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false, message: 'Something went wrong. Please try again' }, { status: 500 });
    }

}

export async function POST(request: NextRequest) {
    try {

        // checks if the provided task input is valid
        const data = await request.json();

        data.task = data.task.trim();

        if (data.task.length === 0) {
            return NextResponse.json({ success: false, message: 'Task input cannot be empty' }, { status: 400 });
        }

        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // checks if the user exists
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User does not exist' }, { status: 404 });
        }

        // creates new task
        const newTask = new Task({ userId: session.user.id, task: data.task });

        await newTask.save();

        return NextResponse.json({ success: true, message: 'Task created successfully' }, { status: 201 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ success: false, message: 'Something went wrong. Please try again' }, { status: 500 });
    }

}