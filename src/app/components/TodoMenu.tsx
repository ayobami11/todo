'use client'

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAppContext } from '@/contexts/app';

const TodoMenu = () => {

  const router = useRouter();

  const searchParams = useSearchParams();

  const filter = searchParams.get('filter');

  const { state, dispatch } = useAppContext();

  const setFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTER', payload: { filter: event.target.value } });

    router.push(`?filter=${event.target.value}`);
  }

  useEffect(() => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        filter
      }
    });
  }, [dispatch, filter]);

  return (
    <menu className='flex justify-center gap-6 mt-4 p-4 font-bold bg-very-light-gray dark:bg-very-dark-desaturated-blue text-dark-grayish-blue dark:text-dark-grayish-blue-alt rounded-md md:mt-0 md:p-0'>
      <li>
        <input
          className='appearance-none'
          type='radio'
          name='tasks-filter'
          id='filter-all'
          value='all'
          checked={state.filter === 'all'}
          onChange={setFilter}
        />
        <label className={`cursor-pointer hover:text-very-dark-grayish-blue dark:hover:text-light-grayish-blue-alt-2 ${state.filter === 'all' ? 'text-bright-blue' : ''}`} htmlFor='filter-all'>All</label>
      </li>
      <li>
        <input
          className='appearance-none'
          type='radio'
          name='tasks-filter'
          id='filter-active'
          value='active'
          checked={state.filter === 'active'}
          onChange={setFilter}
        />
        <label className={`cursor-pointer hover:text-very-dark-grayish-blue dark:hover:text-light-grayish-blue-alt-2 ${state.filter === 'active' ? 'text-bright-blue' : ''}`} htmlFor='filter-active'>Active</label>
      </li>
      <li>
        <input
          className='appearance-none'
          type='radio'
          name='tasks-filter'
          id='filter-completed'
          value='completed'
          checked={state.filter === 'completed'}
          onChange={setFilter}
        />
        <label className={`cursor-pointer hover:text-very-dark-grayish-blue dark:hover:text-light-grayish-blue-alt-2 ${state.filter === 'completed' ? 'text-bright-blue' : ''}`} htmlFor='filter-completed'>Completed</label>
      </li>
    </menu>
  )
}

export default TodoMenu;