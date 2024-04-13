// priority: 1000

/**
 * Returns a random number in the range [low, high)
 * @param {number} low
 * @param {number=} high
 * @returns {number}
 */
const randRange = (low, high) => {
  if (high === undefined) {
    high = low
    low = 0
  }
  return Math.random() * (high - low) + low
}

// Wrapper to define a utility function in the given RecipeEvent context that
// wraps the shaped/shapeless recipe definitions to redefine a recipe for
// a given item.
const redefineRecipe_ = (e) => {
  // Overrides shaped/shapeless recipes for a given output
  return (output, shape, keys) => {
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    // 3-argument shaped recipe
    if (keys !== undefined) {
      // Remove keys that aren't present in the shape specification, make a copy
      // of the key arguments to prevent mutating the input JSON object.
      const joined = shape.join('')
      let keyCopy = Object.assign({}, keys)
      for (const key in keyCopy) {
        if (!joined.includes(key)) {
          delete keyCopy[key]
        }
      }
      return e.shaped(output, shape, keyCopy)
    } else {
      // 2-argument shapeless recipe
      return e.shapeless(output, shape)
    }
  }
}

const redefineMechanismRecipe_ = (e) => {
  // Redefines the recipe for 'output' as
  // A TOP A
  // M MID M
  // A BOT A
  // where A = air, M = given mechanism, and
  // TOP, MID, BOT are the respective arguments
  return (mechanism) => {
    return (output, top, middle, bottom) => {
      const id = output.replace(/^[0-9]+x /, '')
      e.remove({ output: id })
      return e.shaped(
        output,
        [
          ' T ', //
          'ZMZ', //
          ' B ', //
        ],
        {
          T: top,
          M: middle,
          B: bottom,
          Z: mechanism,
        }
      )
    }
  }
}

const redefineEnchantingRecipe_ = (e) => {
  // Recipes using the Ars Nouveau enchanting apparatus.
  return (output, inputs, reagent, source, keepReagentNbt) => {
    source = source === undefined ? 0 : source
    keepReagentNbt = keepReagentNbt === undefined ? true : false
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    e.recipes.ars_nouveau.enchanting_apparatus(
      inputs,
      reagent,
      output,
      source,
      keepReagentNbt
    )
  }
}

/**
 *
 * @param {Object} o
 * @param {string} key
 * @param {Object} value
 * @returns {boolean}
 */
const setIfValid = (o, key, value) => {
  if (value === null) return false
  if (o[key] !== undefined) throw new Error(`Key ${key} is already set on ${o}`)
  o[key] = value
  return true
}
