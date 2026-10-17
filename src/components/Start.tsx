import { useRef, useState } from 'react'
import { lekcje } from '../data/lekcje'
import type { Postep } from '../logic/postep'
import { PanelRodzica } from './PanelRodzica'
import s from './ui.module.css'

type Props = { postep: Postep; onWybierz: (id: string) => void; onWyczysc: () => void }

export function Start({ postep, onWybierz, onWyczysc }: Props) {
  const [panel, setPanel] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // Panel rodzica: przytrzymaj tytuł przez 1,5 s.
  const start = () => (timer.current = window.setTimeout(() => setPanel(true), 1500))
  const stop = () => window.clearTimeout(timer.current)

  return (
    <div className={s.ekran}>
      <h1
        className={s.tytul}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        Angielski Nadii
      </h1>
      <p className={s.powitanie}>Cześć, Nadia! 👋 W co dziś zagramy?</p>
      <div className={s.siatkaLekcji}>
        {lekcje.map((l) => (
          <button key={l.id} className={s.kafel} onClick={() => onWybierz(l.id)}>
            <span className={s.kafelEmoji}>{l.emoji}</span>
            {l.nazwa}
            <span className={s.kafelLiczba}>{l.slowka.length} słówek</span>
          </button>
        ))}
        <button className={`${s.kafel} ${s.kafelWszystkie}`} onClick={() => onWybierz('wszystkie')}>
          <span className={s.kafelEmoji}>🔁</span>
          Wszystkie słówka
          <span className={s.kafelLiczba}>powtórka</span>
        </button>
      </div>
      {panel && <PanelRodzica postep={postep} onZamknij={() => setPanel(false)} onWyczysc={onWyczysc} />}
    </div>
  )
}
