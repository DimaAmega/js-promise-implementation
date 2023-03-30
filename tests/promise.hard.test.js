import Promise from '../src'

const sleepGood = ms => new Promise(resolve => setTimeout(resolve, ms, ms))

test('Chain rule', done => {
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

test('Chain rule but async/await', async () => {
  const startDate = new Date()
  const delay = 10

  const d1 = await sleepGood(delay)
  expect(d1).toBe(delay)
  const d2 = await sleepGood(2 * d1)
  expect(d2).toBe(2 * delay)
  const d3 = await sleepGood(2 * d2)
  expect(d3).toBe(4 * delay)
  expect(new Date() - startDate).toBeGreaterThanOrEqual(7 * delay)
})

test('Chain rule 2', done => {
  const delay = 10
  sleepGood(delay)
    .then(value => {
      expect(value).toBe(delay)
      return sleepGood(2 * value)
    })
    .then(value => {
      expect(value).toBe(2 * delay)
      throw 'error'
    })
    .then(() => {
      throw 'error 2'
    })
    .catch(error => {
      expect(error).toBe('error')
      done()
    })
    .catch(error => done(error))
})

test('Chain rule 2 but async/await', async () => {
  try {
    const delay = 10
    const d1 = await sleepGood(delay)
    expect(d1).toBe(delay)
    const d2 = await sleepGood(2 * delay)
    expect(d2).toBe(2 * delay)
    throw 'error'
    throw 'error 2'
  } catch (error) {
    expect(error).toBe('error')
  }
})
