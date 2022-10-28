import PromiseImpl from '../src'

test('Chain rule', done => {
  const sleepGood = ms =>
    new PromiseImpl(resolve => setTimeout(resolve, ms, ms))
  const startDate = new Date()
  const delay = 10
  sleepGood(delay)
    .then(value => {
      expect(value).toBe(delay)
      return sleepGood(2 * value)
    })
    .then(value => {
      expect(value).toBe(2 * delay)
      return sleepGood(2 * value)
    })
    .then(value => {
      expect(value).toBe(4 * delay)
    })
    .then(value => {
      expect(value).toBe(undefined)
      expect(new Date() - startDate).toBeGreaterThanOrEqual(7 * delay)
      done()
    })
    .catch(error => done(error))
})
