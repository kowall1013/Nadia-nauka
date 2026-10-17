import { useEffect, useMemo, useState } from 'react'
import type { GraProps } from '../App'
import { Obrazek } from '../components/Obrazek'
import { efekt, powiedz } from '../logic/dzwiek'
import { gwiazdki, opcje, wybierzSlowka } from '../logic/losowanie'
import { Kropki } from './Quiz'
import s from './gry.module.css'

const RUNDY = 8
const BALONY = 4

export function Balony({ slowka, postep, onOdpowiedz, onKoniec }: GraProps) {
  const rundy = useMemo(
    () => wybierzSlowka(slowka, RUNDY, postep).map((p) => ({ slowko: p, balony: opcje(p, slowka, BALONY) })),
    // rundy losowane raz na grę
    [],
  )
  const [nr, setNr] = useState(0)
  const [zle, setZle] = useState<string[]>([])
  const [pekniety, setPekniety] = useState<string | null>(null)
  const [trafione, setTrafione] = useState(0)

  const runda = rundy[nr]

  useEffect(() => {
    powiedz(runda.slowko.en)
  }, [runda])

  const klik = (en: string) => {
    if (pekniety || zle.includes(en)) return
    const pierwszaProba = zle.length === 0
    if (en !== runda.slowko.en) {
      efekt.jeszczeRaz()
      if (pierwszaProba) onOdpowiedz(runda.slowko.en, false)
      setZle([...zle, en])
      return
    }
    efekt.pop()
    efekt.dobrze()
    if (pierwszaProba) onOdpowiedz(en, true)
    const wynik = trafione + (pierwszaProba ? 1 : 0)
    setTrafione(wynik)
    setPekniety(en)
    setTimeout(() => {
      if (nr + 1 === rundy.length) return onKoniec(gwiazdki(wynik, rundy.length))
      setNr(nr + 1)
      setZle([])
      setPekniety(null)
    }, 900)
  }

  return (
    <div className={s.gra}>
      <Kropki ile={rundy.length} nr={nr} />
      <p className={s.polecenie}>
        Złap balon: <b className={s.slowoEn}>{runda.slowko.en}</b>{' '}
        <button className={s.glosnikMaly} onClick={() => powiedz(runda.slowko.en)} aria-label="Posłuchaj">
          🔊
        </button>
      </p>
      <div className={s.niebo} key={nr}>
        {runda.balony.map((b, i) => (
          <button
            key={b.en}
            className={`${s.balon} ${zle.includes(b.en) ? s.balonZly : ''} ${pekniety === b.en ? s.balonPekniety : ''}`}
            style={{
              left: `${5 + i * (90 / BALONY)}%`,
              animationDelay: `${-((i * 2.3) % 9)}s`,
            }}
            onClick={() => klik(b.en)}
            aria-label={b.pl}
          >
            <span className={s.balonCialo}>
              <span className={s.balonSrodek}>
                <Obrazek slowko={b} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
