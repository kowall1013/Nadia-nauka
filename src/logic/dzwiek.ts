// Lektor (Web Speech API) i krótkie efekty dźwiękowe (Web Audio) — bez plików audio.

const KLUCZ_WYCISZ = 'nadia-nauka:wycisz'

let wyciszone = (() => {
  try {
    return localStorage.getItem(KLUCZ_WYCISZ) === '1'
  } catch {
    return false
  }
})()

export const czyWyciszone = () => wyciszone

export function ustawWyciszenie(w: boolean) {
  wyciszone = w
  try {
    localStorage.setItem(KLUCZ_WYCISZ, w ? '1' : '0')
  } catch {
    // bez zapisu ustawienia
  }
}

function glos(jezyk: 'en' | 'pl'): SpeechSynthesisVoice | undefined {
  const glosy = speechSynthesis.getVoices()
  const pref = jezyk === 'en' ? ['en-US', 'en-GB', 'en'] : ['pl-PL', 'pl']
  for (const p of pref) {
    const g = glosy.find((v) => v.lang.replace('_', '-').startsWith(p))
    if (g) return g
  }
  return undefined
}

/** Lektor działa zawsze, także po wyciszeniu efektów — to część nauki. */
export function powiedz(tekst: string, jezyk: 'en' | 'pl' = 'en') {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(tekst)
  u.lang = jezyk === 'en' ? 'en-US' : 'pl-PL'
  const g = glos(jezyk)
  if (g) u.voice = g
  u.rate = 0.85
  speechSynthesis.speak(u)
}

let ctx: AudioContext | undefined

function ton(freq: number, start: number, dlugosc: number, typ: OscillatorType = 'sine', glosnosc = 0.15) {
  ctx ??= new AudioContext()
  const t = ctx.currentTime + start
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = typ
  osc.frequency.value = freq
  gain.gain.setValueAtTime(glosnosc, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dlugosc)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dlugosc)
}

export const efekt = {
  dobrze() {
    if (wyciszone) return
    ton(880, 0, 0.15)
    ton(1320, 0.1, 0.25)
  },
  /** Łagodny dźwięk przy pomyłce — bez "buczka". */
  jeszczeRaz() {
    if (wyciszone) return
    ton(330, 0, 0.2, 'triangle', 0.1)
  },
  pop() {
    if (wyciszone) return
    ton(600, 0, 0.08, 'square', 0.06)
  },
  fanfary() {
    if (wyciszone) return
    ;[523, 659, 784, 1047].forEach((f, i) => ton(f, i * 0.15, 0.4, 'triangle'))
  },
}
