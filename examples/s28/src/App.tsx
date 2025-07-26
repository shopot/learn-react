import { List } from './components/List';
import { usePersistedSearch } from './hooks/usePersistedSearch';
import { useGetStoriesQuery } from './hooks/useGetStoriesQuery';
import { SearchForm } from './components/SearchForm';
import { useCallback, useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const { data, isError, isLoading } = useGetStoriesQuery(searchTerm);
  const [counter, setCounter] = useState(0);

  // Вызываем useCallback и передаем в него определение нашего обработчика
  const handleSubmit = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <div>
      {counter}{' '}
      <button onClick={() => setCounter((prev) => prev + 1)}>Click</button>
      <h1>Showcasing innovation every day</h1>
      <SearchForm
        loading={isLoading}
        onSubmit={handleSubmit}
        defaultValue={searchTerm}
      />
      <hr />
      {isError && <p>Что-то пошло не так...</p>}
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <List items={data} onRemoveItem={() => null} />
      )}
    </div>
  );
}

export default App;
