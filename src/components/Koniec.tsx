import { useEffect } from 'react'
import { efekt } from '../logic/dzwiek'
import s from './ui.module.css'

const KOLORY = ['#ff7eb3', '#7b5cff', '#ffd84d', '#3ccf91', '#4db8ff']
const POCHWALY = ['Super!', 'Brawo, Nadia!', 'Świetnie!', 'Wow, ale super!']

type Props = { gwiazdki: number; onJeszczeRaz: () => void; onInnaGra: () => void }

export function Koniec({ gwiazdki, onJeszczeRaz, onInnaGra }: Props) {
  useEffect(() => efekt.fanfary(), [])
  const pochwala = POCHWALY[gwiazdki % POCHWALY.length]

  return (
    <div className={s.ekran}>
      <div className={s.konfetti} aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              background: KOLORY[i % KOLORY.length],
              animationDelay: `${(i % 10) * 0.15}s`,
              animationDuration: `${2.5 + (i % 5) * 0.4}s`,
            }}
          />
        ))}
      </div>
      <h1 className={s.tytul}>{pochwala}</h1>
      <div className={s.duzeGwiazdki} aria-label={`${gwiazdki} z 3 gwiazdek`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= gwiazdki ? s.gwiazdka : s.gwiazdkaPusta} style={{ animationDelay: `${n * 0.3}s` }}>
            ⭐
          </span>
        ))}
      </div>
      <div className={s.przyciskiKonca}>
        <button className={s.przycisk} onClick={onJeszczeRaz}>🔄 Jeszcze raz</button>
        <button className={s.przyciskDrugi} onClick={onInnaGra}>🎮 Inna gra</button>
      </div>
    </div>
  )
}
