---
sidebar_position: 2
---

# Ваш первый компонент React

## src/App.tsx

Наш первый компонент React находится в файле `src/App.tsx`, который должен выглядеть примерно так, как в приведённом ниже примере.
Этот файл может немного отличаться, поскольку **Vite** иногда обновляет структуру компонента по умолчанию.


```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

Этот React-компонент, называемый компонентом `App`, представляет собой просто функцию на TypeScript.
Его обычно называют **функциональным компонентом**, потому что существуют и другие вариации React-компонентов.

Компонент `App` пока не принимает никаких параметров (пропосов - пропсы от анг. props) в своей сигнатуре функции, пропсы компонентов будут рассмотрены позже. 

Компонент `App` возвращает код, который похож на **HTML**, и этот код называется **JSX** (JSX-разметка).

## App и Hello React

Давайте изменим немного компонент `App`, удалим все лишнее и оставим только текст "_Hello React_":

```tsx
function App() {
  return (
    <div>
        <h1>Hello React</h1>
    </div>
  )
}

export default App
```

Теперь если запустить приложение через команду

```shell
npm run dev
```
и перейти по адресу

```shell
http://localhost:5173/
```

То на странице вы должны увидеть текст "_Hello React_"

## Заключение

Функциональные компоненты — это основной способ создания компонентов в React, которые пришли на смену классовым компонентам, особенно с появлением **React Hooks** в версии **React 16.8**.

Вот основные особенности функциональных компонентов в React:

1. Функциональный компонент — это просто функция, которая может принимать пропсы (props) и возвращает JSX-разметку.
    ```tsx
    function Greeting(props: { name: string }) {
        return <h1>Привет, {props.name}!</h1>;
    }
    ```
    Или с синтаксисом стрелочной функции:
    ```tsx
    const Greeting: React.FC<{ name: string }> = ({ name }) => <h1>Привет, {name}!</h1>;
    ```
2. Функциональный компонент всегда должен именоваться в нотации **PascalCase**, стандарт для компонентов: первая буква каждого слова — заглавная. 

    Примеры: **UserProfile**, **LoginForm**, **NavBar**, **TodoItem**.
   
    🧠 Компоненты, начинающиеся с маленькой буквы (`todoItem`), не будут интерпретироваться как JSX-компоненты — React будет думать, что это обычные HTML-теги.
3. Название файла - совпадает с названием компонента (в PascalCase или kebab-case).

   Компонент `UserCard` — файл `UserCard.tsx` или `user-card.tsx`.
4. Расширение файла должно быть `.tsx` для всех для компонентов, содержащих **JSX** (`.jsx` если используется JavaScript).
   Расширение `.ts` используется если файл содержит только логику без **JSX** (например, утилиты или хуки).

   ⚠️ **JSX** не работает в `.ts` — обязательно использовать `.tsx`.

Разработчики часто организуют свои React-проекты таким образом, чтобы каждый компонент был в отдельной директории.
Это помогает поддерживать структуру и облегчает навигацию по коду:

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── UserCard/
│       ├── UserCard.tsx            # Компонент с JSX-разметкой
│       ├── UserCard.module.css     # Стили (если CSS-модули)
│       └── index.ts                # Реэкспорт (Public API)
└──...         
```