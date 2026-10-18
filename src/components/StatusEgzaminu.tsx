import { PROG_ZALICZENIA } from '../logic/egzamin'
import s from './ui.module.css'

/** Plakietka z najlepszym wynikiem egzaminu: ✅ zdany, 🎓 próbowany, nic — jeszcze bez podejścia. */
export function StatusEgzaminu({ procent }: { procent?: number }) {
  if (procent === undefined) return null
  const zdany = procent >= PROG_ZALICZENIA
  return (
    <span className={zdany ? s.statusZdany : s.statusProba}>
      {zdany ? '✅' : '🎓'} egzamin {procent}%
    </span>
  )
}
