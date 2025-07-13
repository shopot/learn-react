import { List } from './components/List';
import { stories } from './stores/stories';

function App() {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', event.target.value);
  };

  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
      <hr />
      <List items={stories} />
    </div>
  );
}

export default App;
