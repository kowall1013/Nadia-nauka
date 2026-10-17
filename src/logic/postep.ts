export type StatSlowka = { dobrze: number; zle: number }

export type Postep = {
  slowka: Record<string, StatSlowka>
  gry: number
  gwiazdki: number
  ostatnio?: string
}

const KLUCZ = 'nadia-nauka:postep'

export const pustyPostep = (): Postep => ({ slowka: {}, gry: 0, gwiazdki: 0 })

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
