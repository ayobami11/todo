import bcrypt from 'bcryptjs';

import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongoose';


export const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Todo',
            credentials: {
                email: {
                    label: 'Email:',
                    type: 'email',
                    placeholder: 'johndoe@example.com'
                },
                password: {
                    label: 'Password:',
                    type: 'password'
                }
            },
            async authorize(credentials) {
                try {

                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();
                    console.log('response', result)

                    if (response.ok) {
                        return result.user;
                    } else {
                        return null;
                    }


                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ profile, user, account }) {

            try {

                if (account?.provider === 'google') {

                    if (!profile?.email) {
                        throw new Error('Email was not provided');
                    }

                    await connectToDatabase();

                    const existingUser = await User.findOne({ email: profile.email });

                    if (existingUser) {
                        user._id = existingUser._id;
                    } else {
                        const newUser =  new User({
                            email: profile.email,
                            name: profile.name,
                            account_type: 'google'
                        });
                        
                        await newUser.save();

                        user._id = newUser._id;
                    }

                    return true;
                } else if (account?.provider === 'credentials') {
                    return user._id ? true : false;
                }

                return false;

            } catch (error) {
                console.log(error);

                return false;
            }
        },
        async jwt({ token, user, account }) {

            if (account && account.access_token) {
                token.accessToken = account.access_token;
                token.id = user._id;
            } else if (user && user.access_token) {
                token.accessToken = user.access_token;
                token.id = user._id;
            }

            return token;
        },
        async session({ session, token }) {

            if (token) {
                session.accessToken = token.accessToken;
                session.user.id = token.id;
            }

            return session;
        }
    }
}