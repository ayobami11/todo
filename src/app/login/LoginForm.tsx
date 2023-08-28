'use client'

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';

import { useTheme } from 'next-themes';

import { signIn } from 'next-auth/react';

import { useAppContext } from '@/contexts/app';

import googleIcon from '../../../public/assets/images/icon-google.svg';
import githubIconLight from '../../../public/assets/images/icon-github-light.svg';
import githubIconDark from '../../../public/assets/images/icon-github-dark.svg';

export interface LoginDetailsType {
    email: string,
    password: string
}

const LoginForm = () => {

    const formRef = useRef<HTMLFormElement>(null);

    const { theme, systemTheme } = useTheme();

    // defaults to the system theme if the user hasn't selected one
    const userTheme = theme === 'system' ? systemTheme : theme;

    const router = useRouter();

    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const { dispatch } = useAppContext();

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [formDetails, setFormDetails] = useState<LoginDetailsType>({
        email: '',
        password: ''
    });
    const [isRequestSending, setIsRequestSending] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                setIsRequestSending(true);

                const result = await signIn('credentials', {
                    redirect: false,
                    email: formDetails.email,
                    password: formDetails.password
                });

                if (!result?.error) {
                    router.push(callbackUrl);
                } else {
                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: result.error
                        }
                    });
                }

            } catch (error) {

                console.log(error);
            } finally {

                setIsRequestSending(false);
            }
        }

        if (areInputsValid()) {
            submitFormdata();
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit} ref={formRef}>
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
                    <label htmlFor='email' className='peer-focus:text-bright-blue'>Email</label>
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
                        autoComplete='current-password'
                        value={formDetails.password}
                        minLength={8}
                        maxLength={30}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor='password' className='peer-focus:text-bright-blue'>Password</label>
                </div>
                <button
                    type='submit'
                    disabled={isRequestSending}
                    className='bg-bright-blue py-2 px-4 mt-3 rounded-md text-very-light-gray flex items-center'>
                    {isRequestSending ? (
                        <div role="status">
                            <svg aria-hidden="true" className="w-5 h-5 mr-2 animate-spin text-gray-600/75 fill-very-light-gray" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : null}
                    Login
                </button>
            </form>

            <div className='flex items-center gap-4 my-6'>
                <span className='flex-grow h-px bg-gray-400'></span>
                <span className='flex-shrink'>or</span>
                <span className='flex-grow h-px bg-gray-400'></span>
            </div>
            {/* <button className='flex items-center gap-4 my-8 mx-auto border border-gray-400 dark:border-slate-300 rounded-md py-3 px-8 shadow-md transition-transform hover:scale-105 hover:border-2 active:scale-100 motion-reduce:transition-none motion-reduce:transform-none' onClick={() => signIn('google', {
                callbackUrl: '/'
            })}>
                <Image src={googleIcon} alt='Google icon' />
                Continue with Google
            </button> */}
            <button className='flex items-center gap-4 my-8 mx-auto border border-gray-400 dark:border-slate-300 rounded-md py-3 px-8 shadow-md transition-transform hover:scale-105 hover:border-2 active:scale-100 motion-reduce:transition-none motion-reduce:transform-none' onClick={() => signIn('github', {
                callbackUrl: '/'
            })}>
                {isMounted ? (
                    userTheme === 'dark' ?
                        <Image src={githubIconDark} alt='Github icon' width={26} height={24} /> :
                        <Image src={githubIconLight} alt='Github icon' width={26} height={24} />
                ) : null
                }
                Continue with Github
            </button>
        </>
    );
}

export default LoginForm;