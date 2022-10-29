import ERRORS from '../configs/errors'
import PROMISE_STATES from '../configs/promise-states.js'

export default () =>
  class Promise {
    static resolve(value) {
      return new Promise(resolve => resolve(value))
    }

    static reject(error) {
      return new Promise((resolve, reject) => reject(error))
    }

    constructor(cb) {
      if (cb == undefined || typeof cb !== 'function') {
        throw new Error(ERRORS.missedCallback)
      }
      this.waiters = []
      this.state = PROMISE_STATES.Pending
      // invoke the callback
      try {
        cb(this.#resolveFunction.bind(this), this.#rejectFunction.bind(this))
      } catch (error) {
        this.#rejectFunction(error)
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

    ///////////////////////
    //    PUBLIC API
    ///////////////////////
    then(onFulfilledCb, onRejectedCb) {
      return new Promise((resolve, reject) => {
        this.waiters.push({ onFulfilledCb, onRejectedCb, reject, resolve })
        this.#serveWaiters()
      })
    }

    catch(onRejectedCb) {
      return this.then(null, onRejectedCb)
    }

    finally(cb) {
      const throwError = error => {
        throw error
      }

      return this.then(
        value => {
          const cbResult = cb()
          if (cbResult instanceof Promise) {
            return cbResult.then(() => value, throwError)
          }
          return value
        },
        error => {
          const cbResult = cb()
          if (cbResult instanceof Promise) {
            return cbResult.then(() => throwError(error), throwError)
          }
          throw error
        },
      )
    }
  }
