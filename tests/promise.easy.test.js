import PROMISE_STATES from '../src/configs/promise-states'
import { Promise } from '../src'

const testIf = condition => (condition ? test : test.skip)

test('Promise have to invoke callback immediately', () => {
  let cbInvoked = false
  new Promise(() => (cbInvoked = true))

  expect(cbInvoked).toBe(true)
})

test('Promise have to invoke callback with two args', () => {
  let argsCount = undefined
  new Promise((...args) => (argsCount = args.length))

  expect(argsCount).toEqual(2)
})

test('Promise have to invoke callback with two callbacks', () => {
  let captureArgs = undefined
  new Promise((...args) => (captureArgs = args))

  captureArgs.forEach(arg => expect(typeof arg).toEqual('function'))
})

////////////////////
//   TEST STATES
////////////////////

testIf(Promise.__custom).each([12, 'string', {}, [], () => {}])(
  'Promise with sync cb have to be in fulfilled state \
with value: %p',
  value => {
    const promise = new Promise(resolve => resolve(value))

    expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
    expect(promise.value).toEqual(value)
  },
)

testIf(Promise.__custom)(
  '(static method) Promise with sync cb have to be in fulfilled state',
  () => {
    const promise = Promise.resolve(123)

    expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
    expect(promise.value).toEqual(123)
  },
)

testIf(Promise.__custom)('Promise with cb have to be in rejected state', () => {
  const error = new Error('rejected')
  const promise = new Promise((resolve, reject) => reject(error))

  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error)
  expect(promise.value).toEqual(undefined)
})

testIf(Promise.__custom)(
  '(static method) Promise with sync cb have to be in rejected state',
  () => {
    const error = new Error('rejected')
    const promise = Promise.reject(error)

    expect(promise.state).toBe(PROMISE_STATES.Rejected)
    expect(promise.error).toBe(error)
    expect(promise.value).toEqual(undefined)
  },
)

testIf(Promise.__custom)(
  'Promise with sync cb but with explicit exception have \
      to be in rejected state',
  () => {
    const error = new Error('rejected')
    let promise = undefined

    expect(() => {
      promise = new Promise(() => {
        throw error
      })
    }).not.toThrow(error)

    expect(promise.state).toBe(PROMISE_STATES.Rejected)
    expect(promise.error).toEqual(error)
  },
)
