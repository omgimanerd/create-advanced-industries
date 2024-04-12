// priority: 1000

// Utilities for parsing string input into JSON for custom datapack recipes.

const Parser = {}

/**
 * Example valid inputs:
 *   #minecraft:logs
 *   3x minecraft:oak_log
 *   4x #minecraft:logs
 */
Parser.ITEM_REGEX = /^(([0-9]+)x )*([#]*)([a-z_]+:[a-z_]+)$/
/**
 * Example valid inputs:
 *   100mb #forge:gasoline
 *   200mb pneumaticcraft:plastic
 */
Parser.FLUID_REGEX = /^(([0-9]+)mb )([#]*)([a-z_]+:[a-z_]+)$/

/**
 * @param {String} s
 * @returns {Object|null}
 */
Parser.parseStackedItemInput = (s) => {
  if (typeof s !== 'string') return null

  const m = s.match(Parser.ITEM_REGEX)
  if (m === null || m.length != 5) return null

  const output = {}

  const tag = m[3]
  const id = m[4]
  if (tag !== '') {
    output.tag = id
  } else {
    output.item = id
  }

  const quantity = parseInt(m[2], 10)
  if (!isNaN(quantity)) {
    output.count = quantity
  }

  return output
}

/**
 * @param {String} s
 * @returns {Object|null}
 */
Parser.parseItemInput = (s) => {
  const g = Parser.parseStackedItemInput(s)
  if (g === null) return null
  if (g.count !== undefined) {
    throw new Error(`Single item input cannot have a quantity: ${s}`)
  }
  return g
}

/**
 * @param {String} s
 * @returns {Object|null}
 */
Parser.parseItemOutput = (s) => {
  const g = Parser.parseStackedItemInput(s)
  if (g === null) return null
  if (g.tag !== undefined) {
    throw new Error(`Output item cannot have a tag: ${s}`)
  }
  return g
}

/**
 * @param {String} s
 * @returns {Object|null}
 */
Parser.parseFluidInput = (s) => {
  if (typeof s !== 'string') return null

  const m = s.match(Parser.FLUID_REGEX)
  if (m === null || m.length != 5) return null

  const quantity = parseInt(m[2], 10)
  if (isNaN(quantity)) return null

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

/**
 * @param {String} s
 * @returns {Object|null}
 */
Parser.parseFluidOutput = (s) => {
  const g = Parser.parseFluidInput(s)
  if (g === null) return null
  if (g.tag !== undefined) {
    throw new Error(`Output fluid cannot have a tag: ${s}`)
  }
  return g
}
