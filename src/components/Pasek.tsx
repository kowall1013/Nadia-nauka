import { useState } from 'react'
import { czyWyciszone, ustawWyciszenie } from '../logic/dzwiek'
import s from './ui.module.css'

export function Pasek({ onWstecz, gwiazdki }: { onWstecz?: () => void; gwiazdki: number }) {
  const [wycisz, setWycisz] = useState(czyWyciszone)
  return (
    <header className={s.pasek}>
      {onWstecz ? (
        <button className={s.ikona} onClick={onWstecz} aria-label="Wróć">
          ⬅️
        </button>
      ) : (
        <span className={s.ikonaMiejsce} />
      )}
      <span className={s.licznik} aria-label={`Gwiazdki: ${gwiazdki}`}>
        ⭐ {gwiazdki}
      </span>
      <button
        className={s.ikona}
        aria-label={wycisz ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
        onClick={() => {
          ustawWyciszenie(!wycisz)
          setWycisz(!wycisz)
        }}
      >
        {wycisz ? '🔇' : '🔊'}
      </button>
    </header>
  )
}
