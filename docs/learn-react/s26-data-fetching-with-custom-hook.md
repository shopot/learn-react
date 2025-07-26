---
sidebar_position: 26
---

# Создание пользовательского хука для загрузки данных

В этой статье мы научимся выносить логику работы с API в переиспользуемые кастомные хуки — важный навык для создания чистого и поддерживаемого кода.

## Почему пользовательские хуки?

Пользовательские хуки позволяют:

- Изолировать сложную логику.
- Повторно использовать код в разных компонентах.
- Упрощать тестирование.
- Делать компоненты более чистыми и понятными.

## Создание хука `useGetStoriesQuery`

Разберём пошагово создание хука для загрузки данных:

```tsx
import { useEffect, useState } from 'react';
import type { Story } from '../types';

const API_ENDPOINT = 'http://localhost:3000/catalog';

export const useGetStoriesQuery = (activeSearch: string) => {
  // 1. Состояния хука
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // 2. Эффект для загрузки данных
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = () => {
      setIsLoading(true);

      fetch(`${API_ENDPOINT}?title_like=${activeSearch}`, {
        signal: controller.signal, // Подключаем механизм отмены
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          return response.json();
        })
        .then((result) => {
          setStories(result);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Игнорируем ошибку отмены
            setIsLoading(false);
            setIsError(true);
          }
        });
    };

    fetchData();

    return () => controller.abort();
  }, [activeSearch]); // Зависимость от поискового запроса

  // 3. Возвращаемые значения
  return { data: stories, isLoading, isError };
};
```

**Ключевые особенности:**

- Параметры хука - принимает поисковый запрос.
- Управление состоянием - содержит логику загрузки, ошибок и данных.
- Эффект с `AbortController` - отменяет неактуальные запросы.
- Автоматически реагирует на изменение входных параметров
- Запускает новые запросы при изменении зависимостей.
- Инкапсулирует сложную логику работы с API.

## Использование в компоненте

Применяем хук в компоненте App:

```tsx
// ... остальной код
import { useGetStoriesQuery } from './hooks/useGetStoriesQuery';

function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const [debouncedValue, setDebouncedValue] = useDebounceValue(searchTerm);
  const { data, isError, isLoading } = useGetStoriesQuery(debouncedValue);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setDebouncedValue(value);
  };

 // ... остальной код
}
```

Преимущества такого подхода:

- Компонент стал проще - логика загрузки вынесена в хук.
- Переиспользуемость - useGetStoriesQuery можно использовать в любом месте приложения.
- Гибкость - легко модифицировать логику загрузки в одном месте.


## Практические рекомендации

- Выносите логику API в кастомные хуки для чистоты кода.
- Применяйте `useEffect` для обработки побочных эффектов.
- Не забывайте про реализацию отмены запросов через `AbortController`.
- Реализуйте жизненный цикл для запросов (`isLoading`, `isError` etc.).
- Рассмотрите готовые решения TanStack Query, RTK Query, SWR, Apollo Client.

## Заключение

Пользовательские хуки в React — это мощный инструмент для организации кода, который позволяет выносить сложную логику (например, работу с API) в переиспользуемые модули. Как мы увидели на примере хука useGetStoriesQuery, такой подход делает компоненты чище, улучшает поддерживаемость кода и позволяет легко повторно использовать логику в разных частях приложения. 