import { v4 as uuidv4 } from 'uuid';

export interface ToastType {
    id: string,
    message: string
}

export interface TaskType {
    _id: string,
    message: string,
    completed: boolean
}

type FilterType = 'all' | 'active' | 'completed';
export interface AppState {
    toasts: ToastType[],
    tasks: TaskType[],
    filter: FilterType
}

type AppActions = {
    type: 'SET_TASKS',
    payload: { tasks: TaskType[] }
} | {
    type: 'ADD_TASK',
    payload: { newTask: TaskType }
} | {
    type: 'UPDATE_TASK',
    payload: { taskId: string, newMessage: string }
} | {
    type: 'TOGGLE_TASK_COMPLETED',
    payload: { taskId: string, message: string }
} | {
    type: 'DELETE_TASK',
    payload: { taskId: string }
} | {
    type: 'DELETE_COMPLETED_TASKS'
} | {
    type: 'SET_FILTER',
    payload: { filter: FilterType }
} | {
    type: 'ADD_TOAST',
    payload: { message: string }
} | {
    type: 'DELETE_TOAST',
    payload: { toastId: string }
}

export const initialState: AppState = {
    toasts: [],
    tasks: [],
    filter: 'all'
}

export const reducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case 'SET_TASKS': {
            return {
                ...state,
                tasks: action.payload.tasks
            }
        }

        case 'ADD_TASK': {
            const updatedTasks = [...state.tasks, action.payload.newTask];

            return {
                ...state,
                tasks: updatedTasks
            }
        }

        case 'UPDATE_TASK': {

            const updatedTasks = state.tasks.map(task => {
                if (task._id === action.payload.taskId) {
                    task.message = action.payload.newMessage;
                }

                return task;
            });

            return {
                ...state,
                tasks: updatedTasks
            }
        }

        case 'TOGGLE_TASK_COMPLETED': {

            const updatedTasks = state.tasks.map(task => {
                if (task._id === action.payload.taskId) {
                    task.completed = !task.completed;
                }

                return task;
            });

            return {
                ...state,
                tasks: updatedTasks
            }
        }

        case 'DELETE_TASK': {
            const updatedTasks = state.tasks.filter(task => task._id !== action.payload.taskId);

            return {
                ...state,
                tasks: updatedTasks
            }
        }

        case 'DELETE_COMPLETED_TASKS': {
            const updatedTasks = state.tasks.filter(task => !task.completed);

            return {
                ...state,
                tasks: updatedTasks
            }
        }

        case 'SET_FILTER': {

            const validFilters = ['all', 'active', 'completed'];

            const filter = validFilters.includes(action.payload.filter) ? action.payload.filter : 'all';

            return {
                ...state,
                filter
            }
        }

        case 'ADD_TOAST': {

            const newToast = {
                id: uuidv4(),
                message: action.payload.message
            }

            return {
                ...state,
                toasts: [...state.toasts, newToast]
            }
        }

        case 'DELETE_TOAST': {

            const modifiedToasts = state.toasts.filter(toast => toast.id !== action.payload.toastId);

            return {
                ...state,
                toasts: modifiedToasts
            }
        }

        default: {
            return state;
        }
    }
}