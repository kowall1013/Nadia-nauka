import { useEffect, useMemo, useState } from 'react'
import type { Slowko } from '../data/lekcje'
import { Obrazek } from '../components/Obrazek'
import { efekt, powiedz } from '../logic/dzwiek'
import { pytaniaEgzaminu } from '../logic/egzamin'
import s from './gry.module.css'

type Odpowiedz = { en: string; dobrze: boolean }

type Props = {
  slowka: Slowko[]
  onOdpowiedz: (en: string, dobrze: boolean) => void
  onKoniec: (odpowiedzi: Odpowiedz[]) => void
}

/** Egzamin ze słuchu: każde słówko raz, liczy się tylko pierwsza odpowiedź, bez poprawiania. */
export function Egzamin({ slowka, onOdpowiedz, onKoniec }: Props) {
  // pytania losowane raz na egzamin
  const pytania = useMemo(() => pytaniaEgzaminu(slowka), [])
  const [nr, setNr] = useState(0)
  const [wybrane, setWybrane] = useState<string>()
  const [odpowiedzi, setOdpowiedzi] = useState<Odpowiedz[]>([])

  const pytanie = pytania[nr]

  useEffect(() => {
    powiedz(pytanie.slowko.en)
  }, [pytanie])

  const odpowiedz = (en: string) => {
    if (wybrane) return
    const dobrze = en === pytanie.slowko.en
    setWybrane(en)
    onOdpowiedz(pytanie.slowko.en, dobrze)
    const nowe = [...odpowiedzi, { en: pytanie.slowko.en, dobrze }]
    setOdpowiedzi(nowe)
    if (dobrze) efekt.dobrze()
    else efekt.jeszczeRaz()
    // po pomyłce chwila dłużej — Nadia widzi i słyszy poprawną odpowiedź
    if (!dobrze) setTimeout(() => powiedz(pytanie.slowko.en), 400)
    setTimeout(
      () => {
        if (nr + 1 === pytania.length) return onKoniec(nowe)
        setNr(nr + 1)
        setWybrane(undefined)
      },
      dobrze ? 1000 : 2200,
    )
  }

  return (
    <div className={s.gra}>
      <div className={s.pasekPostepu} aria-label={`Pytanie ${nr + 1} z ${pytania.length}`}>
        <span style={{ width: `${(nr / pytania.length) * 100}%` }} />
      </div>
      <p className={s.info}>
        Egzamin · {nr + 1} z {pytania.length}
      </p>
      <p className={s.polecenie}>Posłuchaj i wybierz obrazek</p>
      <button className={s.glosnik} onClick={() => powiedz(pytanie.slowko.en)} aria-label="Posłuchaj jeszcze raz">
        🔊
      </button>
      <div className={s.opcje}>
        {pytanie.opcje.map((o) => {
          const poprawna = o.en === pytanie.slowko.en
          const stan = !wybrane ? '' : poprawna ? s.dobra : o.en === wybrane ? s.zla : ''
          return (
            <button key={o.en} className={`${s.opcja} ${stan}`} onClick={() => odpowiedz(o.en)}>
              <Obrazek slowko={o} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
