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
]

export const wszystkieSlowka: Slowko[] = lekcje.flatMap((l) => l.slowka)
