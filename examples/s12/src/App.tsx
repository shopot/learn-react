import { stories } from './stores/stories';
import { List } from './components/List';
import { Search } from './components/Search';

function App() {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <Search onSearch={handleChange} />
      <hr />
      <List items={stories} />
    </div>
  );
}

export default App;
