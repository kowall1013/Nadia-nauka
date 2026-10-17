# Angielski Nadii

Gry do nauki angielskich słówek dla dziecka: **Memory**, **Quiz**
(posłuchaj / przeczytaj) i **Balony**. Lektor przez Web Speech API, postęp
zapisywany w przeglądarce, działa offline jako PWA.

Strona: https://kowall1013.github.io/Nadia-nauka/

## Nowa lekcja

Dopisz lekcję na końcu `src/data/lekcje.ts`:

```ts
{
  id: 'owoce',
  nazwa: 'Owoce',
  emoji: '🍎',
  slowka: [
    { pl: 'jabłko', en: 'apple', emoji: '🍎' },
    // emoji można pominąć — wtedy karta pokazuje polski napis
  ],
},
```

Potem `npm test && npm run build` i push na `main` — GitHub Actions
opublikuje nową wersję na Pages.

## Rozwój

```sh
npm install
npm run dev     # http://localhost:5173/Nadia-nauka/
npm test
```

Panel rodzica: przytrzymaj tytuł na ekranie głównym przez 1,5 s.
