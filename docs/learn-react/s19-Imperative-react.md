---
sidebar_position: 19
---

# Императивное программирование в React: когда и как использовать

React в первую очередь продвигает декларативную парадигму программирования, где вы описываете, как должен выглядеть пользовательский интерфейс, основываясь на состоянии приложения, а React отвечает за обновление DOM. Это контрастирует с императивным программированием, которое включает в себя явное пошаговое инструктирование компьютера о том, как достичь результата, часто с помощью прямых манипуляций с DOM.

## Декларативный vs императивный подход

В то время как React делает упор на декларативность, существуют конкретные сценарии, в которых императивный React становится необходимостью и лучшим решением:

- Прямое управление DOM через DOM API (фокусировка ввода, управление позициями прокрутки или запуск анимации).
- Интеграция сторонних библиотек (например, D3.js для построения графиков).

## Декларативный подход: `autoFocus`

Простейший декларативный способ установки фокуса — атрибут `autoFocus`:

```tsx
export const InputField = ({ id, label, value, onChange }: InputFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input id={id} type="text" value={value} onChange={handleChange} autoFocus />
    </>
  );
};
```

Проблема: если компонент используется несколько раз, фокус получит только последний отрисованный инпут.
В качестве решения можно предложить добавить новый пропс `isFocused` для контроля фокуса через родительский компонент или использовать дополнительно хук `useRef` в связке с `useEffect`.

Здесь стоит упомянуть, что значение Props по умолчанию равно `true`

>Если вы не передаете значение пропса, то оно по умолчанию равно `true`.

То есть, эти два выражения JSX эквивалентны:

```jsx
<input autoFocus />

<input autoFocus ={true} />
```

> Не рекомендуется пропускать значение для свойства (prop), если оно предполагает логическое значение.

Конкретно, речь идёт о том, что если вы не передаёте значение для пропа, то его значение по умолчанию считается `true`, что похоже на поведение HTML-атрибутов (например,` <input disabled>` — атрибут `disabled` считается `true`). 
Однако, в JavaScript и ES6 существует сокращённая запись объектов `{foo}` вместо `{foo: foo}`, что может вызвать путаницу.


## Императивный подход: `useRef` + `useEffect`

`useRef` — это хук в React, который позволяет создавать ссылку на DOM-элемент или сохранять произвольный mutable-объект, который сохраняется между рендерами компонента.
Объект `ref` имеет свойство `.current`, которое хранит значение, которое вы присваиваете.
В отличие от `useState`, изменение данных в `ref.current` не вызывает повторного ререндера компонента.

Давайте посмотрим пример использования `useRef` для установки фокуса:

```tsx
import React, { useEffect, useRef } from 'react';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  isFocused?: boolean;
  onChange: (value: string) => void;
};

export const InputField = ({
  id,
  label,
  value,
  isFocused,
  onChange,
}: InputFieldProps) => {
  // (1) Создаём ref
  const inputRef = useRef<HTMLInputElement>(null!);

  // (3) Эффект для управления фокусом
  useEffect(() => {
    if (isFocused && inputRef?.current) {
      // (4) Императивный вызов focus()
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input
        ref={inputRef} // (2) Привязываем ref к элементу
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
      />
    </>
  );
};
```

**Пошаговое объяснение:**

1. Создание ref:

    `useRef` создаёт мутабельный объект, сохраняющийся между рендерами. Свойство `current` может хранить DOM-элемент.

2. Привязка ref:

    Передаём ref в JSX через атрибут `ref`. React автоматически присвоит DOM-элемент в `inputRef.current`.

3. Эффект для фокуса:
    
    Хук `useEffect` срабатывает при монтировании и изменении `isFocused`.

4. Императивное действие:
    
    Если `isFocused` `true` и элемент существует, вызываем `focus()` на DOM-элементе.


**Совет**: Всегда сначала пробуйте решить задачу декларативно, и только если это действительно невозможно — переходите к императивному подходу. 


## Хук useImperativeHandle

Когда дочернему компоненту необходимо предоставить определенные методы или функциональные возможности своему родительскому компоненту, которыми невозможно эффективно управлять с помощью props, можно использовать useImperativeHandle в сочетании с forwardRef. Это позволяет родительскому элементу вызывать определенные методы в экземпляре дочернего компонента.

Ниже приведен пример с использованием `useImperativeHandle`:

```tsx
// types.ts
import React from 'react'

type MyInputHandlers = React.RefObject<{
   focus: () => void;
   scrollIntoView: () => void;
}>;


// MyInput.tsx
import { useRef, useImperativeHandle } from 'react';

type MyInputProps = {
   placeholder?: string;
   ref?: MyInputHandlers;
}

const MyInput = ({ placeholder, ref }: MyInputProps) => {
   const inputRef = useRef<HTMLInputElement>(null);

   useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      scrollIntoView: () => inputRef.current?.scrollIntoView()
   }), []);

   return <input ref={inputRef} placeholder={placeholder} />;
}

// Form.tsx
import { useRef } from 'react';
import MyInput from './MyInput';

const Form = () => {
   const ref = useRef<MyInputHandlers>(null);

   const handleClick = () => {
     ref.current?.focus();
     // ref.current?.scrollIntoView();
     // Следующее не сработает, так как DOM-узел не экспортируется:
     // ref.current.style.opacity = 0.5;
   }

   return (
     <form>
       <MyInput placeholder="Enter your name" ref={ref} />
       <button type="button" onClick={handleClick}>
         Edit
       </button>
     </form>
   );
}
```

Как это работает?

- Родительский компонент создаёт `ref` и передаёт его дочернему.
- Дочерний компонент ловит этот `ref` и настраивает его через `useImperativeHandle`. Внутри него указывается, какие методы или значения будут доступны снаружи.
- Родитель использует `ref`, но видит только то, что разрешил дочерний компонент. Если попытаться вызвать что-то, что не было указано в `useImperativeHandle`, React выдаст ошибку.

## Заключение

Императивные подходы доступны и полезны для конкретных случаев использования, требующих детального контроля над DOM или раскрытия функциональных возможностей компонентов.
Однако, как правило, рекомендуется по возможности отдавать предпочтение декларативным решениям для улучшения читаемости кода, удобства сопровождения и приведения его в соответствие с основными принципами React.