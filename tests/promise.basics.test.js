import ERRORS from '../src/configs/errors'
import PROMISE_STATES from '../src/configs/promise-states'
import Promise from '../src'

test('Promise have to throw exception if callback missed', () => {
  expect(() => new Promise()).toThrow(ERRORS.missedCallback)
})

test('Promise have to throw exception if callback is not a function', () => {
  expect(() => {
    const args = ['string', new Error('error'), {}, Number(123), []]
    args.map(arg => new Promise(arg))
  }).toThrow(ERRORS.missedCallback)
})

test('Promise have to not throw exception if callback is passed', () => {
  expect(() => new Promise(() => {})).not.toThrow(ERRORS.missedCallback)
})

test('Promise should be in pending state initially', () => {
  const promise = new Promise(() => {})
  expect(promise.state).toBe(PROMISE_STATES.Pending)
})
