export type Slowko = {
  pl: string
  en: string
  /** Obrazek do słówka. Puste, gdy żadne emoji nie pasuje — wtedy karta z samym napisem. */
  emoji?: string
}

export type Lekcja = {
  id: string
  nazwa: string
  emoji: string
  slowka: Slowko[]
}

/** Lekcja z kartki ze szkoły — zawsze wszystkie słówka z kartki, w kolejności z kartki. */
export type Kartka = Lekcja & {
  nr: number
  /** Lekcje dodatkowe: nowe słówka w podobnej tematyce, bez powtórek z kartki. */
  rozszerzenia: Lekcja[]
}

// Nowe kartki dopisuj na końcu listy z kolejnym numerem.
export const kartki: Kartka[] = [
  {
    nr: 1,
    id: 'lekcja-1',
    nazwa: 'Kolory i szkoła',
    emoji: '🎒',
    slowka: [
      { pl: 'długi', en: 'long', emoji: '🐍' },
      { pl: 'krótki', en: 'short' },
      { pl: 'niebieski', en: 'blue', emoji: '🔵' },
      { pl: 'czerwony', en: 'red', emoji: '🔴' },
      { pl: 'żółty', en: 'yellow', emoji: '🟡' },
      { pl: 'zielony', en: 'green', emoji: '🟢' },
      { pl: 'pomarańczowy', en: 'orange', emoji: '🟠' },
      { pl: 'czarny', en: 'black', emoji: '⚫' },
      { pl: 'fioletowy', en: 'purple', emoji: '🟣' },
      { pl: 'różowy', en: 'pink', emoji: '🩷' },
      { pl: 'brązowy', en: 'brown', emoji: '🟤' },
      { pl: 'biały', en: 'white', emoji: '⚪' },
      { pl: 'klasa', en: 'classroom', emoji: '🏫' },
      { pl: 'nauczyciel', en: 'teacher', emoji: '🧑‍🏫' },
      { pl: 'uczeń', en: 'pupil', emoji: '🧒' },
      { pl: 'ławka', en: 'desk' },
      { pl: 'książka', en: 'book', emoji: '📕' },
      { pl: 'plecak', en: 'backpack', emoji: '🎒' },
      { pl: 'pióro', en: 'pen', emoji: '🖊️' },
      { pl: 'piórnik', en: 'pencil case' },
      { pl: 'krzesło', en: 'chair', emoji: '🪑' },
      { pl: 'ołówek', en: 'pencil', emoji: '✏️' },
      { pl: 'gumka', en: 'rubber' },
      { pl: 'linijka', en: 'ruler', emoji: '📏' },
      { pl: 'tablica', en: 'board' },
      { pl: 'duży', en: 'big', emoji: '🐘' },
      { pl: 'mały', en: 'small', emoji: '🐜' },
    ],
    rozszerzenia: [
      {
        id: 'kolory-plus',
        nazwa: 'Więcej kolorów',
        emoji: '🌈',
        slowka: [
          { pl: 'szary', en: 'grey', emoji: '🩶' },
          { pl: 'złoty', en: 'gold', emoji: '🥇' },
          { pl: 'srebrny', en: 'silver', emoji: '🥈' },
          { pl: 'tęcza', en: 'rainbow', emoji: '🌈' },
          { pl: 'farba', en: 'paint', emoji: '🎨' },
        ],
      },
      {
        id: 'szkola-plus',
        nazwa: 'Więcej o szkole',
        emoji: '✂️',
        slowka: [
          { pl: 'nożyczki', en: 'scissors', emoji: '✂️' },
          { pl: 'klej', en: 'glue', emoji: '🧴' },
          { pl: 'kredka', en: 'crayon', emoji: '🖍️' },
          { pl: 'zeszyt', en: 'notebook', emoji: '📓' },
          { pl: 'temperówka', en: 'sharpener' },
          { pl: 'papier', en: 'paper', emoji: '📄' },
          { pl: 'zegar', en: 'clock', emoji: '🕐' },
          { pl: 'komputer', en: 'computer', emoji: '💻' },
        ],
      },
      {
        id: 'przeciwienstwa',
        nazwa: 'Przeciwieństwa',
        emoji: '↔️',
        slowka: [
          { pl: 'wysoki', en: 'tall', emoji: '🦒' },
          { pl: 'gorący', en: 'hot', emoji: '🔥' },
          { pl: 'zimny', en: 'cold', emoji: '🧊' },
          { pl: 'szybki', en: 'fast', emoji: '🐆' },
          { pl: 'wolny', en: 'slow', emoji: '🐢' },
          { pl: 'wesoły', en: 'happy', emoji: '😀' },
          { pl: 'smutny', en: 'sad', emoji: '😢' },
          { pl: 'stary', en: 'old', emoji: '👴' },
          { pl: 'młody', en: 'young', emoji: '👶' },
        ],
      },
      {
        id: 'zwierzeta',
        nazwa: 'Zwierzęta',
        emoji: '🐾',
        slowka: [
          { pl: 'pies', en: 'dog', emoji: '🐶' },
          { pl: 'kot', en: 'cat', emoji: '🐱' },
          { pl: 'ryba', en: 'fish', emoji: '🐟' },
          { pl: 'ptak', en: 'bird', emoji: '🐦' },
          { pl: 'koń', en: 'horse', emoji: '🐴' },
          { pl: 'krowa', en: 'cow', emoji: '🐮' },
          { pl: 'świnia', en: 'pig', emoji: '🐷' },
          { pl: 'mysz', en: 'mouse', emoji: '🐭' },
        ],
      },
      {
        id: 'zawody',
        nazwa: 'Zawody',
        emoji: '🧑‍🚒',
        slowka: [
          { pl: 'lekarz', en: 'doctor', emoji: '🧑‍⚕️' },
          { pl: 'strażak', en: 'firefighter', emoji: '🧑‍🚒' },
          { pl: 'policjant', en: 'police officer', emoji: '👮' },
          { pl: 'kucharz', en: 'cook', emoji: '🧑‍🍳' },
          { pl: 'rolnik', en: 'farmer', emoji: '🧑‍🌾' },
          { pl: 'pilot', en: 'pilot', emoji: '🧑‍✈️' },
          { pl: 'astronauta', en: 'astronaut', emoji: '🧑‍🚀' },
          { pl: 'piosenkarz', en: 'singer', emoji: '🧑‍🎤' },
        ],
      },
    ],
  },
]

/** Wszystkie lekcje: kartki i ich rozszerzenia. */
export const lekcje: Lekcja[] = kartki.flatMap((k) => [k, ...k.rozszerzenia])

export const znajdzLekcje = (id: string): Lekcja | undefined => lekcje.find((l) => l.id === id)

/** Nazwa do wyświetlenia: „Lekcja 1: Kolory i szkoła” dla kartek, sama nazwa dla rozszerzeń. */
export function nazwaLekcji(id: string): string {
  const k = kartki.find((x) => x.id === id)
  if (k) return `Lekcja ${k.nr}: ${k.nazwa}`
  return znajdzLekcje(id)?.nazwa ?? id
}

export const wszystkieSlowka: Slowko[] = lekcje.flatMap((l) => l.slowka)
