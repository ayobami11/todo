import bcrypt from 'bcryptjs';

import type { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';

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
    // adapter: MongoDBAdapter(clientPromise),
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
                // console.log(credentials)
                // console.log('checking credentials')

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
        async signIn({ profile, user, email, credentials, account }) {
            // console.log('profile', profile);
            // console.log('user', user);
            // console.log('email', email);
            // console.log('credentials', credentials);
            // console.log('account', account);

            try {

                if (account?.provider === 'google') {

                    if (!profile?.email) {
                        throw new Error('Email was not provided');
                    }

                    await connectToDatabase();

                    const doesUserExist = await User.findOne({ email: profile.email });

                    console.log(doesUserExist);

                    if (!doesUserExist) {
                        await User.create({
                            email: profile.email,
                            name: profile.name,
                            account_type: 'google'
                        });
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
        async jwt({ token, user, account, profile }) {
            // console.log('user', user);
            // console.log('token', token);
            // console.log('account', account);
            // console.log('profile', profile);



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
            // if (token?.id) {
            // session.user = { id: token.id, name: token.name, email: token.email }
            // }

            // console.log('token', token);
            // console.log('session', session);


            if (token) {
                session.accessToken = token.accessToken;
                session.user.id = token.id;

                // return {
                //     ...session,
                //     accessToken: token.accessToken,
                //     user: {
                //         ...session.user,
                //         id: token.id
                //     }
                // }
            }

            return session;
        }
    }
}