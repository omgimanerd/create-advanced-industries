// priority: 1000

// Utility methods for functional programming

/**
 * @param {dev.latvian.mods.kubejs.recipe.RecipesEventJS} e
 * @param {Function} fn
 * @returns {Function}
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
 * @param {Internal.RecipesEventJS} e
 * @param {Function} constructor
 * @returns {Function}
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
