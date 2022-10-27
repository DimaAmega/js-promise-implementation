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
  const promise = new Promise(resolve => resolve())
  expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
  expect(promise.value).toEqual(undefined)
})

test('Promise with no async cb have to be in rejected state', () => {
  const error = new Error('rejected')
  const promise = new Promise((resolve, reject) => reject(error))
  expect(promise.state).toBe(PROMISE_STATES.Rejected)
  expect(promise.error).toBe(error)
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
  const values = [123, 'string', {}, []]
  values.forEach(value => {
    const promise = new Promise(resolve => resolve(value))
    expect(promise.state).toBe(PROMISE_STATES.Fulfilled)
    expect(promise.value).toEqual(value)
  })
})
