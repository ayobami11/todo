'use client'

import Image from 'next/image';

import useSWRMutation from 'swr/mutation';

import { TaskType } from '@/app/reducers/app';

import { useAppContext } from '@/app/contexts/app';

import crossIcon from '../../../public/assets/images/icon-cross.svg';
import checkIcon from '../../../public/assets/images/icon-check.svg';

const TodoItem = ({ _id: id, task, completed }: TaskType) => {

    const { dispatch } = useAppContext();

    const sendGetRequest = async (url: string) => {
        return await fetch(url);
    }

    const { trigger: triggerGetRequest } = useSWRMutation('/api/tasks', sendGetRequest);

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

    const sendDeleteRequest = async (url: string) => {
        return await fetch(url, {
            method: 'DELETE'
        });
    }

    const { trigger: triggerDeleteRequest, isMutating: isMutatingDelete } = useSWRMutation(`/api/tasks/${id}`, sendDeleteRequest);

    const deleteTask = () => {

        const sendRequest = async () => {
            try {
                const response = await triggerDeleteRequest();
                const result = await response.json();

                console.log(result);
                if (response.ok) {
                    getTasks();
                }

            } catch (error) {
                console.log(error);
            }
        }

        sendRequest();
    }

    const sendPatchRequest = async (url: string) => {
        return await fetch(url, {
            method: 'PATCH'
        });
    }

    const { trigger: triggerPatchRequest, isMutating: isMutatingPatch } = useSWRMutation(`/api/tasks/${id}/toggleCompleted`, sendPatchRequest);

    const toggleCompleted = () => {
        (async () => {
            try {
                const response = await triggerPatchRequest();
                const result = await response.json();

                console.log(result);
                if (response.ok) {
                    getTasks();
                }

            } catch (error) {
                console.log(error);
            }
        })();
    }

    return (
        <li className={
            `group/item flex justify-between p-4 border-b-2 text-dark-grayish-blue dark:text-light-grayish-blue 
            border-very-light-grayish-blue dark:border-very-dark-grayish-blue-alt hover:text-very-dark-grayish-blue 
            dark:hover:text-light-grayish-blue-alt`
        }>
            <div className='flex items-center gap-2'>
                <input
                    className='peer appearance-none hover:cursor-pointer'
                    type='checkbox'
                    name='task'
                    id={`task-${id}`}
                    checked={completed}
                    disabled={isMutatingPatch}
                    onChange={toggleCompleted}
                />
                <label htmlFor={`task-${id}`}
                    className={
                        `group/label grid place-items-center grid-cols-1 relative w-6 aspect-square cursor-pointer rounded-full 
                        bg-gradient-to-r from-check-background-start to-check-background-stop peer-checked:border-none hover:border-none
                        focus:border-none border-2 border-light-grayish-blue dark:border-very-dark-grayish-blue`
                    }>
                    <div className={
                        `inline-grid place-content-center rounded-full w-full aspect-square 
                        ${!completed ? 'bg-very-light-gray dark:bg-very-dark-desaturated-blue group-hover/label:w-[calc(100%-4px)] group-focus/label:w-[calc(100%-4px)]' : ''}`
                    }>
                        <Image
                            className={`${!completed ? 'hidden' : ''}`}
                            src={checkIcon}
                            alt='Check icon'
                        />
                    </div>
                </label>
                <label htmlFor={`task-${id}`}
                    className='peer-checked:text-light-grayish-blue dark:peer-checked:text-very-dark-grayish-blue peer-checked:line-through hover:cursor-pointer'>{task}</label>
            </div>

            <button className='opacity-0 group-hover/item:opacity-100 focus:opacity-100' disabled={isMutatingDelete} onClick={deleteTask}>
                <Image
                    src={crossIcon}
                    alt='Close icon'
                />
            </button>
        </li>
    )
}

export default TodoItem