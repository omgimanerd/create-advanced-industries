// priority: 200
// Recipe overhauls for Chapter 4C progression.

ServerEvents.tags('fluid', (e) => {
  e.add('forge:crude_oil', 'tfmg:crude_oil_fluid')
})

ItemEvents.rightClicked('kubejs:diamond_sawblade', (e) => {
  if (!e.player.level.isClientSide() && !e.player.isCreative()) {
    e.player.attack(new $DamageSources(e.level.registryAccess()).cactus(), 1)
    e.player.damageHeldItem()
    e.player.tell("Ouch, that's sharp!")
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  const redefineRecipe = redefineRecipe_(e)

  // Hardened planks can only be crafted in a pressure chamber, which gates
  // steel casings behind Pneumaticcraft.
  e.remove({ id: 'tfmg:filling/hardened_wood_creosote' })
  pneumaticcraft
    .PressureChamber(['8x #minecraft:planks', '1x tfmg:creosote_bucket'])
    .pressure(2)
    .outputs(['8x tfmg:hardened_planks', 'minecraft:bucket'])

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
      M: 'tfmg:steel_mechanism',
    }
  )
  redefineRecipe(
    'pneumaticcraft:refinery_output',
    [
      'HHH', //
      'GTG', //
      'HHH',
    ],
    {
      H: 'tfmg:heavy_plate',
      G: '#forge:glass',
      T: 'pneumaticcraft:small_tank',
    }
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
      M: 'tfmg:steel_mechanism',
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
    .ThermoPlant(['100mb #forge:diesel'])
    .pressure(2)
    .minTemp(300)
    .outputs(['80mb pneumaticcraft:kerosene', 'thermal:bitumen'])
  e.remove({ id: 'pneumaticcraft:thermo_plant/gasoline' })
  pneumaticcraft
    .ThermoPlant(['100mb #forge:kerosene'])
    .pressure(2)
    .minTemp(300)
    .outputs(['80mb pneumaticcraft:gasoline', 'thermal:sulfur'])
  e.remove({ id: 'pneumaticcraft:thermo_plant/lpg' })
  pneumaticcraft
    .ThermoPlant(['100mb #forge:gasoline'])
    .pressure(2)
    .minTemp(300)
    .outputs(['80mb pneumaticcraft:lpg', 'thermal:sulfur'])

  // Sulfur byproduct can be crushed into sulfur dust.
  create.milling('thermal:sulfur_dust', 'thermal:sulfur')
  // Worldgen sulfur can be crushed as well.
  create.milling(
    ['3x thermal:sulfur_dust', Item.of('thermal:sulfur_dust').withChance(0.5)],
    'tfmg:sulfur'
  )

  // Overhaul lubricant from diesel
  e.remove({ id: 'pneumaticcraft:thermo_plant/lubricant_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/lubricant_from_diesel' })
  pneumaticcraft
    .FluidMixer('250mb #forge:diesel', '250mb #forge:plantoil')
    .time(100)
    .pressure(2)
    .outputs(['500mb pneumaticcraft:lubricant', 'createaddition:biomass'])

  // Plastic must come from petrochemical processing, nerf it a little bit
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_lpg' })
  pneumaticcraft
    .ThermoPlant(['250mb #forge:lpg', 'minecraft:coal'])
    .minTemp(100)
    .outputs(['250mb pneumaticcraft:plastic'])

  // Cool plastic in a heat frame or TPP
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/plastic' })
  pneumaticcraft
    .HeatFrame('1000mb pneumaticcraft:plastic')
    .bonusOutput(/*limit=*/ 1, /*multiplier=*/ 0.01)
    .maxTemp(50)
    .outputs('2x tfmg:plastic_sheet')
  pneumaticcraft
    .ThermoPlant('1000mb pneumaticcraft:plastic')
    .maxTemp(0)
    .pressure(-0.75)
    .outputs('2x tfmg:plastic_sheet')

  // Plastic sheets are cut from plastic
  create.cutting('3x pneumaticcraft:plastic', 'tfmg:plastic_sheet')

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
    .HeatFrame('360mb kubejs:molten_silicon')
    .maxTemp(-50)
    .outputs('4x refinedstorage:silicon')
  pneumaticcraft
    .ThermoPlant('360mb kubejs:molten_silicon')
    .maxTemp(-100)
    .pressure(-0.75)
    .outputs('4x refinedstorage:silicon')

  // Diamond sawblades to cut silicon into wafers
  // TODO: better diamond cutting and diamond automation in chapter 5b
  create.crushing(
    Item.of('thermal:diamond_dust').withChance(0.8),
    'minecraft:diamond'
  )
  e.shaped(
    'kubejs:diamond_saw_blade',
    [
      'DDD', //
      'DSD', //
      'DDD', //
    ],
    {
      D: 'thermal:diamond_dust',
      S: 'thermal:saw_blade',
    }
  )

  // Silicon wafer cutting
  create
    .SequencedAssembly('refinedstorage:silicon')
    .deploy('#kubejs:diamond_saw_blade')
    .fill('minecraft:water', 500)
    .loops(4)
    .outputs('4x kubejs:silicon_wafer')

  // Faster electron tube crafting
  pneumaticcraft
    .ThermoPlant(['minecraft:quartz', '270mb kubejs:molten_redstone'])
    .pressure(7.5)
    .minTemp(300)
    .outputs('create:electron_tube')

  // Transistor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/transistor' })
  create
    .SequencedAssembly('create:electron_tube')
    .transitional('kubejs:intermediate_transistor')
    .deploy('kubejs:silicon_wafer')
    .deploy('minecraft:glass_pane')
    .deploy('pneumaticcraft:plastic')
    .press()
    .outputs('pneumaticcraft:transistor')

  // Capacitor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/capacitor' })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .transitional('kubejs:intermediate_capacitor')
    .deploy('thermal:silver_plate')
    .deploy('pneumaticcraft:plastic')
    .deploy('thermal:silver_plate')
    .press()
    .outputs('pneumaticcraft:capacitor')

  // Pneumatic cylinder overhaul
  e.remove({ id: 'pneumaticcraft:pneumatic_cylinder' })
  create
    .SequencedAssembly('pneumaticcraft:cannon_barrel')
    .deploy('tfmg:rebar')
    .fill('pneumaticcraft:lubricant', 250)
    .press()
    .outputs('pneumaticcraft:pneumatic_cylinder')

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
    .deploy('morered:red_alloy_ingot')
    .press()
    .deploy('create:super_glue')
    .deploy('create_new_age:copper_wire')
    .press()
    .outputs('create_new_age:copper_circuit')

  // Empty PCB overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/empty_pcb' })
  e.blasting('pneumaticcraft:empty_pcb', 'create_new_age:copper_circuit')

  // Empty PCBs get etched in an etching tank to become unassembled PCBs.
  // Etching acid overhaul
  create.mixing(Fluid.of('pneumaticcraft:etching_acid', 1000), [
    Fluid.water(1000),
    'thermal:sulfur_dust',
    'create:copper_nugget',
  ])

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
    .deploy('pneumaticcraft:capacitor')
    .deploy('pneumaticcraft:transistor')
    .press()
    .loops(4)
    .outputs('pneumaticcraft:printed_circuit_board')

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

  // Overhaul Create: New Age's magnetic blocks
  // Magnetite block crafting recipe
  create.energising(
    'create_new_age:magnetite_block',
    'minecraft:iron_block',
    9000
  )
  redefineRecipe(
    'create_new_age:redstone_magnet',
    [
      'RRR', //
      'RMR', //
      'RRR', //
    ],
    {
      R: 'morered:red_alloy_ingot',
      M: 'create_new_age:magnetite_block',
    }
  )
  redefineRecipe(
    'create_new_age:layered_magnet',
    [
      'IGI', //
      'GMG', //
      'IGI', //
    ],
    {
      I: 'create_new_age:overcharged_iron_sheet',
      G: 'create_new_age:overcharged_golden_sheet',
      M: 'create_new_age:redstone_magnet',
    }
  )
  redefineRecipe(
    'create_new_age:fluxuated_magnetite',
    [
      'GDG', //
      'DMG', //
      'GDG', //
    ],
    {
      G: 'create_new_age:overcharged_golden_sheet',
      D: 'create_new_age:overcharged_diamond',
      M: 'create_new_age:layered_magnet',
    }
  )
  redefineRecipe(
    'create_new_age:netherite_magnet',
    [
      'NDN', //
      'DMD', //
      'NDN', //
    ],
    {
      N: 'minecraft:netherite_ingot',
      D: 'create_new_age:overcharged_diamond',
      M: 'create_new_age:fluxuated_magnetite',
    }
  )

  // Probabilistic crushing recipe, only one yields ancient debris.
  const diceRoll = Math.random() > 0.5
  let probabilisticStone = 'create:scoria'
  if (diceRoll) probabilisticStone = 'create:scorchia'
  create.crushing(
    [
      Item.of('minecraft:ancient_debris').withChance(0.005),
      Item.of('minecraft:iron_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:copper_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('minecraft:gold_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:zinc_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('thermal:silver_nugget').withChance(randRange(0.01, 0.1)),
    ],
    probabilisticStone
  )

  // Ancient Debris processing
  e.remove({ id: /minecraft:netherite_scrap.*/ })
  e.remove({ id: 'minecraft:netherite_ingot' })
  pneumaticcraft
    .Assembly('minecraft:ancient_debris')
    .type(Assembly.TYPE_LASER)
    .outputs('minecraft:netherite_scrap')
  create
    .compacting('minecraft:netherite_ingot', [
      '2x minecraft:netherite_scrap',
      '2x minecraft:gold_ingot',
    ])
    .superheated()

  // create_connected:control_chip

  // Red alloy overhaul
  e.remove({ id: 'morered:red_alloy_ingot_from_jumbo_smelting' })
  create.filling('morered:red_alloy_ingot', [
    'create_new_age:overcharged_iron',
    Fluid.of('kubejs:molten_redstone', 360),
  ])

  // Overhaul Refined Storage processors
  e.remove({ id: /^refinedstorage:[a-z_]+_processor/ })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_ingot')
    .deploy('minecraft:iron_ingot')
    .outputs('refinedstorage:raw_basic_processor')
  pneumaticcraft
    .Assembly('refinedstorage:raw_basic_processor')
    .type(Assembly.TYPE_LASER)
    .outputs('refinedstorage:basic_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_ingot')
    .deploy('minecraft:gold_ingot')
    .outputs('refinedstorage:raw_improved_processor')
  pneumaticcraft
    .Assembly('refinedstorage:raw_improved_processor')
    .type(Assembly.TYPE_LASER)
    .outputs('refinedstorage:improved_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_ingot')
    .deploy('thermal:diamond_dust')
    .outputs('refinedstorage:raw_advanced_processor')
  pneumaticcraft
    .Assembly('refinedstorage:raw_advanced_processor')
    .type(Assembly.TYPE_LASER)
    .outputs('refinedstorage:advanced_processor')

  // Mechanism assembly
  create.mechanical_crafting(
    'kubejs:logistics_mechanism',
    [
      'PPPPP', //
      'PRNRP', //
      'PBMIP', //
      'PCCCP', //
      'PPPPP', //
    ],
    {
      M: 'tfmg:steel_mechanism',
      P: 'pneumaticcraft:plastic',
      C: 'pneumaticcraft:printed_circuit_board',
      B: 'refinedstorage:basic_processor',
      I: 'refinedstorage:improved_processor',
      R: 'morered:red_alloy_ingot',
      N: 'thermal:netherite_nugget',
    }
  )
})
