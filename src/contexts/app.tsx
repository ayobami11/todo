'use client'

import { createContext, useContext, useReducer } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { AppState, reducer, initialState } from '@/reducers/app';

export interface AppContextType {
    state: AppState,
    dispatch: React.Dispatch<any>
}

const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <SessionProvider>
                <ThemeProvider attribute='class' enableSystem={true}>
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === null) {
        throw new Error('AppContext does not have a valid value.');
    }

    return context;
};