import { useState } from 'react'
import { lekcje, nazwaLekcji, wszystkieSlowka } from '../data/lekcje'
import { PROG_ZALICZENIA } from '../logic/egzamin'
import { najlepszyWynik, poziom, trudneSlowka, type Postep } from '../logic/postep'
import { firebaseConfig } from '../firebaseConfig'
import { Konto } from './Konto'
import s from './ui.module.css'

type Props = { postep: Postep; onZamknij: () => void; onWyczysc: () => void }

const HISTORIA = 20

export function PanelRodzica({ postep, onZamknij, onWyczysc }: Props) {
  const [potwierdz, setPotwierdz] = useState(false)
  const trudne = trudneSlowka(postep)
  const pl = (en: string) => wszystkieSlowka.find((w) => w.en === en)?.pl ?? ''
  const cwiczone = Object.keys(postep.slowka).length
  const historia = [...postep.egzaminy].reverse().slice(0, HISTORIA)
  const kiedy = (data: string) =>
    new Date(data).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={s.tloModala} onClick={onZamknij}>
      <section className={s.modal} onClick={(e) => e.stopPropagation()} aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <ul className={s.statystyki}>
          <li>Poziom (zdane egzaminy): <b>{poziom(postep)}</b> z {lekcje.length}</li>
          <li>Rozegrane gry: <b>{postep.gry}</b></li>
          <li>Zebrane gwiazdki: <b>{postep.gwiazdki}</b></li>
          <li>Ćwiczone słówka: <b>{cwiczone}</b> z {wszystkieSlowka.length}</li>
          <li>Ostatnio: <b>{postep.ostatnio ?? '—'}</b></li>
        </ul>
        {firebaseConfig && (
          <>
            <h3>Baza danych</h3>
            <Konto config={firebaseConfig} />
          </>
        )}
        <h3>Egzaminy ze słuchu</h3>
        <table className={s.tabela}>
          <thead>
            <tr><th>Lekcja</th><th>Najlepszy</th><th>Podejścia</th></tr>
          </thead>
          <tbody>
            {lekcje.map((l) => {
              const najlepszy = najlepszyWynik(postep, l.id, 'sluchanie')
              const podejscia = postep.egzaminy.filter((e) => e.lekcjaId === l.id).length
              return (
                <tr key={l.id}>
                  <td>{nazwaLekcji(l.id)}</td>
                  <td>
                    {najlepszy ? `${najlepszy.procent >= PROG_ZALICZENIA ? '✅' : '❌'} ${najlepszy.procent}%` : '—'}
                  </td>
                  <td>{podejscia}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h3>Ostatnie podejścia</h3>
        {historia.length === 0 ? (
          <p>Jeszcze nie było egzaminu.</p>
        ) : (
          <table className={s.tabela}>
            <thead>
              <tr><th>Kiedy</th><th>Lekcja</th><th>Wynik</th><th>Błędy</th></tr>
            </thead>
            <tbody>
              {historia.map((e) => (
                <tr key={e.data}>
                  <td>{kiedy(e.data)}</td>
                  <td>{nazwaLekcji(e.lekcjaId)}</td>
                  <td>{e.procent}% <span className={s.szary}>({e.trafione}/{e.wszystkie})</span></td>
                  <td className={s.szary}>{e.bledy.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
