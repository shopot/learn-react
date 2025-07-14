---
sidebar_position: 20
---


# Inline обработчики событий в JSX

## Создание состояния для списка

В предыдущих разделах мы работали со списком историй как с обычной переменной. Теперь мы сделаем его состоянием (state) компонента, чтобы иметь возможность изменять его.

Здесь мы используем хук `useState` для управления состоянием списка историй. Обратите внимание, что мы не используем наш хук `usePersistedSearch`, так как хотим каждый раз начинать с исходного списка.

```tsx
import { useState } from 'react';
// Импортируем массив stories как переменнную для начального состояния
import { stories as initialStories } from './stores/stories';
import type { Story } from './types';
// ...

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  // Инициализируем состояние массивом наших историй
  const [stories, setStories] = useState<Story[]>(initialStories);
  
  // ... остальной код
 }
 ```

Здесь мы объявили новый тип в файле `src/types/index.ts`

```ts
export type Story = {
  id: number;
  title: string;
  description: string;
};
```

## Удаление элемента из списка

Добавим функцию для удаления истории из списка:

```tsx
// ... предыдущий код
const App = () => {
  // ... предыдущий код

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
      {/* ... другие компоненты */}
      <List items={filteredStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}
```

Функция handleRemoveStory принимает `id` элемента для удаления и фильтрует текущий список, исключая из него элемент с найденным `id`.

## Передача обработчика через компоненты

Обработчик передаётся через несколько компонентов:

```tsx
import type { Story } from '../types';
import { ListItem } from './ListItem';

type ListProps = {
  items: Story[];
  onRemoveItem: (id: number) => void;
};

export const List = ({ items, onRemoveItem }: ListProps) => (
  <ul>
    {items.map((item) => (
      <ListItem key={item.id} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);
```

Компонент `List` получает обработчик как пропс и передаёт его дальше в компонент `ListItem`.

## Реализация обработчика в компоненте `ListItem`

В компоненте `ListItem` мы можем реализовать обработчик несколькими способами.

**Способ 1: Отдельная функция-обработчик**

```tsx
import type { Story } from '../types';

type ListItem = {
  item: Story;
  onRemoveItem: (id: number) => void;
};

export const ListItem = ({ item, onRemoveItem }: ListItem) => {
  const { id, title, description } = item;

  const handleRemoveItem = () => {
    onRemoveItem(id);
  };

  return (
    <li>
      <span>{title}</span>
      <span>{description}</span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Удалить
        </button>
      </span>
    </li>
  );
};
```

**Способ 2: Inline-обработчик с использованием `.bind()`**

```tsx
<button type="button" onClick={onRemoveItem.bind(null, id)}>
  Удалить
</button>
```

Метод `bind()` создаёт новую функцию, в которой первый аргумент (в данном случае `null`) становится значением `this`, а последующие аргументы (здесь `id`) привязываются как параметры функции.

**Способ 3: Inline-обработчик со стрелочной функцией**

```tsx
<button type="button" onClick={() => onRemoveItem(id)}>
  Удалить
</button>
```

Этот способ наиболее популярен благодаря своей лаконичности.

## Рекомендации по использованию inline-обработчиков

- Простота vs читаемость: Inline-обработчики делают код короче, но могут снизить его читаемость, особенно при сложной логике.
- Избегайте сложной логики в JSX: Выносите сложную логику в отдельную функцию.
- Производительность: Inline-стрелочные функции создают новую функцию при каждом рендере, что может повлиять на производительность в больших списках. В таких случаях лучше использовать `.bind()` или отдельные обработчики.

## Заключение

В этом разделе мы рассмотрели:

- Преобразование списка в состояние компонента.
- Реализацию обработчика удаления элемента.
- Три способа передачи обработчиков событий.
- Особенности inline-обработчиков в JSX.

Все три подхода к обработке событий имеют право на существование. Выбор между ними зависит от конкретного случая и предпочтений разработчика. Главное - соблюдать баланс между лаконичностью и читаемостью кода.
