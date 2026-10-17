import type { Slowko } from '../data/lekcje'
import type { Postep } from './postep'

export type Rng = () => number

export function tasuj<T>(lista: readonly T[], rng: Rng = Math.random): T[] {
  const wynik = [...lista]
  for (let i = wynik.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[wynik[i], wynik[j]] = [wynik[j], wynik[i]]
  }
  return wynik
}

/** Waga słówka: im więcej pomyłek względem trafień, tym częściej się pojawia. */
export function waga(slowko: Slowko, postep: Postep): number {
  const s = postep.slowka[slowko.en]
  if (!s) return 2 // nowe słówko — trochę częściej niż dobrze znane
  return Math.max(1, 1 + s.zle * 2 - s.dobrze * 0.5)
}

/** Losuje `ile` różnych słówek, preferując trudne (losowanie ważone bez zwracania). */
export function wybierzSlowka(
  slowka: readonly Slowko[],
  ile: number,
  postep: Postep,
  rng: Rng = Math.random,
): Slowko[] {
  const pula = [...slowka]
  const wynik: Slowko[] = []
  while (wynik.length < ile && pula.length > 0) {
    const wagi = pula.map((s) => waga(s, postep))
    let r = rng() * wagi.reduce((a, b) => a + b, 0)
    let i = 0
    while (i < pula.length - 1 && r >= wagi[i]) {
      r -= wagi[i]
      i++
    }
    wynik.push(pula.splice(i, 1)[0])
  }
  return wynik
}

/** Poprawne słówko + `ile - 1` innych, w losowej kolejności. */
export function opcje(
  poprawne: Slowko,
  slowka: readonly Slowko[],
  ile: number,
  rng: Rng = Math.random,
): Slowko[] {
  const inne = tasuj(
    slowka.filter((s) => s.en !== poprawne.en),
    rng,
  ).slice(0, ile - 1)
  return tasuj([poprawne, ...inne], rng)
}

/** 3 gwiazdki za ≥90% trafień za pierwszym razem, 2 za ≥60%, inaczej 1 — zawsze coś. */
export function gwiazdki(trafione: number, wszystkie: number): number {
  if (wszystkie === 0) return 1
  const p = trafione / wszystkie
  if (p >= 0.9) return 3
  if (p >= 0.6) return 2
  return 1
}
