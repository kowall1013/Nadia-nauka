import { describe, expect, it } from 'vitest'
import { kartki, lekcje, wszystkieSlowka, znajdzLekcje, type Slowko } from '../data/lekcje'
import { gwiazdki, opcje, tasuj, wybierzSlowka } from './losowanie'
import { pustyPostep, trudneSlowka, zapiszGre, zapiszOdpowiedz } from './postep'

/** Powtarzalny generator liczb losowych do testów. */
function rngZ(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2 ** 31
    return seed / 2 ** 31
  }
}

const slowka: Slowko[] = ['a', 'b', 'c', 'd', 'e'].map((x) => ({ pl: x, en: x }))

describe('lekcje', () => {
  it('mają unikalne id i słówka angielskie unikalne w całej aplikacji', () => {
    expect(new Set(lekcje.map((l) => l.id)).size).toBe(lekcje.length)
    const en = wszystkieSlowka.map((s) => s.en.toLowerCase())
    expect(new Set(en).size).toBe(en.length)
  })

  it('każda lekcja ma co najmniej 4 słówka (tyle opcji ma quiz)', () => {
    for (const l of lekcje) expect(l.slowka.length).toBeGreaterThanOrEqual(4)
  })

  it('lekcje z kartek są ponumerowane po kolei od 1', () => {
    expect(kartki.map((k) => k.nr)).toEqual(kartki.map((_, i) => i + 1))
  })

  it('Lekcja 1 ma dokładnie wszystkie słówka z kartki', () => {
    const kartka1 = [
      ['long', 'długi'], ['short', 'krótki'],
      ['blue', 'niebieski'], ['red', 'czerwony'], ['yellow', 'żółty'], ['green', 'zielony'],
      ['orange', 'pomarańczowy'], ['black', 'czarny'], ['purple', 'fioletowy'], ['pink', 'różowy'],
      ['brown', 'brązowy'], ['white', 'biały'],
      ['classroom', 'klasa'], ['teacher', 'nauczyciel'], ['pupil', 'uczeń'], ['desk', 'ławka'],
      ['book', 'książka'], ['backpack', 'plecak'], ['pen', 'pióro'], ['pencil case', 'piórnik'],
      ['chair', 'krzesło'], ['pencil', 'ołówek'], ['rubber', 'gumka'], ['ruler', 'linijka'],
      ['board', 'tablica'], ['big', 'duży'], ['small', 'mały'],
    ]
    expect(kartki[0].slowka.map((s) => [s.en, s.pl])).toEqual(kartka1)
  })

  it('płaska lista zawiera kartki i ich rozszerzenia, a znajdzLekcje szuka po id', () => {
    const rozszerzenia = kartki.flatMap((k) => k.rozszerzenia)
    expect(rozszerzenia.length).toBeGreaterThan(0)
    expect(lekcje).toHaveLength(kartki.length + rozszerzenia.length)
    expect(znajdzLekcje(rozszerzenia[0].id)).toBe(rozszerzenia[0])
    expect(znajdzLekcje('nie-ma')).toBeUndefined()
  })
})

describe('tasuj', () => {
  it('zachowuje elementy i nie zmienia oryginału', () => {
    const oryginal = [1, 2, 3, 4, 5]
    const wynik = tasuj(oryginal, rngZ(1))
    expect([...wynik].sort()).toEqual(oryginal)
    expect(oryginal).toEqual([1, 2, 3, 4, 5])
  })
})

describe('wybierzSlowka', () => {
  it('zwraca żądaną liczbę różnych słówek, najwyżej tyle, ile jest', () => {
    const w = wybierzSlowka(slowka, 3, pustyPostep(), rngZ(2))
    expect(w).toHaveLength(3)
    expect(new Set(w.map((s) => s.en)).size).toBe(3)
    expect(wybierzSlowka(slowka, 10, pustyPostep(), rngZ(2))).toHaveLength(5)
  })

  it('częściej wybiera słówka, przy których były pomyłki', () => {
    let postep = pustyPostep()
    for (const s of slowka) {
      for (let i = 0; i < 5; i++) postep = zapiszOdpowiedz(postep, s.en, s.en !== 'e')
    }
    const rng = rngZ(3)
    let trafienia = 0
    for (let i = 0; i < 1000; i++) {
      if (wybierzSlowka(slowka, 1, postep, rng)[0].en === 'e') trafienia++
    }
    // bez wag byłoby ~20%
    expect(trafienia).toBeGreaterThan(500)
  })
})

describe('opcje', () => {
  it('zawierają poprawne słówko i różne słówka', () => {
    const o = opcje(slowka[0], slowka, 4, rngZ(4))
    expect(o).toHaveLength(4)
    expect(o.map((s) => s.en)).toContain('a')
    expect(new Set(o.map((s) => s.en)).size).toBe(4)
  })
})

describe('gwiazdki', () => {
  it('zawsze daje co najmniej jedną', () => {
    expect(gwiazdki(0, 8)).toBe(1)
    expect(gwiazdki(5, 8)).toBe(2)
    expect(gwiazdki(8, 8)).toBe(3)
  })
})

describe('postęp', () => {
  it('liczy odpowiedzi i gry', () => {
    let p = pustyPostep()
    p = zapiszOdpowiedz(p, 'red', true)
    p = zapiszOdpowiedz(p, 'red', false)
    p = zapiszOdpowiedz(p, 'blue', false)
    p = zapiszGre(p, 3, '2026-10-17')
    expect(p.slowka.red).toEqual({ dobrze: 1, zle: 1 })
    expect(p).toMatchObject({ gry: 1, gwiazdki: 3, ostatnio: '2026-10-17' })
    expect(trudneSlowka(p).map(([en]) => en)).toEqual(['blue', 'red'])
  })
})
