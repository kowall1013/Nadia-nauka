import { describe, expect, it } from 'vitest'
import { magazynLokalny, migruj, scal } from './magazyn'
import { pustyPostep, zapiszEgzamin, zapiszGre, zapiszOdpowiedz, type WynikEgzaminu } from './postep'

/** Pamięć przeglądarki w pamięci — jak localStorage, bez przeglądarki. */
function pamiec(poczatek: Record<string, string> = {}): Storage {
  const dane = new Map(Object.entries(poczatek))
  return {
    getItem: (k) => dane.get(k) ?? null,
    setItem: (k, v) => void dane.set(k, v),
    removeItem: (k) => void dane.delete(k),
    clear: () => dane.clear(),
    key: (i) => [...dane.keys()][i] ?? null,
    get length() {
      return dane.size
    },
  }
}

describe('migruj', () => {
  it('przenosi postęp zapisany przed egzaminami', () => {
    const stary = { slowka: { red: { dobrze: 3, zle: 1 } }, gry: 4, gwiazdki: 9, ostatnio: '2026-10-17' }
    expect(migruj(stary)).toEqual({ ...stary, egzaminy: [] })
  })

  it('zastępuje uszkodzone dane pustym postępem', () => {
    expect(migruj(null)).toEqual(pustyPostep())
    expect(migruj('bzdura')).toEqual(pustyPostep())
    expect(migruj({ slowka: 5, gry: 'x', egzaminy: {} })).toEqual(pustyPostep())
  })
})

describe('magazynLokalny', () => {
  it('bez zapisu daje pusty postęp', () => {
    expect(magazynLokalny(pamiec()).wczytaj()).toEqual(pustyPostep())
  })

  it('wczytuje stary zapis z tabletu', () => {
    const stary = { slowka: { cat: { dobrze: 1, zle: 0 } }, gry: 1, gwiazdki: 3 }
    const m = magazynLokalny(pamiec({ 'nadia-nauka:postep': JSON.stringify(stary) }))
    expect(m.wczytaj()).toMatchObject({ ...stary, egzaminy: [] })
  })

  it('odczytuje to, co zapisał', () => {
    const m = magazynLokalny(pamiec())
    let p = zapiszOdpowiedz(pustyPostep(), 'red', true)
    p = zapiszEgzamin(p, {
      lekcjaId: 'lekcja-1',
      typ: 'sluchanie',
      procent: 81,
      trafione: 22,
      wszystkie: 27,
      bledy: ['desk'],
      data: '2026-10-18T10:00:00.000Z',
    })
    m.zapisz(p)
    expect(m.wczytaj()).toEqual(p)
  })

  it('nie wywraca gry, gdy pamięć przeglądarki nie działa', () => {
    const zepsuta = { ...pamiec(), getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('full') } }
    const m = magazynLokalny(zepsuta)
    expect(m.wczytaj()).toEqual(pustyPostep())
    expect(() => m.zapisz(pustyPostep())).not.toThrow()
  })
})

describe('scal', () => {
  const egz = (lekcjaId: string, data: string): WynikEgzaminu => ({
    lekcjaId,
    typ: 'sluchanie',
    procent: 90,
    trafione: 9,
    wszystkie: 10,
    bledy: [],
    data,
  })

  it('bierze statystyki z urządzenia, które więcej grało, a egzaminów nie gubi z żadnego', () => {
    let tablet = zapiszGre(zapiszGre(zapiszOdpowiedz(pustyPostep(), 'red', true), 3, '2026-10-18'), 2, '2026-10-18')
    tablet = zapiszEgzamin(tablet, egz('lekcja-1', '2026-10-18T10:00:00.000Z'))
    tablet = zapiszEgzamin(tablet, egz('zawody', '2026-10-18T12:00:00.000Z'))
    let baza = zapiszGre(pustyPostep(), 1, '2026-10-17')
    baza = zapiszEgzamin(baza, egz('lekcja-1', '2026-10-18T10:00:00.000Z')) // ten sam co na tablecie
    baza = zapiszEgzamin(baza, egz('zwierzeta', '2026-10-18T11:00:00.000Z'))

    const w = scal(tablet, baza)
    expect(w).toMatchObject({ gry: 2, gwiazdki: 5, slowka: { red: { dobrze: 1, zle: 0 } } })
    expect(w.egzaminy.map((e) => e.lekcjaId)).toEqual(['lekcja-1', 'zwierzeta', 'zawody'])
  })

  it('jest symetryczne', () => {
    const a = zapiszEgzamin(zapiszGre(pustyPostep(), 3, '2026-10-18'), egz('x', '2026-10-18T09:00:00.000Z'))
    const b = zapiszEgzamin(pustyPostep(), egz('y', '2026-10-18T08:00:00.000Z'))
    expect(scal(a, b)).toEqual(scal(b, a))
  })
})
