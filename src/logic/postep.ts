import { PROG_ZALICZENIA, type TypEgzaminu } from './egzamin'

export type StatSlowka = { dobrze: number; zle: number }

/** Jedno podejście do egzaminu — zapisujemy każde, także poprawki. */
export type WynikEgzaminu = {
  lekcjaId: string
  typ: TypEgzaminu
  procent: number
  trafione: number
  wszystkie: number
  /** Słówka (en) z błędną pierwszą odpowiedzią. */
  bledy: string[]
  /** Data i godzina, ISO. */
  data: string
}

export type Postep = {
  slowka: Record<string, StatSlowka>
  gry: number
  gwiazdki: number
  ostatnio?: string
  egzaminy: WynikEgzaminu[]
}

const KLUCZ = 'nadia-nauka:postep'

export const pustyPostep = (): Postep => ({ slowka: {}, gry: 0, gwiazdki: 0, egzaminy: [] })

export function zapiszOdpowiedz(postep: Postep, en: string, dobrze: boolean): Postep {
  const s = postep.slowka[en] ?? { dobrze: 0, zle: 0 }
  return {
    ...postep,
    slowka: {
      ...postep.slowka,
      [en]: dobrze ? { ...s, dobrze: s.dobrze + 1 } : { ...s, zle: s.zle + 1 },
    },
  }
}

export function zapiszGre(postep: Postep, gwiazdki: number, data: string): Postep {
  return { ...postep, gry: postep.gry + 1, gwiazdki: postep.gwiazdki + gwiazdki, ostatnio: data }
}

export function zapiszEgzamin(postep: Postep, wynik: WynikEgzaminu): Postep {
  return { ...postep, egzaminy: [...postep.egzaminy, wynik] }
}

export function najlepszyWynik(postep: Postep, lekcjaId: string, typ: TypEgzaminu): WynikEgzaminu | undefined {
  return postep.egzaminy
    .filter((e) => e.lekcjaId === lekcjaId && e.typ === typ)
    .reduce<WynikEgzaminu | undefined>((naj, e) => (!naj || e.procent > naj.procent ? e : naj), undefined)
}

/** Poziom Nadii = liczba zdanych egzaminów (lekcja + rodzaj egzaminu); poprawki się nie liczą podwójnie. */
export function poziom(postep: Postep): number {
  const zdane = postep.egzaminy.filter((e) => e.procent >= PROG_ZALICZENIA).map((e) => `${e.lekcjaId}|${e.typ}`)
  return new Set(zdane).size
}

/** Słówka z co najmniej jedną pomyłką, najtrudniejsze pierwsze. */
export function trudneSlowka(postep: Postep): [string, StatSlowka][] {
  return Object.entries(postep.slowka)
    .filter(([, s]) => s.zle > 0)
    .sort(([, a], [, b]) => b.zle / (b.zle + b.dobrze) - a.zle / (a.zle + a.dobrze))
}

export function wczytaj(): Postep {
  try {
    const raw = localStorage.getItem(KLUCZ)
    return raw ? { ...pustyPostep(), ...JSON.parse(raw) } : pustyPostep()
  } catch {
    return pustyPostep()
  }
}

export function zapisz(postep: Postep): void {
  try {
    localStorage.setItem(KLUCZ, JSON.stringify(postep))
  } catch {
    // brak pamięci przeglądarki — gra działa dalej, tylko bez zapisu
  }
}
