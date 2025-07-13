import { List } from './components/List';
import { stories } from './stores/stories';
import { Search } from './components/Search';

function App() {
  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <Search />
      <hr />
      <List items={stories} />
    </div>
  );
}

export default App;
