import { getServerSession } from 'next-auth/next';

import { NextResponse, type NextRequest } from 'next/server';

import Task from '@/models/Task';

import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/database';
import User from '@/models/User';


export async function GET(request: NextRequest) {

    try {
        // checks if the user is logged in
        const session = await getServerSession(authOptions);

        /* 
            session would always have the appropriate value because it has
            been handled by the next-auth middleware; this is just precautionary
        */
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const filter = searchParams.get('filter');

        await connectToDatabase();

        // checks if the user exists
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
        }

        // saves the new task to the database
        let tasks = await (filter === 'active' ?
            Task.find({ userId: session.user.id, completed: false }) :
            filter === 'completed' ?
                Task.find({ userId: session.user.id, completed: true }) :
                Task.find({ userId: session.user.id })).select('message completed');

        return NextResponse.json({ message: 'Tasks retrieved successfully', tasks }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    }

}

export async function POST(request: NextRequest) {
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

        // checks if the user exists
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: 'User does not exist' }, { status: 404 });
        }

        // creates new task
        const newTask = new Task({ userId: session.user.id, message: data.message });

        await newTask.save();

        return NextResponse.json({ message: 'Task created successfully', task: newTask }, { status: 201 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    }

}