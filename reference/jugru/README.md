# Стилизация под хост JugRu

Виджеты BetterEvent встраиваются в страницы [beta.jugru.org](https://beta.jugru.org). Агентам: **перед правкой UI прочитайте этот файл**.

## На живой странице (production)

Хост уже задаёт CSS-переменные на `:root`. Используйте их — не хардкодьте цвета:

```css
.betterevent-widget {
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
```

Частые имена: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--destructive`, `--border`, `--input`, `--ring`.

Точные значения смотрите в DevTools на открытой странице хоста (`:root` / `.dark`).

## Локальная разработка (`vp dev`)

Dev-страница не загружает CSS хоста. Для приблизительного превью подключите fallbacks:

```ts
import "../reference/jugru/palette.css";
```

Fallbacks могут расходиться с production — перед релизом проверяйте виджет на beta.jugru.org.

## Файлы

| Файл          | Назначение                                                         |
| ------------- | ------------------------------------------------------------------ |
| `palette.css` | Минимальные dev-fallbacks для семантических токенов (light / dark) |
| `README.md`   | Этот документ                                                      |
