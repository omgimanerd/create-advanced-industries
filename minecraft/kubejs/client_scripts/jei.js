// priority: 0

const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')

// Duplicate fluids or ones removed by the modpack.
const hiddenFluids = [
  'cofh_core:potion',
  'createarmory:molten_brass',
  'create_things_and_misc:diluted_bonemeal',
  'pneumaticcraft:oil',
  'pneumaticcraft:memory_essence',
  'sophisticatedcore:xp_still',
  'thermal:creosote',
  'thermal:crude_oil',
  'thermal:heavy_oil',
  'thermal:light_oil',
  'thermal:refined_fuel',
  'tfmg:liquid_plastic',
  'tfmg:molten_slag',
  'tfmg:gasoline',
  'tfmg:diesel',
  'tfmg:kerosene',
  'tfmg:naphtha',
  'tfmg:heavy_oil',
  'tfmg:lubrication_oil',
  'tfmg:cooling_fluid',
]

JEIEvents.addItems((e) => {
  e.add('thermal:drill_head')
  e.add('thermal:saw_blade')
  e.add('apotheosis:ancient_material')
})

JEIEvents.hideItems((e) => {
  // Defined in startup_scripts/removed_recipes.js
  if (global.hideJEI) {
    global.removedRecipes.forEach((r) => {
      if (r.output) {
        e.hide(r.output)
      }
    })
  }

  // Hide all the buckets for unused fluids.
  hiddenFluids.forEach((fluid) => {
    e.hide(`${fluid}_bucket`)
  })

  // Hide intermediate mechanism items.
  e.hide('kubejs:incomplete_andesite_mechanism')
  e.hide('kubejs:incomplete_copper_mechanism')
  e.hide('kubejs:incomplete_source_mechanism')
})

JEIEvents.addFluids((e) => {
  // Add the Create awkward potion so custom brewing recipes can be looked up.
  e.add(
    Fluid.of('create:potion').withNBT({
      Bottle: 'REGULAR',
      Potion: 'minecraft:awkward',
    })
  )
})

JEIEvents.hideFluids((e) => {
  hiddenFluids.forEach((fluid) => {
    e.hide(fluid)
  })
})

JEIEvents.removeCategories((e) => {
  e.remove('thermal:bottler')
  e.remove('thermal:furnace')
  e.remove('thermal:brewer')
  e.remove('jumbofurnace:jumbo_smelting')
  e.remove('jumbofurnace:jumbo_furnace_upgrade')
})

// JEIAddedEvents.registerCategories((e) => {
// const jeiHelper = e.data.jeiHelpers
// const guiHelper = jeiHelper.guiHelper
// const nutrientInfusionRecipeType = $RecipeType.create(
//   'kubejs',
//   'nutrient_infusion',
//   jeiHelper.getRecipeType('anvil').get().getRecipeClass()
// )
// Register a custom category for Nutrient Infusion enchantment
// TODO: does not work!
// e.register(nutrientInfusionRecipeType, (category) => {
//   category
//     .title('Nutrient Infusion')
//     .icon(
//       guiHelper.createDrawableItemStack('minecraft:enchanted_golden_apple')
//     )
//     .isRecipeHandled(() => true)
// })
// })

JEIAddedEvents.registerRecipes((e) => {
  const { ingredientManager, jeiHelpers, vanillaRecipeFactory } = e.data
  /**
   * @param {Internal.ItemStack} itemStack
   * @param {Internal.List} books
   * @param {Internal.List} results
   * @returns {Internal.IJeiAnvilRecipe}
   */
  const createAnvilRecipe = (itemStack, books, results) => {
    return vanillaRecipeFactory[
      'createAnvilRecipe(net.minecraft.world.item.ItemStack,java.util.List,' +
        'java.util.List)'
    ](itemStack, books, results)
  }

  /**
   * @param {any[]} l
   */
  const wrapList = (l) => {
    l = Array.isArray(l) ? l : [l]
    const r = Utils.newList()
    l.forEach((v) => r.add(v))
    return r
  }

  const nutrientInfusionBooks = wrapList(
    Array(5)
      .fill(null)
      .map((_, i) => {
        return Item.of('minecraft:enchanted_book').enchant(
          'kubejs:nutrient_infusion',
          i + 1
        )
      })
  )
  const getEnchantedFoodResults = (itemStack) => {
    return wrapList(
      Array(5)
        .fill(null)
        .map((_, i) => {
          return itemStack.enchant('kubejs:nutrient_infusion', i + 1)
        })
    )
  }
  let recipes = Utils.newList()
  ingredientManager.allItemStacks
    .stream()
    .filter((itemStack) => {
      return itemStack.isEdible() && itemStack.id !== 'artifacts:eternal_steak'
    })
    .forEach((itemStack) => {
      recipes.add(
        createAnvilRecipe(
          itemStack,
          nutrientInfusionBooks,
          getEnchantedFoodResults(itemStack)
        )
      )
    })
  e.register(jeiHelpers.getRecipeType('anvil').get(), recipes)
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  const $BasinRecipe = Java.loadClass(
    'com.simibubi.create.content.processing.basin.BasinRecipe'
  )
  const basinRecipeType = $RecipeType.create('create', 'mixing', $BasinRecipe)
  const automatedBrewing = $RecipeType.create(
    'create',
    'automatic_brewing',
    $BasinRecipe
  )

  // Move all custom potion brewing recipes from the Create mixer category to
  // Create automated brewing.
  const recipeManager = e.data.getRecipeManager()
  const customBrewingRecipes = Utils.newList()
  recipeManager
    .createRecipeLookup(basinRecipeType)
    .get()
    .forEach((recipe) => {
      if (recipe.getId().toString().startsWith('kubejs:create_potion_mixing')) {
        customBrewingRecipes.add(recipe)
      }
    })
  recipeManager.hideRecipes(basinRecipeType, customBrewingRecipes)
  recipeManager.addRecipes(automatedBrewing, customBrewingRecipes)
})
