import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraProps } from '../App'
import { Obrazek } from '../components/Obrazek'
import { efekt, powiedz } from '../logic/dzwiek'
import { gwiazdki, wybierzSlowka } from '../logic/losowanie'
import { BladMikrofonu, sluchaj, type Sluchanie } from '../logic/mikrofon'
import { ocenWymowe } from '../logic/wymowa'
import { Kropki } from './Quiz'
import s from './gry.module.css'
import ui from '../components/ui.module.css'

const PYTANIA = 8

type Stan =
  | { typ: 'czeka' }
  | { typ: 'slucha' }
  | { typ: 'dobrze' }
  | { typ: 'prawie'; uslyszane: string }
  | { typ: 'zle'; uslyszane: string }
  | { typ: 'cisza' }
  | { typ: 'podpowiedz' }
  | { typ: 'blad'; bezZgody: boolean }

/** Polskie słówko na ekranie, Nadia mówi je po angielsku do mikrofonu i może poprawiać wymowę. */
export function Mow({ slowka, postep, onOdpowiedz, onKoniec }: GraProps) {
  // pytania losowane raz na grę
  const pytania = useMemo(() => wybierzSlowka(slowka, PYTANIA, postep), [])
  const [nr, setNr] = useState(0)
  const [stan, setStan] = useState<Stan>({ typ: 'czeka' })
  const [trafione, setTrafione] = useState(0)
  // pomyłka albo podpowiedź przy tym słówku — liczy się tylko pierwsza próba
  const [pomylka, setPomylka] = useState(false)
  const sluchanie = useRef<Sluchanie>(undefined)

  const slowko = pytania[nr]

  useEffect(() => {
    powiedz(slowko.pl, 'pl')
  }, [slowko])

  // wyjście z gry w trakcie słuchania wyłącza mikrofon
  useEffect(() => () => sluchanie.current?.przerwij(), [])

  const zaliczPomylke = () => {
    if (!pomylka) onOdpowiedz(slowko.en, false)
    setPomylka(true)
  }

  const nastepne = (wynik: number) => {
    if (nr + 1 === pytania.length) return onKoniec(gwiazdki(wynik, pytania.length))
    setNr(nr + 1)
    setStan({ typ: 'czeka' })
    setPomylka(false)
  }

  const mow = async () => {
    if (stan.typ === 'slucha' || stan.typ === 'dobrze') return
    setStan({ typ: 'slucha' })
    const nowe = sluchaj()
    sluchanie.current = nowe
    let wersje: string[]
    try {
      wersje = await nowe.wynik
    } catch (e) {
      const kod = e instanceof BladMikrofonu ? e.kod : ''
      setStan({ typ: 'blad', bezZgody: kod === 'not-allowed' || kod === 'service-not-allowed' })
      return
    }
    if (wersje.length === 0) return setStan({ typ: 'cisza' })
    const { ocena, uslyszane } = ocenWymowe(slowko.en, wersje)
    if (ocena !== 'dobrze') {
      efekt.jeszczeRaz()
      zaliczPomylke()
      setStan({ typ: ocena, uslyszane })
      // po pomyłce Nadia słyszy, jak to powiedzieć
      setTimeout(() => powiedz(slowko.en), 600)
      return
    }
    efekt.dobrze()
    powiedz(slowko.en)
    if (!pomylka) onOdpowiedz(slowko.en, true)
    const wynik = trafione + (pomylka ? 0 : 1)
    setTrafione(wynik)
    setStan({ typ: 'dobrze' })
    setTimeout(() => nastepne(wynik), 1500)
  }

  const podpowiedz = () => {
    zaliczPomylke()
    setStan({ typ: 'podpowiedz' })
    powiedz(slowko.en)
  }

  const widacOdpowiedz = stan.typ === 'dobrze' || stan.typ === 'prawie' || stan.typ === 'zle' || stan.typ === 'podpowiedz'
  const moznaDalej = stan.typ !== 'czeka' && stan.typ !== 'slucha' && stan.typ !== 'dobrze'

  return (
    <div className={s.gra}>
      <Kropki ile={pytania.length} nr={nr} />
      <p className={s.polecenie}>
        Powiedz po angielsku
        <button className={s.glosnikMaly} onClick={() => powiedz(slowko.pl, 'pl')} aria-label="Posłuchaj po polsku">
          🔊
        </button>
      </p>
      <div className={s.pytanieCzytaj}>
        {slowko.emoji && <Obrazek slowko={slowko} />}
        <span className={s.slowoPl}>{slowko.pl}</span>
      </div>

      <button
        className={`${s.glosnik} ${stan.typ === 'slucha' ? s.mikrofonSlucha : ''}`}
        onClick={mow}
        disabled={stan.typ === 'dobrze'}
        aria-label="Mów do mikrofonu"
      >
        🎤
      </button>

      <div className={s.komunikat} aria-live="polite">
        <Komunikat stan={stan} />
        {widacOdpowiedz && (
          <button className={`${s.odpowiedzMow} ${stan.typ === 'dobrze' ? s.dobra : ''}`} onClick={() => powiedz(slowko.en)}>
            <b className={s.slowoEn}>{slowko.en}</b> 🔊
          </button>
        )}
      </div>

      <div className={ui.przyciskiKonca}>
        {(stan.typ === 'czeka' || stan.typ === 'cisza' || stan.typ === 'prawie' || stan.typ === 'zle') && (
          <button className={ui.przyciskDrugi} onClick={podpowiedz}>
            💡 Podpowiedź
          </button>
        )}
        {moznaDalej && (
          <button className={ui.przycisk} onClick={() => nastepne(trafione)}>
            Dalej ➜
          </button>
        )}
      </div>
    </div>
  )
}

function Komunikat({ stan }: { stan: Stan }) {
  switch (stan.typ) {
    case 'czeka':
      return <p className={s.info}>Dotknij mikrofonu i powiedz słówko</p>
    case 'slucha':
      return <p className={s.info}>Słucham… 👂</p>
    case 'dobrze':
      return <p className={s.polecenie}>Super! 🎉</p>
    case 'prawie':
      return (
        <p className={s.info}>
          Prawie! Mikrofon usłyszał „{stan.uslyszane}”. Posłuchaj i spróbuj jeszcze raz:
        </p>
      )
    case 'zle':
      return (
        <p className={s.info}>
          Mikrofon usłyszał „{stan.uslyszane}”. Po angielsku to — posłuchaj i powtórz:
        </p>
      )
    case 'cisza':
      return <p className={s.info}>Mikrofon nic nie usłyszał. Dotknij mikrofonu i powiedz głośniej 🙂</p>
    case 'podpowiedz':
      return <p className={s.info}>Posłuchaj i powtórz do mikrofonu:</p>
    case 'blad':
      return (
        <p className={s.info}>
          {stan.bezZgody
            ? 'Mikrofon jest wyłączony. Pozwól na mikrofon w ustawieniach przeglądarki.'
            : 'Coś nie zadziałało. Sprawdź internet i spróbuj jeszcze raz.'}
        </p>
      )
  }
}
