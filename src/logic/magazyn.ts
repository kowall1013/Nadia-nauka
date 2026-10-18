import { pustyPostep, type Postep } from './postep'

/** Gdzie leży postęp Nadii. Gra zna tylko ten interfejs — nie wie, czy to przeglądarka, czy baza. */
export interface Magazyn {
  /** Od razu, bez czekania — gra startuje z tym, co jest pod ręką. */
  wczytaj(): Postep
  zapisz(postep: Postep): void
  /** Zmiany przychodzące z zewnątrz (np. z bazy). Zwraca funkcję wypisującą. */
  subskrybuj(sluchacz: (postep: Postep) => void): () => void
}

const czyObiekt = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const liczba = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : 0)

/** Dowolny zapis (także sprzed egzaminów albo uszkodzony) → poprawny postęp. */
export function migruj(dane: unknown): Postep {
  if (!czyObiekt(dane)) return pustyPostep()
  const p: Postep = {
    slowka: czyObiekt(dane.slowka) ? (dane.slowka as Postep['slowka']) : {},
    gry: liczba(dane.gry),
    gwiazdki: liczba(dane.gwiazdki),
    egzaminy: Array.isArray(dane.egzaminy) ? dane.egzaminy : [],
  }
  if (typeof dane.ostatnio === 'string') p.ostatnio = dane.ostatnio
  return p
}

/**
 * Łączy postęp z dwóch miejsc (tablet i baza), gdy jedno grało bez drugiego.
 * Statystyki słówek i gwiazdki — z tego, które więcej grało; egzaminy — wszystkie z obu, bez powtórek.
 */
export function scal(a: Postep, b: Postep): Postep {
  const baza = a.gry !== b.gry ? (a.gry > b.gry ? a : b) : a.gwiazdki >= b.gwiazdki ? a : b
  const egzaminy = new Map([...a.egzaminy, ...b.egzaminy].map((e) => [`${e.data}|${e.lekcjaId}|${e.typ}`, e]))
  return { ...baza, egzaminy: [...egzaminy.values()].sort((x, y) => x.data.localeCompare(y.data)) }
}

const KLUCZ = 'nadia-nauka:postep'

/** Postęp w pamięci przeglądarki na tym urządzeniu. */
export function magazynLokalny(pamiec: Storage = localStorage): Magazyn {
  return {
    wczytaj() {
      try {
        const raw = pamiec.getItem(KLUCZ)
        return raw ? migruj(JSON.parse(raw)) : pustyPostep()
      } catch {
        return pustyPostep()
      }
    },
    zapisz(postep) {
      try {
        pamiec.setItem(KLUCZ, JSON.stringify(postep))
      } catch {
        // brak pamięci przeglądarki — gra działa dalej, tylko bez zapisu
      }
    },
    subskrybuj: () => () => {},
  }
}
