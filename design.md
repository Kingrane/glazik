# design.md — glazik

## Philosophy

Premium Sans + Material You. Гладко, аккуратно, приятно.
Всё дышит пространством. Никаких резких теней, никакого мусора.
Карточки чуть приподняты. Цвета живые, но не кричат.
Радиусы большие — как у материальных компонентов Google.

---

## Typography

### Шрифты (Google Fonts)

| Роль | Шрифт | Использование |
|------|-------|---------------|
| Display / Hero | **Dela Gothic One** | Крупные заголовки режимов, счёт |
| Heading | **Geologica** | H1–H3, навигация, карточки |
| Body | **Golos Text** | Весь основной текст, описания |
| Accent / Label | **Climate Crisis** | Только для особых моментов (рекорды, финальный счёт) |
| Mono | `monospace` system | Таймеры, числовые показатели |

```css
@import url('https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Dela+Gothic+One&family=Geologica:wght@300;400;500;600&family=Golos+Text:wght@400;500;600&display=swap');
```

### Шкала размеров

```css
--text-xs:   12px;   /* мета, теги */
--text-sm:   14px;   /* вспомогательный текст, лейблы */
--text-base: 16px;   /* основной текст */
--text-lg:   18px;   /* подзаголовки карточек */
--text-xl:   24px;   /* h3, заголовки секций */
--text-2xl:  32px;   /* h2, режим-заголовок */
--text-3xl:  48px;   /* h1, hero */
--text-display: 72px; /* счёт, dela gothic one */
```

### Веса

- Geologica: 300 (тонкие описания), 500 (заголовки), 600 (активные элементы)
- Golos Text: 400 (body), 500 (акценты), 600 (кнопки)
- Dela Gothic One: всегда 400 (у шрифта один вес)

---

## Colors

### Light mode (default)

```css
/* Фон */
--bg-base:       #F6F4F0;   /* тёплый офф-вайт, страница */
--bg-surface:    #FFFFFF;   /* карточки, панели */
--bg-elevated:   #FFFFFF;   /* попапы, модалки */
--bg-overlay:    rgba(0,0,0,0.04); /* hover-состояния */

/* Контент */
--text-primary:  #1A1916;   /* основной текст */
--text-secondary:#5A5750;   /* мета, описания */
--text-tertiary: #9A9590;   /* плейсхолдеры, хинты */
--text-inverse:  #FFFFFF;   /* текст на тёмных поверхностях */

/* Бордеры */
--border-subtle: rgba(0,0,0,0.07);   /* карточки по умолчанию */
--border-medium: rgba(0,0,0,0.14);   /* hover, focus */
--border-strong: rgba(0,0,0,0.25);   /* активные элементы */

/* Акцентные (режимы) */
--accent-flowers: #2D9B6B;   /* цветочки — зелёный */
--accent-flowers-bg: #E8F7F0;
--accent-f1:      #E05A2B;   /* светофор — оранжево-красный */
--accent-f1-bg:   #FDEEE7;
--accent-color:   #5B4FD4;   /* цвет — фиолетовый */
--accent-color-bg:#EDEAFC;

/* Системные */
--success: #22A06B;
--warning: #D97706;
--danger:  #DC2626;
--info:    #3B82F6;
```

### Dark mode

```css
@media (prefers-color-scheme: dark) {
  --bg-base:        #141210;
  --bg-surface:     #1F1D1A;
  --bg-elevated:    #2A2723;
  --bg-overlay:     rgba(255,255,255,0.05);

  --text-primary:   #F0EDE8;
  --text-secondary: #A09B94;
  --text-tertiary:  #6A6560;

  --border-subtle:  rgba(255,255,255,0.07);
  --border-medium:  rgba(255,255,255,0.13);
  --border-strong:  rgba(255,255,255,0.22);

  --accent-flowers-bg: #0D2E1F;
  --accent-f1-bg:      #2E1408;
  --accent-color-bg:   #1A1640;
}
```

---

## Spacing

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## Borders & Radius

Material You — большие скруглённые углы.

```css
--radius-sm:   8px;    /* мелкие элементы: теги, бейджи */
--radius-md:   12px;   /* кнопки, инпуты */
--radius-lg:   16px;   /* карточки */
--radius-xl:   24px;   /* большие карточки, режимы */
--radius-full: 999px;  /* пилюли, аватары */
```

---

## Elevation & Shadow

Никаких жёстких дроп-шэдоу. Только мягкое свечение.

```css
--shadow-card:
  0 1px 2px rgba(0,0,0,0.04),
  0 4px 12px rgba(0,0,0,0.06);

--shadow-elevated:
  0 2px 4px rgba(0,0,0,0.04),
  0 8px 24px rgba(0,0,0,0.10);

--shadow-floating:
  0 4px 8px rgba(0,0,0,0.06),
  0 16px 40px rgba(0,0,0,0.14);

/* hover-эффект для карточек */
--shadow-card-hover:
  0 2px 8px rgba(0,0,0,0.06),
  0 12px 28px rgba(0,0,0,0.10);
```

---

## Components

### Top bar

```
height: 56px
padding: 0 24px
background: var(--bg-surface)
border-bottom: 1px solid var(--border-subtle)
backdrop-filter: blur(12px) — при скролле
```

- Слева: `glazik` — Geologica 600, 17px
- Центр: навигационные ссылки — Golos Text 500, 14px, gap 4px
- Справа: иконки 32×32px, radius-sm, border subtle

Активный nav-линк: подчёркивание 2px снизу, цвет `--text-primary`

### Cards (landing, 3 штуки)

```
background: var(--bg-surface)
border: 1px solid var(--border-subtle)
border-radius: var(--radius-xl)
padding: 24px
box-shadow: var(--shadow-card)
transition: box-shadow 200ms ease, transform 200ms ease
```

**Hover:**
```
box-shadow: var(--shadow-card-hover)
transform: translateY(-2px)
border-color: var(--border-medium)
```

Структура карточки:
1. Иконка-блок 44×44px, radius-lg, цветной bg из `--accent-*-bg`
2. Название — Geologica 600, 17px, margin-top 14px
3. Описание — Golos Text 400, 14px, color text-secondary
4. Тег-пилюля — Golos Text 500, 12px, radius-full, padding 3px 10px

### Buttons

**Primary:**
```
background: var(--text-primary)
color: var(--text-inverse)
border-radius: var(--radius-md)
padding: 10px 20px
font: Golos Text 600, 15px
border: none
transition: opacity 150ms ease, transform 150ms ease
hover: opacity 0.88
active: transform scale(0.98)
```

**Secondary / Outline:**
```
background: transparent
border: 1px solid var(--border-medium)
color: var(--text-primary)
hover: background var(--bg-overlay), border-color var(--border-strong)
```

**Accent (per mode):**
```
background: var(--accent-*)
color: #fff
hover: brightness(1.08)
```

### Sliders (для режима цвет)

```css
input[type=range] {
  appearance: none;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--border-medium);
  outline: none;
}
input[type=range]::-webkit-slider-thumb {
  appearance: none;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--text-primary);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 150ms ease;
}
input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
```

### Game cards (режим игры, полноэкранный)

```
background: var(--bg-surface)
border-radius: var(--radius-xl)
padding: 40px
max-width: 560px
margin: 0 auto
box-shadow: var(--shadow-elevated)
```

Заголовок режима — Dela Gothic One, 48px, color var(--accent-*)

### Score display

```
font-family: 'Dela Gothic One', display
font-size: 72px
color: var(--text-primary)
```

Для рекорда — Climate Crisis, с анимацией появления (scale 0.8 → 1.0, opacity 0→1, 400ms ease-out)

### Badges / теги

```
font: Golos Text 500, 12px
padding: 3px 10px
border-radius: var(--radius-full)
background: var(--accent-*-bg)
color: var(--accent-*)
```

---

## Motion

```css
--duration-fast:   120ms;
--duration-base:   200ms;
--duration-slow:   350ms;
--duration-slower: 500ms;

--ease-out:   cubic-bezier(0.0, 0.0, 0.2, 1);  /* Material You decelerate */
--ease-in:    cubic-bezier(0.4, 0.0, 1.0, 1);
--ease-inout: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* лёгкий пружинный эффект */
```

Типичные переходы:
- hover карточки: `200ms var(--ease-out)`
- появление модального окна: `350ms var(--ease-out)` + scale 0.95→1
- смена раундов: fade 250ms
- таймер убывает: linear

Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Layout

```css
/* Страница */
--page-max-width: 1100px;
--page-padding: 24px;        /* mobile */
--page-padding-md: 40px;     /* tablet+ */

/* Сетка карточек */
grid-template-columns: repeat(3, 1fr);  /* desktop */
grid-template-columns: 1fr;              /* mobile < 640px */
grid-template-columns: repeat(2, 1fr);  /* tablet 640–960px */
gap: 16px;
```

---

## Icons

Библиотека: **Lucide** (outline, 1.5px stroke)
Размер навигация: 16px
Размер карточки-иконка: 22px
Размер кнопок topbar: 18px

Примеры по режимам:
- Цветочки: `Flower` / `Sparkles`
- Светофор F1: `TrafficCone` / `Zap`
- Цвет: `Palette` / `Pipette`

---

## Game-specific UI

### F1 Lights

5 кружков в ряд, 40px диаметр каждый.
- OFF: `background: #2A2723; border: 2px solid rgba(255,255,255,0.08)`
- ON: `background: #CC0000; box-shadow: 0 0 12px rgba(204,0,0,0.6)`
- Переход ON→OFF: 80ms ease-in (быстро, как настоящий светофор)

### Flowers display

Флауэры на canvas или SVG. Случайный seed, плотность = кол-во.
Цвет фонов — neutral `--bg-base`. Сами цветки — `--accent-flowers` и оттенки.

### Color recall

Большой квадрат цвета: 240×240px, radius-xl, border subtle.
Ползунки подписаны: R, G, B + H, S, B — Golos Text 13px, text-secondary.
Цвет-превью справа от ползунков обновляется в реальном времени.

---

## Responsive breakpoints

```css
/* Mobile first */
--bp-sm: 480px;
--bp-md: 640px;
--bp-lg: 960px;
--bp-xl: 1200px;
```

---

## CSS custom properties — итоговый список

Подключи в `:root` и `[data-theme="dark"]`.
Все компоненты работают только через эти переменные — никаких хардкод-цветов.

```css
:root {
  /* backgrounds */
  --bg-base: #F6F4F0;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-overlay: rgba(0,0,0,0.04);

  /* text */
  --text-primary: #1A1916;
  --text-secondary: #5A5750;
  --text-tertiary: #9A9590;
  --text-inverse: #FFFFFF;

  /* borders */
  --border-subtle: rgba(0,0,0,0.07);
  --border-medium: rgba(0,0,0,0.14);
  --border-strong: rgba(0,0,0,0.25);

  /* accents */
  --accent-flowers: #2D9B6B;
  --accent-flowers-bg: #E8F7F0;
  --accent-f1: #E05A2B;
  --accent-f1-bg: #FDEEE7;
  --accent-color: #5B4FD4;
  --accent-color-bg: #EDEAFC;

  /* tokens */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 999px;

  --shadow-card: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-elevated: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.10);

  --duration-base: 200ms;
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark"] {
  --bg-base: #141210;
  --bg-surface: #1F1D1A;
  --bg-elevated: #2A2723;
  --bg-overlay: rgba(255,255,255,0.05);
  --text-primary: #F0EDE8;
  --text-secondary: #A09B94;
  --text-tertiary: #6A6560;
  --border-subtle: rgba(255,255,255,0.07);
  --border-medium: rgba(255,255,255,0.13);
  --border-strong: rgba(255,255,255,0.22);
  --accent-flowers-bg: #0D2E1F;
  --accent-f1-bg: #2E1408;
  --accent-color-bg: #1A1640;
  --shadow-card: 0 1px 2px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.20);
  --shadow-elevated: 0 2px 4px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.30);
}
```