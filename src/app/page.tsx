import Header from '@/app/components/Header';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import TodoMenu from '@/app/components/TodoMenu';


export default async function Home() {

  return (
    <>
      <Header />
      <main className='w-11/12 max-w-4xl mx-auto'>
        <div>
          <TodoForm />
          <TodoList />
          <TodoMenu />
        </div>
      </main>
    </>
  );
}
