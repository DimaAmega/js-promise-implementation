import PROMISE_STATES from '../src/configs/promise-states'
import Promise from '../src'

test('finally sync resolve ignore returned value', () => {
  let isTouched = false
  const value = 77
  const promise = new Promise(resolve => resolve(value)).finally(() => {
    isTouched = true
    return 88
  })

  expect(isTouched).toBe(true)
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toBe(value)
})

test('finally sync resolve ignore returned promise', () => {
  const value = 77
  const promise = new Promise(resolve => resolve(value)).finally(() => {
    return new Promise(resolve => resolve(88))
  })

  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toBe(value)
})

test('finally sync reject ignore returned value', () => {
  let isTouched = false
  const value = 77
  const error = 'error'
  const promise = new Promise((resolve, reject) => reject(error)).finally(
    () => {
      isTouched = true
      return value
    },
  )

  expect(isTouched).toBe(true)
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error)
  expect(promise.value).toBe(undefined)
})

test('finally sync reject handle new error via throw', () => {
  const [error, error2] = ['error', 'error2']
  const promise = new Promise((resolve, reject) => reject(error)).finally(
    () => {
      throw error2
    },
  )

  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error2)
  expect(promise.value).toBe(undefined)
})

test('finally sync reject handle new error via promise that reject', () => {
  const [error, error2] = ['error', 'error2']
  const promise = new Promise((resolve, reject) => reject(error)).finally(
    () => new Promise((resolve, reject) => reject(error2)),
  )

  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error2)
  expect(promise.value).toBe(undefined)
})
