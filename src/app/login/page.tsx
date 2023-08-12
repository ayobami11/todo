import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Login',
}

import LoginForm from '@/app/login/LoginForm';

const Login = () => {
    return (
        <main className='text-very-dark-grayish-blue dark:text-light-grayish-blue'>
            <div className='w-5/6 max-w-xl mx-auto mt-24'>
                <h2 className='font-bold text-4xl mb-10'>Login</h2>

                <LoginForm />
                <p className='text-center my-8'>
                    Don&apos;t have an account?
                    <Link href='/signup' className='text-bright-blue ml-2 hover:underline'>Sign up</Link>
                </p>
            </div>
        </main>
    )
}

export default Login