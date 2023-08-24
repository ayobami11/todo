'use client'

import { useAppContext } from '@/contexts/app';

import ToastItem from '@/app/components/ToastItem';


const ToastList = () => {

    const { state } = useAppContext();

    return (
        <ul className='fixed bottom-4 left-4 grid justify-items-center justify-center gap-3'>
            {
                state.toasts.map(toast => <ToastItem key={toast.id} {...toast} />)
            }
        </ul>
    )

}

export default ToastList;