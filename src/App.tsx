import { useState } from 'react'
import { nazwaLekcji, wszystkieSlowka, znajdzLekcje, type Slowko } from './data/lekcje'
import {
  najlepszyWynik,
  poziom,
  pustyPostep,
  wczytaj,
  zapisz,
  zapiszEgzamin,
  zapiszGre,
  zapiszOdpowiedz,
  type Postep,
  type WynikEgzaminu as Wynik,
} from './logic/postep'
import { ocenEgzamin } from './logic/egzamin'
import { Pasek } from './components/Pasek'
import { Start } from './components/Start'
import { WyborGry } from './components/WyborGry'
import { Koniec } from './components/Koniec'
import { Memory } from './games/Memory'
import { Quiz } from './games/Quiz'
import { Balony } from './games/Balony'
import { Egzamin } from './games/Egzamin'
import { WynikEgzaminu } from './components/WynikEgzaminu'

export type Gra = 'memory-obrazek' | 'memory-polski' | 'quiz-sluchaj' | 'quiz-czytaj' | 'balony'

export type GraProps = {
  slowka: Slowko[]
  postep: Postep
  onOdpowiedz: (en: string, dobrze: boolean) => void
  onKoniec: (gwiazdki: number) => void
}

type Wybor = { id: string; nazwa: string; slowka: Slowko[] }

type Ekran =
  | { typ: 'start' }
  | { typ: 'wybor'; wybor: Wybor }
  | { typ: 'gra'; wybor: Wybor; gra: Gra; runda: number }
  | { typ: 'koniec'; wybor: Wybor; gra: Gra; gwiazdki: number }
  | { typ: 'egzamin'; wybor: Wybor; runda: number }
  | { typ: 'wynikEgzaminu'; wybor: Wybor; wynik: Wynik; poprzedniNajlepszy?: number }

export function wyborLekcji(id: string): Wybor {
  if (id === 'wszystkie') return { id, nazwa: 'Wszystkie słówka', slowka: wszystkieSlowka }
  return { id, nazwa: nazwaLekcji(id), slowka: znajdzLekcje(id)!.slowka }
}

const teraz = () => new Date().toISOString()
const dzis = () => teraz().slice(0, 10)

export function App() {
  const [ekran, setEkran] = useState<Ekran>({ typ: 'start' })
  const [postep, setPostep] = useState<Postep>(wczytaj)

  const aktualizuj = (f: (p: Postep) => Postep) =>
    setPostep((p) => {
      const nowy = f(p)
      zapisz(nowy)
      return nowy
    })

  const graj = (wybor: Wybor, gra: Gra) => setEkran({ typ: 'gra', wybor, gra, runda: Date.now() })
  const egzamin = (wybor: Wybor) => setEkran({ typ: 'egzamin', wybor, runda: Date.now() })
  const zapiszWynikOdpowiedzi = (en: string, dobrze: boolean) => aktualizuj((p) => zapiszOdpowiedz(p, en, dobrze))

  let tresc
  switch (ekran.typ) {
    case 'start':
      tresc = (
        <Start
          postep={postep}
          onWybierz={(id) => setEkran({ typ: 'wybor', wybor: wyborLekcji(id) })}
          onWyczysc={() => aktualizuj(pustyPostep)}
        />
      )
      break
    case 'wybor':
      tresc = (
        <WyborGry
          nazwa={ekran.wybor.nazwa}
          slowka={ekran.wybor.slowka}
          onGraj={(g) => graj(ekran.wybor, g)}
          najlepszyEgzamin={najlepszyWynik(postep, ekran.wybor.id, 'sluchanie')?.procent}
          // powtórka wszystkich słówek to nie lekcja — bez egzaminu
          onEgzamin={ekran.wybor.id === 'wszystkie' ? undefined : () => egzamin(ekran.wybor)}
        />
      )
      break
    case 'gra': {
      const props: GraProps = {
        slowka: ekran.wybor.slowka,
        postep,
        onOdpowiedz: zapiszWynikOdpowiedzi,
        onKoniec: (gwiazdki) => {
          aktualizuj((p) => zapiszGre(p, gwiazdki, dzis()))
          setEkran({ typ: 'koniec', wybor: ekran.wybor, gra: ekran.gra, gwiazdki })
        },
      }
      const g = ekran.gra
      tresc =
        g === 'memory-obrazek' || g === 'memory-polski' ? (
          <Memory key={ekran.runda} {...props} tryb={g === 'memory-obrazek' ? 'obrazek' : 'polski'} />
        ) : g === 'quiz-sluchaj' || g === 'quiz-czytaj' ? (
          <Quiz key={ekran.runda} {...props} tryb={g === 'quiz-sluchaj' ? 'sluchaj' : 'czytaj'} />
        ) : (
          <Balony key={ekran.runda} {...props} />
        )
      break
    }
    case 'koniec':
      tresc = (
        <Koniec
          gwiazdki={ekran.gwiazdki}
          onJeszczeRaz={() => graj(ekran.wybor, ekran.gra)}
          onInnaGra={() => setEkran({ typ: 'wybor', wybor: ekran.wybor })}
        />
      )
      break
    case 'egzamin': {
      const { wybor } = ekran
      tresc = (
        <Egzamin
          key={ekran.runda}
          slowka={wybor.slowka}
          onOdpowiedz={zapiszWynikOdpowiedzi}
          onKoniec={(odpowiedzi) => {
            const { zdany: _, ...ocena } = ocenEgzamin(odpowiedzi)
            const wynik: Wynik = { lekcjaId: wybor.id, typ: 'sluchanie', ...ocena, data: teraz() }
            const poprzedniNajlepszy = najlepszyWynik(postep, wybor.id, 'sluchanie')?.procent
            aktualizuj((p) => zapiszEgzamin(p, wynik))
            setEkran({ typ: 'wynikEgzaminu', wybor, wynik, poprzedniNajlepszy })
          }}
        />
      )
      break
    }
    case 'wynikEgzaminu':
      tresc = (
        <WynikEgzaminu
          wynik={ekran.wynik}
          poprzedniNajlepszy={ekran.poprzedniNajlepszy}
          slowka={ekran.wybor.slowka}
          onPopraw={() => egzamin(ekran.wybor)}
          onWroc={() => setEkran({ typ: 'wybor', wybor: ekran.wybor })}
        />
      )
      break
  }

  const wstecz =
    ekran.typ === 'start'
      ? undefined
      : ekran.typ === 'wybor'
        ? () => setEkran({ typ: 'start' })
        : () => setEkran({ typ: 'wybor', wybor: ekran.wybor })

  return (
    <>
      <Pasek onWstecz={wstecz} gwiazdki={postep.gwiazdki} poziom={poziom(postep)} />
      <main>{tresc}</main>
    </>
  )
}
