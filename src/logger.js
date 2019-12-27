function logger(debug) {
    return debug
      ? console
      : Object.keys(console).reduce(
          (obj, method) => ({ ...obj, [method]: () => {} }),
          {},
        );
  }

module.exports = logger;
