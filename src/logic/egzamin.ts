import type { Slowko } from '../data/lekcje'
import { opcje, tasuj, type Rng } from './losowanie'

/** Rodzaj egzaminu. Na razie tylko ze słuchu — kolejne (np. pisownia) dopisuj tutaj. */
export type TypEgzaminu = 'sluchanie'

export const PROG_ZALICZENIA = 80
const OPCJE = 4

export type PytanieEgzaminu = { slowko: Slowko; opcje: Slowko[] }

/** Każde słówko lekcji dokładnie raz, w losowej kolejności. */
export function pytaniaEgzaminu(slowka: readonly Slowko[], rng: Rng = Math.random): PytanieEgzaminu[] {
  return tasuj(slowka, rng).map((s) => ({ slowko: s, opcje: opcje(s, slowka, OPCJE, rng) }))
}

export type Ocena = { procent: number; trafione: number; wszystkie: number; bledy: string[]; zdany: boolean }

/** Ocena z odpowiedzi za pierwszym razem (po jednej na pytanie). */
export function ocenEgzamin(odpowiedzi: readonly { en: string; dobrze: boolean }[]): Ocena {
  const trafione = odpowiedzi.filter((o) => o.dobrze).length
  const wszystkie = odpowiedzi.length
  const procent = wszystkie === 0 ? 0 : Math.round((trafione / wszystkie) * 100)
  return {
    procent,
    trafione,
    wszystkie,
    bledy: odpowiedzi.filter((o) => !o.dobrze).map((o) => o.en),
    zdany: procent >= PROG_ZALICZENIA,
  }
}
