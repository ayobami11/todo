'use client'

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';

import { DragDropContext, Draggable, type DropResult } from 'react-beautiful-dnd';

import { StrictModeDroppable as Droppable } from '@/app/components/StrictModeDroppable';

import { useAppContext } from '@/contexts/app';

import TodoMenu from '@/app/components/TodoMenu';
import TodoItem from '@/app/components/TodoItem';

import { TaskType } from '@/reducers/app';

// a little function to help us with reordering the result
const reorderTasks = (list: TaskType[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const TodoList = () => {

    const { data: session } = useSession();

    const { state, dispatch } = useAppContext();

    const handleDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const tasks = reorderTasks(
            state.tasks,
            result.source.index,
            result.destination.index
        );

        dispatch({ type: 'SET_TASKS', payload: { tasks } });
    }

    const sendGetTasks = async (url: string) => {
        return await fetch(url);
    }

    const sendDeleteCompletedTasks = async (url: string) => {
        return await fetch(url, {
            method: 'DELETE'
        });
    }

    const { trigger: triggerGetTasks } = useSWRMutation('/api/tasks', sendGetTasks);
    const {
        trigger: triggerDeleteCompleted,
        isMutating: isMutatingDelete
    } = useSWRMutation('/api/tasks/deleteCompleted', sendDeleteCompletedTasks);

    const tasksFilterKey = state.filter === 'active' ?
    'activeTasks' : state.filter === 'completed' ?
    'completedTasks' : 'tasks';
    const numberOfTasks = state[tasksFilterKey].length;

    const deleteCompletedTasks = () => {
        (async () => {
            try {
                const response = await triggerDeleteCompleted();

                if (response.ok) {
                    dispatch({ type: 'DELETE_COMPLETED_TASKS' });

                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: 'Tasks deleted.'
                        }
                    });
                }
            } catch (error) {
                console.log(error);

                dispatch({
                    type: 'ADD_TOAST',
                    payload: {
                        message: 'Task deletions failed.'
                    }
                });
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

                    dispatch({
                        type: 'ADD_TOAST',
                        payload: {
                            message: 'Tasks fetched successfully.'
                        }
                    });
                }

            } catch (error) {
                console.log(error);

                dispatch({
                    type: 'ADD_TOAST',
                    payload: {
                        message: 'Tasks could not be fetched successfully.'
                    }
                });
            }
        }

        if (session?.user.id) {
            getTasks();
        }

    }, [triggerGetTasks, session?.user.id, dispatch]);


    return (
        <div className='bg-very-light-gray dark:bg-very-dark-desaturated-blue rounded-md shadow-list-light dark:shadow-list-dark'>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='droppable'>
                    {(provided) => (
                        <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {state[tasksFilterKey].map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >

                                            <TodoItem key={task._id} {...task} />
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <footer className='flex p-4 justify-between text-dark-grayish-blue dark:text-dark-grayish-blue-alt'>
                <p>{numberOfTasks || 'No'} {numberOfTasks === 1 ? 'item' : 'items'} left</p>
                <div className='hidden md:block'>
                    <TodoMenu />
                </div>
                <button
                    className='capitalize hover:text-very-dark-grayish-blue dark:hover:text-light-grayish-blue-alt-1 focus:text-very-dark-grayish-blue dark:focus:text-light-grayish-blue-alt-2 focus:outline-none'
                    disabled={isMutatingDelete}
                    onClick={deleteCompletedTasks}
                >Clear completed</button>
            </footer>
        </div>
    )
}

export default TodoList;