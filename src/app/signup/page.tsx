import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Signup',
}

import SignupForm from '@/app/signup/SignupForm';

const Signup = () => {
    return (
        <main className='text-very-dark-grayish-blue dark:text-light-grayish-blue'>
            <div className='w-5/6 max-w-xl mx-auto mt-24'>
                <h2 className='font-bold text-4xl mb-10'>Sign Up</h2>

                <SignupForm />
                <p className='text-center my-8'>
                    Already have an account ?
                    <Link href='/login' className='text-bright-blue ml-2 hover:underline'>Log in</Link>
                </p>
            </div>
        </main>
    )
}

export default Signup;