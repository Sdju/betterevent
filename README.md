# betterevent

> **Внесём в мир React немного Vue здравомыслия.**

Набор инструментов, которые улучшают UX работы с [JugRu](https://beta.jugru.org): виджеты и userscript-расширения, встраиваемые прямо в страницы платформы. JugRu написан на React — мы добавляем поверх него удобные Vue-компоненты, не ломая нативный интерфейс.

## Что внутри

| Часть           | Зачем                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| `userscripts/`  | Минимальный Tampermonkey-лоадер: только `BASE` + подгрузка `widget.css` / `widget.js` |
| `src/widget.ts` | IIFE-бандл: API монтирования и автозапуск на JugRu                                    |
| `src/jugru/`    | Логика внедрения на страницу хоста (обновляется вместе с виджетом)                    |

Каждый виджет живёт отдельно, но делит общую инфраструктуру: userscript грузит бандл → `widget.js` сам находит якорь и монтируется.

## Установка (Tampermonkey)

1. Соберите и запустите preview-сервер (для локальной проверки):

```sh
vp install
vp run build
vp preview
```

2. Установите [Tampermonkey](https://www.tampermonkey.net/), создайте скрипт из [`userscripts/betterevent-loader.user.js`](userscripts/betterevent-loader.user.js).
3. При необходимости поменяйте только `BASE` — всё остальное в бандле.
4. Откройте страницу на `beta.jugru.org`.

Userscript намеренно тонкий (~20 строк): при обновлениях виджета его переписывать не нужно — достаточно пересобрать `widget.js`.

Прод: [sdju.github.io/betterevent](https://sdju.github.io/betterevent/) (деплой через GitHub Actions при push в `main`).

## Как это устроено

```
userscript (BASE + css/js) → widget.js → bootstrap → WidgetApp
```

| Артефакт                            | Назначение             |
| ----------------------------------- | ---------------------- |
| `dist/index.html`                   | Локальная dev-страница |
| `dist/widget.js`, `dist/widget.css` | Бандл для userscript   |

## Разработка

```sh
vp dev          # локальная «чужая» страница
vp run build    # dist/ + widget.js
vp check        # форматирование, линт, типы
```

Стек: Vue 3, TypeScript, Vite+.
