// priority: 100

StartupEvents.registry('fluid', (e) => {
  e.create('kubejs:crystal_growth_accelerator')
    .thinTexture(0xb062be)
    .bucketColor(0xb062be)
    .displayName('Crystal Growth Accelerator')

  e.create('kubejs:blaze_milk')
    .thickTexture(0xbe4d25)
    .bucketColor(0xbe4d25)
    .displayName('Blaze Milk')

  // Arboreal Extractors used on Ars Nouveau archwood
  e.create('kubejs:flourishing_archwood_sap') // Green tree
    .thinTexture(0x14b400)
    .bucketColor(0x14b400)
    .displayName('Flourishing Archwood Sap')
  e.create('kubejs:vexing_archwood_sap') // Purple tree
    .thinTexture(0x9f23fc)
    .bucketColor(0x9f23fc)
    .displayName('Vexing Archwood Sap')
  e.create('kubejs:blazing_archwood_sap') // Red tree
    .thinTexture(0xfc3223)
    .bucketColor(0xfc3223)
    .displayName('Blazing Archwood Sap')
  e.create('kubejs:cascading_archwood_sap') // Blue tree
    .thinTexture(0x255cfa)
    .bucketColor(0x255cfa)
    .displayName('Cascading Archwood Sap')
  e.create('kubejs:flashing_archwood_sap') // Yellow tree
    .thinTexture(0xccd700)
    .bucketColor(0xccd700)
    .displayName('Flashing Archwood Sap')

  // After first refinement
  e.create('kubejs:liquid_air_essence')
    .thinTexture(0xd4f22b)
    .bucketColor(0xd4f22b)
    .displayName('Liquid Air Essence')
  e.create('kubejs:liquid_earth_essence')
    .thinTexture(0x2ec22e)
    .bucketColor(0x2ec22e)
    .displayName('Liquid Earth Essence')
  e.create('kubejs:liquid_fire_essence')
    .thinTexture(0xf85736)
    .bucketColor(0xf85736)
    .displayName('Liquid Fire Essence')
  e.create('kubejs:liquid_water_essence')
    .thinTexture(0xcbb8db)
    .bucketColor(0xcbb8db)
    .displayName('Liquid Water Essence')
})
