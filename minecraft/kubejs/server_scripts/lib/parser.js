// priority: 1000

// Utilities for parsing string input into JSON for custom datapack recipes.

const Parser = (() => {
  const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

  /**
   * Example valid inputs:
   *   #minecraft:logs
   *   3x minecraft:oak_log
   *   4x #minecraft:logs
   */
  const ITEM_REGEX = /^(([0-9]+)x ){0,1}(#{0,1})([a-z_]+:[a-z_]+)$/

  /**
   * Example valid inputs:
   *   100mb #forge:gasoline
   *   200mb pneumaticcraft:plastic
   */
  const FLUID_REGEX = /^(([0-9]+)mb )(#{0,1})([a-z_]+:[a-z_]+)$/

  /**
   * @param {String} s
   * @returns {object|null}
   */
  const parseAsItem = (s) => {
    if (s === undefined || s === null) return null
    if (s.class === $ItemStack) {
      return JSON.parse(s.toJson())
    }
    if (typeof s === 'object' && !Array.isArray(s) && s !== null) return s
    if (typeof s !== 'string') return null

    const m = s.match(ITEM_REGEX)
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
   * @param {string} s
   * @returns {object|null}
   */
  const parseAsFluid = (s) => {
    if (typeof s === 'object' && !Array.isArray(s) && s !== null) return s
    if (typeof s !== 'string') return null

    const m = s.match(FLUID_REGEX)
    if (m === null || m.length != 5) return null

    const quantity = parseInt(m[2], 10)
    if (isNaN(quantity)) return null

    const tag = m[3]
    if (tag !== '') {
      return {
        amount: quantity,
        tag: m[4],
      }
    }
    return {
      amount: quantity,
      fluid: m[4],
    }
  }

  // Externally exported methods throw an error on failure.

  /**
   * @param {string} s
   * @returns {object}
   */
  const parseStackedItemInput = (s) => {
    const parsedInput = parseAsItem(s)
    if (parsedInput === null) {
      throw new Error(`Unable to parse item input: ${s}`)
    }
    return parsedInput
  }

  /**
   * @param {String} s
   * @returns {object}
   */
  const parseItemInput = (s) => {
    const parsedInput = parseAsItem(s)
    if (parsedInput === null) {
      throw new Error(`Unable to parse item input: ${s}`)
    }
    if (parsedInput.count === 1) delete parsedInput.count
    if (parsedInput.count !== undefined) {
      throw new Error(`Single item input cannot have a quantity: ${s}`)
    }
    return parsedInput
  }

  /**
   * @param {string} s
   * @returns {object}
   */
  const parseItemOutput = (s) => {
    const parsedOutput = parseAsItem(s)
    if (parsedOutput === null) {
      throw new Error(`Unable to parse item output: ${s}`)
    }
    if (parsedOutput.tag !== undefined) {
      throw new Error(`Output item cannot have a tag: ${s}`)
    }
    return parsedOutput
  }

  /**
   * @param {string} s
   * @returns {object}
   */
  const parseFluidInput = (s) => {
    const parsedInput = parseAsFluid(s)
    if (parsedInput === null) {
      throw new Error(`Unable to parse fluid input: ${s}`)
    }
    return parsedInput
  }

  /**
   * @param {String} s
   * @returns {object|null}
   */
  const parseFluidOutput = (s) => {
    const parsedOutput = parseFluidInput(s)
    if (parsedOutput === null) {
      throw new Error(`Unable to parse fluid output: ${s}`)
    }
    if (parsedOutput.tag !== undefined) {
      throw new Error(`Output fluid cannot have a tag: ${s}`)
    }
    return parsedOutput
  }

  /**
   * @param {String} s
   * @returns {object|null}
   */
  const parseItemOrFluidInput = (s) => {
    const itemInputMaybe = parseAsItem(s)
    if (itemInputMaybe !== null) return itemInputMaybe
    const fluidInputMaybe = parseAsFluid(s)
    if (fluidInputMaybe !== null) return fluidInputMaybe
    throw new Error(`Unable to parse item or fluid input: ${s}`)
  }

  const parseItemOrFluidOutput = (s) => {
    const itemOutputMaybe = parseAsItem(s)
    if (itemOutputMaybe !== null) {
      if (itemOutputMaybe.tag !== undefined) {
        throw new Error(`Item output cannot have a tag: ${s}`)
      }
      return itemOutputMaybe
    }
    const fluidOutputMaybe = parseAsFluid(s)
    if (fluidOutputMaybe !== null) {
      if (fluidOutputMaybe.tag !== undefined) {
        throw new Error(`Fluid output cannot have a tag: ${s}`)
      }
      return fluidOutputMaybe
    }
    throw new Error(`Could not parse input: ${s}`)
  }

  /**
   * @param {string[]} arr
   * @param {{maxItems: number?, maxFluids: number?}} options
   * @returns {{items: object[], fluids: object[]}}
   */
  const parseItemOrFluidInputs = (arr, options) => {
    const maxItems =
      options?.maxItems === undefined ? Math.inf : options.maxItems
    const maxFluids =
      options?.maxFluids === undefined ? Math.inf : options.maxFluids
    const obj = {
      items: [],
      fluids: [],
    }
    arr = Array.isArray(arr) ? arr : [arr]
    for (const input of arr) {
      let parsedItemInput = parseAsItem(input)
      if (parsedItemInput !== null) {
        obj.items.push(parsedItemInput)
        continue
      }
      let parsedFluidInput = parseAsFluid(input)
      if (parsedFluidInput !== null) {
        obj.fluids.push(parsedFluidInput)
        continue
      }
      throw new Error(`Could not parse input ${s}`)
    }
    if (obj.items.length > maxItems) {
      throw new Error(`${arr} exceeded ${maxItems} items`)
    }
    if (obj.fluids.length > maxFluids) {
      throw new Error(`${arr} exceeded ${maxFluids} fluids`)
    }
    return obj
  }

  /**
   * @param {string[]} arr
   * @param {{maxItems: number?, maxFluids: number?}} options
   * @returns {{items: object[], fluids: object[]}}
   */
  const parseItemOrFluidOutputs = (arr, options) => {
    const obj = parseItemOrFluidInputs(arr, options)
    for (const item of obj.items) {
      if (item.tag !== undefined) {
        throw new Error(`Output item cannot have a tag: ${s}`)
      }
    }
    for (const fluid of obj.fluids) {
      if (fluid.tag !== undefined) {
        throw new Error(`Output fluid cannot have a tag: ${s}`)
      }
    }
    return obj
  }

  return {
    parseStackedItemInput: parseStackedItemInput,
    parseItemInput: parseItemInput,
    parseItemOutput: parseItemOutput,
    parseFluidInput: parseFluidInput,
    parseFluidOutput: parseFluidOutput,
    parseItemOrFluidInput: parseItemOrFluidInput,
    parseItemOrFluidOutput: parseItemOrFluidOutput,
    parseItemOrFluidInputs: parseItemOrFluidInputs,
    parseItemOrFluidOutputs: parseItemOrFluidOutputs,
  }
})()
