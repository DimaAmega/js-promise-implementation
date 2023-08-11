import ERRORS from '../src/configs/errors'
import PROMISE_STATES from '../src/configs/promise-states'
import { Promise } from '../src'

const testIf = condition => (condition ? test : test.skip)

test('Promise have to throw exception if callback missed', () => {
  expect(() => new Promise()).toThrow(ERRORS.missedCallback())
})

test('Promise have to not throw exception if callback is passed', () => {
  expect(() => new Promise(() => {})).not.toThrow(ERRORS.missedCallback())
})

test.each(['string', new Error('error'), {}, 123, []])(
  'Promise have to throw exception if callback is %p',
  arg => expect(() => new Promise(arg)).toThrow(ERRORS.missedCallback(arg)),
)

testIf(Promise.__custom)('Promise must be in pending state initially', () => {
  const promise = new Promise(() => {})
  expect(promise.state).toBe(PROMISE_STATES.Pending)
})
