---
sidebar_position: 10
---

# Передача данных вверх по иерархии компонентов

##  Проблема: изолированное состояние в дочернем компоненте

Если вы сделали домашнюю работу из предыдущей статьи, то теперь наше приложение состоит из трех компонентов:

- `App` (родительский)
- `Search` и `List` (дочерние, находящиеся на одном уровне)

Мы вынесли логику поиска в отдельный компонент `Search`, который хранит состояние `searchTerm` и отображает его. 
Однако теперь у нас возникает проблема: как передать этот `searchTerm` обратно в `App` или в компонент `List`?

По умолчанию в React пропсы передаются только сверху вниз, но не наоборот. Это означает, что напрямую отправить данные из Search в App или List нельзя.

## Решение: Callback Handler

Callback Handler – это функция, переданная через пропсы, которая позволяет дочернему компоненту "сообщать" родительскому компоненту о каких-то изменениях.

Как это работает?

- Родитель (`App`) определяет функцию-обработчик (например, `handleSearch`).
- Функция передаётся в дочерний компонент (`Search`) через пропсы.
- Дочерний компонент вызывает эту функцию при необходимости (например, при изменении поля ввода).
- Родитель получает данные и может их использовать (например, передать в `List`).

Давайте посмотрим на пример реализации.

Реализация для компонента `App`: 

```tsx
// src/App.tsx
import { List } from './components/List';
import { peopleData } from './peopleData';
import { Search } from './components/Search';

const App = () => {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <div>
      <h1>The People's list</h1>
      <Search onSearch={handleChange} />
      <hr />
      <List items={peopleData} />
    </div>
  );
};

export default App;
```

Реализация для компонента `Search`:

```tsx
// src/components/Search.tsx
import React, { useState } from 'react';

type SearchProps = {
  onSearch: (value: string) => void;
};

export const Search = ({ onSearch }: SearchProps) => {
  // Инициализация состояния пустой строкой
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSearchTerm(newValue);
    onSearch(newValue); // Вызов Callback Handler
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        value={searchTerm} // Переменная состояния
        onChange={handleChange} // Обработчик изменения поля ввода
      />
    </div>
  );
};
```

**Как это работает?**

- Пользователь вводит текст в `input` внутри `Search`.
- Компонент `Search` вызывает `onSearch(newValue)`, передавая новое значение родительскому компоненту.
- `App` получает это значение и выводит его в консоль.


## Заключение


Обработчики обратного вызова (Callback Handlers), передаваемые как функции в пропсах, могут использоваться для передачи
данных вверх по иерархии компонентов. Это позволяет организовать восходящую передачу данных в React, особенно это полезно, когда:

- Дочерний компонент должен уведомить родителя о действиях пользователя.
- Несколько компонентов должны синхронизировать своё состояние.

