'use client'

import Image from 'next/image';

import { useEffect, useCallback } from 'react';

import { useAppContext } from '@/contexts/app';

import type { ToastType } from '@/reducers/app';

import crossIcon from '../../../public/assets/images/icon-cross.svg';

const ToastItem = ({ id, message }: ToastType) => {

    const { state, dispatch } = useAppContext();

    const closeToast = useCallback(() => {
        dispatch({ 
            type: 'DELETE_TOAST',
            payload: {
                toastId: id
            }
         });
    }, [id, dispatch]);

    useEffect(() => {
        const timer = setTimeout(closeToast, 5000);

        return () => clearTimeout(timer);
    }, [closeToast]);

    return (
        <li className='relative overflow-hidden flex justify-between items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800'>
            <output role='status'>{message}</output>
            <button
                onClick={closeToast}
                className='p-2 rounded-full hover:bg-gray-400/5 transition-colors ease-in-out duration-300 active:scale-90'>
                <Image src={crossIcon} alt='Close icon' aria-hidden='true' />
                <span className="sr-only">Close</span>
            </button>

            {/* Progress bar */}
            <div className='absolute left-0 bottom-0 h-1 w-full bg-bright-blue animate-loader' />
        </li>
    )
}

export default ToastItem;