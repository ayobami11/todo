import { v4 as uuidv4 } from 'uuid';

export type ToastType = Record<'id' | 'message', string>;

export type TaskType = Record<'_id' | 'message', string> & {
    completed: boolean
}

type FilterType = 'all' | 'active' | 'completed';

export type AppState = Record<'tasks' | 'activeTasks' | 'completedTasks', TaskType[]> & {
    filter: FilterType,
    toasts: ToastType[]
};

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
    activeTasks: [],
    completedTasks: [],
    filter: 'all'
}

export const reducer = (state: AppState, action: AppActions): AppState => {
    switch (action.type) {
        case 'SET_TASKS': {

            const tasks = action.payload.tasks;
            const activeTasks = [];
            const completedTasks = [];

            for (const task of tasks) {
                task.completed ?
                    completedTasks.push(task) :
                    activeTasks.push(task);
            }

            return {
                ...state,
                tasks,
                activeTasks,
                completedTasks
            }
        }

        case 'ADD_TASK': {

            const newTask = action.payload.newTask;

            return {
                ...state,
                tasks: [...state.tasks, newTask],
                activeTasks: [...state.activeTasks, newTask]
            }
        }

        case 'UPDATE_TASK': {

            const tasks = state.tasks.map(task => {
                if (task._id === action.payload.taskId) {
                    task.message = action.payload.newMessage;
                }

                return task;
            });

            const activeTasks = [];
            const completedTasks = [];

            for (const task of tasks) {
                task.completed ?
                    completedTasks.push(task) :
                    activeTasks.push(task);
            }

            return {
                ...state,
                tasks,
                activeTasks,
                completedTasks
            }
        }

        case 'TOGGLE_TASK_COMPLETED': {

            const tasks = state.tasks.map(task => {
                if (task._id === action.payload.taskId) {
                    task.completed = !task.completed;
                }

                return task;
            });

            const activeTasks = [];
            const completedTasks = [];

            for (const task of tasks) {
                task.completed ?
                    completedTasks.push(task) :
                    activeTasks.push(task);
            }

            return {
                ...state,
                tasks,
                activeTasks,
                completedTasks
            }
        }

        case 'DELETE_TASK': {

            const tasks = [];
            const activeTasks = [];
            const completedTasks = [];

            for (const task of state.tasks) {
                // ignores the deleted task
                if (task._id === action.payload.taskId) continue;

                tasks.push(task);

                task.completed ?
                    completedTasks.push(task) :
                    activeTasks.push(task);
            }

            return {
                ...state,
                tasks,
                activeTasks,
                completedTasks
            }
        }

        case 'DELETE_COMPLETED_TASKS': {

            return {
                ...state,
                tasks: state.activeTasks,
                completedTasks: []
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