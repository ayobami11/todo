import { NextResponse } from 'next/server';

import { connectToDatabase, disconnectFromDatabase } from '@/lib/database';
import { verifyPassword } from '@/lib/auth';

import User from '@/models/User';

import type { LoginDetailsType } from '@/app/login/LoginForm';

export async function POST(request: Request) {

    try {

        const data: LoginDetailsType = await request.json();

        // validation checks
        for (const [key, value] of Object.entries(data)) {

            if (key === 'email' || key === 'password') {

                const trimmedValue = value.trim();

                if (trimmedValue.length === 0) {
                    return NextResponse.json({ message: `Input field: ${key} cannot have an empty value.` }, { status: 400 });
                } else if (trimmedValue.length > 30) {
                    return NextResponse.json({ message: `Input field: ${key} cannot exceed 30 characters.` }, { status: 400 });
                }
            }
        }

        // at this point, data has been validated
        await connectToDatabase();

        // checks if the email has already been taken
        const user = await User.findOne({
            email: data.email,
            account_provider: 'credentials'
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 400 });
        }

        const isPasswordValid = await verifyPassword(data.password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 400 });
        }

        await user.generateAccessToken();

        return NextResponse.json({ message: 'Login successful.', user }, { status: 200 });
    } catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    } finally {
        await disconnectFromDatabase();
    }
}
