import type { Slowko } from '../data/lekcje'
import s from './ui.module.css'

/** Obrazek słówka; gdy brak emoji — polski napis zamiast obrazka. */
export function Obrazek({ slowko, maly }: { slowko: Slowko; maly?: boolean }) {
  return slowko.emoji ? (
    <span className={maly ? s.emojiMale : s.emoji} aria-label={slowko.pl}>
      {slowko.emoji}
    </span>
  ) : (
    <span className={s.napisZamiastObrazka}>{slowko.pl}</span>
  )
}
