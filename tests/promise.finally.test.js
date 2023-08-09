import { Promise } from '../src'

test('finally sync resolve ignore returned value', done => {
  let isTouched = false
  const initialValue = 77
  Promise.resolve(initialValue)
    .finally(() => {
      isTouched = true
      return 88
    })
    .then(value => {
      expect(isTouched).toBe(true)
      expect(value).toBe(initialValue)
      done()
    })
    .catch(error => done(error))
})

test('finally async/await syntax', async () => {
  let isTouched = false
  const initialValue = 77

  try {
    const value = await Promise.resolve(initialValue)
    expect(value).toBe(initialValue)
  } catch (error) {
    throw error
  } finally {
    isTouched = true
  }
  expect(isTouched).toBe(true)
})

test('finally sync resolve ignore returned promise', done => {
  const initialValue = 77
  Promise.resolve(initialValue)
    .finally(() => {
      return Promise.resolve(88)
    })
    .then(value => {
      expect(value).toBe(initialValue)
      done()
    })
    .catch(error => done(error))
})

test('finally sync reject ignore returned value', done => {
  let isTouched = false
  const initialValue = 77
  const initialError = new Error('error')
  Promise.reject(initialError)
    .finally(() => {
      isTouched = true
      return initialValue
    })
    .catch(error => {
      expect(isTouched).toBe(true)
      expect(error).toBe(initialError)
    })
    .then(value => {
      expect(value).toBe(undefined)
      done()
    })
    .catch(error => done(error))
})

test('finally sync reject handle new error via throw', done => {
  const [errorOne, errorTwo] = [new Error('error'), new Error('error2')]
  Promise.reject(errorOne)
    .finally(() => {
      throw errorTwo
    })
    .catch(error => {
      expect(error).toBe(errorTwo)
      done()
    })
    .catch(error => done(error))
})

test('finally sync reject handle new error via promise that reject', done => {
  const [errorOne, errorTwo] = [new Error('error'), new Error('error2')]
  Promise.reject(errorOne)
    .finally(() => Promise.reject(errorTwo))
    .catch(error => {
      expect(error).toBe(errorTwo)
      done()
    })
    .catch(error => done(error))
})
