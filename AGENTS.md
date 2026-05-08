# AGENTS.md — glazik

## Project
Name: glazik game
Описание: Мини-игры для тренировки восприятия, реакции и памяти
Stack: Next.js (App Router) + React, no Tailwind, global CSS with tokens
Theme: light default (сохраняется при переходе между страницами через ThemeProvider)
Language: Russian UI

## Layout
- Top bar: brand "glazik" left (28px) | nav center (3 links) | icon buttons right
- Main: hero (label + h1 + subtitle) → 3-column card grid
- Footer: text links centered

## Nav links (center)
Цветочки, Светофор F1, Угадай цвет (ссылки на игры, с линией снизу при hover)

## Icon buttons (right)
sound toggle, theme toggle, profile

## Colors (акценты карточек на главной)
- Цветочки: #FDC5F5 (bg), #D81159 (text)
- Светофор F1: #FFD6CC (bg), #FF6B35 (text)
- Угадай цвет: #DFFFD6 (bg), #2EC4B6 (text)

## Game modes — 3 cards on landing
1. Цветочки — random flowers 10–300, guess count, score by error, 5 rounds
2. Светофор F1 — 5 lights, fill one by one, random delay after all on, click on lights-out, score by reaction ms
3. Угадай цвет — show color 5s, user matches RGB sliders, score by distance

## Scoring
- Цветочки: points = max(0, 100 - abs_error_pct * 100)
- Светофор: points = max(0, 1000 - reaction_ms), false start = 0 pts
- Цвет: points = max(0, 100 - color_distance_normalized * 100)
- 5 rounds per mode, total at end

## Profile (local only)
- localStorage: nickname, per-mode best score, last 10 runs
- No backend, no auth

## UI details
- Header: transparent, 64px height, logo 28px
- Nav: линия снизу при hover (через ::after)
- Cards: min-height 240px, border 1.5px
- Buttons icon: scale 1.05 на hover, 0.95 на active
- Border: 0.10/0.18/0.30 (subtle/medium/strong)
- Background: radial gradient с зеленым и фиолетовым (еле заметно)
- Формат времени: X.Xc (например 5.0c)
- Во всех играх: кнопка выхода (стрелка назад) всегда активна, можно выйти в любой момент
- Заголовок игры: "glazik game"

## Game Цветочки
- countdown 3-2-1 перед показом
- игровое поле 420x420 в черном квадрате
- таймер большими цифрами сбоку от поля (формат X.Xc), не двигает поле
- выбор количества: стрелочки +-1 + широкое поле ввода + ползунок
- активная кнопка выхода (стрелка назад) всегда доступна

## Game Светофор F1
- 5 кружков загораются постепенно (один за 400мс)
- после 5-го горят 1.5-3.5 сек (рандом)
- потом гаснут и можно нажимать
- большое игровое поле (80px кружки, 600px контейнер)
- таймер реакции показывается в формате X.XXc
- активная кнопка выхода (стрелка назад) всегда доступна

## Game Угадай цвет
- countdown 3-2-1 перед показом
- большое поле 400x400 показывается 5 сек
- таймер сбоку в формате X.Xc, не двигает поле, цвет черный (#1A1916)
- при выборе: большой превью 200x200
- результат: два блока 180x180
- активная кнопка выхода (стрелка назад) всегда доступна

## Components
ThemeProvider — управление темой на уровне приложения
useProfile — работа с localStorage для профиля
useTheme — доступ к текущей теме

## Fonts (Google Fonts)
- Display: Dela Gothic One
- Heading: Geologica
- Body: Golos Text
- Accent: Climate Crisis

## CSS Variables
Все цвета, отступы, радиусы, тени, анимации определены в app/globals.css через CSS custom properties.