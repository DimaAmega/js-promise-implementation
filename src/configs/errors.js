const ERRORS = {
  missedCallback: cb =>
    `Promise resolver ${
      cb instanceof Error
        ? cb.toString()
        : Array.isArray(cb)
        ? `[object Array]`
        : cb instanceof Object
        ? `#<Object>`
        : cb && cb.toString && cb.toString()
    } is not a function`,
}

export default ERRORS
