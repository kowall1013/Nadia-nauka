import { describe, expect, it } from 'vitest'
import { normalizuj, ocenWymowe, odleglosc } from './wymowa'

describe('normalizuj', () => {
  it('usuwa wielkie litery, interpunkcję i myślniki', () => {
    expect(normalizuj('  Pencil-Case! ')).toBe('pencil case')
    expect(normalizuj("It's RED.")).toBe("it's red")
  })
})

describe('odleglosc', () => {
  it('liczy zmienione, dodane i usunięte litery', () => {
    expect(odleglosc('long', 'long')).toBe(0)
    expect(odleglosc('long', 'lung')).toBe(1)
    expect(odleglosc('cat', 'cats')).toBe(1)
    expect(odleglosc('', 'abc')).toBe(3)
  })
})

describe('ocenWymowe', () => {
  it('dobrze, gdy usłyszane to dokładnie słówko', () => {
    expect(ocenWymowe('long', ['Long'])).toEqual({ ocena: 'dobrze', uslyszane: 'Long' })
  })

  it('dobrze, gdy słówko jest w dłuższej wypowiedzi', () => {
    expect(ocenWymowe('dog', ['a dog']).ocena).toBe('dobrze')
    expect(ocenWymowe('pencil case', ["it's a pencil case"]).ocena).toBe('dobrze')
  })

  it('dobrze dla słów wieloczłonowych zapisanych razem, osobno lub z myślnikiem', () => {
    expect(ocenWymowe('pencil case', ['pencilcase']).ocena).toBe('dobrze')
    expect(ocenWymowe('firefighter', ['fire fighter']).ocena).toBe('dobrze')
    expect(ocenWymowe('police officer', ['police-officer']).ocena).toBe('dobrze')
  })

  it('dobrze dla słów, które brzmią identycznie', () => {
    expect(ocenWymowe('red', ['read']).ocena).toBe('dobrze')
    expect(ocenWymowe('blue', ['blew']).ocena).toBe('dobrze')
    expect(ocenWymowe('grey', ['gray']).ocena).toBe('dobrze')
  })

  it('wybiera najlepszą z wersji podanych przez rozpoznawanie', () => {
    expect(ocenWymowe('pupil', ['people', 'pupil'])).toEqual({ ocena: 'dobrze', uslyszane: 'pupil' })
  })

  it('prawie, gdy różni się o jedną literę', () => {
    expect(ocenWymowe('long', ['lung'])).toEqual({ ocena: 'prawie', uslyszane: 'lung' })
  })

  it('dla długich słów "prawie" toleruje więcej liter', () => {
    expect(ocenWymowe('astronaut', ['astronot']).ocena).toBe('prawie')
  })

  it('źle, gdy to zupełnie inne słowo', () => {
    expect(ocenWymowe('long', ['short'])).toEqual({ ocena: 'zle', uslyszane: 'short' })
    expect(ocenWymowe('dog', ['pies']).ocena).toBe('zle')
  })

  it('źle, gdy nic nie usłyszano', () => {
    expect(ocenWymowe('dog', [])).toEqual({ ocena: 'zle', uslyszane: '' })
  })
})
