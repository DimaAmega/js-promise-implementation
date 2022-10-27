import PROMISE_STATES from '../src/configs/promise-states'
import PromiseImpl from '../src'

test('Promise have to invoke callback immediately', async () => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const delay = 100
  const promise = new PromiseImpl(resolve => setTimeout(resolve, delay, delay))
  expect(promise.state).toBe(PROMISE_STATES.Pending)

  await sleep(delay)
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toBe(delay)
})

test('Then is the promise', () => {
  const promise = new PromiseImpl(() => {}).then(() => {})
  expect(promise).toBeInstanceOf(PromiseImpl)
})

test('Promise sync invoke then and fulfilled', () => {
  const result = 200
  const promise = new PromiseImpl(resolve => resolve(result))
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toBe(result)
  const newPromise = promise.then(value => 2 * value)
  expect(newPromise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(newPromise.value).toBe(2 * result)
})

test('Promise sync invoke then and rejected', () => {
  const initialError = new Error('error')
  const promise = new PromiseImpl((resolve, reject) => reject(initialError))
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.value).toBe(undefined)
  expect(promise.error).toBe(initialError)

  let [isOnRejectedInvoked, isOnFulfilledInvoked] = [false, false]
  const newPromise = promise.then(
    () => (isOnFulfilledInvoked = true),
    error => {
      isOnRejectedInvoked = true
      expect(error).toBe(initialError)
    },
  )

  expect(isOnFulfilledInvoked).toBe(false)
  expect(isOnRejectedInvoked).toBe(true)
  expect(newPromise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(newPromise.value).toBe(undefined)
  expect(newPromise.error).toBe(undefined)
})

test('Promise async invoke then and fulfilled', done => {
  const delay = 100
  const promise = new PromiseImpl(resolve => setTimeout(resolve, delay, delay))
  expect(promise.state).toBe(PROMISE_STATES.Pending)
  const startTime = new Date()

  const newPromise = promise.then(value => value)
  expect(newPromise.state).toBe(PROMISE_STATES.Pending)

  newPromise
    .then(value => {
      const endTime = new Date()
      expect(endTime - startTime).toBeGreaterThanOrEqual(delay)

      expect(value).toBe(delay)
      expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
      expect(newPromise.state).toBe(PROMISE_STATES.Fulfilled)
      expect(promise.value).toBe(delay)
      expect(newPromise.value).toBe(delay)

      done()
    })
    .catch(error => done(error))
})
