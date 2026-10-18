import type { FirebaseOptions } from 'firebase/app'

/**
 * Konfiguracja projektu Firebase (Ustawienia projektu → Twoje aplikacje → SDK setup → Config).
 * Te dane nie są tajne — dostęp do bazy chronią reguły z `firestore.rules` i logowanie.
 * `undefined` = bez bazy: postęp tylko w pamięci przeglądarki.
 */
export const firebaseConfig: FirebaseOptions | undefined = {
  apiKey: 'AIzaSyAGrjmnnQKCktR8qQgAoOi9utjDGJ9Joz4',
  authDomain: 'nadia-nauka.firebaseapp.com',
  projectId: 'nadia-nauka',
  storageBucket: 'nadia-nauka.firebasestorage.app',
  messagingSenderId: '301693427205',
  appId: '1:301693427205:web:880d72bd054e5695aa866c',
}
