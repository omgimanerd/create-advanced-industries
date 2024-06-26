// priority: 1000

/**
 * @param {Internal.RecipesEventJS_} e
 * @param {function} fn
 * @returns {function}
 */
const getPartialApplication = (e, fn) => {
  return function () {
    const args = [e]
    for (const arg of arguments) {
      args.push(arg)
    }
    return fn.apply(null, args)
  }
}

/**
 * Returns a concrete instantiation of the given constructor with the
 * RecipesEventJS context applied as the first argument.
 * @param {Internal.RecipesEventJS_} e
 * @param {function} constructor
 * @returns {function}
 */
const getConstructorWrapper = (e, constructor) => {
  return function () {
    const args = [constructor, e]
    for (const arg of arguments) {
      args.push(arg)
    }
    const newclass = constructor.bind.apply(constructor, args)
    return new newclass()
  }
}
