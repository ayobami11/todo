type FilterType = 'all' | 'active' | 'completed';

export interface TaskType {
    _id: string,
    task: string,
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