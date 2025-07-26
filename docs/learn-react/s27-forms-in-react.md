---
sidebar_position: 27
---

# Работа с формами в React

И так, сейчас наше приложение отправляет запрос каждый раз когда пользователь осуществляет ввод данных в `input`.

Для улучшения пользовательского опыта, мы должны отказаться от неявной отправки запроса данных в пользу явной отправки запроса.
Другими словами, приложение должно выполнять повторную выборку данных, только если кто-то нажмет кнопку подтверждения. 

Для того, что бы это сделать, нам необходимо вынести логику поиска в отдельный компонент формы со своим состоянием и возможностью передачи данных для запроса в родительский компонент `App`.

## Создаем компонент `SearchForm`

Создадим новый файл `src/components/SearchForm.tsx`:

```tsx
import { useState } from 'react';
import { InputField } from './InputField';

type SearchFormProps = {
  loading: boolean;
  defaultValue: string;
  onSubmit: (searchValue: string) => void;
};

export const SearchForm = ({
  loading,
  defaultValue,
  onSubmit,
}: SearchFormProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSubmit('');
  };

  const isSubmitDisabled = loading || !inputValue;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <InputField
          id="search"
          label="Search"
          value={inputValue}
          isFocused
          onChange={setInputValue}
        />
        <button type="submit" disabled={isSubmitDisabled}>
          Поиск
        </button>
        <button type="button" onClick={handleClear} disabled={!inputValue}>
          Очистить
        </button>
      </div>
    </form>
  );
};
```

Давайте разберём по шагам, как работает этот компонент формы поиска.

## Пропсы (входные параметры)

Компонент принимает три параметра:

- `loading` - флаг загрузки (`true/false`).
- `defaultValue` - начальное значение для поля ввода.
- `onSubmit` - функция, которая вызывается при отправке формы.

### Состояние компонента

```ts
const [inputValue, setInputValue] = useState(defaultValue);
```

Здесь мы создаём:

- `inputValue` - текущее значение в поле ввода.
- `setInputValue` - функция для обновления этого значения.

Начальное значение берётся из пропса `defaultValue` при начальном рендере компонента.

### Обработчики событий

При отправке формы:

```ts
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // Отменяем стандартное поведение формы
  onSubmit(inputValue); // Вызываем переданную функцию с текущим значением
};
```

### Условия для кнопок

```ts
// Вычисляемое значение на каждый рендер компонента
const isSubmitDisabled = loading || !inputValue;
```

Кнопка "Поиск" будет отключена, если:

- Идёт загрузка (`loading === true`)
- Поле ввода пустое (`inputValue` пустая строка)

Кнопка "Очистить" отключается, когда поле ввода пустое.

## Как это работает

1. Пользователь вводит текст в поле поиска:

    - Каждое изменение вызывает `setInputValue`.
    - Компонент перерендеривается с новым значением.

2. При нажатии "Поиск":

    - Форма отправляется.
    - Вызывается `handleSubmit`.
    - Родительский компонент получает текущее значение через `onSubmit`.

3. При нажатии "Очистить":

    - Поле ввода очищается.
    - Родительский компонент получает пустую строку.

4. Во время загрузки:

    - Кнопка "Поиск" становится неактивной.
    - Пользователь не может отправить новый запрос, пока идёт текущий.


## Пример использования

В родительском компоненте форма используется так:

```tsx
// ... остальной код
function App() {
  const [searchTerm, setSearchTerm] = usePersistedSearch('search', '');
  const { data, isError, isLoading } = useGetStoriesQuery(searchTerm);

  const handleSubmit = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <h1>Showcasing innovation every day</h1>
      <SearchForm
        loading={isLoading}
        onSubmit={handleSubmit}
        defaultValue={searchTerm}
      />
      <hr />
      {isError && <p>Что-то пошло не так...</p>}
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <List items={data} onRemoveItem={() => null} />
      )}
    </div>
  );
}
```

## Практические рекомендации

При разработке форм в React стоит обратить внимание на несколько важных моментов:

- Всегда используйте контролируемые компоненты для полей ввода формы.
- Храните состояние формы либо локально в компоненте, либо в глобальном хранилище.
- Для сложных форм рассмотрите использование библиотек типа **Formik** или **React Hook Form**.
- Всегда отменяйте стандартное поведение формы (`e.preventDefault()`).
- Старайтесь разделять логику валидации и отправку данных.
- Добавляйте визуальную обратную связь при загрузке.
- Отключайте кнопку отправки во время обработки запроса.
- Рассмотрите Debouncing для полей с мгновенной валидацией.

## Заключение

Отличная работа! Вы создали компоненты формы отделив логику поиска от компонента `App`, вы сделали код чище и удобнее для поддержки.
Помните - хорошие формы делают интерфейс интуитивным, а приложение стабильным. 