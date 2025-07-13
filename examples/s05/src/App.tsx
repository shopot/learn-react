import { List } from './components/List';
// Первая строка подключает новый компонент List,
// чтобы его можно было использовать внутри компонента App.

function App() {
  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
      <hr />
      <List />
    </div>
  );
}

export default App;
