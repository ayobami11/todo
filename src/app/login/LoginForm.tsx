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

    const { theme } = useTheme();

    const router = useRouter();

    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const { dispatch } = useAppContext();

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [formDetails, setFormDetails] = useState<LoginDetailsType>({
        email: '',
        password: ''
    });
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(false);

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
                setIsSubmitBtnDisabled(true);

                const result = await signIn('credentials', {
                    redirect: false,
                    email: formDetails.email,
                    password: formDetails.password
                });

                if (result?.ok) {
                    router.push('/');
                } else if (result?.error) {
                    router.push(callbackUrl);

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

                setIsSubmitBtnDisabled(false);
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
                            // border-slate-300 rounded-md focus:outline-none focus:border-bright-blue focus:ring-1 focus:ring-bright-blue invalid:caret-pink-500
                            // invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-600`
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
                    disabled={isSubmitBtnDisabled}
                    className='bg-bright-blue py-2 px-4 mt-3 rounded-md text-very-light-gray'>
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
                     theme === 'dark' ?
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