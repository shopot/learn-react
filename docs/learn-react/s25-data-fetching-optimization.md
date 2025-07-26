---
sidebar_position: 25
---

# Оптимизация запросов в React: Debouncing and AbortController

В предыдущей статье мы реализовали серверный поиск (фильтрацию на стороне сервера), который отправляет запрос при каждом изменении `input`.
Теперь мы оптимизируем этот процесс, чтобы снизить нагрузку на сервер и улучшить пользовательский опыт.

## Проблемы текущей реализации

- Избыточные запросы - при быстром вводе отправляется слишком много запросов.
- Гонка запросов - старые запросы могут вернуться позже новых.
- Проблема с производительностью - избыточная нагрузка на клиент и сервер.

## Решение 1: Debouncing (задержка запросов)

Реализуем задержку запроса с помощью `setTimeout`, для этого реализуем упрощенную версию хука `useDebounceValue`:

Создадим файл `src/hooks/useDebounceValue.ts`:

```ts
import { useRef, useState } from 'react';

export const useDebounceValue = (defaultValue = '', delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(() => defaultValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const setValue = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  };

  return [debouncedValue, setValue] as const;
};
```

Теперь в `useEffect` вместо  `searchTerm` мы будем использовать `debouncedValue`, а для синхронизации значения добавим вызов `setDebouncedValue` в обработчик ввода:

```ts
const handleSearch = (value: string) => {
  setSearchTerm(value);
  setDebouncedValue(value);
};
```

### Как это работает:

**1. Инициализация состояния:**

```ts
const [debouncedValue, setDebouncedValue] = useState(defaultValue);
```

- Создает состояние `debouncedValue` с начальным значением `defaultValue`.
- `defaultValue` - этот аргумент игнорируется после первоначального рендера.

**2. Ссылка на таймер:**

```ts
const timerRef = useRef<ReturnType<typeof setTimeout>>(0);
```

- Создает mutable ref для хранения идентификатора таймера.
- Типизирован как возвращаемый тип `setTimeout`.

**3. Функция `setValue`:**

```ts
const setValue = (value: string) => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  timerRef.current = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);
};
```

При каждом вызове:

- Отменяет предыдущий запланированный таймер, если он существует.
- Устанавливает новый таймер для обновления значения через указанную задержку.

### **Ключевые особенности**

**1. Debouncing:**

- Обновление `debouncedValue` происходит только после указанной задержки (`delay`).
- При частых вызовах `setValue` таймер всегда сбрасывает предыдущее состояние.

**2. Архитектурные решения:**

- Использование `useRef` для хранения таймера (сохраняется между рендерами).
- Чистка таймера при каждом новом вызове (предотвращает утечки).
- Константный кортеж as `const` для строгой типизации возвращаемого значения.

**3. Поведение:**

```ts
const [searchTerm, setSearchTerm] = useDebounceValue('', 500);

// При быстром вводе "react":
setSearchTerm('r') // таймер 500ms
setSearchTerm('re') // сбрасывает предыдущий, новый таймер 500ms
setSearchTerm('rea') // снова сбрасывает
setSearchTerm('reac') // снова сбрасывает
setSearchTerm('react') // последний вызов
// Через 500ms после последнего ввода:
// debouncedValue обновится до 'react'
```

## Решение 2: Отмена предыдущих запросов

Используем `AbortController` для отмены неактуальных запросов:

```tsx
useEffect(() => {
  const controller = new AbortController();

  const fetchData = () => {
    setIsLoading(true);

    fetch(`${API_ENDPOINT}?title_like=${debouncedValue}`, {
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
}, [debouncedValue]);
```

### Как это работает

**1. Создание AbortController**

```ts
const controller = new AbortController();
```

- Создаётся объект `AbortController`, который позволяет прервать fetch-запрос
- Это нативный браузерный API, а не часть React

**2. Основная функция запроса**

```ts
signal: controller.signal // Подключаем механизм отмены
```

- Запрос выполняется с параметром `signal` из контроллера.
- Это "подписывает" запрос на возможность отмены.

**3. Запуск запроса**

```ts
fetchData();
```

- Функция вызывается сразу при выполнении эффекта.

**4. Функция очистки `useEffect`**

```ts
return () => controller.abort();
```

- Вызывается в двух случаях:
    - Перед повторным выполнением эффекта (при изменении `debouncedValue`).
    - При размонтировании компонента.

- `controller.abort()` посылает сигнал отмены:
    - Прерывает активный запрос.
    - Вызывает `AbortError` в цепочке промисов.

**5. Обработка ошибки отмены**

- Важно отличать ошибку отмены от настоящих ошибок сети.
- При `AbortError` не обновляем состояние (запрос был намеренно прерван).


### Почему это важно?

- Предотвращает "гонку запросов" — когда старый запрос возвращается позже нового.
- Экономит ресурсы — отменяет неактуальные запросы.
- Избегает утечек памяти — предотвращает обновление состояния размонтированного компонента.

### Особенности реализации

- Работает только с `fetch` (для `axios` используется `CancelToken`).
- Не отменяет уже завершённые запросы.
- Совместим с Debouncing (как в вашем хуке `useDebounceValue`).


## Практические рекомендации

- Всегда используйте Debouncing для поисковых запросов.
- Обязательно отменяйте неактуальные запросы.
- Для сложных сценариев рассмотрите библиотеки (TanStack Query, RTK Query, SWR)
- Оптимальная задержка Debouncing - 300-500ms.

## Заключение

В этой статье мы рассмотрели два ключевых подхода для оптимизации работы с API в React-приложениях:

**Дебаунсинг (useDebounceValue)**

- Позволяет уменьшить количество запросов при частом изменении `input`.
- Реализуется через `setTimeout` и `clearTimeout`.
- Сохраняет стабильность приложения при быстром вводе пользователя.

**Отмена запросов (`AbortController`)**

- Предотвращает "гонку запросов".
- Избегает утечек памяти при размонтировании компонентов.
- Обеспечивает актуальность получаемых данных.
