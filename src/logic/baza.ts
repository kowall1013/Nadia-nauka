// Postęp w Firebase Firestore: jeden dokument `postep/{uid}` na konto rodzica.
// Pamięć przeglądarki zostaje jako kopia — gra startuje od razu i działa offline,
// a Firestore sam wysyła zaległe zapisy, gdy wróci internet.

import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type Auth } from 'firebase/auth'
import {
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  setDoc,
  type Firestore,
} from 'firebase/firestore'
import { magazynLokalny, migruj, scal, type Magazyn } from './magazyn'
import type { Postep } from './postep'

type Baza = { auth: Auth; db: Firestore }

let baza: Baza | undefined

function polacz(config: FirebaseOptions): Baza {
  if (baza) return baza
  const app = initializeApp(config)
  baza = {
    auth: getAuth(app),
    db: initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      ignoreUndefinedProperties: true,
    }),
  }
  return baza
}

const dokument = (db: Firestore, uid: string) => doc(db, 'postep', uid)
const takiSam = (a: Postep, b: Postep) => JSON.stringify(a) === JSON.stringify(b)

/** Magazyn z bazą: zapisuje lokalnie i — gdy rodzic jest zalogowany — do Firestore. */
export function magazynZBaza(config: FirebaseOptions): Magazyn {
  const { auth, db } = polacz(config)
  const lokalny = magazynLokalny()
  let uid: string | undefined
  // dopóki pierwszy odczyt z bazy nie scali postępu, nie nadpisujemy bazy samym tabletem
  let scalone = false

  const wyslij = (p: Postep) => {
    if (!uid) return
    setDoc(dokument(db, uid), p).catch((e) => console.warn('[baza] zapis się nie udał', e))
  }

  return {
    wczytaj: () => lokalny.wczytaj(),
    zapisz(p) {
      lokalny.zapisz(p)
      if (scalone) wyslij(p)
    },
    subskrybuj(sluchacz) {
      let stopDokument = () => {}
      const stopKonto = onAuthStateChanged(auth, (user) => {
        stopDokument()
        uid = user?.uid
        scalone = false
        if (!user) return
        stopDokument = onSnapshot(
          dokument(db, user.uid),
          (snap) => {
            const zBazy = snap.exists() ? migruj(snap.data()) : undefined
            let p: Postep
            if (!scalone) {
              // pierwsze połączenie: łączymy to, co tablet zebrał bez bazy, z tym, co w bazie
              p = zBazy ? scal(lokalny.wczytaj(), zBazy) : lokalny.wczytaj()
              scalone = true
              if (!zBazy || !takiSam(p, zBazy)) wyslij(p)
            } else {
              p = zBazy ?? lokalny.wczytaj()
            }
            lokalny.zapisz(p)
            sluchacz(p)
          },
          (e) => console.warn('[baza] odczyt się nie udał', e),
        )
      })
      return () => {
        stopKonto()
        stopDokument()
      }
    },
  }
}

export type StanKonta = { email: string } | null

export function obserwujKonto(config: FirebaseOptions, f: (konto: StanKonta) => void): () => void {
  return onAuthStateChanged(polacz(config).auth, (u) => f(u ? { email: u.email ?? '' } : null))
}

export async function zaloguj(config: FirebaseOptions, email: string, haslo: string): Promise<void> {
  await signInWithEmailAndPassword(polacz(config).auth, email, haslo)
}

export async function wyloguj(config: FirebaseOptions): Promise<void> {
  await signOut(polacz(config).auth)
}
