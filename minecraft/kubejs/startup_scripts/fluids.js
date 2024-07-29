// priority: 100

StartupEvents.registry('fluid', (e) => {
  /**
   * @param {string} id
   * @returns {Internal.FluidBuilder_}
   */
  const registerFluid = (id) => {
    return e.create(id).displayName(getDisplayName(id))
  }

  // Chapter 5a Fluids

  // Molten Silicon cannot be casted, register it separately.
  registerFluid('kubejs:molten_silicon')
    .thickTexture(0x6e6074)
    .bucketColor(0x6e6074)
    .noBlock()

  // Chapter 5b Fluids

  // Crystal Growth Accelerator for Amethyst growth
  registerFluid('kubejs:crystal_growth_accelerator')
    .thinTexture(0xb062be)
    .bucketColor(0xb062be)

  // Blaze milk
  const blazeMilk = registerFluid('kubejs:blaze_milk')
    .thickTexture(0xbe4d25)
    .bucketColor(0xbe4d25)
    .noBlock()
  blazeMilk.bucketItem.tooltip(Text.gold('Where did you even milk this from?'))

  // Arboreal Extractors used on Ars Nouveau archwood
  registerFluid('kubejs:flourishing_archwood_sap') // Green tree
    .thinTexture(0x14b400)
    .bucketColor(0x14b400)
    .noBlock()
  registerFluid('kubejs:vexing_archwood_sap') // Purple tree
    .thinTexture(0x9f23fc)
    .bucketColor(0x9f23fc)
    .noBlock()
  registerFluid('kubejs:blazing_archwood_sap') // Red tree
    .thinTexture(0xfc3223)
    .bucketColor(0xfc3223)
    .noBlock()
  registerFluid('kubejs:cascading_archwood_sap') // Blue tree
    .thinTexture(0x255cfa)
    .bucketColor(0x255cfa)
    .noBlock()
  registerFluid('kubejs:flashing_archwood_sap') // Yellow tree
    .thinTexture(0xccd700)
    .bucketColor(0xccd700)
    .noBlock()

  // After first refinement
  registerFluid('kubejs:liquid_air_essence')
    .thinTexture(0xd4f22b)
    .bucketColor(0xd4f22b)
    .noBlock()
  registerFluid('kubejs:liquid_earth_essence')
    .thinTexture(0x2ec22e)
    .bucketColor(0x2ec22e)
    .noBlock()
  registerFluid('kubejs:liquid_fire_essence')
    .thinTexture(0xf85736)
    .bucketColor(0xf85736)
    .noBlock()
  registerFluid('kubejs:liquid_water_essence')
    .thinTexture(0xcbb8db)
    .bucketColor(0xcbb8db)
    .noBlock()

  // Chapter 6b Fluids

  // Infused Dragon's Breath
  registerFluid('kubejs:infused_dragon_breath')
    .stillTexture('kubejs:fluid/infused_dragon_breath')
    .noBlock()
    .noBucket()

  // Fluid to be extracted when enderman teleport.
  registerFluid('kubejs:teleportation_juice').thinTexture(0x105d50).noBlock()
})
