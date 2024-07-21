// priority: 500
// Recipe registrations for metal casting and melting for all the registrations
// in startup_scripts/metallurgy.js

ServerEvents.tags('item', (e) => {
  const tagMaterialIngot = (material, mod) => {
    e.add('forge:ingots', `${mod}:${material}_ingot`)
    e.add(`forge:ingots/${material}`, `${mod}:${material}_ingot`)
  }

  // Untagged ingots
  tagMaterialIngot('industrial_iron', 'createdeco')
  tagMaterialIngot('red_alloy', 'morered')
  tagMaterialIngot('void_steel', 'createutilities')
  tagMaterialIngot('andesite', 'create')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  global.metallurgy.meltable_items.forEach((i) => {
    i.registerMeltingRecipes(e)
      .registerCastingRecipes(e)
      .registerWashedCastRecipes(e)
      .registerDustCrushingRecipes(e)
  })

  // Manually register melting recipes for all glass types
  create.mixing(Fluid.of('kubejs:molten_glass', 360), '#forge:glass').heated()

  // Better melting recipe for sand into glass
  create
    .mixing(Fluid.of('kubejs:molten_glass', 450), '#minecraft:smelts_to_glass')
    .heated()

  // A full block is casted from molten glass instead of a glass shard.
  // Register this manually so we don't need to add edge cases to MeltableItem.
  const ceramicCastedMoltenGlass = 'kubejs:ceramic_ingot_cast_molten_glass'
  const steelCastedMoltenGlass = 'kubejs:steel_ingot_cast_molten_glass'
  const MeltableItem = global.MeltableItem
  create.filling(ceramicCastedMoltenGlass, [
    Fluid.of('kubejs:molten_glass', MeltableItem.DEFAULT_INGOT_FLUID * 4),
    MeltableItem.CERAMIC_INGOT_CAST,
  ])
  create.filling(steelCastedMoltenGlass, [
    Fluid.of('kubejs:molten_glass', MeltableItem.DEFAULT_INGOT_FLUID * 4),
    MeltableItem.STEEL_INGOT_CAST,
  ])
  create.splashing(
    [
      'minecraft:glass',
      Item.of(MeltableItem.CERAMIC_INGOT_CAST).withChance(
        MeltableItem.CERAMIC_CAST_RETURN_CHANCE
      ),
    ],
    ceramicCastedMoltenGlass
  )
  create.splashing(
    ['minecraft:glass', MeltableItem.STEEL_INGOT_CAST],
    steelCastedMoltenGlass
  )

  // Add crushing recipes for items not overhauled by metallurgy.
  const ingotDustMap = {
    'thermal:ruby': 'thermal:ruby_dust',
    'thermal:sapphire': 'thermal:sapphire_dust',
    'thermal:apatite': 'thermal:apatite_dust',
    'thermal:cinnabar': 'thermal:cinnabar_dust',
    'thermal:niter': 'thermal:niter_dust',
    // Sulfur dust overhauled in chapter 5a
    'minecraft:netherite_ingot': 'thermal:netherite_dust',
  }
  for (const [ingot, dust] of Object.entries(ingotDustMap)) {
    create.milling(dust, ingot)
  }

  // Register all metallic alloying recipes, and remove the custom blend
  // crafting.
  global.materials
    .filter((v) => {
      return v.type === global.MATERIAL_TYPE_ALLOY_METAL && v.alloyRatios
    })
    .forEach((/** @type {Material} */ v) => {
      const { dust, fluid, superheated, alloyRatios, pressurizingCatalyst } = v
      if (dust) {
        // Only remove shapeless crafting recipes where a dust existed. Brass
        // does not a dust, and this will remove all shapeless recipes if
        // dust is undefined.
        e.remove({ type: 'minecraft:crafting_shapeless', output: dust })
      }
      let totalFluidOutput = 0
      const ingredients = Object.entries(alloyRatios).map((e) => {
        totalFluidOutput += e[1] * MeltableItem.DEFAULT_INGOT_FLUID
        return Fluid.of(e[0], e[1] * MeltableItem.DEFAULT_INGOT_FLUID)
      })
      const fluidOutput = Fluid.of(fluid, totalFluidOutput)
      if (pressurizingCatalyst !== undefined) {
        let secondaryFluidInput = Fluid.of(
          pressurizingCatalyst[0],
          pressurizingCatalyst[1] * MeltableItem.DEFAULT_INGOT_FLUID
        )
        let pressurizingRecipe = create
          .pressurizing(ingredients)
          .secondaryFluidInput(secondaryFluidInput)
        if (superheated) {
          pressurizingRecipe.superheated()
        } else {
          pressurizingRecipe.heated()
        }
        pressurizingRecipe.outputs(fluidOutput)
      } else {
        let mixingRecipe = create.mixing(fluidOutput, ingredients)
        if (superheated) {
          mixingRecipe.superheated()
        } else {
          mixingRecipe.heated()
        }
      }
    })

  // Slag melting and solidication.
  e.remove({ id: 'tfmg:mixing/slag' })
  create
    .mixing(
      Fluid.of('tfmg:molten_slag', MeltableItem.DEFAULT_INGOT_FLUID),
      'thermal:slag'
    )
    .heated()
  create.compacting(
    'thermal:slag',
    Fluid.of('tfmg:molten_slag', MeltableItem.DEFAULT_INGOT_FLUID)
  )
  create
    .mixing(
      Fluid.of('tfmg:molten_slag', 4 * MeltableItem.DEFAULT_INGOT_FLUID),
      'thermal:slag_block'
    )
    .heated()
  create.compacting(
    'thermal:slag_block',
    Fluid.of('tfmg:molten_slag', 4 * MeltableItem.DEFAULT_INGOT_FLUID)
  )

  // Slag processing as an alternate iron route.
  create
    .mixing(
      [
        Fluid.of('kubejs:molten_iron', 135),
        '2x thermal:slag',
        '2x minecraft:gravel',
        Item.of('thermal:slag', 2).withChance(0.25),
        Item.of('minecraft:gravel', 2).withChance(0.25),
      ],
      Fluid.of('tfmg:molten_slag', 900)
    )
    .heated()

  // TODO rich slag is the only way to get aluminum?
  // TODO Rich slag + liquid = better?
})
