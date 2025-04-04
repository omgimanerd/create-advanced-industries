// priority: 0

// Duplicate fluids or ones removed by the modpack.
const hiddenFluids = [
  'cofh_core:experience',
  'cofh_core:honey',
  'cofh_core:potion',
  'createarmory:molten_brass',
  'create_things_and_misc:diluted_bonemeal',
  'pneumaticcraft:oil',
  'pneumaticcraft:memory_essence',
  'pneumaticcraft:vegetable_oil',
  'sophisticatedcore:xp_still',
  'thermal:creosote',
  'thermal:crude_oil',
  'thermal:heavy_oil',
  'thermal:light_oil',
  'thermal:refined_fuel',
  'tfmg:liquid_plastic',
  'tfmg:gasoline',
  'tfmg:diesel',
  'tfmg:kerosene',
  'tfmg:naphtha',
  'tfmg:heavy_oil',
  'tfmg:liquid_concrete',
  'tfmg:lubrication_oil',
]

JEIEvents.addItems((e) => {
  e.add('apotheosis:ancient_material')
  e.add('create:chromatic_compound')
  e.add('create:crushed_raw_aluminum')
  e.add('create:refined_radiance')
  e.add('create:shadow_steel')
  e.add('thermal:drill_head')
  e.add('thermal:saw_blade')
  e.add('vintageimprovements:refined_radiance_rod')
  e.add('vintageimprovements:refined_radiance_sheet')
  e.add('vintageimprovements:shadow_steel_sheet')
})

JEIEvents.hideItems((e) => {
  // Hide all the buckets for unused fluids.
  hiddenFluids.forEach((fluid) => {
    e.hide(`${fluid}_bucket`)
  })

  // Hide intermediate sequenced assembly items.
  e.hide('kubejs:incomplete_kinetic_mechanism')
  e.hide('kubejs:incomplete_copper_mechanism')
  e.hide('kubejs:incomplete_source_mechanism')
  e.hide('kubejs:incomplete_logistics_mechanism')
  e.hide('kubejs:incomplete_crystalline_mechanism')
  e.hide('kubejs:incomplete_quantum_chip')
  e.hide('kubejs:incomplete_quantum_mechanism')
  e.hide('kubejs:incomplete_creative_mechanism')

  e.hide('kubejs:intermediate_transistor')
  e.hide('kubejs:intermediate_capacitor')
  e.hide('kubejs:intermediate_pneumatic_cylinder')
  e.hide('kubejs:unfinished_sigil_of_socketing')
  e.hide('kubejs:unfinished_sigil_of_withdrawal')
  e.hide('kubejs:unfinished_sigil_of_rebirth')
  e.hide('kubejs:unfinished_sigil_of_enhancement')
  e.hide('kubejs:unfinished_sigil_of_unnaming')
  e.hide('kubejs:incomplete_totem_body')
  e.hide('kubejs:incomplete_totem_head')

  e.hide('compressedcreativity:incomplete_mesh_splashing')

  // Hide the colored Refined Storage items. Dark blue is the default.
  const colors = [
    'white',
    'orange',
    'magenta',
    'yellow',
    'lime',
    'pink',
    'gray',
    'light_gray',
    'cyan',
    'purple',
    'blue',
    'brown',
    'green',
    'red',
    'black',
  ]
  e.hide(new RegExp(`refinedstorage:(${colors.join('|')}).*`))
})

JEIEvents.addFluids((e) => {
  // Add the Create awkward potion so custom brewing recipes can be looked up.
  e.add(
    Fluid.of('create:potion').withNBT({
      Bottle: 'REGULAR',
      Potion: 'minecraft:awkward',
    })
  )
  e.add('create_central_kitchen:dragon_breath')
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

// Multiple iterations through all recipe types is inefficient, but the code
// is more readable.
JEIAddedEvents.onRuntimeAvailable((e) => {
  const { recipeManager, jeiHelpers } = e.data

  // Hide all recipes generated by custom sequenced assembly past the first
  // loop. They may not necessarily all be of type create:sequenced_assembly
  // but their IDs all end in _hidejei
  jeiHelpers.allRecipeTypes.forEach((recipeType) => {
    const recipesToHide = recipeManager
      .createRecipeLookup(recipeType)
      .get()
      .filter((recipe) => {
        return (
          recipe.getId !== undefined &&
          recipe.getId().toString().endsWith('_hidejei')
        )
      })
      .toList()
    recipeManager.hideRecipes(recipeType, recipesToHide)
  })

  // Hide all anvilling recipes for Soulbound and Reactive enchantments since
  // they apply to all items and clog JEI.
  recipeManager.hideRecipes(
    'minecraft:anvil',
    recipeManager
      .createRecipeLookup('minecraft:anvil')
      .get()
      .filter((recipe) => {
        for (let input of recipe.getRightInputs()) {
          if (
            input.id === 'minecraft:enchanted_book' &&
            (input.enchantments.containsKey('ars_elemental:soulbound') ||
              input.enchantments.containsKey('ars_nouveau:reactive'))
          ) {
            return true
          }
        }
        return false
      })
      .toList()
  )
})
