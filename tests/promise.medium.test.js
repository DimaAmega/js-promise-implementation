import PROMISE_STATES from '../src/configs/promise-states'
import Promise from '../src'

test('Promise have to be in Pending state', async () => {
  const delay = 100
  const promise = new Promise(resolve => setTimeout(resolve, delay, delay))
  expect(promise.state).toBe(PROMISE_STATES.Pending)
})

test('Then is the promise', () => {
  const promise = new Promise(() => {}).then(() => {})
  expect(promise).toBeInstanceOf(Promise)
})

test('Then does not invoked immediately', () => {
  let isInvoked = false
  Promise.resolve().then(() => (isInvoked = true))
  expect(isInvoked).toBe(false)
})

test('Right order of execution', done => {
  const ip = []

  ip.push(1)

  Promise.resolve()
    .then(() => ip.push(3))
    .then(() => {
      ip.push(4)
      expect(ip).toEqual([1, 2, 3, 4])
      done()
    })
    .catch(error => done(error))

  ip.push(2)
})

test('Then does not invoked immediately, but eventually', done => {
  let isInvoked = false
  Promise.resolve()
    .then(() => (isInvoked = true))
    .then(() => {
      expect(isInvoked).toBe(true)
      done()
    })
    .catch(error => done(error))

  expect(isInvoked).toBe(false)
})

test('Catch is works', done => {
  const initialError = new Error('error')
  let catchError = undefined

  Promise.resolve(123)
    .then(() => {
      throw initialError
    })
    .catch(error => {
      catchError = error
    })
    .finally(() => {
      expect(catchError).toBe(initialError)
      done()
    })
})

test('Promise sync invoke then and this promise is pending', done => {
  const result = 200
  const promise = new Promise(resolve => resolve(result))
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toBe(result)
  const newPromise = promise.then(value => 2 * value)
  expect(newPromise.state).toBe(PROMISE_STATES.Pending)
  expect(newPromise.value).toBe(undefined)
  newPromise
    .then(value => {
      expect(value).toBe(2 * result)
      done()
    })
    .catch(error => done(error))
})

test('Promise sync invoke then and then goes right way', done => {
  const initialError = new Error('error')
  const promise = new Promise((resolve, reject) => reject(initialError))
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.value).toBe(undefined)
  expect(promise.error).toBe(initialError)

  let [isOnRejectedInvoked, isOnFulfilledInvoked] = [false, false]
  promise
    .then(
      () => (isOnFulfilledInvoked = true),
      error => {
        isOnRejectedInvoked = true
        expect(error).toBe(initialError)
      },
    )
    .then(() => {
      expect(isOnFulfilledInvoked).toBe(false)
      expect(isOnRejectedInvoked).toBe(true)
      done()
    })
    .catch(error => done(error))
})

test('Promise sync invoke then and rejected but onRejected callback missed', done => {
  const initialError = new Error('error')
  const promise = new Promise((resolve, reject) => reject(initialError))
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.value).toBe(undefined)
  expect(promise.error).toBe(initialError)

  let isOnFulfilledInvoked = false
  promise
    .then(() => (isOnFulfilledInvoked = true))
    .catch(error => expect(error).toBe(initialError))
    .then(() => {
      expect(isOnFulfilledInvoked).toBe(false)
      done()
    })
    .catch(error => done(error))
})

test('Promise async invoke then and fulfilled', done => {
  const delay = 100
  const startTime = new Date()
  const promise = new Promise(resolve => setTimeout(resolve, delay, delay))

  const newPromise = promise.then(value => value)
  expect(newPromise.state).toBe(PROMISE_STATES.Pending)

  newPromise
    .then(value => {
      expect(new Date() - startTime).toBeGreaterThanOrEqual(delay)

      expect(value).toBe(delay)
      expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
      expect(newPromise.state).toBe(PROMISE_STATES.Fulfilled)
      expect(promise.value).toBe(delay)
      expect(newPromise.value).toBe(delay)

      done()
    })
    .catch(error => done(error))
})
