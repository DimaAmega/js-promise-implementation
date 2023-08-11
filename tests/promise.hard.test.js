import { Promise } from '../src'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms, ms))

test('Chain rule', done => {
  const startDate = new Date()
  const delay = 10

  sleep(delay)
    .then(value => {
      expect(value).toBe(delay)
      return sleep(2 * value)
    })
    .then(value => {
      expect(value).toBe(2 * delay)
      return sleep(2 * value)
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

  const d1 = await sleep(delay)
  expect(d1).toBe(delay)
  const d2 = await sleep(2 * d1)
  expect(d2).toBe(2 * delay)
  const d3 = await sleep(2 * d2)
  expect(d3).toBe(4 * delay)
  expect(new Date() - startDate).toBeGreaterThanOrEqual(7 * delay)
})

test('Chain rule with exceptions', done => {
  const delay = 10
  sleep(delay)
    .then(value => {
      expect(value).toBe(delay)
      return sleep(2 * value)
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

test('Chain rule with exceptions but in async/await syntax', async () => {
  try {
    const delay = 10
    const d1 = await sleep(delay)
    expect(d1).toBe(delay)
    const d2 = await sleep(2 * delay)
    expect(d2).toBe(2 * delay)
    throw 'error'
    throw 'error 2'
  } catch (error) {
    expect(error).toBe('error')
  }
})
