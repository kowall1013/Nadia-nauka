# Angielski Nadii

Gry do nauki angielskich słówek dla dziecka: **Memory**, **Quiz**
(posłuchaj / przeczytaj) i **Balony**. Lektor przez Web Speech API, postęp
zapisywany w przeglądarce, działa offline jako PWA.

Strona: https://kowall1013.github.io/Nadia-nauka/

## Nowa lekcja

Nowa kartka ze szkoły — dopisz ją na końcu `kartki` w `src/data/lekcje.ts`
z kolejnym numerem i **wszystkimi** słówkami z kartki:

```ts
{
  nr: 2,
  id: 'lekcja-2',
  nazwa: 'Owoce',
  emoji: '🍎',
  slowka: [
    { pl: 'jabłko', en: 'apple', emoji: '🍎' },
    // emoji można pominąć — wtedy karta pokazuje polski napis
  ],
  rozszerzenia: [
    // lekcje dodatkowe: { id, nazwa, emoji, slowka } — tylko nowe słówka
  ],
},
```

Słówko angielskie może wystąpić w aplikacji tylko raz (pilnuje tego test).

Potem `npm test && npm run build` i push na `main` — GitHub Actions
opublikuje nową wersję na Pages.

## Rozwój

```sh
npm install
npm run dev     # http://localhost:5173/Nadia-nauka/
npm test
```

Panel rodzica: przytrzymaj tytuł na ekranie głównym przez 1,5 s.
