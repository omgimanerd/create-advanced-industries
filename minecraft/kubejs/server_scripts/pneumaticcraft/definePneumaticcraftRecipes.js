// priority: 500

// Helper to define the special custom shaped recipe formats used by
// Pneumaticcraft
const shapedSpecial = (e, type, output, pattern, keys) => {
  const allowedTypes = {
    'pneumaticcraft:compressor_upgrade_crafting': true,
    'pneumaticcraft:crafting_shaped_no_mirror': true,
    'pneumaticcraft:crafting_shaped_pressurizable': true,
  }
  if (!(type in allowedTypes)) throw new Error(`Unknown type ${type}`)
  const base = {
    type: type,
    category: 'misc',
    pattern: pattern,
    key: {},
  }
  const keysInPattern = pattern.join('')
  for (const [key, item] of Object.entries(keys)) {
    if (!keysInPattern.includes(key)) continue
    let parsedItem = Parser.parseItemInput(item)
    if (!setIfValid(base.key, key, parsedItem)) {
      throw new Error(`Invalid keys: ${keys}`)
    }
  }
  const outputItem = Parser.parseItemOutput(output)
  if (!setIfValid(base, 'result', outputItem)) {
    throw new Error(`Invalid output ${output}`)
  }

  return e.custom(base)
}

/**
 * @param {Internal.RecipesEventJS} e
 * @returns
 */
const definePneumaticcraftRecipes = (e) => {
  return {
    /**
     * @param {string} input
     * @returns {Refinery}
     */
    Refinery: getConstructorWrapper(e, Refinery),
    /**
     * @param {string|string[]} inputs
     * @returns {ThermoPlant}
     */
    ThermoPlant: getConstructorWrapper(e, ThermoPlant),
    /**
     * @param {string} type
     * @param {string} output
     * @param {string[]} pattern
     * @param {Object<string, string>} output
     */
    shapedSpecial: getPartialApplication(e, shapedSpecial),
  }
}
