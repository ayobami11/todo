'use client'

import Image from 'next/image';

import useSWRMutation from 'swr/mutation';

import { useState, useEffect, useRef } from 'react';

import { TaskType } from '@/reducers/app';

import { useAppContext } from '@/contexts/app';

import editIcon from '../../../public/assets/images/icon-edit.svg';
import minimizeIcon from '../../../public/assets/images/icon-minimize.svg';
import crossIcon from '../../../public/assets/images/icon-cross.svg';
import checkIcon from '../../../public/assets/images/icon-check.svg';

const TodoItem = ({ _id: id, message, completed }: TaskType) => {

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [showEditInput, setShowEditInput] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');

    const { dispatch } = useAppContext();

    const toggleEditInputVisibility = () => {
        if (message !== newMessage) {
            setNewMessage(message);
        }

        setShowEditInput(prevState => !prevState);
    }

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    }

    const sendDeleteRequest = async (url: string) => {
        return await fetch(url, {
            method: 'DELETE'
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
            method: 'PATCH'
        });
    }

    const {
        trigger: triggerToggleCompletedRequest,
        isMutating: isMutatingToggleCompleted
    } = useSWRMutation(`/api/tasks/${id}/toggleCompleted`, sendToggleCompletedRequest);

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: newMessage })
        });
    }

    const {
        trigger: triggerUpdateMessageRequest,
        isMutating: isMutatingUpdateMessage
    } = useSWRMutation(`/api/tasks/${id}/editMessage`, sendUpdateMessageRequest);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // removes any leading or trailing whitespace
        setNewMessage(prevState => prevState.trim());


        const updateTask = async () => {
            try {

                const response = await triggerUpdateMessageRequest();

                const result = await response.json();

                if (response.ok) {
                    dispatch({ type: 'UPDATE_TASK', payload: { taskId: id, newMessage } });

                    setShowEditInput(false);
                    setNewMessage('');
                }

                console.log(result);

            } catch (error) {
                console.log(error);
            }
        }

        formRef.current?.reportValidity();

        if (message && message !== newMessage) {
            updateTask();
        }

    }

    useEffect(() => {
        if (showEditInput) {
            inputRef.current?.focus();
        }
    }, [showEditInput]);

    return (
        <li className={
            `group/item flex flex-wrap gap-4 justify-between p-4 border-b-2 text-dark-grayish-blue dark:text-light-grayish-blue 
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
                        `group/label shrink-0 grid place-items-center grid-cols-1 relative w-6 aspect-square cursor-pointer rounded-full 
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

            <div className={`ml-auto flex gap-x-5`}>
                <button
                    className={`${!showEditInput ? 'md:opacity-0 md:group-hover/item:opacity-100 md:focus:opacity-100' : ''}`}
                    title={showEditInput ? 'Hide' : 'Edit'}
                    onClick={toggleEditInputVisibility}
                >
                    {showEditInput ?
                        <Image
                            src={minimizeIcon}
                            alt='Minimize icon'
                        /> :
                        <Image
                            src={editIcon}
                            alt='Edit icon'
                        />
                    }
                </button>
                <button
                    className={`${!showEditInput ? 'md:opacity-0 md:group-hover/item:opacity-100 md:focus:opacity-100' : ''}`}
                    disabled={isMutatingDelete}
                    title='Delete'
                    onClick={deleteTask}
                >
                    <Image
                        src={crossIcon}
                        alt='Close icon'
                    />
                </button>
            </div>
            {
                showEditInput ? (
                    <form ref={formRef} className='basis-full flex gap-x-3' onSubmit={handleSubmit}>
                        <input
                            className={
                                `grow bg-transparent px-3 py-2 text-dark-grayish-blue dark:text-light-grayish-blue shadow-sm border 
                            border-slate-300 rounded-md focus:outline-none focus:border-bright-blue focus:ring-1 focus:ring-bright-blue invalid:caret-pink-500
                            invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-600`
                            }
                            type='text'
                            name='message'
                            value={newMessage}
                            ref={inputRef}
                            required
                            onChange={handleEditInputChange}
                        />
                        <button
                            className='text-very-light-gray bg-gradient-to-r from-cyan-500 to-blue-500 hover:enabled:bg-gradient-to-l font-medium px-4 rounded-md focus:outline-none focus:blue disabled:cursor-not-allowed disabled:opacity-75'
                            type='submit' disabled={!newMessage || (message === newMessage) || isMutatingUpdateMessage}>Save</button>
                    </form>
                ) : null
            }
        </li>
    )
}

export default TodoItem