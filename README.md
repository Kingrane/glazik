# glazik

> мини-игры для тренировки восприятия, реакции и памяти

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-no_Tailwind-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Что это

**glazik** — небольшой сайт с мини-играми, которые проверяют насколько хорошо ты замечаешь, считаешь и реагируешь. Три режима, 5 раундов в каждом, личный рекорд сохраняется локально.

Вдохновлено [dialed.gg](https://dialed.gg).

---

## Режимы игры

### 🌸 Цветочки
На экране мелькает куча цветочков — угадай сколько их было. Диапазон от 10 до 300. Чем точнее ответ, тем больше очков. 5 раундов.

### 🚦 Светофор F1
Пять огней загораются один за другим. Держи нервы — в случайный момент они гаснут. Кликни как можно быстрее. Фальстарт = 0 очков в раунде.

### 🎨 Угадай цвет
5 секунд смотришь на цвет. Потом пытаешься воссоздать его по RGB-ползункам. Счёт — по расстоянию между цветами.

---

## Стек

- **Next.js** (App Router) + **React**
- Чистый CSS с custom properties — без Tailwind
- Google Fonts: Dela Gothic One, Geologica, Golos Text, Climate Crisis
- Хранилище: только `localStorage`, никакого бэкенда

---

## Запуск

```bash
git clone https://github.com/твой-ник/glazik.git
cd glazik
npm install
npm run dev
```

Откроется на [http://localhost:3000](http://localhost:3000).

---

## Структура

```
src/
└── app/
    ├── layout.tsx          # ThemeProvider, шрифты
    ├── globals.css         # CSS-переменные, токены
    ├── page.tsx            # Лендинг с 3 карточками
    ├── flowers/            # Режим: цветочки
    ├── f1/                 # Режим: светофор F1
    └── color/              # Режим: угадай цвет
```

---

## Профиль

Никакой регистрации. Всё хранится в `localStorage`:
- никнейм
- лучший счёт по каждому режиму
- последние 10 игр

---

## Скоринг

| Режим | Формула |
|---|---|
| Цветочки | `max(0, 100 − abs_error% × 100)` |
| Светофор F1 | `max(0, 1000 − reaction_ms)`, фальстарт = 0 |
| Угадай цвет | `max(0, 100 − color_distance_normalized × 100)` |

---

## Лицензия

MIT