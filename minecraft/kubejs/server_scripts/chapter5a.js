// priority: 100
// Recipe overhauls for Chapter 4C progression.

ServerEvents.tags('fluid', (e) => {
  e.add('forge:crude_oil', 'tfmg:crude_oil_fluid')
})

ItemEvents.rightClicked('kubejs:diamond_sawblade', (e) => {
  if (!e.player.level.isClientSide() && !e.player.isCreative()) {
    const $DamageSources = Java.loadClass(
      'net.minecraft.world.damagesource.DamageSources'
    )
    e.player.attack(new $DamageSources(e.level.registryAccess()).cactus(), 1)
    e.player.damageHeldItem()
    e.player.tell("Ouch, that's sharp!")
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Hardened planks can only be crafted in a pressure chamber
  e.remove({ id: 'tfmg:filling/hardened_wood_creosote' })
  pneumaticcraft
    .PressureChamber(['8x #minecraft:planks', '1x tfmg:creosote_bucket'])
    .pressure(2)
    .outputs('8x tfmg:hardened_planks')

  // Overhaul refinery recipe

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

  // Cool plastic in a heat frame
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/plastic' })
  pneumaticcraft
    .HeatFrame('1000mb pneumaticcraft:plastic')
    .bonusOutput(/*limit=*/ 1, /*multiplier=*/ 0.01)
    .maxTemp(70)
    .outputs('2x tfmg:plastic_sheet')
  create.cutting('3x pneumaticcraft:plastic', 'tfmg:plastic_sheet')

  // TODO overhaul reinf stone

  // Silicon overhaul, must be crystallized in a heat frame
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

  // Diamond sawblades to cut silicon into wafers
  e.shaped(
    'kubejs:diamond_saw_blade',
    [
      'DDD', //
      'DSD', //
      'DDD', //
    ],
    {
      D: 'createaddition:diamond_grit',
      S: 'thermal:saw_blade',
    }
  )
  create
    .SequencedAssembly('refinedstorage:silicon')
    .deploy('#kubejs:diamond_saw_blade')
    .fill('minecraft:water', 500)
    .loops(4)
    .outputs('4x kubejs:silicon_wafer')

  // Transistor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/transistor' })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('minecraft:glass_pane')
    .deploy('minecraft:redstone_torch')
    .deploy('pneumaticcraft:plastic')
    .press()
    .outputs('pneumaticcraft:transistor')

  // Capacitor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/capacitor' })
  create
    .SequencedAssembly('thermal:silver_plate')
    .deploy('pneumaticcraft:plastic')
    .deploy('thermal:silver_plate')
    .deploy('minecraft:redstone_torch')
    .press()
    .outputs('pneumaticcraft:capacitor')

  // Pneumatic cylinder overhaul
  e.remove({ id: 'pneumaticcraft:pneumatic_cylinder' })
  create
    .SequencedAssembly('pneumaticcraft:cannon_barrel')
    .deploy('tfmg:rebar')
    .press()
    .fill('pneumaticcraft:lubricant', 250)
    .press(2)
    .outputs('pneumaticcraft:pneumatic_cylinder')

  // make gates with pneu assemblylatc

  // red alloy + FE gen

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
  e.remove({ id: /^create_new_age:cutting\/.*/ })
  const wireCraftingShape = [
    'WWW', //
    'WSW', //
    'WWW', //
  ]
  const defineWireOverhauls = (wire, coil) => {
    e.shaped(coil, wireCraftingShape, {
      W: wire,
      S: 'createaddition:spool',
    })
    create
      .SequencedAssembly('createaddition:spool')
      .deploy(wire)
      .loops(4)
      .outputs(coil)
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

  // Magnetite block crafting recipe
  create.energising(
    'create_new_age:magnetite_block',
    'minecraft:iron_block',
    9000
  )

  // Basalt probabilistic crushing
  create.crushing(
    [
      Item.of('minecraft:ancient_debris').withChance(0.005),
      Item.of('minecraft:iron_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:copper_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('minecraft:gold_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:zinc_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('thermal:silver_nugget').withChance(randRange(0.01, 0.1)),
    ],
    'minecraft:basalt'
  )

  // Two types of stone production, one is useless, other produces ancient
  // debris

  // netherite
  //

  create
    .SequencedAssembly('create:precision_mechanism')
    .transitional('kubejs:incomplete_logistics_mechanism')
    .deploy('pneumaticcraft:plastic')
    .deploy('pneumaticcraft:printed_circuit_board')
    .outputs('kubejs:logistics_mechanism')
})
