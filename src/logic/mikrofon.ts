// Rozpoznawanie mowy (Web Speech API). Chrome i Edge wysyłają nagranie do serwerów Google,
// Safari rozpoznaje często na urządzeniu. Firefox nie obsługuje — wtedy gry z mikrofonem nie ma.

/** Minimalne typy — TypeScript nie ma ich w bibliotece DOM. */
type Rozpoznawanie = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  abort(): void
}

type KonstruktorRozpoznawania = new () => Rozpoznawanie

const Konstruktor = (() => {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as Record<string, KonstruktorRozpoznawania | undefined>
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
})()

export const mikrofonDostepny = () => Konstruktor !== undefined

/** Błąd rozpoznawania, np. brak zgody na mikrofon albo brak internetu. */
export class BladMikrofonu extends Error {
  constructor(public kod: string) {
    super(kod)
  }
}

export type Sluchanie = {
  /** Wersje tego, co usłyszała przeglądarka (najbardziej prawdopodobna pierwsza); pusta lista = cisza. */
  wynik: Promise<string[]>
  przerwij: () => void
}

/** Słucha jednej wypowiedzi po angielsku. Kończy się sam, gdy dziecko przestanie mówić. */
export function sluchaj(): Sluchanie {
  if (!Konstruktor) return { wynik: Promise.reject(new BladMikrofonu('brak')), przerwij: () => {} }
  // lektor nie może mówić, gdy słuchamy — mikrofon by go usłyszał
  speechSynthesis.cancel()
  const r = new Konstruktor()
  // brytyjski angielski, jak w szkole: grey, rubber
  r.lang = 'en-GB'
  r.interimResults = false
  r.continuous = false
  r.maxAlternatives = 5
  const wynik = new Promise<string[]>((resolve, reject) => {
    let wersje: string[] = []
    r.onresult = (e) => {
      const pierwszy = e.results[0]
      wersje = Array.from({ length: pierwszy.length }, (_, i) => pierwszy[i].transcript)
    }
    r.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return
      reject(new BladMikrofonu(e.error))
    }
    r.onend = () => resolve(wersje)
  })
  r.start()
  return { wynik, przerwij: () => r.abort() }
}
