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
            <button type='submit' disabled={isMutating} className='bg-bright-blue py-2 px-4 mt-3 rounded-md text-very-light-gray flex items-center'>
                {isMutating ? (
                    <div role="status">
                        <svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600/75 fill-very-light-gray" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : null}
                Sign Up
            </button>
        </form>
    );
}

export default SignupForm;