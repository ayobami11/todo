'use client'

import Image from 'next/image';

import useSWRMutation from 'swr/mutation';

import { useState, useRef } from 'react';

import { TaskType } from '@/reducers/app';

import { useAppContext } from '@/contexts/app';

import crossIcon from '../../../public/assets/images/icon-cross.svg';
import checkIcon from '../../../public/assets/images/icon-check.svg';

const TodoItem = ({ _id: id, message, completed }: TaskType) => {

    const formRef = useRef<HTMLFormElement>(null);

    const [showEditInput, setShowEditInput] = useState<boolean>(false);
    const [editInputValue, setEditInputValue] = useState<string>('');

    const { dispatch } = useAppContext();

    const toggleEditInputVisibility = () => {
        if (message !== editInputValue) {
            setEditInputValue(message);
        }

        setShowEditInput(prevState => !prevState);
    }

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(event.target.value);
    }

    const sendDeleteRequest = async (url: string) => {
        return await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const { trigger: triggerDeleteRequest, isMutating: isMutatingDelete } = useSWRMutation(`/api/tasks/${id}`, sendDeleteRequest);

    const deleteTask = () => {
        (async () => {
            try {
                const response = await triggerDeleteRequest();

                if (response.ok) {
                    dispatch({ type: 'DELETE_TASK', payload: { taskId: id } });
                }

            } catch (error) {
                console.log(error);
            }
        })();
    }

    const sendToggleCompletedRequest = async (url: string) => {
        return await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const { trigger: triggerToggleCompletedRequest, isMutating: isMutatingToggleCompleted } = useSWRMutation(`/api/tasks/${id}/toggleCompleted`, sendToggleCompletedRequest);

    const toggleCompleted = () => {
        (async () => {
            try {
                const response = await triggerToggleCompletedRequest();

                if (response.ok) {
                    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: { taskId: id } });
                }

            } catch (error) {
                console.log(error);
            }
        })();
    }

    const sendUpdateMessageRequest = async (url: string) => {
        return await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({ message: editInputValue }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const { trigger: triggerUpdateMessageRequest, isMutating: isMutatingUpdateMessage } = useSWRMutation(`/api/tasks/${id}/editMessage`, sendUpdateMessageRequest);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // removes any leading or trailing whitespace
        setEditInputValue(prevState => prevState.trim());

        const updateTask = async () => {
            try {

                const response = await triggerUpdateMessageRequest();

                const result = await response.json();

                if (response.ok) {
                    setShowEditInput(false);
                    setEditInputValue('');

                    dispatch({ type: 'UPDATE_TASK', payload: { taskId: id, updatedTask: result.task } });
                }

                console.log(result);

            } catch (error) {
                console.log(error);
            }
        }

        if (message) {
            updateTask();
        } else {
            formRef.current?.reportValidity();
        }
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
                    disabled={isMutatingToggleCompleted}
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
                    className='peer-checked:text-light-grayish-blue dark:peer-checked:text-very-dark-grayish-blue peer-checked:line-through hover:cursor-pointer'>{message}</label>
            </div>

            <button onClick={toggleEditInputVisibility}>{showEditInput ? 'Hide' : 'Edit'}</button>
            <button className='opacity-0 group-hover/item:opacity-100 focus:opacity-100' disabled={isMutatingDelete} onClick={deleteTask}>
                <Image
                    src={crossIcon}
                    alt='Close icon'
                />
            </button>
            {
                showEditInput ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            name='message'
                            value={editInputValue}
                            required
                            onChange={handleEditInputChange}
                        />
                        <button type='submit' disabled={(message === editInputValue) || isMutatingUpdateMessage}>Save</button>
                    </form>
                ) : null
            }
        </li>
    )
}

export default TodoItem