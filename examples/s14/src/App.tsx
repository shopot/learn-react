import { useState } from 'react';
import { stories } from './stores/stories';
import { List } from './components/List';
import { Search } from './components/Search';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredStories = stories.filter(({ title }) => {
    return title.toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List items={filteredStories} />
    </div>
  );
}

export default App;
