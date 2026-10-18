import { useEffect, useState, type FormEvent } from 'react'
import type { FirebaseOptions } from 'firebase/app'
import { obserwujKonto, wyloguj, zaloguj, type StanKonta } from '../logic/baza'
import s from './ui.module.css'

/** Logowanie rodzica do bazy — raz na urządzeniu, potem postęp synchronizuje się sam. */
export function Konto({ config }: { config: FirebaseOptions }) {
  const [konto, setKonto] = useState<StanKonta | undefined>()
  const [email, setEmail] = useState('')
  const [haslo, setHaslo] = useState('')
  const [blad, setBlad] = useState('')
  const [czekam, setCzekam] = useState(false)

  useEffect(() => obserwujKonto(config, setKonto), [config])

  const wyslij = async (e: FormEvent) => {
    e.preventDefault()
    setBlad('')
    setCzekam(true)
    try {
      await zaloguj(config, email.trim(), haslo)
      setHaslo('')
    } catch {
      setBlad('Nie udało się zalogować — sprawdź e-mail, hasło i internet.')
    } finally {
      setCzekam(false)
    }
  }

  if (konto === undefined) return <p className={s.szary}>Sprawdzam konto…</p>

  if (konto)
    return (
      <p>
        ☁️ Postęp zapisuje się w bazie: <b>{konto.email}</b>{' '}
        <button className={s.link} onClick={() => wyloguj(config)}>
          Wyloguj
        </button>
      </p>
    )

  return (
    <form className={s.formularz} onSubmit={wyslij}>
      <p className={s.szary}>Zaloguj się, żeby postęp trafiał do bazy i był widoczny na Twoim telefonie.</p>
      <input type="email" autoComplete="username" placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input
        type="password"
        autoComplete="current-password"
        placeholder="hasło"
        value={haslo}
        onChange={(e) => setHaslo(e.target.value)}
        required
      />
      {blad && <p className={s.blad}>{blad}</p>}
      <button className={s.przycisk} disabled={czekam}>
        {czekam ? 'Loguję…' : 'Zaloguj'}
      </button>
    </form>
  )
}
