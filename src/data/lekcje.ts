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

// Nowe lekcje dopisuj na końcu listy.
export const lekcje: Lekcja[] = [
  {
    id: 'kolory',
    nazwa: 'Kolory',
    emoji: '🎨',
    slowka: [
      { pl: 'czerwony', en: 'red', emoji: '🔴' },
      { pl: 'niebieski', en: 'blue', emoji: '🔵' },
      { pl: 'zielony', en: 'green', emoji: '🟢' },
      { pl: 'żółty', en: 'yellow', emoji: '🟡' },
      { pl: 'pomarańczowy', en: 'orange', emoji: '🟠' },
      { pl: 'fioletowy', en: 'purple', emoji: '🟣' },
      { pl: 'czarny', en: 'black', emoji: '⚫' },
      { pl: 'biały', en: 'white', emoji: '⚪' },
      { pl: 'brązowy', en: 'brown', emoji: '🟤' },
      { pl: 'różowy', en: 'pink', emoji: '🩷' },
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
    id: 'szkola',
    nazwa: 'Szkoła',
    emoji: '🎒',
    slowka: [
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
    ],
  },
  {
    id: 'przeciwienstwa',
    nazwa: 'Przeciwieństwa',
    emoji: '↔️',
    slowka: [
      { pl: 'duży', en: 'big', emoji: '🐘' },
      { pl: 'mały', en: 'small', emoji: '🐜' },
      { pl: 'długi', en: 'long', emoji: '🐍' },
      { pl: 'krótki', en: 'short' },
    ],
  },
]

export const wszystkieSlowka: Slowko[] = lekcje.flatMap((l) => l.slowka)
