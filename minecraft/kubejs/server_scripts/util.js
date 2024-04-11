// priority: 1000

// Utilities for parsing inputs into the Pneumaticcraft custom recipe wrappers.
let PneumaticcraftUtils = {}

PneumaticcraftUtils.ITEM_REGEX = /^(([0-9]+)x )*([#]*)([a-z_]+:[a-z_]+)$/
PneumaticcraftUtils.FLUID_REGEX = /^(([0-9]+)mb )([#]*)([a-z_]+:[a-z_]+)$/

PneumaticcraftUtils.parseItemInput = (s) => {
  if (typeof s !== 'string') {
    return null
  }
  const m = s.match(PneumaticcraftUtils.ITEM_REGEX)
  if (m === null || m.length != 5) {
    return null
  }
  let quantity = parseInt(m[2], 10)
  quantity = isNaN(quantity) ? 1 : quantity
  const tag = m[3]
  if (tag !== '') {
    return {
      quantity: quantity,
      tag: m[4],
    }
  }
  return {
    quantity: quantity,
    item: m[4],
  }
}

PneumaticcraftUtils.parseItemOutput = (s) => {
  const g = PneumaticcraftUtils.parseItemInput(s)
  if (g === null) {
    return null
  }
  if (g.tag !== undefined) {
    throw new Error(`Output item cannot have a tag: ${s}`)
  }
  return g
}

PneumaticcraftUtils.parseFluidInput = (s) => {
  if (typeof s !== 'string') {
    return null
  }
  const m = s.match(PneumaticcraftUtils.FLUID_REGEX)
  if (m === null || m.length != 5) {
    return null
  }
  let quantity = parseInt(m[2], 10)
  if (isNaN(quantity)) {
    return null
  }
  const tag = m[3]
  if (tag !== '') {
    return {
      type: 'pneumaticcraft:fluid',
      amount: quantity,
      tag: m[4],
    }
  }
  return {
    type: 'pneumaticcraft:fluid',
    amount: quantity,
    fluid: m[4],
  }
}

PneumaticcraftUtils.parseFluidOutput = (s) => {
  const g = PneumaticcraftUtils.parseFluidInput(s)
  if (g === null) {
    return null
  }
  if (g.tag !== undefined) {
    throw new Error(`Output fluid cannot have a tag: ${s}`)
  }
  return g
}

// Attempts to set the given key to the given value on the custom recipe object
// o. Returns true if successful, false if value is null.
PneumaticcraftUtils.setIfValid = (o, key, value) => {
  if (value === null) {
    return false
  }
  if (o[key] !== undefined) {
    throw new Error(`Key ${key} is already set on ${o}`)
  }
  o[key] = value
  return true
}

// Returns a random number in the range [low, high)
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
      // Remove keys that aren't present in the shape specification
      const joined = shape.join('')
      for (let key in keys) {
        if (!joined.includes(key)) {
          delete keys[key]
        }
      }
      return e.shaped(output, shape, keys)
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
