// priority: 1000

const createRolling = (e, output, input) => {
  if (typeof output !== 'string') throw new Error(`Invalid output ${output}`)
  if (typeof input !== 'string') throw new Error(`Invalid input ${input}`)
  const base = {
    type: 'createaddition:rolling',
    input: {},
    result: {},
  }
  if (input.startsWith('#')) {
    base.input.tag = input.substring(1)
  } else {
    base.input.item = input
  }
  // TODO refactor this into general utils
  base.result = PneumaticcraftUtils.parseItemOutput(output)
  if (base.result === null) throw new Error(`Invalid output ${output}`)
  return e.custom(base)
}

// createEnergising = (e, output, input) => {}

const getPartialApplication = (e, fn) => {
  return function () {
    const args = [e]
    for (const arg of arguments) {
      args.push(arg)
    }
    return fn.apply(null, args)
  }
}

const defineCreateAddonRecipes = (e) => {
  const recipes = {
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

    // Addons
    rolling: getPartialApplication(e, createRolling),
  }

  e.recipes.create = recipes
}
