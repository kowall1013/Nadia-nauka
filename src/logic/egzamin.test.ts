import { describe, expect, it } from 'vitest'
import type { Slowko } from '../data/lekcje'
import { ocenEgzamin, pytaniaEgzaminu } from './egzamin'
import { najlepszyWynik, poziom, pustyPostep, zapiszEgzamin, type WynikEgzaminu } from './postep'

const slowka: Slowko[] = ['a', 'b', 'c', 'd', 'e', 'f'].map((x) => ({ pl: x, en: x }))

describe('pytaniaEgzaminu', () => {
  it('pyta o każde słówko lekcji dokładnie raz', () => {
    const p = pytaniaEgzaminu(slowka)
    expect(p.map((x) => x.slowko.en).sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  })

  it('daje 4 różne opcje z lekcji, w tym poprawną', () => {
    for (const { slowko, opcje } of pytaniaEgzaminu(slowka)) {
      expect(opcje).toHaveLength(4)
      expect(new Set(opcje.map((o) => o.en)).size).toBe(4)
      expect(opcje.map((o) => o.en)).toContain(slowko.en)
    }
  })
})

describe('ocenEgzamin', () => {
  it('liczy procent z odpowiedzi za pierwszym razem i wypisuje błędy', () => {
    const w = ocenEgzamin([
      { en: 'a', dobrze: true },
      { en: 'b', dobrze: false },
      { en: 'c', dobrze: true },
    ])
    expect(w).toEqual({ procent: 67, trafione: 2, wszystkie: 3, bledy: ['b'], zdany: false })
  })

  it('zalicza od 80%', () => {
    const odp = (dobre: number, wszystkie: number) =>
      Array.from({ length: wszystkie }, (_, i) => ({ en: String(i), dobrze: i < dobre }))
    expect(ocenEgzamin(odp(4, 5)).zdany).toBe(true) // 80%
    expect(ocenEgzamin(odp(19, 25)).zdany).toBe(false) // 76%
    expect(ocenEgzamin(odp(27, 27))).toMatchObject({ procent: 100, zdany: true })
  })
})

describe('egzaminy w postępie', () => {
  const wynik = (lekcjaId: string, procent: number, data: string): WynikEgzaminu => ({
    lekcjaId,
    typ: 'sluchanie',
    procent,
    trafione: procent,
    wszystkie: 100,
    bledy: [],
    data,
  })

  it('zapisuje każde podejście, a najlepszy wynik to najwyższy procent', () => {
    let p = pustyPostep()
    p = zapiszEgzamin(p, wynik('lekcja-1', 60, '2026-10-18T10:00'))
    p = zapiszEgzamin(p, wynik('lekcja-1', 90, '2026-10-18T11:00'))
    p = zapiszEgzamin(p, wynik('lekcja-1', 70, '2026-10-19T09:00'))
    expect(p.egzaminy).toHaveLength(3)
    expect(najlepszyWynik(p, 'lekcja-1', 'sluchanie')?.procent).toBe(90)
    expect(najlepszyWynik(p, 'zawody', 'sluchanie')).toBeUndefined()
  })

  it('poziom to liczba lekcji ze zdanym egzaminem, poprawki się nie dublują', () => {
    let p = pustyPostep()
    expect(poziom(p)).toBe(0)
    p = zapiszEgzamin(p, wynik('lekcja-1', 50, '2026-10-18T10:00'))
    expect(poziom(p)).toBe(0)
    p = zapiszEgzamin(p, wynik('lekcja-1', 85, '2026-10-18T11:00'))
    p = zapiszEgzamin(p, wynik('lekcja-1', 100, '2026-10-18T12:00'))
    p = zapiszEgzamin(p, wynik('zawody', 80, '2026-10-18T13:00'))
    expect(poziom(p)).toBe(2)
  })
})
