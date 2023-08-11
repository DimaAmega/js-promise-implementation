const ERRORS = {
  missedCallback: obj =>
    `Promise resolver ${
      obj instanceof Error
        ? obj.toString()
        : Array.isArray(obj)
        ? `[object Array]`
        : obj instanceof Object
        ? `#<Object>`
        : obj && obj.toString && obj.toString()
    } is not a function`,
}

export default ERRORS
