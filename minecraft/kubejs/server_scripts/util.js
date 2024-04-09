// priority: 1000

// This file contains wrappers for utility functions to define them within
// the callbacks where they will be used.

const randRange = (low, high) => {
  if (high === undefined) {
    high = low
    low = 0
  }
  return Math.random() * (high - low) + low
}

const redefineRecipe_ = (e) => {
  // Overrides shaped/shapeless recipes for a given output
  return (output, shape, keys) => {
    e.remove({ output: output })
    // 3-argument shaped recipe
    if (keys !== undefined) {
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
      e.remove({ output: output })
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
    e.remove({ output: output })
    e.recipes.ars_nouveau.enchanting_apparatus(
      inputs,
      reagent,
      output,
      source,
      keepReagentNbt
    )
  }
}
