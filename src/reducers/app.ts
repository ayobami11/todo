type FilterType = 'all' | 'active' | 'completed';

export interface TaskType {
    _id: string,
    message: string,
    completed: boolean
}

export interface AppState {
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
    payload: { taskId: string, updatedTask: TaskType }
} | {
    type: 'TOGGLE_TASK_COMPLETED',
    payload: { taskId: string, message: string }
} | {
    type: 'DELETE_TASK',
    payload: { taskId: string }
} | {
    type: 'SET_FILTER',
    payload: { filter: FilterType }
}

export const initialState: AppState = {
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
                return task._id === action.payload.taskId ? action.payload.updatedTask : task;
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

        case 'SET_FILTER': {
            return {
                ...state,
                filter: action.payload.filter
            }
        }

        default: {
            return state;
        }
    }
}