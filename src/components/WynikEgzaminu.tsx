import { useEffect } from 'react'
import type { Slowko } from '../data/lekcje'
import { efekt, powiedz } from '../logic/dzwiek'
import { PROG_ZALICZENIA } from '../logic/egzamin'
import type { WynikEgzaminu as Wynik } from '../logic/postep'
import { Obrazek } from './Obrazek'
import s from './ui.module.css'

type Props = {
  wynik: Wynik
  /** Najlepszy wynik sprzed tego podejścia. */
  poprzedniNajlepszy?: number
  slowka: Slowko[]
  onPopraw: () => void
  onWroc: () => void
}

export function WynikEgzaminu({ wynik, poprzedniNajlepszy, slowka, onPopraw, onWroc }: Props) {
  const zdany = wynik.procent >= PROG_ZALICZENIA
  const rekord = poprzedniNajlepszy !== undefined && wynik.procent > poprzedniNajlepszy
  const bledne = slowka.filter((w) => wynik.bledy.includes(w.en))

  useEffect(() => {
    if (zdany) efekt.fanfary()
  }, [zdany])

  return (
    <div className={s.ekran}>
      <h1 className={s.tytul}>{zdany ? 'Egzamin zdany! 🎉' : 'Prawie! 💪'}</h1>
      <p className={s.wynikProcent}>{wynik.procent}%</p>
      <p className={s.powitanie}>
        {wynik.trafione} z {wynik.wszystkie} dobrze
        {rekord && ' · nowy rekord! 🏆'}
      </p>
      {!zdany && <p className={s.szary}>Do zdania potrzeba {PROG_ZALICZENIA}%. Spróbuj jeszcze raz!</p>}
      {poprzedniNajlepszy !== undefined && !rekord && (
        <p className={s.szary}>Najlepszy wynik: {poprzedniNajlepszy}%</p>
      )}
      {bledne.length > 0 && (
        <>
          <h2 className={s.podtytul}>Do powtórki — dotknij, żeby posłuchać</h2>
          <div className={s.listaSlowek}>
            {bledne.map((w) => (
              <button key={w.en} className={s.slowko} onClick={() => powiedz(w.en)}>
                <Obrazek slowko={w} maly />
                <b>{w.en}</b>
                <span className={s.szary}>{w.pl}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <div className={s.przyciskiKonca}>
        <button className={s.przycisk} onClick={onPopraw}>🔄 {zdany ? 'Jeszcze raz' : 'Popraw egzamin'}</button>
        <button className={s.przyciskDrugi} onClick={onWroc}>📚 Wróć do lekcji</button>
      </div>
    </div>
  )
}
