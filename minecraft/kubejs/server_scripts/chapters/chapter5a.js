// priority: 200
// Recipe overhauls for Chapter 5A progression.

ServerEvents.tags('fluid', (e) => {
  e.add('forge:crude_oil', 'tfmg:crude_oil_fluid')
  e.add('forge:lpg', 'pneumaticcraft:lpg')
})

ItemEvents.rightClicked('kubejs:diamond_saw_blade', (e) => {
  const { player, level } = e
  if (!player.isCreative()) {
    player.attack(level.damageSources().cactus(), 1)
    player.damageHeldItem()
    player.tell("Ouch, that's sharp!")
  }
})

/**
 * Alternative magnetite crafting via lightning strike.
 */
EntityEvents.spawned('ars_nouveau:an_lightning', (e) => {
  const { entity, level } = e
  for (let offset of BlockPos.betweenClosed(-1, -1, -1, 1, 1, 1)) {
    let block = entity.block.offset(offset.x, offset.y, offset.z)
    if (block.id === 'minecraft:iron_block') {
      block.set('create_new_age:magnetite_block')
      // Wrap in a closure to bind the block position.
      ;((pos) => {
        repeat(level.server, 20, 5, () => {
          spawnParticles(level, 'cofh_core:spark', pos, 1, 20, 0.2, true)
        })
      })(block.pos)
    }
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  const redefineRecipe = redefineRecipe_(e)

  // Hardened planks can only be crafted with pressurizing
  e.remove({ id: 'tfmg:filling/hardened_wood_creosote' })
  create
    .pressurizing('#minecraft:planks')
    .secondaryFluidInput(Fluid.of('tfmg:creosote', 1000))
    .heated()
    .outputs('tfmg:hardened_planks')
  pneumaticcraft
    .thermo_plant()
    .item_input('#minecraft:planks')
    .fluid_input(Fluid.of('tfmg:creosote', 500))
    .pressure(2)
    .temperature({ min_temp: 273 + 250 })
    .item_output('tfmg:hardened_planks')

  // Overhaul Pneumaticcraft Refinery recipes
  redefineRecipe(
    'pneumaticcraft:refinery',
    [
      'HHH', //
      'FCF', //
      'SMS', //
    ],
    {
      H: 'tfmg:heavy_plate',
      F: 'minecraft:furnace',
      C: 'tfmg:steel_casing',
      S: 'tfmg:steel_ingot',
      M: STEEL_MECHANISM,
    }
  )
  redefineRecipe(
    'pneumaticcraft:refinery_output',
    [
      'HHH', //
      'GTG', //
      'HHH',
    ],
    { H: 'tfmg:heavy_plate', G: '#forge:glass', T: 'pneumaticcraft:small_tank' }
  )

  // Overhaul Thermopneumatic Processing Plant recipe
  redefineRecipe(
    'pneumaticcraft:thermopneumatic_processing_plant',
    [
      'HHH', //
      'TCT', //
      'SMS', //
    ],
    {
      H: 'tfmg:heavy_plate',
      T: 'pneumaticcraft:small_tank',
      C: 'tfmg:steel_casing',
      S: 'tfmg:steel_ingot',
      M: STEEL_MECHANISM,
    }
  )

  // 1000mb crude oil =
  //   200 mb diesel = 160 kerosene
  //   300 mb kerosene + 160 kerosene = 368 gasoline
  //   300 mb gasoline + 368 gasoline = 534.4 lpg
  //   200 mb lpg + 534.4 lpg = 734.4 total
  // Fractional distillation overhauls to yield bitumen and sulfur byproducts
  e.remove({ id: 'pneumaticcraft:thermo_plant/kerosene' })
  pneumaticcraft
    .thermo_plant()
    .fluid_input({
      tag: 'forge:diesel',
      amount: 100,
    })
    .fluid_output(Fluid.of('pneumaticcraft:kerosene', 80))
    .item_output('thermal:bitumen')
    .pressure(2)
    .temperature({ min_temp: 273 + 300 })
  e.remove({ id: 'pneumaticcraft:thermo_plant/gasoline' })
  pneumaticcraft
    .thermo_plant()
    .fluid_input({
      tag: 'forge:kerosene',
      amount: 100,
    })
    .fluid_output(Fluid.of('pneumaticcraft:gasoline', 80))
    .item_output('thermal:sulfur')
    .pressure(2)
    .temperature({ min_temp: 273 + 300 })
  e.remove({ id: 'pneumaticcraft:thermo_plant/lpg' })
  pneumaticcraft
    .thermo_plant()
    .fluid_input({
      tag: 'forge:gasoline',
      amount: 100,
    })
    .fluid_output(Fluid.of('pneumaticcraft:lpg', 80))
    .item_output('thermal:sulfur')
    .pressure(2)
    .temperature({ min_temp: 273 + 300 })
  // Overhaul burn times
  e.remove({ id: 'createaddition:liquid_burning/diesel' })
  e.remove({ id: 'createaddition:liquid_burning/gasoline' })
  create.burnableFluid(
    { fluidTag: '#forge:diesel', amount: 1000 },
    4800 // 4 minutes
  )
  create.burnableFluid(
    { fluidTag: '#forge:kerosene', amount: 1000 },
    9600 // 8 minutes
  )
  create.burnableFluid(
    { fluidTag: '#forge:gasoline', amount: 1000 },
    19200 // 16 minutes
  )
  create.burnableFluid(
    { fluidTag: '#forge:lpg', amount: 1000 },
    38400, // 32 minutes
    true
  )

  // Sulfur byproduct can be crushed into sulfur dust.
  create.milling('thermal:sulfur_dust', 'thermal:sulfur')
  // Worldgen sulfur can be crushed as well.
  create.milling(
    ['3x thermal:sulfur_dust', Item.of('thermal:sulfur_dust').withChance(0.5)],
    'tfmg:sulfur'
  )

  // Overhaul pyrolyzer recipe for bitumen.
  e.remove({ id: 'thermal:machines/pyrolyzer/pyrolyzer_bitumen' })
  e.recipes.thermal
    .pyrolyzer(
      [
        'tfmg:coal_coke',
        Item.of('thermal:tar').withChance(0.5),
        Fluid.of('pneumaticcraft:diesel', 50),
      ],
      'thermal:bitumen'
    )
    .energy(8000)

  // Overhaul lubricant from diesel
  e.remove({ id: 'pneumaticcraft:thermo_plant/lubricant_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/lubricant_from_diesel' })
  pneumaticcraft
    .fluid_mixer(
      Fluid.of('pneumaticcraft:diesel', 250),
      Fluid.of('createaddition:seed_oil', 250),
      2,
      100
    )
    .item_output('createaddition:biomass')
    .fluid_output(Fluid.of('pneumaticcraft:lubricant', 500))

  // Pneumatic cylinder overhaul
  e.remove({ id: 'pneumaticcraft:pneumatic_cylinder' })
  create
    .SequencedAssembly(
      'pneumaticcraft:cannon_barrel',
      'kubejs:intermediate_pneumatic_cylinder'
    )
    .deploy('tfmg:rebar')
    .fill(Fluid.of('pneumaticcraft:lubricant', 250))
    .press()
    .outputs('pneumaticcraft:pneumatic_cylinder')

  // Plastic must come from petrochemical processing, nerf it a little bit
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_lpg' })
  pneumaticcraft
    .thermo_plant()
    .fluid_input({ tag: 'forge:lpg', amount: 250 })
    .item_input('minecraft:coal')
    .fluid_output(Fluid.of('pneumaticcraft:plastic', 250))
    .temperature({ min_temp: 100 })

  // Cool plastic in a heat frame or TPP
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/plastic' })
  pneumaticcraft
    .heat_frame_cooling(
      Fluid.of('pneumaticcraft:plastic', 1000),
      '2x tfmg:plastic_sheet'
    )
    .bonus_output({ limit: 1, multiplier: 0.01 })
    .max_temp(50)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('pneumaticcraft:plastic', 1000))
    .item_output('2x tfmg:plastic_sheet')
    .pressure(-0.75)
    .temperature({ max_temp: 273 + 0 })

  // Plastic sheets are cut from plastic
  create.cutting('3x pneumaticcraft:plastic', 'tfmg:plastic_sheet')

  // Blank circuits
  e.remove({ id: 'create_new_age:pressing/blank_circuit' })
  create
    .SequencedAssembly('pneumaticcraft:plastic')
    .press()
    .cut()
    .outputs('4x create_new_age:blank_circuit')

  // Copper circuits
  e.remove({ id: 'create_new_age:deploying/copper_circuit' })
  create
    .SequencedAssembly('create_new_age:blank_circuit')
    .deploy('morered:red_alloy_wire')
    .press()
    .deploy('create:super_glue')
    .deploy('create_new_age:copper_wire')
    .press()
    .outputs('create_new_age:copper_circuit')
  create
    .SequencedAssembly('create_new_age:blank_circuit')
    .deploy('morered:red_alloy_wire')
    .press()
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('create_new_age:copper_wire')
    .press()
    .outputs('create_new_age:copper_circuit')

  // Empty PCB overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/empty_pcb' })
  e.blasting('pneumaticcraft:empty_pcb', 'create_new_age:copper_circuit')

  // Sulfuric acid overhaul
  e.remove({ id: 'vintageimprovements:pressurizing/sulfur_dioxide' })
  create
    .pressurizing('thermal:sulfur_dust')
    .secondaryFluidOutput(Fluid.of('vintageimprovements:sulfur_dioxide', 1000))
    .heated()
    .processingTime(80)
    .outputs([])
  pneumaticcraft
    .thermo_plant()
    .item_input('thermal:sulfur_dust')
    .pressure(2)
    .temperature({ min_temp: 273 + 220 })
    .fluid_output(Fluid.of('vintageimprovements:sulfur_dioxide'))
  e.remove({ id: 'vintageimprovements:pressurizing/sulfur_trioxide' })
  e.remove({ id: 'vintageimprovements:pressurizing/sulfur_trioxide_alt' })
  create
    .pressurizing([
      'minecraft:iron_nugget',
      Fluid.of('vintageimprovements:sulfur_dioxide', 250),
    ])
    .secondaryFluidOutput(Fluid.of('vintageimprovements:sulfur_trioxide', 250))
    .superheated()
    .processingTime(80)
    .outputs([])
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:iron_nugget')
    .fluid_input(Fluid.of('vintageimprovements:sulfur_dioxide', 250))
    .pressure(2)
    .temperature({ min_temp: 273 + 870 })
    .fluid_output(Fluid.of('vintageimprovements:sulfur_trioxide', 250))
  e.remove({ id: 'vintageimprovements:pressurizing/sulfuric_acid' })
  create
    .pressurizing(Fluid.of('vintageimprovements:sulfur_trioxide', 1000))
    .secondaryFluidInput(Fluid.water(1000))
    .heated()
    .processingTime(80)
    .outputs(Fluid.of('vintageimprovements:sulfuric_acid', 1000))
  pneumaticcraft
    .fluid_mixer(
      Fluid.of('vintageimprovements:sulfur_trioxide', 1000),
      Fluid.water(1000)
    )
    .time(20)
    .pressure(4)
    .fluid_output(Fluid.of('vintageimprovements:sulfuric_acid', 1000))

  // Empty PCBs get etched in an etching tank to become unassembled PCBs.
  // Etching acid overhaul from copper sulfate
  e.remove({ id: 'vintageimprovements:pressurizing/copper_sulfate' })
  create.mixing(
    [
      'vintageimprovements:copper_sulfate',
      Fluid.of('vintageimprovements:sulfur_dioxide', 250),
      Fluid.water(500),
    ],
    ['thermal:copper_dust', Fluid.of('vintageimprovements:sulfuric_acid', 500)]
  )
  e.remove({ id: 'pneumaticcraft:pressure_chamber/etching_acid' })
  create
    .pressurizing(['vintageimprovements:copper_sulfate', 'minecraft:green_dye'])
    .secondaryFluidInput(Fluid.water(500))
    .heated()
    .processingTime(80)
    .outputs(Fluid.of('pneumaticcraft:etching_acid', 500))

  // Unassembled PCBs must be made in an etching tank.
  e.remove({ id: 'pneumaticcraft:assembly/unassembled_pcb' })

  // Failed PCBs can be crushed to be recycled.
  e.remove({ id: 'pneumaticcraft:empty_pcb_from_failed_pcb' })
  create.crushing(
    ['pneumaticcraft:plastic', Item.of('create:copper_sheet').withChance(0.5)],
    'pneumaticcraft:failed_pcb'
  )

  // PCB overhaul
  e.remove({ id: 'pneumaticcraft:printed_circuit_board' })
  create
    .SequencedAssembly('pneumaticcraft:unassembled_pcb')
    .laser(800, 800)
    .deploy('pneumaticcraft:capacitor')
    .deploy('pneumaticcraft:transistor')
    .press()
    .outputs('pneumaticcraft:printed_circuit_board')

  // Spool recipes for wire coils
  e.remove({ id: 'createaddition:crafting/spool' })
  e.shaped('createaddition:spool', ['H', 'S', 'H'], {
    H: 'tfmg:heavy_plate',
    S: 'create:shaft',
  })
  create
    .SequencedAssembly('tfmg:heavy_plate', 'kubejs:intermediate_spool')
    .deploy('create:shaft')
    .deploy('tfmg:heavy_plate')
    .press()
    .outputs('2x createaddition:spool')

  // Overhaul the wire coils
  e.remove({ id: 'createaddition:rolling/iron_plate' })
  create.rolling(
    '2x createaddition:iron_wire',
    'create_new_age:overcharged_iron_sheet'
  )
  e.remove({ id: 'createaddition:rolling/gold_plate' })
  create.rolling(
    '2x createaddition:gold_wire',
    'create_new_age:overcharged_golden_sheet'
  )
  create.rolling(
    '2x kubejs:overcharged_diamond_wire',
    'create_new_age:overcharged_diamond'
  )
  const wireCraftingShape = [
    'WWW', //
    'WSW', //
    'WWW', //
  ]
  const defineWireOverhauls = (wire, spool) => {
    e.shaped(spool, wireCraftingShape, {
      W: wire,
      S: 'createaddition:spool',
    })
    e.remove({ output: spool })
    create
      .SequencedAssembly('createaddition:spool')
      .deploy(wire)
      .loops(4)
      .outputs(spool)
  }
  defineWireOverhauls(
    'createaddition:copper_wire',
    'create_new_age:copper_wire'
  )
  defineWireOverhauls(
    'createaddition:iron_wire',
    'create_new_age:overcharged_iron_wire'
  )
  defineWireOverhauls(
    'createaddition:gold_wire',
    'create_new_age:overcharged_golden_wire'
  )
  e.remove({ id: 'create_new_age:diamond_wire' })
  defineWireOverhauls(
    'kubejs:overcharged_diamond_wire',
    'create_new_age:overcharged_diamond_wire'
  )

  // Generator coils
  e.remove({ id: 'create_new_age:shaped/generator_coil' })
  create.mechanical_crafting(
    '16x create_new_age:generator_coil',
    [
      'CCCCCCC', //
      'CMMMMMC', //
      'CMCCCMC', //
      'CMC CMC', //
      'CMCCCMC', //
      'CMMMMMC', //
      'CCCCCCC', //
    ],
    { C: 'create_new_age:copper_wire', M: 'create_new_age:magnetite_block' }
  )

  // Carbon brushes for electrical generation
  e.remove({ id: 'create_new_age:shaped/carbon_brushes' })
  create.mechanical_crafting(
    'create_new_age:carbon_brushes',
    [
      'HHHHH', //
      'HDDDH', //
      'HDSDH', //
      'HDDDH', //
      'HMCMH', //
    ],
    {
      H: 'tfmg:heavy_plate',
      D: 'kubejs:graphite',
      S: 'create:shaft',
      M: STEEL_MECHANISM,
      C: 'tfmg:heavy_machinery_casing',
    }
  )

  // Red alloy overhaul
  e.remove({ id: 'morered:red_alloy_ingot_from_jumbo_smelting' })
  create.filling('morered:red_alloy_ingot', [
    'create_new_age:overcharged_iron',
    Fluid.of('kubejs:molten_redstone', 360),
  ])

  // Rolling red alloy into wire
  create.rolling('6x morered:red_alloy_wire', 'morered:red_alloy_ingot')

  // Overhaul Create: New Age's magnetic blocks
  // Magnetite block crafting recipe
  create.energizing(
    'create_new_age:magnetite_block',
    'minecraft:iron_block',
    9000
  )
  e.remove({ id: 'create_new_age:shaped/redstone_magnet' })
  create.mechanical_crafting(
    '8x create_new_age:redstone_magnet',
    [
      'RRRRR', //
      'RWWWR', //
      'RWMWR', //
      'RWWWR', //
      'RRRRR', //
    ],
    {
      R: 'morered:red_alloy_ingot',
      W: 'create_new_age:copper_wire',
      M: 'create_new_age:magnetite_block',
    }
  )
  e.remove({ id: 'create_new_age:shaped/layered_magnet' })
  create.mechanical_crafting(
    '8x create_new_age:layered_magnet',
    [
      'GGGGG', //
      'IWWWI', //
      'GWMWG', //
      'IWWWI', //
      'GGGGG', //
    ],
    {
      G: 'create_new_age:overcharged_golden_sheet',
      I: 'create_new_age:overcharged_iron_sheet',
      W: 'create_new_age:overcharged_iron_wire',
      M: 'create_new_age:redstone_magnet',
    }
  )
  e.remove({ id: 'create_new_age:shaped/fluxuated_magnetite' })
  create.mechanical_crafting(
    '8x create_new_age:fluxuated_magnetite',
    [
      'GDGDG', //
      'DWWWD', //
      'GWMWG', //
      'DWWWD', //
      'GDGDG', //
    ],
    {
      G: 'create_new_age:overcharged_golden_sheet',
      D: 'create_new_age:overcharged_diamond',
      W: 'create_new_age:overcharged_golden_wire',
      M: 'create_new_age:layered_magnet',
    }
  )
  e.remove({ id: 'create_new_age:shaped/netherite_magnet' })
  create.mechanical_crafting(
    '8x create_new_age:netherite_magnet',
    [
      'DNNND', //
      'NWWWN', //
      'NWMWN', //
      'NWWWN', //
      'DNNND', //
    ],
    {
      N: 'thermal:netherite_nugget',
      D: 'create_new_age:overcharged_diamond',
      W: 'create_new_age:overcharged_diamond_wire',
      M: 'create_new_age:fluxuated_magnetite',
    }
  )

  // Super glue automation
  create.compacting(
    Fluid.of('create_things_and_misc:slime', 100),
    'minecraft:slime_ball'
  )
  create.compacting(
    Fluid.of('create_things_and_misc:slime', 900),
    'minecraft:slime_block'
  )
  create.mixing(
    Fluid.of('create_things_and_misc:slime', 900),
    'minecraft:slime_block'
  )
  e.replaceInput(
    { id: 'create:crafting/kinetics/super_glue' },
    'minecraft:slime_ball',
    'minecraft:slime_block'
  )
  e.remove({ id: 'create_things_and_misc:gluepackagingcraft' })
  create
    .SequencedAssembly('minecraft:iron_nugget')
    .deploy('create:iron_sheet')
    .deploy('minecraft:lime_dye')
    .outputs('create_things_and_misc:glue_packaging')
  e.remove({ id: 'create_things_and_misc:glue_fluid_craft' })
  create.filling('create:super_glue', [
    'create_things_and_misc:glue_packaging',
    Fluid.of('create_things_and_misc:slime', 1000),
  ])
  // Recipe to reverse slime back into blocks
  create.compacting(
    'minecraft:slime_block',
    Fluid.of('create_things_and_misc:slime', 900)
  )
  create.vibrating('9x minecraft:slime_ball', 'minecraft:slime_block')

  // Probabilistic crushing recipe, only one yields ancient debris.
  const diceRoll = Math.random() > 0.5
  let probabilisticStone = 'create:scoria'
  let uselessStone = 'create:scorchia'
  if (diceRoll) {
    probabilisticStone = 'create:scorchia'
    uselessStone = 'create:scoria'
  }
  const randomOutputs = [
    Item.of('minecraft:ancient_debris').withChance(0.005),
    Item.of('minecraft:iron_nugget').withChance(global.randRange(0.01, 0.1)),
    Item.of('create:copper_nugget').withChance(global.randRange(0.01, 0.1)),
    Item.of('minecraft:gold_nugget').withChance(global.randRange(0.01, 0.1)),
    Item.of('create:zinc_nugget').withChance(global.randRange(0.01, 0.1)),
    Item.of('thermal:silver_nugget').withChance(global.randRange(0.01, 0.1)),
  ]
  create.crushing(randomOutputs, probabilisticStone)
  create.crushing('minecraft:cobblestone', uselessStone)
  e.recipes.ars_nouveau.crush(probabilisticStone, randomOutputs)
  e.recipes.ars_nouveau.crush(
    uselessStone,
    Item.of('minecraft:cobblestone').withChance(1)
  )

  // Ancient Debris processing
  e.remove({ id: /minecraft:netherite_scrap.*/ })
  e.remove({ id: 'minecraft:netherite_ingot' })
  create
    .laser_cutting('minecraft:netherite_scrap', 'minecraft:ancient_debris')
    .energy(24000)
    .maxChargeRate(4000)
  pneumaticcraft.assembly_laser(
    'minecraft:ancient_debris',
    'minecraft:netherite_scrap'
  )
  create
    .pressurizing('minecraft:netherite_scrap')
    .secondaryFluidInput(Fluid.of('kubejs:molten_gold', 135))
    .superheated()
    .outputs(Fluid.of('kubejs:molten_netherite', ingotFluid))
  pneumaticcraft
    .thermo_plant()
    .item_input('2x minecraft:netherite_scrap')
    .fluid_input(Fluid.of('kubejs:molten_gold', 90))
    .pressure(9)
    .temperature({ min_temp: 273 + 800 })
    .fluid_output(Fluid.of('kubejs:molten_netherite', ingotFluid))

  // Silicon overhaul, must be solidified in a heat frame or TPP
  e.remove({ id: 'refinedstorage:silicon' })
  create
    .mixing(
      [Fluid.of('kubejs:molten_silicon', 3 * ingotFluid), '2x thermal:slag'],
      ['4x minecraft:quartz', '2x tfmg:coal_coke_dust']
    )
    .superheated()
  create
    .mixing(
      [Fluid.of('kubejs:molten_silicon', 3 * ingotFluid), '2x thermal:slag'],
      [
        Fluid.of('kubejs:molten_quartz', 3 * ingotFluid),
        '2x tfmg:coal_coke_dust',
      ]
    )
    .superheated()
  pneumaticcraft
    .heat_frame_cooling(
      Fluid.of('kubejs:molten_silicon', 360),
      '4x refinedstorage:silicon'
    )
    .max_temp(-50)

  // Continuing to process silicon with coal coke yields
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('kubejs:molten_silicon', 90))
    .item_input('tfmg:coal_coke_dust')
    .item_output('kubejs:graphite')
    .pressure(9.5)
    .temperature({ min_temp: 273 + 1000 })

  // Under high pressure, graphite turns into diamond dust
  e.remove({ id: 'pneumaticcraft:pressure_chamber/coal_to_diamond' })
  pneumaticcraft.pressure_chamber(
    '9x kubejs:graphite',
    'thermal:diamond_dust',
    4.75
  )

  // Diamond saw blades to cut silicon into wafers
  e.shaped(
    'kubejs:diamond_saw_blade',
    [
      'DDD', //
      'DSD', //
      'DDD', //
    ],
    { D: 'thermal:diamond_dust', S: 'thermal:saw_blade' }
  )

  // The unbreakable diamond saw blade is not easily accessible until chapter 5b
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill(enchantedBook('minecraft:unbreaking', 8)),
    'kubejs:diamond_saw_blade',
    Item.of('kubejs:unbreakable_diamond_saw_blade', { Unbreakable: true })
  )

  // Diamond dust can be recrystallized into diamonds
  // Recipe defined in overhauls/thermal.js

  // Silicon wafer cutting
  create
    .SequencedAssembly('refinedstorage:silicon')
    .deploy('#kubejs:diamond_saw_blade')
    .fill(Fluid.of('pneumaticcraft:lubricant', 100))
    .loops(4)
    .outputs('4x kubejs:silicon_wafer')

  // Transistor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/transistor' })
  create
    .SequencedAssembly('create:electron_tube', 'kubejs:intermediate_transistor')
    .deploy('kubejs:silicon_wafer')
    .deploy('minecraft:glass_pane')
    .deploy('pneumaticcraft:plastic')
    .press()
    .outputs('4x pneumaticcraft:transistor')

  // Capacitor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/capacitor' })
  create
    .SequencedAssembly('kubejs:silicon_wafer', 'kubejs:intermediate_capacitor')
    .deploy('#forge:plates/silver')
    .deploy('pneumaticcraft:plastic')
    .deploy('#forge:plates/silver')
    .press()
    .outputs('4x pneumaticcraft:capacitor')

  // Overhaul Refined Storage processors
  e.remove({ id: /^refinedstorage:[a-z_]+_processor/ })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_wire')
    .deploy('minecraft:iron_ingot')
    .outputs('refinedstorage:raw_basic_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('morered:red_alloy_wire')
    .deploy('minecraft:iron_ingot')
    .outputs('refinedstorage:raw_basic_processor')
  pneumaticcraft.assembly_laser(
    'refinedstorage:raw_basic_processor',
    'refinedstorage:basic_processor'
  )
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_wire')
    .deploy('minecraft:gold_ingot')
    .outputs('refinedstorage:raw_improved_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('morered:red_alloy_wire')
    .deploy('minecraft:gold_ingot')
    .outputs('refinedstorage:raw_improved_processor')
  pneumaticcraft.assembly_laser(
    'refinedstorage:raw_improved_processor',
    'refinedstorage:improved_processor'
  )
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_wire')
    .deploy('thermal:diamond_dust')
    .outputs('refinedstorage:raw_advanced_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('morered:red_alloy_wire')
    .deploy('thermal:diamond_dust')
    .outputs('refinedstorage:raw_advanced_processor')
  pneumaticcraft.assembly_laser(
    'refinedstorage:raw_advanced_processor',
    'refinedstorage:advanced_processor'
  )

  // Mechanism assembly
  create.mechanical_crafting(
    LOGISTICS_MECHANISM,
    [
      'PPPPP', //
      'PRNRP', //
      'PBMIP', //
      'PCCCP', //
      'PPPPP', //
    ],
    {
      M: STEEL_MECHANISM,
      P: 'pneumaticcraft:plastic',
      C: 'pneumaticcraft:printed_circuit_board',
      B: 'refinedstorage:basic_processor',
      I: 'refinedstorage:improved_processor',
      R: 'morered:red_alloy_ingot',
      N: 'create_new_age:netherite_magnet',
    }
  )
})
