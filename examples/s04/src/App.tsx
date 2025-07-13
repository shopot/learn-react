const stories = [
  {
    id: 1,
    title: 'React',
    description:
      'Библиотека для создания пользовательских интерфейсов, основанная на компонентной архитектуре.',
  },
  {
    id: 2,
    title: 'Vue.js',
    description:
      'Прогрессивный фреймворк для построения интерфейсов, легкий и гибкий в использовании.',
  },
  {
    id: 3,
    title: 'Angular',
    description:
      'Мощный фреймворк от Google для разработки одностраничных приложений с богатым функционалом.',
  },
  {
    id: 4,
    title: 'Svelte',
    description:
      'Современный фреймворк, который компилирует компоненты в чистый JavaScript, обеспечивая высокую производительность.',
  },
  {
    id: 5,
    title: 'Ember.js',
    description:
      'Фреймворк для амбициозных веб-приложений с встроенным роутингом и инструментами разработки.',
  },
];

function App() {
  const storiesList = stories.map(({ id, title, description }) => (
    <li key={id}>
      <span>{title}</span>
      <span>{description}</span>
    </li>
  ));

  return (
    <div>
      <h1>Frontend JavaScript frameworks</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
      <hr />
      <ul>{storiesList}</ul>
    </div>
  );
}

export default App;
