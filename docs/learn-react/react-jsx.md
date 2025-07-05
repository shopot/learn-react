---
sidebar_position: 3
---

# React JSX

JSX представляет способ описания визуального кода посредством комбинации кода на JavaScript и XML-подобного синтаксиса разметки, во время компиляции JSX транслируется в обычный JavaScript.

> JSX - это XML-подобное синтаксическое расширение ECMAScript без какой-либо определенной семантики. Он НЕ предназначен для реализации в движках или браузерах. Он предназначен для использования различными препроцессорами (транспиляторами) для преобразования этих токенов в стандартный ECMAScript.

Главное отличие от HTML синтаксиса - это наличие закрывающегося (или самозакрывающегося) тега для всех элементов.

```tsx
<img src="..." alt="..." />
```

Пример разметки JSX:

```tsx
<header>
  <h1 className="title">Hello, React!</h1>
</header>
```

этот код JSX, после компиляции превратится в вызов React.createElement():

```tsx
React.createElement(
  'header',
  null,
  React.createElement('h1', {className: 'title'}, 'Hello, React!')
);
```

После компиляции каждое JSX-выражение становится обычным вызовом JavaScript-функции, результат которого - объект JavaScript.

## Встраивание выражений в JSX

В JSX для вставки выражений используется фигурные скобки `{}`. Это позволяет вставлять любые JavaScript-выражения внутри JSX-разметки.

В следующем примере внутри тела функционального компонента определяется переменная `title`,
которая затем вставляется как результат в JSX-разметку:


```tsx
// src/App.tsx
function App() {
    const title = 'React';
    
    return (
        <div>
            <h1>Hello {title}</h1>
        </div>
    );
}

export default App;
```

Запустите приложение с помощью `npm run dev` и посмотрите на отрендеренную переменную в браузере, которая
должна выглядеть так: "_Hello React_".

## JSX — это выражение тоже

После компиляции выражения JSX становятся обычными вызовами функций JavaScript и вычисляются в объекты JavaScript.

Это означает, что вы можете использовать JSX внутри операторов `if` и `for`, присваивать его переменным, принимать его в качестве аргументов и возвращать из функций:

```tsx
function getGreeting(user) {
    if (user) {
        return <h1>Привет, {formatName(user)}!</h1>;
    }
    
    return <h1>Привет, незнакомец.</h1>;
}
```

## Установка атрибутов с помощью JSX

Вы можете использовать кавычки для указания строковых литералов в качестве атрибутов:

```tsx
const greeting = <div tabIndex="0">Hello React</div>;
````

Вы также можете использовать фигурные скобки для вставки JavaScript-выражения в атрибут:

```tsx
const element = <img src={user.avatarUrl} alt="avatar" />;
```

** Внимание: **

Поскольку JSX ближе к JavaScript, чем к HTML, React DOM использует соглашение об именах свойств camelCase вместо имён атрибутов HTML.

Например, `class` ключевое слово — зарезервированное слово в JavaScript, которое становится `className` в JSX,
атрибут `for` становится `htmlFor`, а `tabindex` становится `tabIndex`.

Ниже представлен список некоторых атрибутов DOM, поддерживаемых React:

```text
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

## Один элемент верхнего уровня 

HTML-код должен быть заключен в ОДИН элемент верхнего уровня.

Так что если вы хотите написать два абзаца, вы должны поместить их в один родительский элемент, как `div` элемент:

```tsx
return (
  <div>
    <p>I am a paragraph.</p>
    <p>I am a paragraph too.</p>
  </div>
);
```

⚠️ **JSX** выдаст ошибку, если HTML неверен или если в HTML отсутствует родительский элемент.

Позже вы познакомитесь с `React.Fragment`, который позволяет объединять несколько блоков без дополнительного тега `div`.

## Элементы должны быть закрыты 

JSX следует правилам XML, поэтому все элементы HTML должны быть правильно закрыты.

Закрывайте пустые элементы с помощью `/>`:

```tsx
return (
    <div>
        <input type="text" />
    </div>
);
```

## JSX предотвращает атаки-инъекции

По умолчанию DOM React экранирует любые значения, встроенные в JSX, перед их рендерингом. Таким образом, гарантируется, что вы никогда не сможете внедрить то, чего явно нет в вашем приложении. Перед рендеренгом все преобразуется в строку. Это помогает предотвратить атаки межсайтовый скриптинг (cross-site-scripting, XSS).

## Заключение

**Основные возможности JSX включают:**

- Синтаксические возможности:
  - HTML-подобный синтаксис для создания UI элементов.
  - Вложенность компонентов и элементов.
  - Использование JavaScript выражений в фигурных скобках `{}`.
  - Шаблонизация с помощью условных операторов и циклов.
- Работа с атрибутами:
  - Использование `className` вместо `class`.
  - `camelCase` для атрибутов (`onClick` вместо `onclick`).
  - Поддержка инлайн стилей через `style` атрибут.
  - Автоматическое преобразование атрибутов в соответствующие DOM-свойства.
- Интерактивность:
  - Обработка событий через специальные атрибуты.
  - Использование колбэк-функций в обработчиках событий.
  - Возможность динамического обновления контента.
- Безопасность и производительность:
  - Автоматическая экранировка HTML-символов.
  - Оптимизация рендеринга через виртуальный DOM.
  - Компиляция в эффективный JavaScript код.

**При работе с JSX-разметкой важно помнить следующие правила:**

- Всегда закрывать теги или использовать самозакрывающиеся теги (`<br />`, `<img />`).
- Использовать `className` вместо `class` для CSS классов.
- Оборачивать несколько элементов в общий контейнер или использовать фрагменты.
- Помещать JavaScript выражения в фигурные скобки `{}`.
- Следить за правильным регистром в именах компонентов и атрибутов.
