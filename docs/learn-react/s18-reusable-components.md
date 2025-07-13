---
sidebar_position: 18
---

# Создание переиспользуемых компонентов

## Проблема специализированных компонентов

Специализированный применительно к компоненту — это React-компонент, который решает очень узкую задачу и жёстко привязан к конкретному сценарию использования.

Рассмотрим компонент `Search` из предыдущих примеров. Он имеет несколько ограничений:

```tsx
// ...
export const Search = ({ search, onSearch }: SearchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        value={search} // Значение и пропсов
        onChange={handleChange} // Обработчик изменения поля ввода
      />
    </>
  );
};
```
Проблемы текущей реализации:

- Жёстко заданный текст label ("Search: ").
- Фиксированный идентификатор `search` для связки `label/input`.
- Специфичные названия пропсов (`search`, `onSearch`).
- Невозможность использовать для других типов полей ввода.

Эти ограничения делают компонент непригодным для повторного использования в других частях приложения.
Поэтому стоит провести рефакториг нашего компонента с целью превращения его в универсальный компонент.

## Рефакторинг в универсальный компонент

**1. Обобщение названий и параметров.**

Превратим `Search` в универсальный компонент `InputField`:

```tsx
import React from 'react';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const InputField = ({ id, label, value, onChange }: InputFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input id={id} type="text" value={value} onChange={handleChange} />
    </>
  );
};
```

Обновим компонент App:

```tsx
// ...
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
      <InputField
        id="search"
        label="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <hr />
      <List items={filteredStories} />
    </div>
  );
}
```

**2. Добавление поддержки разных типов полей**

Чтобы компонент мог работать не только с текстовыми полями, добавим новый prop `type`:

```tsx
import type { InputHTMLAttributes } from 'react';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  type: InputHTMLAttributes<HTMLInputElement>['type'];
  onChange: (value: string) => void;
};

export const InputField = ({
  id,
  label,
  value,
  type = 'text', // Значение по умолчанию
  onChange,
}: InputFieldProps) => (
  <>
    <label htmlFor={id}>{label} </label>
    <input id="search" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </>
);
```

Теперь наш компонент можно использовать для любых типов полей ввода в разных местах приложения:

```tsx
// Пример поля email
<InputField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={handleEmailChange}
/>
    
// Пример поля phone
<InputField
  id="phone"
  label="Phone"
  type="tel"
  value={phone}
  onChange={handlePhoneChange}
/>
```

Какие преимущества мы получили после создания переиспользуемого компонента:

- Гибкость: можно использовать для любых полей ввода;
- Универсальность: можно использовать в любом месте приложения, а не только для поиска;
- Безопасность: уникальные `id` предотвращают конфликты в DOM;
- Семантичность: понятные, обобщённые названия пропсов;
- Расширяемость: легко добавить новые параметры (`placeholder`, `disabled` и т.д.).

## Когда НЕ нужно делать компонент переиспользуемым?

- Компонент используется только в одном месте и вряд ли понадобится ещё где-то.
- Он слишком сложный и его универсализация усложнит код (например, форма с 20 полями).
- Он тесно связан с бизнес-логикой (например, `PaymentForm`).

## Общие правила для создания переиспользуемых компонентов на примере `input`

- Сначала создайте `Search` для одной формы (одно место использования в приложении), то есть без учета его переиспользуемости.  
- Если похожий `input` нужен в другом месте, то проведите рефакторинг и создайте универсальный компонент.
- Расширяйте компонент добавлением новых пропсов, для иконок, валидации и т.д.
- Соблюдайте принцип единой ответственности (SRP), компонент должен решать одну задачу.
- Не используйте внешние зависимости из контекста его использования, компонент не должен знать о внешней логике (сторах, API-запросах, и тд).
- Компонент должен отвечать только за рендер, а логика управления должна передаваться извне.
- Задавайте параметры по умолчанию для пропсов, отвечающих за настройки поведения/внешнего вида компонента.

Основное и главное правило это следовать «Закону экономии», не создавайте переиспользуемый компонент заранее, если он точно не нужен прямо сейчас.

Почему?

- Избыточность - тратим время на универсальность, которая может не пригодиться.
- Усложнение кода - компонент обрастает ненужными пропсами и логикой «на будущее».
- Ошибки прогноза - часто такие компоненты потом всё равно переделывают под реальные задачи.

## Заключение

Переиспользуемые компоненты позволяют:

- Уменьшить дублирование кода.
- Упростить поддержку и тестирование.
- Создавать более согласованный UI, т.е. поддерживать единый стиль и поведение интерфейса во всём приложении.
- Быстрее разрабатывать новые функции за счет переиспользования кода.

