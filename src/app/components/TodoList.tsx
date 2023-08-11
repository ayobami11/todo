'use client'

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';

import { useAppContext } from '@/contexts/app';

import TodoItem from '@/app/components/TodoItem';

import tasks from '@/app/data.json';

const TodoList = () => {

    const { data: session } = useSession();

    const { state, dispatch } = useAppContext();

    const sendGetTasks = async (url: string) => {
        return await fetch(url);
    }

    const sendDeleteCompletedTasks = async (url: string) => {
        return await fetch(url, {
            method: 'DELETE'
        });
    }

    const { trigger: triggerGetTasks } = useSWRMutation(`/api/tasks?filter=${state.filter}`, sendGetTasks);
    const {
        trigger: triggerDeleteCompleted,
        isMutating: isMutatingDelete
    } = useSWRMutation('/api/tasks/deleteCompleted', sendDeleteCompletedTasks);

    const numberOfTasks = state.tasks.length;

    const deleteCompletedTasks = () => {
        (async () => {
            try {
                const response = await triggerDeleteCompleted();

                if (response.ok) {
                    dispatch({ type: 'DELETE_COMPLETED_TASKS' });
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }

    useEffect(() => {

        const getTasks = async () => {
            try {
                const response = await triggerGetTasks();

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

    }, [triggerGetTasks, session?.user.id, dispatch, state.filter]);


    return (
        <div className='bg-very-light-gray dark:bg-very-dark-desaturated-blue rounded-md'>
            <ul>
                {state.tasks.map(task => <TodoItem key={task._id} {...task} />)}
            </ul>
            <footer className='flex p-4 justify-between text-dark-grayish-blue dark:text-dark-grayish-blue-alt'>
                <p>{numberOfTasks} {numberOfTasks === 1 ? 'item' : 'items'} left</p>
                <button
                    className='capitalize'
                    disabled={isMutatingDelete}
                    onClick={deleteCompletedTasks}
                >Clear completed</button>
            </footer>
        </div>
    )
}

export default TodoList;