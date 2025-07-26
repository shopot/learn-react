import { List } from './components/List';
import { usePersistedSearch } from './hooks/usePersistedSearch';
import { useGetStoriesQuery } from './hooks/useGetStoriesQuery';
import { useDebounceValue } from './hooks/useDebounceValue';
import { InputField } from './components/InputField';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const [debouncedValue, setDebouncedValue] = useDebounceValue(searchTerm);
  const { data, isError, isLoading } = useGetStoriesQuery(debouncedValue);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setDebouncedValue(value);
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
        <List items={data} onRemoveItem={() => null} />
      )}
    </div>
  );
}

export default App;
