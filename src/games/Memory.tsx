import { useMemo, useRef, useState } from 'react'
import type { GraProps } from '../App'
import type { Slowko } from '../data/lekcje'
import { Obrazek } from '../components/Obrazek'
import { efekt, powiedz } from '../logic/dzwiek'
import { tasuj, wybierzSlowka } from '../logic/losowanie'
import s from './gry.module.css'

const PARY = 6

type Karta = { id: number; slowko: Slowko; strona: 'en' | 'druga' }

export function gwiazdkiMemory(ruchy: number, pary: number): number {
  if (ruchy <= pary + 2) return 3
  if (ruchy <= pary * 2) return 2
  return 1
}

export function Memory({ slowka, postep, onOdpowiedz, onKoniec, tryb }: GraProps & { tryb: 'obrazek' | 'polski' }) {
  const karty = useMemo<Karta[]>(() => {
    const wybrane = wybierzSlowka(slowka, PARY, postep)
    return tasuj(
      wybrane.flatMap((slowko, i) => [
        { id: i * 2, slowko, strona: 'en' as const },
        { id: i * 2 + 1, slowko, strona: 'druga' as const },
      ]),
    )
    // talia losowana raz na grę
  }, [])
  const pary = karty.length / 2

  const [odkryte, setOdkryte] = useState<number[]>([])
  const [znalezione, setZnalezione] = useState<Set<string>>(new Set())
  const [ruchy, setRuchy] = useState(0)
  const blokada = useRef(false)

  const kliknij = (k: Karta) => {
    if (blokada.current || odkryte.includes(k.id) || znalezione.has(k.slowko.en)) return
    if (k.strona === 'en') powiedz(k.slowko.en)
    else if (tryb === 'polski') powiedz(k.slowko.pl, 'pl')

    if (odkryte.length === 0) return setOdkryte([k.id])

    const pierwsza = karty.find((x) => x.id === odkryte[0])!
    setOdkryte([pierwsza.id, k.id])
    setRuchy((r) => r + 1)
    blokada.current = true

    if (pierwsza.slowko.en === k.slowko.en) {
      setTimeout(() => {
        efekt.dobrze()
        powiedz(k.slowko.en)
        onOdpowiedz(k.slowko.en, true)
        const nowe = new Set(znalezione).add(k.slowko.en)
        setZnalezione(nowe)
        setOdkryte([])
        blokada.current = false
        if (nowe.size === pary) setTimeout(() => onKoniec(gwiazdkiMemory(ruchy + 1, pary)), 900)
      }, 500)
    } else {
      setTimeout(() => {
        efekt.jeszczeRaz()
        setOdkryte([])
        blokada.current = false
      }, 1200)
    }
  }

  return (
    <div className={s.gra}>
      <p className={s.polecenie}>Znajdź pary! 🃏</p>
      <div className={s.memory}>
        {karty.map((k) => {
          const widoczna = odkryte.includes(k.id) || znalezione.has(k.slowko.en)
          return (
            <button
              key={k.id}
              className={`${s.karta} ${widoczna ? s.odwrocona : ''} ${znalezione.has(k.slowko.en) ? s.para : ''}`}
              onClick={() => kliknij(k)}
              aria-label={widoczna ? (k.strona === 'en' ? k.slowko.en : k.slowko.pl) : 'zakryta karta'}
            >
              <span className={s.tyl}>?</span>
              <span className={s.przod}>
                {k.strona === 'en' ? (
                  <b className={s.slowoEn}>{k.slowko.en}</b>
                ) : tryb === 'obrazek' ? (
                  <Obrazek slowko={k.slowko} />
                ) : (
                  <span className={s.slowoPl}>{k.slowko.pl}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      <p className={s.info}>Ruchy: {ruchy}</p>
    </div>
  )
}
