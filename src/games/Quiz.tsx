import { useEffect, useMemo, useState } from 'react'
import type { GraProps } from '../App'
import { Obrazek } from '../components/Obrazek'
import { efekt, powiedz } from '../logic/dzwiek'
import { gwiazdki, opcje, wybierzSlowka } from '../logic/losowanie'
import s from './gry.module.css'

const PYTANIA = 8
const OPCJE = 4

export function Quiz({ slowka, postep, onOdpowiedz, onKoniec, tryb }: GraProps & { tryb: 'sluchaj' | 'czytaj' }) {
  const pytania = useMemo(
    () => wybierzSlowka(slowka, PYTANIA, postep).map((p) => ({ slowko: p, opcje: opcje(p, slowka, OPCJE) })),
    // pytania losowane raz na grę
    [],
  )
  const [nr, setNr] = useState(0)
  const [zle, setZle] = useState<string[]>([])
  const [dobrze, setDobrze] = useState(false)
  const [trafione, setTrafione] = useState(0)

  const pytanie = pytania[nr]

  useEffect(() => {
    if (tryb === 'sluchaj') powiedz(pytanie.slowko.en)
  }, [nr, tryb, pytanie])

  const odpowiedz = (en: string) => {
    if (dobrze || zle.includes(en)) return
    const pierwszaProba = zle.length === 0
    if (en !== pytanie.slowko.en) {
      efekt.jeszczeRaz()
      if (pierwszaProba) onOdpowiedz(pytanie.slowko.en, false)
      setZle([...zle, en])
      return
    }
    efekt.dobrze()
    powiedz(en)
    if (pierwszaProba) onOdpowiedz(en, true)
    const wynik = trafione + (pierwszaProba ? 1 : 0)
    setTrafione(wynik)
    setDobrze(true)
    setTimeout(() => {
      if (nr + 1 === pytania.length) return onKoniec(gwiazdki(wynik, pytania.length))
      setNr(nr + 1)
      setZle([])
      setDobrze(false)
    }, 1100)
  }

  return (
    <div className={s.gra}>
      <Kropki ile={pytania.length} nr={nr} />
      {tryb === 'sluchaj' ? (
        <>
          <p className={s.polecenie}>Posłuchaj i wybierz obrazek</p>
          <button className={s.glosnik} onClick={() => powiedz(pytanie.slowko.en)} aria-label="Posłuchaj jeszcze raz">
            🔊
          </button>
        </>
      ) : (
        <>
          <p className={s.polecenie}>Jak to jest po angielsku?</p>
          <div className={s.pytanieCzytaj}>
            {pytanie.slowko.emoji && <Obrazek slowko={pytanie.slowko} />}
            <span className={s.slowoPl}>{pytanie.slowko.pl}</span>
          </div>
        </>
      )}
      <div className={s.opcje}>
        {pytanie.opcje.map((o) => {
          const stan = zle.includes(o.en) ? s.zla : dobrze && o.en === pytanie.slowko.en ? s.dobra : ''
          return (
            <button key={o.en} className={`${s.opcja} ${stan}`} onClick={() => odpowiedz(o.en)}>
              {tryb === 'sluchaj' ? <Obrazek slowko={o} /> : <b className={s.slowoEn}>{o.en}</b>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Kropki({ ile, nr }: { ile: number; nr: number }) {
  return (
    <div className={s.kropki} aria-label={`Pytanie ${nr + 1} z ${ile}`}>
      {Array.from({ length: ile }, (_, i) => (
        <span key={i} className={i < nr ? s.kropkaZrobiona : i === nr ? s.kropkaTeraz : s.kropka} />
      ))}
    </div>
  )
}
