import Header from '@/app/components/Header';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import TodoMenu from '@/app/components/TodoMenu';


export default async function Home() {

  return (
    <>
      <Header />
      <main className='w-11/12 max-w-3xl mx-auto'>
        <div>
          <TodoForm />
          <TodoList />
          <div className='md:hidden'>
            <TodoMenu />
          </div>

          <p className='my-12 text-center text-dark-grayish-blue dark:text-dark-grayish-blue-alt'>Drag and drop to reorder list</p>
        </div>
      </main>
    </>
  );
}
