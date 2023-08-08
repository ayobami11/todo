'use client'

import { useState } from 'react';

import useSWRMutation from 'swr/mutation';

import { useAppContext } from '@/app/contexts/app';

export interface AddTaskType {
    task: string
}

const TodoForm = () => {

    const { dispatch } = useAppContext();

    const [task, setTask] = useState<string>('');

    const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTask(event.target.value);
    }

    const sendGetRequest = async (url: string) => {
        return await fetch(url);
    }

    const sendPostRequest = async (url: string) => {
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ task })
        });
    }

    const { trigger: triggerGetRequest } = useSWRMutation('/api/tasks', sendGetRequest);
    const { trigger: triggerPostRequest, isMutating } = useSWRMutation('/api/tasks', sendPostRequest);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const addTask = async () => {
            try {

                const response = await triggerPostRequest();

                const result = await response.json();

                if (response.ok) {
                    setTask('');
                }

                console.log(result);

            } catch (error) {
                console.log(error);
            }
        }

        const getTasks = async () => {
            try {
                const response = await triggerGetRequest();

                if (response.ok) {
                    const data = await response.json();

                    dispatch({ type: 'SET_TASKS', payload: { tasks: data.tasks } });
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (task) {
            addTask();
            getTasks();
        }
    }

    return (
        <form onSubmit={handleSubmit} className='bg-very-light-gray dark:bg-very-dark-desaturated-blue w-full rounded-lg p-4 mb-5'>
            <input
                className='text-very-dark-grayish-blue dark:text-light-grayish-blue bg-transparent w-full placeholder:text-light-grayish-blue dark:placeholder:text-very-dark-grayish-blue focus:outline-none'
                type='text'
                name='task'
                id='task'
                placeholder='Create a new todo...'
                value={task}
                required
                onChange={handleTaskChange}
            />
            <button type='submit' disabled={isMutating}>Submit</button>
        </form>
    )
}

export default TodoForm