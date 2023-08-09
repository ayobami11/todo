'use client'

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';

import { useAppContext } from '@/contexts/app';

import TodoItem from '@/app/components/TodoItem';

import tasks from '@/app/data.json';

const TodoList = () => {

    const { data: session } = useSession();

    const { state, dispatch } = useAppContext();

    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');

    const sendRequest = async (url: string) => {
        return await fetch(url);
    }

    const { trigger } = useSWRMutation('/api/tasks', sendRequest);

    const numberOfTasks = state.tasks.length;

    useEffect(() => {

        const getTasks = async () => {
            try {
                const response = await trigger();

                if (response.ok) {
                    const data = await response.json();

                    dispatch({ type: 'SET_TASKS', payload: { tasks: data.tasks } });
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (session?.user.id) {
            getTasks();
        }

    }, [trigger, session?.user.id, dispatch]);


    return (
        <div className='bg-very-light-gray dark:bg-very-dark-desaturated-blue rounded-md'>
            <ul>
                {state.tasks.map(task => <TodoItem key={task._id} {...task} />)}
            </ul>
            <footer className='flex p-4 justify-between text-dark-grayish-blue dark:text-dark-grayish-blue-alt'>
                <p>{numberOfTasks} {numberOfTasks === 1 ? 'item' : 'items'} left</p>
                <button className='capitalize'>Clear completed</button>
            </footer>
        </div>
    )
}

export default TodoList;