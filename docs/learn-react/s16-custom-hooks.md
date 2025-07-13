---
sidebar_position: 16
---

# Пользовательские хуки вы React

## Что такое пользовательские хуки?

React предоставляет встроенные хуки, такие как `useState` и `useEffect`, но иногда возникает необходимость в собственной логике, которую можно переиспользовать в разных компонентах. 
Для этого создаются пользовательские хуки (кастомные) — функции, которые используют стандартные хуки внутри себя.

В этой статье мы разберём, как создать свой собственный хук `usePersistedSearch`, который сохраняет состояние в localStorage и синхронизирует его между сессиями.

## Зачем нужен `usePersistedSearch`?

Хук решает две задачи:

- Хранит состояние (как `useState`).
- Сохраняет его в localStorage, чтобы данные не терялись при перезагрузке страницы.


## Пошаговое создание хука

1. Базовый вариант (без переиспользования)

Сначала вынесем логику из компонента в отдельную функцию:

```tsx
// src/hooks/usePersistedSearch.ts
import { useEffect, useState } from 'react';

export const usePersistedSearch = () => {
  const [value, setValue] = useState<string>(
    localStorage.getItem('search') || '',
  );

  useEffect(() => {
    localStorage.setItem('search', value);
  }, [value]);

  return [value, setValue];
};
```


Проблемы:

- Жёстко зашитое ключ `value` — нельзя использовать хук для разных данных.
- Нет возможности задать начальное значение.

2. Добавляем параметры (`key` и `initialState`)

Что бы хук можно было переиспользовать, добавим:

- `key` — уникальный идентификатор для localStorage.
- `initialState` — начальное значение, если в хранилище ничего нет.

```tsx
import { useEffect, useState } from 'react';

export const usePersistedSearch = (key: string, initialState: string) => {
  const [value, setValue] = useState<string>(
    localStorage.getItem(key) ?? initialState,
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]); // Добавляем key в зависимости

  return [value, setValue] as const;
};
```

Теперь хук можно применять в любом компоненте:

```tsx
import { stories } from './stores/stories';
import { List } from './components/List';
import { Search } from './components/Search';
import { usePersistedSearch } from './hooks/usePersistedSearch';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');

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
```

Как это работает?

- При первом рендере хук проверяет localStorage по ключу `search`.
- Если значения нет, устанавливается `initialState` с пустой строкой.
- При изменении `searchTerm` новое значение автоматически сохраняется в localStorage.

## Заключение

Пользовательские хуки — мощный инструмент для организации кода в React. Они служат для:

- Создание переиспользуемой логики для использования в разных компонентах, что исключить дублирование кода.
- Инкапсулирование логики внутри хука для упрощения компонента.
- Сделать логику более предсказуемой и тестируемой.
