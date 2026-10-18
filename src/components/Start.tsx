import { useRef, useState } from 'react'
import { kartki } from '../data/lekcje'
import { najlepszyWynik, type Postep } from '../logic/postep'
import { PanelRodzica } from './PanelRodzica'
import { StatusEgzaminu } from './StatusEgzaminu'
import s from './ui.module.css'

type Props = { postep: Postep; onWybierz: (id: string) => void; onWyczysc: () => void }

export function Start({ postep, onWybierz, onWyczysc }: Props) {
  const [panel, setPanel] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // Panel rodzica: przytrzymaj tytuł przez 1,5 s.
  const start = () => (timer.current = window.setTimeout(() => setPanel(true), 1500))
  const stop = () => window.clearTimeout(timer.current)
  const najlepszy = (id: string) => najlepszyWynik(postep, id, 'sluchanie')?.procent

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
      {kartki.map((k) => (
        <section key={k.id}>
          <div className={s.siatkaLekcji}>
            <button className={`${s.kafel} ${s.kafelKartka}`} onClick={() => onWybierz(k.id)}>
              <span className={s.kafelNr}>Lekcja {k.nr}</span>
              <span className={s.kafelEmoji}>{k.emoji}</span>
              {k.nazwa}
              <span className={s.kafelLiczba}>{k.slowka.length} słówek z kartki</span>
              <StatusEgzaminu procent={najlepszy(k.id)} />
            </button>
          </div>
          <h2 className={s.podtytul}>Dodatkowe do lekcji {k.nr}</h2>
          <div className={s.siatkaLekcji}>
            {k.rozszerzenia.map((l) => (
              <button key={l.id} className={s.kafel} onClick={() => onWybierz(l.id)}>
                <span className={s.kafelEmoji}>{l.emoji}</span>
                {l.nazwa}
                <span className={s.kafelLiczba}>{l.slowka.length} słówek</span>
                <StatusEgzaminu procent={najlepszy(l.id)} />
              </button>
            ))}
          </div>
        </section>
      ))}
      <h2 className={s.podtytul}>Powtórka</h2>
      <div className={s.siatkaLekcji}>
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
