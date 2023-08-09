import { NextResponse } from 'next/server';

import User from '@/models/User';

import { connectToDatabase } from '@/lib/mongoose';

import type { SignupDetailsType } from '@/app/signup/SignupForm';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {

    try {

        const data: SignupDetailsType = await request.json();

        // validation checks
        for (const [key, value] of Object.entries(data)) {

            const trimmedValue = value.trim();

            if (trimmedValue.length === 0) {
                return NextResponse.json({ message: `Input field: ${key} cannot have an empty value` }, { status: 400 });
            } else if (trimmedValue.length > 30) {
                return NextResponse.json({ message: `Input field: ${key} cannot exceed 30 characters` }, { status: 400 });
            }
        }

        // at this point, data has been validated
        await connectToDatabase();

        // checks if the email has already been taken
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 422 });
        }

        // if the name has not been taken, a new user is created
        const hashedPassword = await hashPassword(data.password);

        const newUser = new User({ email: data.email, name: data.name, password: hashedPassword, account_type: 'credentials' });

        await newUser.save();

        return NextResponse.json({ message: 'Signup was successful' }, { status: 201 });
    } catch (error) {

        console.log(error);
        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    }
}
