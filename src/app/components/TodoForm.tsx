'use client'

import Image from 'next/image';

import { useState, useRef } from 'react';

import useSWRMutation from 'swr/mutation';

import { useAppContext } from '@/contexts/app';

import checkIcon from '../../../public/assets/images/icon-check.svg';

export interface AddTaskType {
    message: string
}

const TodoForm = () => {

    const formRef = useRef<HTMLFormElement>(null);

    const { dispatch } = useAppContext();

    const [message, setMessage] = useState<string>('');

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    }

    const sendRequest = async (url: string) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
    }

    const { trigger, isMutating } = useSWRMutation('/api/tasks', sendRequest);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        // removes any leading or trailing whitespace
        setMessage(prevMessage => prevMessage.trim());

        const addTask = async () => {
            try {

                const response = await trigger();

                const result = await response.json();

                if (response.ok) {
                    setMessage('');

                    dispatch({ type: 'ADD_TASK', payload: { newTask: result.task } });
                }

                console.log(result);

            } catch (error) {
                console.log(error);
            }
        }

        if (message) {
            addTask();
        } else {
            formRef.current?.reportValidity();
        }
    }

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='flex flex-row-reverse items-center gap-5 bg-very-light-gray dark:bg-very-dark-desaturated-blue w-full rounded-lg p-4 mb-5'>
            <input
                className='text-very-dark-grayish-blue dark:text-light-grayish-blue bg-transparent w-full autofill:bg-red-500 placeholder:text-light-grayish-blue dark:placeholder:text-very-dark-grayish-blue focus:outline-none'
                type='text'
                name='message'
                id='message'
                placeholder='Create a new todo...'
                value={message}
                required
                onChange={handleMessageChange}
            />
            <button
                type='submit'
                disabled={isMutating}
                title='Submit'
                className={
                    `group flex justify-center items-center w-8 aspect-square border-2 rounded-full border-light-grayish-blue dark:border-very-dark-grayish-blue
                    hover:bg-gradient-to-r focus:bg-gradient-to-r from-check-background-start to-check-background-stop focus:outline-none focus:border-transparent`
                }>
                <Image
                    className='hidden group-hover:block group-focus:block'
                    src={checkIcon}
                    alt='Check icon'
                />
            </button>
        </form>
    )
}

export default TodoForm