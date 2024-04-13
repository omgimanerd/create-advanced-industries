// priority: 900

// Rolling recipe from Create Crafts & Additions
const createRolling = (e, output, input) => {
  const base = {
    type: 'createaddition:rolling',
  }
  if (!setIfValid(base, 'input', Parser.parseItemInput(input))) {
    throw new Error(`Invalid input ${input}`)
  }
  if (!setIfValid(base, 'output', Parser.parseItemOutput(output))) {
    throw new Error(`Invalid output ${output}`)
  }
  return e.custom(base)
}

// Energiser recipes from Create: New Age
const createEnergising = (e, output, input, energyNeeded) => {
  const base = {
    type: 'create_new_age:energising',
    // https://gitlab.com/antarcticgardens/create-new-age
    // JSON recipe key changed in latest dev branch to 'energyNeeded' instead of
    // 'energy_needed'
    energy_needed: energyNeeded !== undefined ? energyNeeded : 1000,
    ingredients: [],
    results: [],
  }
  input = Parser.parseItemInput(input)
  if (input === null) throw new Error(`Invalid input ${input}`)
  base.ingredients.push(input)
  output = Parser.parseItemOutput(output)
  if (output === null) throw new Error(`Invalid output ${output}`)
  base.results.push(output)
  return e.custom(base)
}

// Mechanical extruder recipes from Create Mechanical Extruder
const createExtruding = (e, output, inputs, catalyst) => {
  const base = {
    type: 'create_mechanical_extruder:extruding',
    ingredients: [],
  }
  if (!Array.isArray(inputs) || inputs.length != 2) {
    throw new Error(`Two inputs are required: ${inputs}`)
  }
  for (const input of inputs) {
    let itemInput = Parser.parseItemInput(input)
    if (itemInput !== null) {
      base.ingredients.push(itemInput)
      continue
    }
    let fluidInput = Parser.parseFluidInput(input)
    if (fluidInput !== null) {
      base.ingredients.push(fluidInput)
      continue
    }
    throw new Error(`Unknown input ${input}`)
  }
  const itemOutput = Parser.parseItemOutput(output)
  if (!setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${output}`)
  }
  const catalystItem = Parser.parseItemInput(catalyst)
  setIfValid(base, 'catalyst', catalystItem)

  return e.custom(base)
}

const defineCreateRecipes = (e) => {
  return {
    compacting: e.recipes.create.compacting,
    crushing: e.recipes.create.crushing,
    cutting: e.recipes.create.cutting,
    deploying: e.recipes.create.deploying,
    emptying: e.recipes.create.emptying,
    filling: e.recipes.create.filling,
    haunting: e.recipes.create.haunting,
    item_application: e.recipes.create.item_application,
    mechanical_crafting: e.recipes.create.mechanical_crafting,
    milling: e.recipes.create.milling,
    mixing: e.recipes.create.mixing,
    pressing: e.recipes.create.pressing,
    sandpaper_polishing: e.recipes.create.sandpaper_polishing,
    sequenced_assembly: e.recipes.create.sequenced_assembly,
    splashing: e.recipes.create.splashing,

    // Helpers
    SequencedAssembly: getConstructorWrapper(e, SequencedAssembly),

    // Addons
    rolling: getPartialApplication(e, createRolling),
    energising: getPartialApplication(e, createEnergising),
    extruding: getPartialApplication(e, createExtruding),
  }
}
