import type { Gra } from '../App'
import type { Slowko } from '../data/lekcje'
import { powiedz } from '../logic/dzwiek'
import { Obrazek } from './Obrazek'
import s from './ui.module.css'

const gry: { gra: Gra; emoji: string; nazwa: string; opis: string }[] = [
  { gra: 'memory-obrazek', emoji: '🃏', nazwa: 'Memory', opis: 'obrazek + angielski' },
  { gra: 'memory-polski', emoji: '🃏', nazwa: 'Memory', opis: 'polski + angielski' },
  { gra: 'quiz-sluchaj', emoji: '👂', nazwa: 'Quiz', opis: 'posłuchaj i wybierz' },
  { gra: 'quiz-czytaj', emoji: '📖', nazwa: 'Quiz', opis: 'przeczytaj i wybierz' },
  { gra: 'balony', emoji: '🎈', nazwa: 'Balony', opis: 'złap właściwy balon' },
]

type Props = { nazwa: string; slowka: Slowko[]; onGraj: (g: Gra) => void }

export function WyborGry({ nazwa, slowka, onGraj }: Props) {
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
