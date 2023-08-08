import { getServerSession } from 'next-auth/next';

import Header from '@/app/components/Header';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import TodoMenu from '@/app/components/TodoMenu';

import { authOptions } from '@/lib/auth';

export default async function Home() {

  const session = await getServerSession(authOptions);
  // console.log(session);

  return (
    <div className=''>
      <Header />
      <main className='w-11/12 max-w-4xl'>
        <div>
          <TodoForm />
          <TodoList />
          <TodoMenu />
        </div>
      </main>
    </div>
  );
}
