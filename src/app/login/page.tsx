import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Login',
}

import LoginForm from '@/app/login/LoginForm';

const Login = () => {
    return (
        <main>
            <LoginForm />
            <p>
                Don&apos;t have an account?
                <Link href='/signup'>Sign up</Link>
            </p>
        </main>
    )
}

export default Login