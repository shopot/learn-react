import { useEffect, useState } from 'react';
import { List } from './components/List';
import { InputField } from './components/InputField';
import { usePersistedSearch } from './hooks/usePersistedSearch';
import type { Story } from './types';

const API_ENDPOINT = 'http://localhost:3000/catalog';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(API_ENDPOINT)
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
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRemoveStory = (id: number) => {
    const newStories = stories.filter((story) => story.id !== id);

    setStories(newStories);
  };

  const filteredStories = stories.filter(({ title }) => {
    return title.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

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
        <List items={filteredStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
