import { useState } from 'react'
import { lekcje, wszystkieSlowka, type Slowko } from './data/lekcje'
import { wczytaj, zapisz, zapiszGre, zapiszOdpowiedz, type Postep } from './logic/postep'
import { Pasek } from './components/Pasek'
import { Start } from './components/Start'
import { WyborGry } from './components/WyborGry'
import { Koniec } from './components/Koniec'
import { Memory } from './games/Memory'
import { Quiz } from './games/Quiz'
import { Balony } from './games/Balony'

export type Gra = 'memory-obrazek' | 'memory-polski' | 'quiz-sluchaj' | 'quiz-czytaj' | 'balony'

export type GraProps = {
  slowka: Slowko[]
  postep: Postep
  onOdpowiedz: (en: string, dobrze: boolean) => void
  onKoniec: (gwiazdki: number) => void
}

type Wybor = { nazwa: string; slowka: Slowko[] }

type Ekran =
  | { typ: 'start' }
  | { typ: 'wybor'; wybor: Wybor }
  | { typ: 'gra'; wybor: Wybor; gra: Gra; runda: number }
  | { typ: 'koniec'; wybor: Wybor; gra: Gra; gwiazdki: number }

export function wyborLekcji(id: string): Wybor {
  if (id === 'wszystkie') return { nazwa: 'Wszystkie słówka', slowka: wszystkieSlowka }
  const l = lekcje.find((x) => x.id === id)!
  return { nazwa: l.nazwa, slowka: l.slowka }
}

const dzis = () => new Date().toISOString().slice(0, 10)

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

  let tresc
  switch (ekran.typ) {
    case 'start':
      tresc = (
        <Start
          postep={postep}
          onWybierz={(id) => setEkran({ typ: 'wybor', wybor: wyborLekcji(id) })}
          onWyczysc={() => aktualizuj(() => ({ slowka: {}, gry: 0, gwiazdki: 0 }))}
        />
      )
      break
    case 'wybor':
      tresc = <WyborGry nazwa={ekran.wybor.nazwa} slowka={ekran.wybor.slowka} onGraj={(g) => graj(ekran.wybor, g)} />
      break
    case 'gra': {
      const props: GraProps = {
        slowka: ekran.wybor.slowka,
        postep,
        onOdpowiedz: (en, dobrze) => aktualizuj((p) => zapiszOdpowiedz(p, en, dobrze)),
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
  }

  const wstecz =
    ekran.typ === 'start'
      ? undefined
      : ekran.typ === 'wybor'
        ? () => setEkran({ typ: 'start' })
        : () => setEkran({ typ: 'wybor', wybor: ekran.wybor })

  return (
    <>
      <Pasek onWstecz={wstecz} gwiazdki={postep.gwiazdki} />
      <main>{tresc}</main>
    </>
  )
}
