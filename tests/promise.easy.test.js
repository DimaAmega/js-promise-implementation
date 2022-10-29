import PROMISE_STATES from '../src/configs/promise-states'
import Promise from '../src'

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

test('Promise with no async cb have to be in fulfilled state', () => {
  const promise = Promise.resolve(123)
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toEqual(123)
})

test('Promise with no async cb have to be in rejected state', () => {
  const error = new Error('rejected')
  const promise = Promise.reject(error)
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error)
  expect(promise.value).toEqual(undefined)
})

test('Promise with no async cb but with explicit exception have \
      to be in rejected state', () => {
  const error = new Error('rejected')
  let promise = undefined

  expect(() => {
    promise = new Promise(() => {
      throw error
    })
  }).not.toThrow(error)

  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toEqual(error)
})

test('Promise with no async cb have to be in fulfilled state\
      with specific value', () => {
  const values = [12, 'string', {}, []]
  values.forEach(value => {
    const promise = Promise.resolve(value)
    expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
    expect(promise.value).toEqual(value)
  })
})
