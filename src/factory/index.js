import ERRORS from '../configs/errors'
import PROMISE_STATES from '../configs/promise-states.js'

class PromiseImpl {
  static __custom = true
  static resolve(value) {
    return new PromiseImpl(resolve => resolve(value))
  }

  static reject(error) {
    return new PromiseImpl((resolve, reject) => reject(error))
  }

  constructor(cb) {
    if (typeof cb !== 'function') {
      throw new Error(ERRORS.missedCallback(cb))
    }
    this.waiters = []
    this.state = PROMISE_STATES.Pending
    // invoke the callback
    try {
      cb(
        value => this.#resolveFun(value),
        error => this.#rejectFun(error),
      )
    } catch (error) {
      this.#rejectFun(error)
    }
  }

  #resolveFun(value) {
    this.value = value
    this.state = PROMISE_STATES.Fulfilled
    this.#serveWaiters()
  }

  #rejectFun(error) {
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
            if (!cb) {
              resolve(value)
              continue
            }
          }
          if (this.state == PROMISE_STATES.Rejected) {
            cb = onRejectedCb
            value = this.error
            if (!cb) {
              reject(value)
              continue
            }
          }

          let valueOrPromise = undefined
          try {
            valueOrPromise = cb(value)
          } catch (error) {
            reject(error)
            continue
          }
          if (valueOrPromise instanceof PromiseImpl) {
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
    }
  }

  ///////////////////////
  //    PUBLIC API
  ///////////////////////

  then(onFulfilledCb, onRejectedCb) {
    return new PromiseImpl((resolve, reject) => {
      this.waiters.push({ onFulfilledCb, onRejectedCb, reject, resolve })
      queueMicrotask(() => this.#serveWaiters())
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
        if (cbResult instanceof PromiseImpl) {
          return cbResult.then(() => value, throwError)
        }
        return value
      },
      error => {
        const cbResult = cb()
        if (cbResult instanceof PromiseImpl) {
          return cbResult.then(() => throwError(error), throwError)
        }
        throw error
      },
    )
  }
}

export default ({ isUseNativePromises }) =>
  isUseNativePromises ? Promise : PromiseImpl
