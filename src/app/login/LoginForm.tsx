'use client'

import { useState, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { signIn, getProviders } from 'next-auth/react';


export interface LoginDetailsType {
    email: string,
    password: string
}

const LoginForm = () => {

    const formRef = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const providers = async () => await getProviders();

    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const [formDetails, setFormDetails] = useState<LoginDetailsType>({
        email: '',
        password: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormDetails(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const areInputsValid = (): boolean => {
        const formElements = formRef.current?.elements;

        for (const [key, value] of Object.entries(formDetails)) {

            const input = formElements?.namedItem(key) as HTMLInputElement | null;

            if (input) {

                input.value = input.value.trim();

                if (!input.validity.valid) {
                    input.reportValidity();

                    return false;
                }
            }

            const trimmedValue: string = value.trim();

            if (trimmedValue.length === 0 || trimmedValue.length > 30) {
                return false;
            }
        }

        return true;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submitFormdata = async () => {
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: formDetails.email,
                    password: formDetails.password,
                    callbackUrl: '/'
                })

                console.log(result);

                if (!result?.error) {
                    router.push(callbackUrl);
                    console.log(result?.error)
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (areInputsValid()) {
            submitFormdata();
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formDetails.email}
                        maxLength={30}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor='email'>Email</label>
                </div>
                <div>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formDetails.password}
                        minLength={8}
                        maxLength={30}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor='password'>Password</label>
                </div>
                <button type='submit'>Login</button>
            </form>

            <button onClick={() => signIn('google', {
                callbackUrl: '/'
            })}>Continue with Google</button>
        </>
    );
}

export default LoginForm;