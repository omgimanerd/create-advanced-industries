// priority: 500
// Recipe overhauls for Chapter 6 progression.

/**
 * Event handler for expelling the silverfish from infested stone to generate
 * end stone.
 */
BlockEvents.rightClicked('minecraft:infested_stone', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:sigil_of_withdrawal') return

  // Each usage will spawn a silverfish.
  const silverfish = block.createEntity('minecraft:silverfish')
  silverfish.setPos(block.pos.center.add(0, 1, 0))
  silverfish.spawn()

  spawnParticles(level, 'block', block.pos.center, [0.5, 0.5, 0.5], 35, 0.01)
  // There is a 25% chance of converting the block to end stone.
  if (Math.random() < 0.25) {
    block.set('minecraft:end_stone')

    // Upon a successful conversion, there is a 2% chance the sigil will be
    // consumed.
    if (Math.random() < 0.02) {
      item.count--
    }
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  const MeltableItem = global.MeltableItem

  // Apotheosis material automation
  // Common Material: Mysterious Scrap Metal
  create.crushing('4x apotheosis:common_material', STEEL_MECHANISM)
  // Uncommon Material: Timeworn Fabric
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fabric' })
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fancy' })
  // Timeworn fabric is registered as a time pouch craft.
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fabric'
  )
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fancy'
  )
  create // Rare Material: Luminous Crystal Shard
    .SequencedAssembly('quark:indigo_corundum_cluster')
    .fill(Fluid.of('kubejs:molten_lumium', MeltableItem.DEFAULT_INGOT_FLUID))
    .laser(8000, 1000) // 8 ticks to craft
    .outputs('3x apotheosis:rare_material')
  // 3x yield from the block, one block = 2.66 corundum clusters
  create
    .SequencedAssembly('quark:indigo_corundum')
    .fill(
      Fluid.of('kubejs:molten_lumium', MeltableItem.DEFAULT_INGOT_FLUID * 2)
    )
    .laser(16000, 800) // 20 ticks to craft
    .outputs('9x apotheosis:rare_material')
  create // Epic Material: Arcane Sands
    .SequencedAssembly('tfmg:limesand')
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .energize(50000)
    .outputs([
      'apotheosis:epic_material',
      Item.of('tfmg:limesand').withChance(0.5),
    ])
  create // Mythic Material: Godforged Pearl
    .SequencedAssembly('minecraft:ender_pearl')
    .fill(Fluid.of('create:honey', 1000))
    .energize(100000)
    .outputs('apotheosis:mythic_material')
  create // Ancient Material: rainbow thingy
    .SequencedAssembly('minecraft:totem_of_undying')
    .fill(Fluid.of('create_enchantment_industry:experience', 1000))
    .vibrate()
    .outputs('apotheosis:ancient_material')
  create // Artifact Material: Artifact Shards
    .SequencedAssembly('farmersdelight:pasta_with_meatballs')
    .custom('', (pre, post) => {
      create
        .mixing(post, [pre, Fluid.of('pneumaticcraft:lpg', 250)])
        .superheated()
    })
    .custom('Next: Blast with high heat', (pre, post) => {
      e.blasting(post, pre)
    })
    .custom('Next: Haunt with Soul Fire', (pre, post) => {
      create.haunting(post[0], pre)
    })
    .outputs('apotheotic_additions:artifact_material')
  // Heirloom Material: Core of the Family
  create.filling('apotheotic_additions:heirloom_material', [
    'quark:diamond_heart',
    Fluid.of('thermal:ender', 250),
  ])
  const filledXpCrystal = Item.of('kubejs:xp_crystal')
    .enchant('cofh_core:holding', 3)
    .withNBT({ Xp: 25000 })
    .weakNBT()
  // Esoteric Material: Galactic Core
  create.energizing(
    'apotheotic_additions:esoteric_material',
    filledXpCrystal,
    1000000
  )

  // Heart of Diamond from Quark
  create.mechanical_crafting(
    'quark:diamond_heart',
    [
      'A A A', //
      ' DDD ', //
      'ADMDA', //
      ' DDD ', //
      'A A A', //
    ],
    {
      A: 'createutilities:polished_amethyst',
      D: 'minecraft:diamond',
      M: CRYSTALLINE_MECHANISM,
    }
  )

  // Overhauled recipe for Temporal Pouch
  redefineRecipe(
    'gag:time_sand_pouch',
    [
      'MGM', //
      'GSG', //
      'MGM', //
    ],
    {
      M: CRYSTALLINE_MECHANISM,
      G: 'kubejs:energized_glowstone',
      S: 'thermal:satchel',
    }
  )
  // The output item for this recipe does not matter since .modifyResult will
  // dynamically add 1000 to the input item's nbt value. It is only for display
  // in JEI.
  e.shapeless(Item.of('gag:time_sand_pouch', { grains: 1000 }), [
    'gag:time_sand_pouch',
    'ars_nouveau:glyph_extend_time',
  ]).modifyResult((grid) => {
    const currentGrains = grid.find('gag:time_sand_pouch').nbt.getInt('grains')
    return Item.of('gag:time_sand_pouch', `{grains:${currentGrains + 1000}}`)
  })

  // Apotheosis Gem Fused Slates
  e.remove({ id: 'apotheosis:gem_fused_slate' })
  e.shaped(
    '4x apotheosis:gem_fused_slate',
    [
      'DDD', //
      'DGD', //
      'DDD', //
    ],
    { D: 'minecraft:reinforced_deepslate', G: 'apotheosis:gem_dust' }
  )
  create
    .SequencedAssembly('minecraft:reinforced_deepslate')
    .cut()
    .deploy('apotheosis:gem_dust')
    .press()
    .outputs('2x apotheosis:gem_fused_slate')

  // Redefine each of the sigil recipes to only output 1 sigil.
  e.forEachRecipe({ id: /^apotheosis:sigil_of_.*$/ }, (r) => {
    const json = JSON.parse(r.json)
    r.remove()
    e.shaped(json.result.item, json.pattern, json.key)
  })

  // Sequenced Assemblies for each sigil.
  create
    .SequencedAssembly(
      'apotheosis:gem_fused_slate',
      'kubejs:unfinished_sigil_of_socketing'
    )
    .deploy('minecraft:amethyst_shard')
    .deploy('apotheosis:gem_dust')
    .fill('create_central_kitchen:dragon_breath', 125)
    .press()
    .outputs('apotheosis:sigil_of_socketing')
  create
    .SequencedAssembly(
      'apotheosis:gem_fused_slate',
      'kubejs:unfinished_sigil_of_withdrawal'
    )
    .deploy('minecraft:ender_pearl')
    .deploy('apotheosis:gem_dust')
    .deploy('minecraft:blaze_rod')
    .fill('minecraft:lava', 500)
    .press()
    .outputs('apotheosis:sigil_of_withdrawal')
  create
    .SequencedAssembly(
      'apotheosis:gem_fused_slate',
      'kubejs:unfinished_sigil_of_rebirth'
    )
    .deploy('apotheosis:gem_dust')
    .deploy('apotheosis:gem_dust')
    .press()
    .outputs('apotheosis:sigil_of_rebirth')
  create
    .SequencedAssembly(
      'apotheosis:gem_fused_slate',
      'kubejs:unfinished_sigil_of_enhancement'
    )
    .deploy('apotheosis:mythic_material')
    .deploy('apotheosis:gem_dust')
    .press()
    .outputs('apotheosis:sigil_of_enhancement')
  create
    .SequencedAssembly(
      'apotheosis:gem_fused_slate',
      'kubejs:unfinished_sigil_of_unnaming'
    )
    .deploy('minecraft:flint')
    .press()
    .outputs('apotheosis:sigil_of_unnaming')

  // Syrup bottles can be energized into honey.
  create.energizing('minecraft:honey_bottle', 'thermal:syrup_bottle', 24000)

  // Saturated honeycomb usage
  create.centrifuging(
    [
      Fluid.of('create:honey', 100),
      Item.of('kubejs:saturated_honeycomb').withChance(0.9),
    ],
    'kubejs:saturated_honeycomb'
  )

  // Honey droplets
  create
    .mixing('kubejs:honey_droplet', [Fluid.of('create:honey', 250)])
    .heated()

  // Phantom membranes
  e.remove({ id: 'minecraft:honey_block' })
  create.haunting('minecraft:phantom_membrane', 'minecraft:honeycomb')

  // Rosin from resin, for use in the custom XP Crystal
  create
    .mixing(
      ['thermal:rosin', Fluid.of('thermal:latex', 50)],
      Fluid.of('thermal:resin', 250)
    )
    .heated()
  e.recipes.thermal.refinery(
    [Item.of('thermal:rosin').withChance(0.75), Fluid.of('thermal:latex', 100)],
    Fluid.of('thermal:resin', 200)
  )
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('thermal:resin', 200))
    .item_output('thermal:rosin')
    .fluid_output(Fluid.of('thermal:latex', 100))
    .temperature({ min_temp: 273 + 100 })
    .pressure(1)

  // Custom XP Crystal
  e.remove({ id: 'thermal:tools/xp_crystal' })
  e.shaped(
    'kubejs:xp_crystal',
    [
      ' L ', //
      'ERE', //
      ' L ', //
    ],
    { L: 'minecraft:lapis_lazuli', E: 'minecraft:emerald', R: 'thermal:rosin' }
  )
  e.replaceOutput(
    { id: 'thermal:tools/xp_crystal' },
    'thermal:xp_crystal',
    'kubejs:xp_crystal'
  )
  e.replaceInput({ mod: 'thermal' }, 'thermal:xp_crystal', 'kubejs:xp_crystal')
  create
    .SequencedAssembly('thermal:rosin')
    .deploy('minecraft:emerald')
    .deploy('minecraft:lapis_lazuli')
    .fill(Fluid.of('create_enchantment_industry:experience', 100))
    .outputs('kubejs:xp_crystal')

  // The Treasure Net is gated by a level 60 enchant
  redefineRecipe(
    'thermal:junk_net',
    [
      'LSL', //
      'SLS', //
      'LSL', //
    ],
    { L: 'thermal:lead_nugget', S: 'minecraft:string' }
  )
  e.recipes.apotheosis
    .enchanting('thermal:junk_net', 'kubejs:treasure_net')
    .requirements({ eterna: 30, quanta: 40, arcana: 40 })
  e.recipes.thermal.fisher_boost(
    'kubejs:treasure_net',
    1,
    0,
    'kubejs:gameplay/fishing/treasure'
  )

  // Overhauled Aquatic Entangler outputs
  global.RegisterAquaticEntanglerRecipeOverhauls(e)

  // Fish chum cycling
  create.crushing(
    [
      'kubejs:fish_chum',
      Item.of('kubejs:fish_chum').withChance(0.5),
      Item.of('kubejs:fish_chum').withChance(0.1),
      'minecraft:bone_meal',
    ],
    '#minecraft:fishes'
  )
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      '4x kubejs:fish_chum',
      '4x minecraft:bone_meal',
      Fluid.water(1000),
    ])
    .heated()
  redefineRecipe('4x thermal:aquachow', [
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'minecraft:slime_ball',
  ])
  e.remove({ id: 'thermal:deep_aquachow_4' })
  create
    .SequencedAssembly('thermal:aquachow')
    .deploy(
      Item.of('kubejs:fish_chum')
        .enchant('kubejs:nutrient_infusion', 1)
        .weakNBT()
    )
    .fill(Fluid.of('create_enchantment_industry:experience', 50))
    .deploy('kubejs:fish_hook')
    .outputs('thermal:deep_aquachow')

  // Nautilus shells can also be crushed into limestone dust.
  create.milling('tfmg:limesand', 'minecraft:nautilus_shell')

  // Totem of undying automation from Create: Totem Factory items.
  create.cutting('kubejs:totem_body_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_body_casing',
      'kubejs:incomplete_totem_body'
    )
    .fill(potionFluid('minecraft:long_fire_resistance', 250))
    .fill(potionFluid('minecraft:strong_regeneration', 250))
    .deploy('create:brass_sheet')
    .outputs('kubejs:totem_body')
  create.cutting('kubejs:totem_head_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_head_casing',
      'kubejs:incomplete_totem_head'
    )
    .deploy('minecraft:end_crystal')
    .deploy('create:brass_sheet')
    .energize(50000)
    .outputs('kubejs:totem_head')
  create.mechanical_crafting(
    'kubejs:inactive_totem',
    [
      'EHE', //
      ' B ', //
    ],
    { E: 'minecraft:emerald', H: 'kubejs:totem_head', B: 'kubejs:totem_body' }
  )
  create.filling('minecraft:totem_of_undying', [
    'kubejs:inactive_totem',
    Fluid.of('create_enchantment_industry:experience', 1000),
  ])

  // Bottles of Experience
  e.remove({ id: 'create_new_age:energising/splash_water_bottle' })

  // Liquid Hyper Experience condensing, gated behind a level 100 enchant
  e.remove({ id: 'create_enchantment_industry:mixing/hyper_experience' })
  e.recipes.apotheosis
    .enchanting('apotheosis:mythic_material', 'kubejs:inert_xp_condenser')
    .requirements({ eterna: 50, quanta: 80, arcana: 80 })
  // Hyper Experience condensing requires an inert XP condenser
  create
    .pressurizing('kubejs:inert_xp_condenser')
    .secondaryFluidInput(
      Fluid.of('create_enchantment_industry:experience', 1000)
    )
    .superheated()
    .processingTime(200)
    .outputs('kubejs:xp_condenser')
  create.emptying(
    [
      Fluid.of('create_enchantment_industry:hyper_experience', 100),
      'kubejs:inert_xp_condenser',
    ],
    'kubejs:xp_condenser'
  )

  // Provide a way to get Everlasting Beef / Eternal Steak with a level 100
  // enchantment.
  e.recipes.apotheosis
    .enchanting('minecraft:beef', 'artifacts:everlasting_beef')
    .requirements({ eterna: 50, quanta: 60, arcana: 60 })
  e.recipes.apotheosis
    .enchanting('minecraft:cooked_beef', 'artifacts:eternal_steak')
    .requirements({ eterna: 50, quanta: 60, arcana: 60 })

  // Nether Star automation
  // Skeleton skulls can be automated with resonance crafting
  create
    .SequencedAssembly('minecraft:skeleton_skull')
    .fill(Fluid.of('create_enchantment_industry:ink', 100))
    .fill(potionFluid('apotheosis:strong_wither', 100))
    .outputs('minecraft:wither_skeleton_skull')

  // Chorus fruit alternative pathways
  create
    .vacuumizing(
      [
        Fluid.of('starbunclemania:source_fluid', 125),
        'minecraft:popped_chorus_fruit',
      ],
      'minecraft:chorus_fruit'
    )
    .heatRequirement('heated')
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:chorus_fruit')
    .temperature({ min_temp: 273 + 250 })
    .pressure(-0.5)
    .item_output('minecraft:popped_chorus_fruit')
    .fluid_output(Fluid.of('starbunclemania:source_fluid', 150))

  // Purpur block overhaul
  e.remove({ id: 'minecraft:purpur_block' })
  create.mechanical_crafting(
    'minecraft:purpur_block',
    [
      'FFFF', //
      'FEEF', //
      'FEEF', //
      'FFFF', //
    ],
    { F: 'minecraft:popped_chorus_fruit', E: 'minecraft:end_stone' }
  )

  // Infused dragon's breath alternative
  pneumaticcraft
    .fluid_mixer(
      Fluid.of('create_central_kitchen:dragon_breath', 1),
      Fluid.of('create_enchantment_industry:hyper_experience', 1)
    )
    .pressure(4.8)
    .time(20)
    .fluid_output(Fluid.of('kubejs:infused_dragon_breath', 1))

  // End crystal overhaul
  e.remove({ id: 'minecraft:end_crystal' })
  create
    .SequencedAssembly('minecraft:glass_pane')
    .deploy('minecraft:purpur_slab')
    .deploy(CRYSTALLINE_MECHANISM)
    .deploy('minecraft:nether_star')
    .energize(25000)
    .outputs('minecraft:end_crystal')

  // Beacon overhaul
  e.remove({ id: 'minecraft:beacon' })
  create
    .SequencedAssembly('minecraft:obsidian')
    .deploy('minecraft:end_crystal')
    .deploy('minecraft:diamond_block')
    .deploy('minecraft:glass')
    .outputs('minecraft:beacon')

  // Final Vibration Mechanism craft
  e.remove({ id: 'create_things_and_misc:vibration_mecanism_craft' })
  create
    .SequencedAssembly(CRYSTALLINE_MECHANISM, INCOMPLETE_VIBRATION_MECHANISM)
    .deploy(
      getGemItem(
        'apotheotic_additions:modded/ars_mana',
        'apotheotic_additions:esoteric'
      )
    )
    .fill(potionFluid('apotheosis:extra_long_flying', 250))
    .deploy('create:rose_quartz')
    .fill(Fluid.of('kubejs:infused_dragon_breath', 250))
    .deploy('vintageimprovements:invar_spring')
    .vibrate(200)
    .outputs(VIBRATION_MECHANISM)

  // TODO alternative uses for infused dragon's breath
})
