export type Language = "ru" | "en";

const ru = {
  brand: "glazik",
  nav: {
    flowers: "Цветочки",
    f1: "Светофор F1",
    color: "Угадай цвет",
  },
  home: {
    heroLabel: "тренируй восприятие :D",
    heroTitle: "мини-игры для глаза и реакции",
    heroSubtitle: "5 раундов · очки · личный рекорд",
    cards: {
      flowers: {
        title: "Цветочки",
        description: "Угадай количество цветков на экране",
        tag: "счёт",
      },
      f1: {
        title: "Светофор F1",
        description: "Проверь реакцию на красный свет",
        tag: "реакция",
      },
      color: {
        title: "Угадай цвет",
        description: "Воспроизведи показанный цвет",
        tag: "память",
      },
    },
  },
  footer: {
    about: "о сайте",
    privacy: "конфиденц.",
    github: "github",
  },
  actions: {
    soundOn: "Включить звук",
    soundOff: "Выключить звук",
    lightTheme: "Светлая тема",
    darkTheme: "Тёмная тема",
    profile: "Профиль",
    exit: "Выйти",
  },
  game: {
    flowers: {
      title: "Цветочки",
      round: "Раунд",
      of: "из",
      guessCount: "Угадай количество",
      yourGuess: "Твой ответ",
      submit: "Ответить",
      correct: "Правильно!",
      wrong: "Неверно",
      theAnswer: "Ответ",
      total: "Итого",
      next: "Далее",
      finish: "Завершить",
      results: "Результаты",
      playAgain: "Играть снова",
      backToMenu: "В меню",
    },
    f1: {
      title: "Светофор F1",
      wait: "Жди зелёного...",
      go: "Жми!",
      tooEarly: "Ранняя реакция!",
      reaction: "Реакция",
      round: "Раунд",
      next: "Далее",
      finish: "Завершить",
      results: "Результаты",
      playAgain: "Играть снова",
      backToMenu: "В меню",
    },
    color: {
      title: "Угадай цвет",
      memorize: "Запомни цвет",
      yourTurn: "Твой ход",
      match: "Подбери цвет",
      set: "Установить",
      preview: "Предпросмотр",
      correct: "Правильно!",
      close: "Близко",
      far: "Далеко",
      round: "Раунд",
      results: "Результаты",
      playAgain: "Играть снова",
      backToMenu: "В меню",
      next: "Далее",
      finish: "Завершить",
      submit: "Проверить",
    },
  },
  profile: {
    title: "Профиль",
    nickname: "Никнейм",
    setNickname: "Установить никнейм",
    save: "Сохранить",
    bestScores: "Лучшие результаты",
    noBestScore: "Нет результата",
    lastRuns: "Последние 10 игр",
    noRuns: "Нет игр",
  },
};

const en = {
  brand: "glazik",
  nav: {
    flowers: "Flowers",
    f1: "Traffic Light F1",
    color: "Guess Color",
  },
  home: {
    heroLabel: "train your perception :D",
    heroTitle: "mini games for eye and reaction",
    heroSubtitle: "5 rounds · points · personal best",
    cards: {
      flowers: {
        title: "Flowers",
        description: "Guess the number of flowers on screen",
        tag: "counting",
      },
      f1: {
        title: "Traffic Light F1",
        description: "Test your reaction to red light",
        tag: "reaction",
      },
      color: {
        title: "Guess Color",
        description: "Recreate the shown color",
        tag: "memory",
      },
    },
  },
  footer: {
    about: "about",
    privacy: "privacy",
    github: "github",
  },
  actions: {
    soundOn: "Turn sound on",
    soundOff: "Turn sound off",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    profile: "Profile",
    exit: "Exit",
  },
  game: {
    flowers: {
      title: "Flowers",
      round: "Round",
      of: "of",
      guessCount: "Guess the count",
      yourGuess: "Your answer",
      submit: "Submit",
      correct: "Correct!",
      wrong: "Wrong",
      theAnswer: "Answer",
      total: "Total",
      next: "Next",
      finish: "Finish",
      results: "Results",
      playAgain: "Play again",
      backToMenu: "Back to menu",
    },
    f1: {
      title: "Traffic Light F1",
      wait: "Wait for green...",
      go: "Press now!",
      tooEarly: "Too early!",
      reaction: "Reaction",
      round: "Round",
      next: "Next",
      finish: "Finish",
      results: "Results",
      playAgain: "Play again",
      backToMenu: "Back to menu",
    },
    color: {
      title: "Guess Color",
      memorize: "Memorize the color",
      yourTurn: "Your turn",
      match: "Match the color",
      set: "Set",
      preview: "Preview",
      correct: "Correct!",
      close: "Close",
      far: "Far",
      round: "Round",
      results: "Results",
      playAgain: "Play again",
      backToMenu: "Back to menu",
      next: "Next",
      finish: "Finish",
      submit: "Check",
    },
  },
  profile: {
    title: "Profile",
    nickname: "Nickname",
    setNickname: "Set nickname",
    save: "Save",
    bestScores: "Best scores",
    noBestScore: "No score yet",
    lastRuns: "Last 10 games",
    noRuns: "No games yet",
  },
};

export const translations = { ru, en };
export type Translations = typeof ru;

const russianTimezones = [
  "Europe/Moscow",
  "Europe/Kaliningrad",
  "Europe/Samara",
  "Europe/Volgograd",
  "Europe/Astrakhan",
  "Europe/Saratov",
  "Europe/Volgograd",
  "Europe/Krasnodar",
  "Europe/Sochi",
  "Europe/St Petersburg",
  "Europe/Minsk",
  "Europe/Kiev",
  "Europe/Simferopol",
  "Asia/Yekaterinburg",
  "Asia/Omsk",
  "Asia/Novosibirsk",
  "Asia/Krasnoyarsk",
  "Asia/Irkutsk",
  "Asia/Yakutsk",
  "Asia/Vladivostok",
  "Asia/Sakhalin",
  "Asia/Magadan",
  "Asia/Kamchatka",
];

export function detectLanguage(): Language {
  if (typeof window === "undefined") return "ru";
  
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (russianTimezones.some(tz => timezone.includes(tz.split("/")[1]))) {
      return "ru";
    }
  } catch {}
  
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  
  return "en";
}

export function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? path;
}