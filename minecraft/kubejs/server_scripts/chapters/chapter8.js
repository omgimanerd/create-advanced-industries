// priority: 500

ItemEvents.entityInteracted('kubejs:uninspired_spark', (e) => {
  const { item, entity, target, level } = e
  if (target.isPlayer()) {
    target.tell(Text.lightPurple('A truly creative being...'))
    item.shrink(1)
    entity.giveInHand('kubejs:inspired_spark')
    level.playSound(
      null, // player
      target.x,
      target.y,
      target.z,
      'kubejs:wow',
      'players',
      4, // volume
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

  // Otherwise, empty music discs can be made from pancakes.
  e.remove('minecraft:music_discs', 'supplementaries:pancake')
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

  // Sparks of Inspiration
  create
    .SequencedAssembly('create:refined_radiance')
    .fill(Fluid.of('kubejs:molten_lumium', 1000))
    .fill(potionFluid('ars_elemental:shock_potion', 250))
    .energize(25000)
    .outputs('kubejs:uninspired_spark')
  for (const [painting, rarity] in global.getTieredPaintingVariants()) {
    let probability = 0
    switch (rarity) {
      case 'artifact':
        probability = 0.5
        break
      case 'legendary':
        probability = 0.25
        break
      case 'epic':
        probability = 0.15
        break
      case 'rare':
        probability = 0.1
        break
      default:
        throw new Error(`Unknown painting rarity ${rarity}`)
    }
    create.mixing(
      [
        'kubejs:inspired_spark',
        Item.of('kubejs:inspired_spark').withChance(probability),
      ],
      [
        'kubejs:inspired_spark',
        Item.of('minecraft:painting', {
          EntityTag: { variant: painting },
        }).weakNBT(),
      ]
    )
  }

  // Empty music discs
  create
    .SequencedAssembly('pneumaticcraft:plastic')
    .press()
    .fill(Fluid.of('kubejs:molten_silver', 125))
    .laser(8000, 1000)
    .outputs('kubejs:empty_music_disc')
  const allDiscs = [
    Item.of('kubejs:empty_disc_fragment').withChance(80),
  ].concat(
    Ingredient.of('#minecraft:music_discs')
      .itemIds.filter((id) => {
        return id != 'supplementaries:pancake'
      })
      .map((id) => {
        // Weight chance, not probability
        return Item.of(id).withChance(5)
      })
  )
  create
    .SequencedAssembly('kubejs:empty_music_disc')
    .deploy('kubejs:inspired_spark')
    .laser(1000)
    .outputs(allDiscs)

  // Music discs can be wiped and reassembled
  create.splashing('kubejs:empty_disc_fragment', '#kubejs:disc_fragment')
  create.splashing('kubejs:empty_music_disc', '#minecraft:music_discs')
  create
    .SequencedAssembly('kubejs:empty_disc_fragment')
    .fill(Fluid.of('create_things_and_misc:slime', 25))
    .deploy('kubejs:empty_disc_fragment')
    .loops(3)
    .outputs('kubejs:empty_music_disc')

  // Disc fragments can be made with cutting
  create.cutting(
    [
      '5x kubejs:empty_disc_fragment',
      Item.of('kubejs:empty_disc_fragment', 4).withChance(0.5),
    ],
    'kubejs:empty_music_disc',
    5
  )
  create.cutting(
    [
      '5x minecraft:disc_fragment_5',
      Item.of('minecraft:disc_fragment_5', 4).withChance(0.5),
    ],
    'minecraft:music_disc_5',
    5
  )
  create.cutting(
    [
      '5x idas:disc_fragment_slither',
      Item.of('idas:disc_fragment_slither', 4).withChance(0.5),
    ],
    'idas:music_disc_slither'
  )

  // Creative Mechanism
  create
    .SequencedAssembly('#minecraft:music_discs', INCOMPLETE_CREATIVE_MECHANISM)
    .deploy('create:refined_radiance')
    .deploy('createcasing:chorium_ingot')
    .outputs(CREATIVE_MECHANISM)
})
