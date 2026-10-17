import { useState } from 'react'
import { wszystkieSlowka } from '../data/lekcje'
import { trudneSlowka, type Postep } from '../logic/postep'
import s from './ui.module.css'

type Props = { postep: Postep; onZamknij: () => void; onWyczysc: () => void }

export function PanelRodzica({ postep, onZamknij, onWyczysc }: Props) {
  const [potwierdz, setPotwierdz] = useState(false)
  const trudne = trudneSlowka(postep)
  const pl = (en: string) => wszystkieSlowka.find((w) => w.en === en)?.pl ?? ''
  const cwiczone = Object.keys(postep.slowka).length

  return (
    <div className={s.tloModala} onClick={onZamknij}>
      <section className={s.modal} onClick={(e) => e.stopPropagation()} aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <ul className={s.statystyki}>
          <li>Rozegrane gry: <b>{postep.gry}</b></li>
          <li>Zebrane gwiazdki: <b>{postep.gwiazdki}</b></li>
          <li>Ćwiczone słówka: <b>{cwiczone}</b> z {wszystkieSlowka.length}</li>
          <li>Ostatnio: <b>{postep.ostatnio ?? '—'}</b></li>
        </ul>
        <h3>Trudne słówka</h3>
        {trudne.length === 0 ? (
          <p>Brak pomyłek. 🎉</p>
        ) : (
          <table className={s.tabela}>
            <thead>
              <tr><th>Słówko</th><th>✅</th><th>❌</th></tr>
            </thead>
            <tbody>
              {trudne.map(([en, st]) => (
                <tr key={en}>
                  <td>{en} <span className={s.szary}>({pl(en)})</span></td>
                  <td>{st.dobrze}</td>
                  <td>{st.zle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className={s.przyciskiModala}>
          <button
            className={s.przyciskDrugi}
            onClick={() => {
              if (!potwierdz) return setPotwierdz(true)
              onWyczysc()
              setPotwierdz(false)
            }}
          >
            {potwierdz ? 'Na pewno? Kliknij jeszcze raz' : 'Wyczyść postęp'}
          </button>
          <button className={s.przycisk} onClick={onZamknij}>Zamknij</button>
        </div>
      </section>
    </div>
  )
}
