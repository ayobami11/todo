import bcrypt from 'bcryptjs';

import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/database';


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
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
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

                    const endpoint = process.env.NODE_ENV === 'production' ?
                        'https://todo-app-ayo.vercel.app/api/auth/login' :
                        'http://localhost:3000/api/auth/login';

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (response.status === 200) {
                        return result.user;
                    } else if (response.status === 400) {
                        throw new Error(result.message)
                    } else {
                        throw new Error('Login failed.');
                    }


                } catch (error) {
                    console.log(error);

                    // 'fetch failed' likely to occur when the user is not connected to the internet
                    if (error instanceof Error) {
                        throw new Error(error.message === 'fetch failed' ? 'Login failed.' : error.message);
                    }
                }
            }
        })
    ],
    callbacks: {
        async signIn({ profile, user, account }) {

            try {

                if (account?.provider === 'google' || account?.provider === 'github') {

                    if (!profile?.email) {
                        throw new Error('Email was not provided');
                    }

                    await connectToDatabase();

                    // checks if user already exists
                    const existingUser = await User.findOne({
                        email: profile.email,
                        account_provider: account.provider
                    });

                    if (existingUser) {
                        user._id = existingUser._id;
                    } else {
                        // if user doesn't exist, a new user is created
                        const newUser = new User({
                            email: profile.email,
                            name: profile.name,
                            account_provider: account.provider
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
                // for google and github providers
                token.accessToken = account.access_token;
                token.id = user._id;
            } else if (user && user.access_token) {
                // for credentials provider
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