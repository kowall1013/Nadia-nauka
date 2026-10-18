// Porównanie tego, co usłyszało rozpoznawanie mowy, ze słówkiem do powiedzenia.

export type Ocena = 'dobrze' | 'prawie' | 'zle'

export type WynikWymowy = {
  ocena: Ocena
  /** Najbliższa z wersji, które usłyszała przeglądarka — do pokazania dziecku. */
  uslyszane: string
}

/** Słowa, które brzmią tak samo jak słówko z lekcji — rozpoznawanie nie odróżni ich po dźwięku. */
const brzmiJak: Record<string, string> = {
  read: 'red',
  blew: 'blue',
  bored: 'board',
  gray: 'grey',
}

/** Małe litery, bez interpunkcji, pojedyncze spacje (myślnik = spacja). */
export function normalizuj(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z' ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Odległość Levenshteina — ile liter trzeba zmienić, dodać lub usunąć. */
export function odleglosc(a: string, b: string): number {
  let poprzedni = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const biezacy = [i]
    for (let j = 1; j <= b.length; j++) {
      biezacy[j] = Math.min(poprzedni[j] + 1, biezacy[j - 1] + 1, poprzedni[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    poprzedni = biezacy
  }
  return poprzedni[b.length]
}

function ujednolic(tekst: string): string {
  let t = ` ${normalizuj(tekst)} `
  for (const [z, na] of Object.entries(brzmiJak)) t = t.replaceAll(` ${z} `, ` ${na} `)
  return t.trim()
}

/** Ile liter różnicy to jeszcze "prawie": 1 dla krótkich słów, więcej dla długich. */
const progPrawie = (cel: string) => Math.max(1, Math.floor(cel.length / 4))

function ocenJedna(cel: string, wypowiedz: string): { ocena: Ocena; roznica: number } {
  const slowa = wypowiedz.split(' ')
  const dlugoscCelu = cel.split(' ').length
  // dziecko może powiedzieć więcej, np. "a dog" albo "it's red" — szukamy celu w środku
  let roznica = odleglosc(cel.replaceAll(' ', ''), wypowiedz.replaceAll(' ', ''))
  for (let i = 0; i + dlugoscCelu <= slowa.length; i++) {
    const fragment = slowa.slice(i, i + dlugoscCelu).join('')
    roznica = Math.min(roznica, odleglosc(cel.replaceAll(' ', ''), fragment))
  }
  const ocena = roznica === 0 ? 'dobrze' : roznica <= progPrawie(cel) ? 'prawie' : 'zle'
  return { ocena, roznica }
}

/** Ocenia wszystkie wersje podane przez rozpoznawanie i wybiera najlepszą. */
export function ocenWymowe(slowko: string, wersje: readonly string[]): WynikWymowy {
  const cel = ujednolic(slowko)
  let najlepszy: WynikWymowy & { roznica: number } = { ocena: 'zle', uslyszane: wersje[0] ?? '', roznica: Infinity }
  for (const w of wersje) {
    const { ocena, roznica } = ocenJedna(cel, ujednolic(w))
    if (roznica < najlepszy.roznica) najlepszy = { ocena, uslyszane: w, roznica }
  }
  return { ocena: najlepszy.ocena, uslyszane: najlepszy.uslyszane }
}
