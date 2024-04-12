// priority: 1000

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

const getPartialApplication = (e, fn) => {
  return function () {
    const args = [e]
    for (const arg of arguments) {
      args.push(arg)
    }
    return fn.apply(null, args)
  }
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
    SequencedAssembly: (input) => {
      return new SequencedAssembly(e, input)
    },

    // Addons
    rolling: getPartialApplication(e, createRolling),
    energising: getPartialApplication(e, createEnergising),
  }
}
