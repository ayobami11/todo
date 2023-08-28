'use client'

import Image from 'next/image';

import { useTheme } from 'next-themes';

import { useSession, signOut } from 'next-auth/react';

import { useState, useEffect } from 'react';

import sunIcon from '../../../public/assets/images/icon-sun.svg';
import moonIcon from '../../../public/assets/images/icon-moon.svg';

import bgMobileLight from '../../../public/assets/images/bg-mobile-light.jpg';
import bgMobileDark from '../../../public/assets/images/bg-mobile-dark.jpg';
import bgDesktopLight from '../../../public/assets/images/bg-desktop-light.jpg';
import bgDesktopDark from '../../../public/assets/images/bg-desktop-dark.jpg';


const Header = () => {

    const { data: session } = useSession();

    const [isMounted, setIsMounted] = useState<boolean>(false);

    const { theme, systemTheme, setTheme } = useTheme();

    // defaults to the system theme if the user hasn't selected one
    const userTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const handleSignOut = () => {
        signOut();
    }


    return (
        <header className='w-11/12 max-w-3xl mx-auto'>
            <div className='fixed top-0 left-0 overflow-hidden -z-10 w-full'>
                <Image className='w-full max-sm:h-[40vh] dark:hidden md:hidden' src={bgMobileLight} alt='' placeholder='blur' priority />
                <Image className='w-full max-sm:h-[40vh] hidden dark:block md:dark:hidden' src={bgMobileDark} alt='' placeholder='blur' priority />
                <Image className='w-full hidden dark:hidden md:block' src={bgDesktopLight} alt='' placeholder='blur' priority />
                <Image className='w-full hidden md:dark:block' src={bgDesktopDark} alt='' placeholder='blur' priority />
            </div>
            <div className='flex justify-between items-center my-8'>
                <h1 className='uppercase font-bold text-2xl md:text-3xl lg:text-4xl text-very-light-gray tracking-[0.5em]'>Todo</h1>
                {/* renders the component only when the component is mounted
             so as to avoid hydration mismatch
             
             Source: https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
             */}
                {
                    isMounted ? (
                        <button className='shrink-0' onClick={toggleTheme}>
                            {
                                userTheme === 'dark' ?
                                    <Image src={sunIcon} alt='Sun icon' /> :
                                    <Image src={moonIcon} alt='Moon icon' />
                            }
                        </button>

                    ) : null
                }
            </div>
            <div className='flex flex-wrap justify-between gap-4 mb-6 text-very-light-gray'>
                {
                    session?.user &&
                    <p className='text-xl'>Hello, {session.user.name}</p>
                }
                <button className='ml-auto hover:underline' onClick={handleSignOut}>Sign out</button>
            </div>
        </header>
    )
}

export default Header