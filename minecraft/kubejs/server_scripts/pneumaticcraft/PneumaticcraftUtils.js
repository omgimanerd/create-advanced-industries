// priority: 900

// Utilities for parsing inputs into the Pneumaticcraft custom recipe wrappers.
let PneumaticcraftUtils = {}

PneumaticcraftUtils.LOG_DEBUG_OUTPUT = false

PneumaticcraftUtils.ITEM_REGEX = /^(([0-9]+)x )*([#]*)([a-z_]+:[a-z_]+)$/
PneumaticcraftUtils.FLUID_REGEX = /^(([0-9]+)mb )([#]*)([a-z_]+:[a-z_]+)$/

PneumaticcraftUtils.parseStackedItemInput = (s) => {
  if (typeof s !== 'string') return null

  const m = s.match(PneumaticcraftUtils.ITEM_REGEX)
  if (m === null || m.length != 5) return null

  let output = {}

  const tag = m[3]
  const id = m[4]
  if (tag !== '') {
    output.tag = id
  } else {
    output.item = id
  }

  const quantity = parseInt(m[2], 10)
  if (!isNaN(quantity)) {
    output.type = 'pneumaticcraft:stacked_item'
    output.count = quantity
  }

  return output
}

PneumaticcraftUtils.parseItemInput = (s) => {
  const g = PneumaticcraftUtils.parseStackedItemInput(s)
  if (g === null) return null
  if (g.count !== undefined) {
    throw new Error(`Single item input cannot have a quantity: ${s}`)
  }
  return g
}

PneumaticcraftUtils.parseItemOutput = (s) => {
  const g = PneumaticcraftUtils.parseStackedItemInput(s)
  if (g === null) return null
  if (g.tag !== undefined) {
    throw new Error(`Output item cannot have a tag: ${s}`)
  }
  delete g.type
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
