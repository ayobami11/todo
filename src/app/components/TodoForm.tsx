'use client'

import { useState, useRef } from 'react';

import useSWRMutation from 'swr/mutation';

import { useAppContext } from '@/contexts/app';

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
            body: JSON.stringify({ message }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const { trigger, isMutating } = useSWRMutation('/api/tasks', sendRequest);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // removes any leading or trailing whitespace
        setMessage(prevState => prevState.trim());

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
        <form ref={formRef} onSubmit={handleSubmit} className='bg-very-light-gray dark:bg-very-dark-desaturated-blue w-full rounded-lg p-4 mb-5'>
            <input
                className='text-very-dark-grayish-blue dark:text-light-grayish-blue bg-transparent w-full placeholder:text-light-grayish-blue dark:placeholder:text-very-dark-grayish-blue focus:outline-none'
                type='text'
                name='message'
                id='message'
                placeholder='Create a new todo...'
                value={message}
                required
                onChange={handleMessageChange}
            />
            <button type='submit' disabled={isMutating}>Submit</button>
        </form>
    )
}

export default TodoForm