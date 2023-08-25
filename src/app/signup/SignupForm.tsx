'use client'

import { useRouter } from 'next/navigation';

import useSWRMutation from 'swr/mutation';

import { useState, useRef } from 'react';

import { useAppContext } from '@/contexts/app';

export interface SignupDetailsType {
    email: string,
    name: string,
    password: string
}


const SignupForm = () => {

    const { dispatch } = useAppContext();

    const formRef = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const [formDetails, setFormDetails] = useState<SignupDetailsType>({
        email: '',
        name: '',
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

    const sendRequest = async (url: string, { arg }: { arg: SignupDetailsType }) => {
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const { trigger, isMutating } = useSWRMutation('/api/auth/signup', sendRequest);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submitFormdata = async () => {
            try {
                const response = await trigger(formDetails);

                const result = await response.json();

                if (response.status === 201) {
                    router.push('/login');
                } else if (response.status === 400) {
                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: result.message
                        }
                    });
                } else if (response.status === 422) {
                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: 'Email is already taken.'
                        }
                    });
                } else {
                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: 'Signup failed.'
                        }
                    });
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
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col-reverse gap-1 mb-7'>
                <input
                    className={
                        `peer grow bg-transparent px-3 py-2 shadow-sm border border-gray-400
                            dark:border-slate-300 rounded-md focus:outline-none focus:border-bright-blue focus:ring-1 focus:ring-bright-blue`
                    }
                    type='email'
                    id='email'
                    name='email'
                    autoComplete='email'
                    value={formDetails.email}
                    placeholder='johndoe@example.com'
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label className='peer-focus:text-bright-blue' htmlFor='email'>
                    Email
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <div className='flex flex-col-reverse gap-1 mb-7'>
                <input
                    className={
                        `peer grow bg-transparent px-3 py-2 shadow-sm border border-gray-400
                            dark:border-slate-300 rounded-md focus:outline-none focus:border-bright-blue focus:ring-1 focus:ring-bright-blue`
                    }
                    type='text'
                    id='name'
                    name='name'
                    autoComplete='name'
                    value={formDetails.name}
                    placeholder='John Doe'
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label className='peer-focus:text-bright-blue' htmlFor='name'>
                    Name
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <div className='flex flex-col-reverse gap-1 mb-7'>
                <input
                    className={
                        `peer grow bg-transparent px-3 py-2 shadow-sm border border-gray-400
                            dark:border-slate-300 rounded-md focus:outline-none focus:border-bright-blue focus:ring-1 focus:ring-bright-blue`
                    }
                    type='password'
                    id='password'
                    name='password'
                    autoComplete='new-password'
                    value={formDetails.password}
                    minLength={8}
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label className='peer-focus:text-bright-blue' htmlFor='password'>
                    Password
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <button type='submit' disabled={isMutating} className='bg-bright-blue py-2 px-4 mt-3 rounded-md text-very-light-gray'>Sign Up</button>
        </form>
    );
}

export default SignupForm;