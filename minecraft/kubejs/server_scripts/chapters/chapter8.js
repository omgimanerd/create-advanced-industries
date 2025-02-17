// priority: 500

ItemEvents.entityInteracted('kubejs:uninspired_spark', (e) => {
  const { item, entity, target, level } = e

  if (target.isPlayer()) {
    target.tell('A truly creative being...')
    item.shrink(1)
    entity.giveInHand('kubejs:inspired_spark')
    level.playSound(
      null, // player
      target.x,
      target.y,
      target.z,
      'kubejs:wow',
      'players',
      10, // volume
      1 // pitch
    )
    spawnParticles(
      level,
      'minecraft:enchant', // particle
      target, // pos
      [1.2, 1.2, 1.2], // v
      2000, // count
      0.1
    ) // speed
    return
  }

  const lowInspiration = [
    'Nope, no creativity to be found here.',
    'Seems quite mundane...',
    'Maybe try something else?',
    "Doesn't seem very creative...",
    'Maybe if they went to art school first...',
  ]
  const highInspiration = [
    "Whoa! Here's some creativity, but not quite enough.",
    "A interesting specimen, but perhaps there's something even more " +
      'inspiring.',
    "Now this guy's a true craftsman! Maybe we can find someone even better?",
    "He's got the vibe, but not the pizzazz,",
    "You touch the spark to them. It wiggles a little bit, but doesn't change.",
  ]
  const hint =
    'Can you figure out how to right click this on someone truly inspiring?'
  const uses = item.nbt === null || item.nbt.uses === null ? 0 : item.nbt.uses
  if (uses >= 10) {
    entity.tell(hint)
  } else if (target.name === 'minecraft:villager') {
    entity.tell(highInspiration[uses % highInspiration.length])
  } else {
    entity.tell(lowInspiration[uses % lowInspiration.length])
  }
  item.setNbt({
    uses: Math.min(10, uses + 1),
  })
})

ServerEvents.tags('item', (e) => {
  // Missing plate tags for void steel
  e.add('forge:plates', 'createutilities:void_steel_sheet')
  e.add('forge:plates/void_steel', 'createutilities:void_steel_sheet')

  e.add('kubejs:disc_fragment', 'minecraft:disc_fragment_5')
  e.add('kubejs:disc_fragment', 'idas:disc_fragment_slither')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Radiant Grenade
  redefineRecipe(
    '8x thermal:glowstone_grenade',
    [
      'GGG', //
      'GRG', //
      'GGG', //
    ],
    { G: 'kubejs:energized_glowstone', R: 'createarmory:impact_nade' }
  )
  redefineRecipe(
    '8x thermal:glowstone_tnt',
    [
      'GGG', //
      'GTG', //
      'GGG', //
    ],
    { G: 'kubejs:energized_glowstone', T: 'minecraft:tnt' }
  )

  // Refined Radiance overhaul, in-world crafting disabled in Create config.
  // Shadow steel is also disabled, and done using void conversion in kubejs.
  // Energized beacon crafting recipes is defined in the relevant file.
  create
    .SequencedAssembly('create:chromatic_compound')
    .energize(100000)
    .outputs([
      Item.of('create:refined_radiance').withChance(8),
      Item.of('create:chromatic_compound').withChance(2),
    ])

  // Wand of Symmetry requires Refined Radiance
  e.replaceInput(
    'create:mechanical_crafting/wand_of_symmetry',
    'minecraft:ender_pearl',
    'create:refined_radiance'
  )

  // Blizz Powder
  e.remove({ id: 'thermal:blizz_powder' })
  create.centrifuging(
    ['minecraft:snow_block', '2x thermal:blizz_powder'],
    'thermal:blizz_rod',
    256,
    100
  )

  // Cooling Fluid
  e.remove({ id: 'tfmg:mixing/cooling_fluid' })
  create.mixing(Fluid.of('tfmg:cooling_fluid', 250), [
    Fluid.of('createaddition:seed_oil', 250),
    'thermal:blizz_powder',
  ])
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('createaddition:seed_oil', 250))
    .item_input('thermal:blizz_powder')
    .pressure(2)
    .temperature({ max_temp: 273 - 200 })
    .fluid_output(Fluid.of('tfmg:cooling_fluid', 500))
  pneumaticcraft
    .heat_properties()
    .fluid('tfmg:cooling_fluid')
    .temperature(273 - 200)
    .thermalResistance(50)
    .heatCapacity(50000)
    .transformHot({ block: 'minecraft:air' })

  // Tri-Steel Plating to Chorium Ingot Forging
  create
    .SequencedAssembly('vintageimprovements:shadow_steel_sheet')
    .deploy('tfmg:heavy_plate')
    .deploy('createutilities:void_steel_sheet')
    .curve(V_SHAPED_CURVING_HEAD)
    .press(2)
    .outputs('kubejs:tri_steel_plating')
  create
    .compacting('kubejs:tri_steel_plating_heated', ['kubejs:tri_steel_plating'])
    .superheated()
  create
    .SequencedAssembly('kubejs:tri_steel_plating_heated')
    .press(3)
    .curve(V_SHAPED_CURVING_HEAD)
    .loops(10)
    .outputs('kubejs:tri_steel_plating_semiforged')
  create
    .compacting('kubejs:tri_steel_plating_semiforged_heated', [
      'kubejs:tri_steel_plating_semiforged',
    ])
    .superheated()
  create
    .SequencedAssembly('kubejs:tri_steel_plating_semiforged_heated')
    .fill(Fluid.of('tfmg:cooling_fluid', 250))
    .fill(Fluid.of('kubejs:infused_dragon_breath', 250))
    .fill(Fluid.of('kubejs:chromatic_fluid', 250))
    .loops(4)
    .outputs('createcasing:chorium_ingot')
  e.remove({ output: 'createcasing:chorium_ingot' })

  // Alternative Ink Recipe
  e.shaped(
    'create_enchantment_industry:ink_bucket',
    [
      'DDD', //
      'DBD', //
      'DDD', //
    ],
    {
      D: '#create_enchantment_industry:ink_ingredient',
      B: 'minecraft:water_bucket',
    }
  ).id('kubejs:ink_bucket_manual_only')

  // Empty music discs
  create
    .SequencedAssembly('pneumaticcraft:plastic')
    .press()
    .fill(Fluid.of('kubejs:molten_silver', 125))
    .laser(8000, 1000)
    .outputs('kubejs:empty_music_disc')

  // TODO: writing music discs?
  // TODO: right clickable inspiration item

  // Disc fragment cutting and recycling
  // create.cutting(
  //   Item.of('kubejs:empty_disc_fragment').withChance(0.5),
  //   '#minecraft:music_discs'
  // )
  // create.laser_cutting(
  //   'kubejs:empty_disc_fragment',
  //   '#minecraft:music_discs',
  //   8000,
  //   1000
  // )
  create.splashing('kubejs:empty_disc_fragment', '#kubejs:disc_fragment')
  create.splashing('kubejs:empty_music_disc', '#minecraft:music_discs')
  create
    .SequencedAssembly('kubejs:empty_disc_fragment')
    .fill(Fluid.of('create_things_and_misc:slime', 25))
    .deploy('kubejs:empty_disc_fragment')
    .loops(3)
    .outputs('kubejs:empty_music_disc')
})
