import type { Gra } from '../App'
import type { Slowko } from '../data/lekcje'
import { powiedz } from '../logic/dzwiek'
import { mikrofonDostepny } from '../logic/mikrofon'
import { Obrazek } from './Obrazek'
import { StatusEgzaminu } from './StatusEgzaminu'
import s from './ui.module.css'

const gry: { gra: Gra; emoji: string; nazwa: string; opis: string }[] = [
  { gra: 'memory-obrazek', emoji: '🃏', nazwa: 'Memory', opis: 'obrazek + angielski' },
  { gra: 'memory-polski', emoji: '🃏', nazwa: 'Memory', opis: 'polski + angielski' },
  { gra: 'quiz-sluchaj', emoji: '👂', nazwa: 'Quiz', opis: 'posłuchaj i wybierz' },
  { gra: 'quiz-czytaj', emoji: '📖', nazwa: 'Quiz', opis: 'przeczytaj i wybierz' },
  { gra: 'balony', emoji: '🎈', nazwa: 'Balony', opis: 'złap właściwy balon' },
  // rozpoznawanie mowy nie działa np. w Firefoksie — wtedy bez tej gry
  ...(mikrofonDostepny() ? [{ gra: 'mow' as const, emoji: '🎤', nazwa: 'Mów', opis: 'powiedz po angielsku' }] : []),
]

type Props = {
  nazwa: string
  slowka: Slowko[]
  onGraj: (g: Gra) => void
  onEgzamin?: () => void
  /** Najlepszy wynik egzaminu w %, gdy było już podejście. */
  najlepszyEgzamin?: number
}

export function WyborGry({ nazwa, slowka, onGraj, onEgzamin, najlepszyEgzamin }: Props) {
  return (
    <div className={s.ekran}>
      <h1 className={s.tytul}>{nazwa}</h1>
      <div className={s.siatkaGier}>
        {gry.map((g) => (
          <button key={g.gra} className={s.kafel} onClick={() => onGraj(g.gra)}>
            <span className={s.kafelEmoji}>{g.emoji}</span>
            {g.nazwa}
            <span className={s.kafelLiczba}>{g.opis}</span>
          </button>
        ))}
        {onEgzamin && (
          <button className={`${s.kafel} ${s.kafelEgzamin}`} onClick={onEgzamin}>
            <span className={s.kafelEmoji}>🎓</span>
            Egzamin
            <span className={s.kafelLiczba}>wszystkie {slowka.length} słówek ze słuchu</span>
            <StatusEgzaminu procent={najlepszyEgzamin} />
          </button>
        )}
      </div>
      <h2 className={s.podtytul}>Słówka — dotknij, żeby posłuchać</h2>
      <div className={s.listaSlowek}>
        {slowka.map((w) => (
          <button key={w.en} className={s.slowko} onClick={() => powiedz(w.en)}>
            <Obrazek slowko={w} maly />
            <b>{w.en}</b>
            <span className={s.szary}>{w.pl}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
