import ERRORS from '../configs/errors'
import PROMISE_STATES from '../configs/promise-states.js'

export default () =>
  class Promise {
    constructor(cb) {
      if (cb == undefined || typeof cb !== 'function') {
        throw new Error(ERRORS.missedCallback)
      }
      this.waiters = []
      this.state = PROMISE_STATES.Pending
      // invoke te callback
      try {
        cb(this.#resolveFunction.bind(this), this.#rejectFunction.bind(this))
      } catch (error) {
        this.#rejectFunction(error)
      }
    }

    #serveWaiters() {
      switch (this.state) {
        case PROMISE_STATES.Pending:
          return
        case PROMISE_STATES.Fulfilled:
        case PROMISE_STATES.Rejected:
          for (const waiter of this.waiters) {
            const { onFulfilledCb, resolve, onRejectedCb, reject } = waiter

            let [value, cb] = Array(2).fill()

            if (this.state == PROMISE_STATES.Fulfilled) {
              cb = onFulfilledCb
              value = this.value
            }
            if (this.state == PROMISE_STATES.Rejected) {
              cb = onRejectedCb
              value = this.error
            }

            if (!cb) {
              if (this.state == PROMISE_STATES.Fulfilled) {
                resolve(this.value)
              }
              if (this.state == PROMISE_STATES.Rejected) {
                reject(this.error)
              }
              continue
            }

            let valueOrPromise = undefined
            try {
              valueOrPromise = cb(value)
            } catch (error) {
              reject(error)
              continue
            }
            if (valueOrPromise instanceof Promise) {
              valueOrPromise.then(
                result => resolve(result),
                error => reject(error),
              )
            } else {
              const clearValue = valueOrPromise
              resolve(clearValue)
            }
          }
          this.waiters = []
          break
        default:
          throw new Error(ERRORS.unknownStage)
      }
    }

    #resolveFunction(value) {
      this.value = value
      this.state = PROMISE_STATES.Fulfilled
      this.#serveWaiters()
    }

    #rejectFunction(error) {
      this.error = error
      this.state = PROMISE_STATES.Rejected
      this.#serveWaiters()
    }

    then(onFulfilledCb, onRejectedCb) {
      return new Promise((resolve, reject) => {
        this.waiters.push({ onFulfilledCb, onRejectedCb, reject, resolve })
        this.#serveWaiters()
      })
    }

    catch(onRejectedCb) {
      return this.then(null, onRejectedCb)
    }
  }
