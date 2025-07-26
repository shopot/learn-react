import { useEffect, useState } from 'react';
import { List } from './components/List';
import { InputField } from './components/InputField';
import { usePersistedSearch } from './hooks/usePersistedSearch';
import { useDebounceValue } from './hooks/useDebounceValue';
import type { Story } from './types';

const API_ENDPOINT = 'http://localhost:3000/catalog';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const [debouncedValue, setDebouncedValue] = useDebounceValue('');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = () => {
      setIsLoading(true);

      fetch(`${API_ENDPOINT}?title_like=${debouncedValue}`, {
        signal: controller.signal, // Подключаем механизм отмены
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        })
        .then((result) => {
          setStories(result);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Игнорируем ошибку отмены
            setIsLoading(false);
            setIsError(true);
          }
        });
    };

    fetchData();

    return () => controller.abort();
  }, [debouncedValue]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setDebouncedValue(value);
  };

  const handleRemoveStory = (id: number) => {
    const newStories = stories.filter((story) => story.id !== id);

    setStories(newStories);
  };

  return (
    <div>
      <h1>Showcasing innovation every day</h1>
      <InputField
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onChange={handleSearch}
      />
      <hr />
      {isError && <p>Что-то пошло не так...</p>}

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <List items={stories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
