// priority: 1000

/**
 * Splits a given ID by the colon delimiter to return the item name without
 * the mod prefix.
 *
 * @param {string} s
 * @returns {string}
 */
const getNameFromId = (s) => {
  const parts = s.split(':')
  if (parts.length !== 2) throw new Error(`Invalid item ${s}`)
  return parts[1]
}

/**
 * Generates a list of 3-length arrays containing all the relative coordinates
 * within the given relative coordinate offset object.
 *
 * @param {object} o An object with min/max X,Y,Z relative bounds specified.
 * @returns {(number[])[]}
 */
const getOffsetList = (o) => {
  const minX = o.minX === undefined ? 0 : o.minX
  const maxX = o.maxX === undefined ? o.minX + 1 : o.maxX
  const minY = o.minY === undefined ? 0 : o.minY
  const maxY = o.maxY === undefined ? o.minY + 1 : o.maxY
  const minZ = o.minZ === undefined ? 0 : o.minZ
  const maxZ = o.maxZ === undefined ? o.minZ + 1 : o.maxZ

  const offsetList = []
  for (const x = minX; x <= maxX; x++) {
    for (const y = minY; y <= maxY; y++) {
      for (const z = minZ; z <= maxZ; z++) {
        offsetList.push([x, y, z])
      }
    }
  }
  return offsetList
}

/**
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.Direction|string} direction
 */
const getSameDirectionBlock = (block, direction) => {
  switch (direction) {
    case 'north':
      return block.north
    case 'south':
      return block.south
    case 'east':
      return block.east
    case 'west':
      return block.west
    case 'up':
      return block.up
    case 'down':
      return block.down
    default:
      throw new Error(`Unknown direction ${direction}`)
  }
}

/**
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.Direction|string} direction
 */
const getOppositeDirectionBlock = (block, direction) => {
  switch (direction) {
    case 'north':
      return block.south
    case 'south':
      return block.north
    case 'east':
      return block.west
    case 'west':
      return block.east
    case 'up':
      return block.down
    case 'down':
      return block.up
    default:
      throw new Error(`Unknown direction ${direction}`)
  }
}

/**
 * @param {Internal.BlockContainerJS} block
 */
const getSurroundingBlocks = (block) => {
  return [
    block.up,
    block.down,
    block.north,
    block.south,
    block.east,
    block.west,
  ]
}

/**
 * Returns a random element from the given array, or null if the array is empty.
 * @param {any[]} l
 * @returns {?any}
 */
const choice = (l) => {
  if (l.length === 0) return null
  return l[randRangeInt(0, l.length)]
}

/**
 * For shaped recipes, the passed key object must only include keys used in the
 * pattern. For ease of use, a shared key object is used for multiple recipe
 * remappings, so this helper returns a copy of the key object with all the
 * keys that are not present in the pattern removed.
 * @param {string[]} pattern Crafting pattern
 * @param {Object<string,string>} keys Item mapping for the crafting pattern.
 */
const removeUnusedKeys = (pattern, keys) => {
  const chars = new Set()
  for (const c of pattern.join('')) {
    chars.add(c)
  }
  const newKeys = {}
  for (const [key, value] of Object.entries(keys)) {
    if (chars.has(key)) {
      newKeys[key] = value
    }
  }
  return newKeys
}

/**
 * Wrapper to define a utility function in the given RecipesEventJS context that
 * wraps the shaped/shapeless recipe definitions to redefine a recipe for
 * a given item.
 * @param {Internal.RecipesEventJS} e
 * @returns
 */
const redefineRecipe_ = (e) => {
  // Overrides shaped/shapeless recipes for a given output
  return (output, shape, keys) => {
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    // 3-argument shaped recipe
    if (keys !== undefined) {
      const keyCopy = removeUnusedKeys(shape, keys)
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
    keepReagentNbt = !!keepReagentNbt
    const id = output.replace(/^[0-9]+x /, '')
    e.remove({ output: id })
    e.recipes.ars_nouveau
      .enchanting_apparatus(inputs, reagent, output, source, keepReagentNbt)
      .id(`kubejs:custom_ars_nouveau_enchanting_${getNameFromId(output)}`)
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

/**
 * @param {Internal.Potion} potionId
 * @param {number} quantity
 * @return {Internal.FluidStackJS}
 */
const potionFluid = (
  /** @type {Internal.Potion} */ potionId,
  /** @type {number} */ quantity
) => {
  return Fluid.of('create:potion', quantity).withNBT({ Potion: potionId })
}

/**
 * @param {Internal.Enchantment_} enchantment
 * @param {number} level
 * @return {Internal.Ingredient}
 */
const enchantedBook = (enchantment, level) => {
  return Item.of('minecraft:enchanted_book')
    .enchant(enchantment, level)
    .weakNBT()
}
