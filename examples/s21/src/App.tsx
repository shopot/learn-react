import { useEffect, useState } from 'react';
import { List } from './components/List';
import { InputField } from './components/InputField';
import { usePersistedSearch } from './hooks/usePersistedSearch';
import type { Story } from './types';
import { getAsyncStories } from './api/getAsyncStories';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    getAsyncStories().then((result) => {
      setStories(result.data.stories);
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
      <h1>Frontend JavaScript frameworks</h1>
      <InputField
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onChange={handleSearch}
      />
      <hr />
      <List items={filteredStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

export default App;
