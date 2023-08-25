import { DefaultSession, DefaultUser } from 'next-auth/next';

import { Types } from 'mongoose';


declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken: string,
        user: {
            id: string,
            name: string,
            email: string
        } 
    }

    interface User {
        _id: string,
        access_token: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string,
        id: string
    }
}