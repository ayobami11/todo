import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Signup',
}

import SignupForm from '@/app/signup/SignupForm';

const Signup = () => {
    return (
        <main>
            <SignupForm />
            <p>
                Already have an account ?
                <Link href='/login'>Login</Link>
            </p>
        </main>
    )
}

export default Signup