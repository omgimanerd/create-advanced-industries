// priority: 500
// Recipe registrations for automated potion brewing with Create

ServerEvents.recipes((e) => {
  const $PotionBrewing = Java.loadClass(
    'net.minecraft.world.item.alchemy.PotionBrewing'
  )

  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Create automated brewing recipes should be disabled in the Create server
  // config. They cannot be removed with KubeJS.

  /**
   * @param {Internal.Potion_} potionId
   * @param {string} bottle
   * @returns {Internal.FluidStackJS_}
   */
  const getPotionFluid = (potionId, bottle) => {
    if (bottle === undefined) bottle = 'REGULAR'
    if (typeof potionId !== 'string') {
      throw new Error(`Invalid input ${potionId}`)
    }
    if (potionId === 'minecraft:water') return Fluid.water(1000)
    return Fluid.of('create:potion', 1000).withNBT({
      Bottle: bottle,
      Potion: potionId,
    })
  }

  // The resulting recipe id prefixes are important because the JEI client
  // script relies on these to move all the recipes to their dedicated category.
  const MIXING_PREFIX = 'kubejs:create_potion_mixing_'
  const CENTRIFUGING_PREFIX = 'kubejs:create_potion_centrifuging_'

  let recipeNumber = 1

  // Store all the unique potion IDs to generate splash and lingering potions
  // There can be multiple ways to craft any given potion base.
  let uniquePotionIds = {}
  for (const mix of $PotionBrewing.POTION_MIXES) {
    // Register all the potion brewing mixes as mixing recipes.
    let inputFluidString = new String(mix.from.key().location().toString())
    let inputItems = mix.ingredient.getItemIds()
    if (inputItems.size() !== 1) {
      throw new Error(`Invalid item ingredient ${inputItems}`)
    }
    let outputFluidString = new String(mix.to.key().location().toString())
    let outputId = outputFluidString.replace(/[^a-z_]/, '_')
    let outputPotionFluid = getPotionFluid(outputFluidString)
    create
      .mixing(outputPotionFluid, [
        getPotionFluid(inputFluidString),
        inputItems[0],
      ])
      .heated()
      .id(`${MIXING_PREFIX}${recipeNumber}_${outputId}`)

    // Add a centrifuging recipe to recycle unused potions if we have not
    // done so already.
    if (!uniquePotionIds[outputFluidString]) {
      create
        .centrifuging(
          [Fluid.water(1000), 'kubejs:inert_potion_residue'],
          [outputPotionFluid]
        )
        .minimalRPM(196)
        .id(`${CENTRIFUGING_PREFIX}${recipeNumber}_${outputId}`)
    }

    // Store all the unique potion types
    uniquePotionIds[inputFluidString] = true
    uniquePotionIds[outputFluidString] = true

    recipeNumber += 1
  }

  // Register splash and lingering version of each potion type
  const typeMap = [
    { from: 'REGULAR', to: 'SPLASH', ingredient: 'minecraft:gunpowder' },
    {
      from: 'SPLASH',
      to: 'LINGERING',
      ingredient: Fluid.of('create_central_kitchen:dragon_breath', 250),
    },
  ]
  for (const potionId in uniquePotionIds) {
    // Don't make splash and lingering potions of water.
    if (potionId === 'minecraft:water') {
      continue
    }
    let outputId = potionId.replace(/[^a-z_]/, '_')
    for (const { from, to, ingredient } of typeMap) {
      let suffix = to.toLowerCase()
      let outputPotionFluid = getPotionFluid(potionId, to)
      create
        .mixing(outputPotionFluid, [getPotionFluid(potionId, from), ingredient])
        .heated()
        .id(`kubejs:create_potion_mixing_${recipeNumber}_${outputId}_${suffix}`)
      recipeNumber += 1

      // Add a centrifuging recipe to recycle unused potions.
      create
        .centrifuging(
          [Fluid.water(1000), 'kubejs:inert_potion_residue'],
          [outputPotionFluid]
        )
        .minimalRPM(196)
        .id(`${CENTRIFUGING_PREFIX}${recipeNumber}_${outputId}_${suffix}`)
    }
  }

  // Inert potion residue can be turned back into abjuration essence.
  create.filling('ars_nouveau:abjuration_essence', [
    'kubejs:inert_potion_residue',
    Fluid.of('starbunclemania:source_fluid', 500),
  ])
  create
    .pressurizing('kubejs:inert_potion_residue')
    .secondaryFluidInput(Fluid.of('starbunclemania:source_fluid', 250))
    .heated()
    .outputs('ars_nouveau:abjuration_essence')
  pneumaticcraft
    .thermo_plant()
    .item_input('kubejs:inert_potion_residue')
    .fluid_input(Fluid.of('starbunclemania:source_fluid', 125))
    .pressure(4.5)
    .temperature({ min_temp: 273 + 300 })
    .item_output('ars_nouveau:abjuration_essence')
})
