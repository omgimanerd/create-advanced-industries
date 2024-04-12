// priority: 100
// Recipe overhauls for Chapter 4C progression.

ServerEvents.tags('fluid', (e) => {
  e.add('forge:crude_oil', 'tfmg:crude_oil_fluid')

  // Required for heat frame cooling
  e.add('kubejs:molten_silicon', 'kubejs:molten_silicon')
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
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Basalt probabilistic crushing
  e.recipes.create.crushing(
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

  // Each of the petrochem processes has a chance to yield sulfur
  // 1000mb crude oil =
  //   200 mb diesel = 160 kerosene
  //   300 mb kerosene + 160 kerosene = 368 gasoline
  //   300 mb gasoline + 368 gasoline = 534.4 lpg
  //   200 mb lpg + 534.4 lpg = 734.4 total
  // Fractional distillation overhauls
  e.remove({ id: 'pneumaticcraft:thermo_plant/kerosene' })
  new ThermoPlantRecipe(['100mb #forge:diesel'])
    .pressure(2)
    .minTemp(573)
    .outputs(e, ['80mb pneumaticcraft:kerosene', 'thermal:bitumen'])
  e.remove({ id: 'pneumaticcraft:thermo_plant/gasoline' })
  new ThermoPlantRecipe(['100mb #forge:kerosene'])
    .pressure(2)
    .minTemp(573)
    .outputs(e, ['80mb pneumaticcraft:gasoline', 'thermal:sulfur'])
  e.remove({ id: 'pneumaticcraft:thermo_plant/lpg' })
  new ThermoPlantRecipe(['100mb #forge:gasoline'])
    .pressure(2)
    .minTemp(573)
    .outputs(e, ['80mb pneumaticcraft:lpg', 'thermal:sulfur'])

  // Overhaul lubricant from diesel

  // Plastic must come from petrochemical processing, nerf it a little bit
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_lpg' })
  new ThermoPlantRecipe(['250mb #forge:lpg', 'minecraft:coal'])
    .minTemp(373)
    .outputs(e, ['250mb pneumaticcraft:plastic'])

  // Cool plastic in a heat frame
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/plastic' })
  new HeatFrameRecipe('1000mb pneumaticcraft:plastic')
    .bonusOutput(/*limit=*/ 1, /*multiplier=*/ 0.01)
    .outputs(e, '2x tfmg:plastic_sheet')
  e.recipes.create.cutting('3x pneumaticcraft:plastic', 'tfmg:plastic_sheet')

  // TODO overhaul reinf stone

  // Silicon overhaul
  e.remove({ id: 'refinedstorage:silicon' })
  e.recipes.create
    .mixing(
      [Fluid.of('kubejs:molten_silicon', 3 * ingotFluid), '2x thermal:slag'],
      ['4x minecraft:quartz', '2x tfmg:coal_coke_dust']
    )
    .superheated()
  e.recipes.create
    .mixing(
      [Fluid.of('kubejs:molten_silicon', 3 * ingotFluid), '2x thermal:slag'],
      [
        Fluid.of('kubejs:molten_quartz', 3 * ingotFluid),
        '2x tfmg:coal_coke_dust',
      ]
    )
    .superheated()
  new HeatFrameRecipe('360mb kubejs:molten_silicon').outputs(
    e,
    '4x refinedstorage:silicon'
  )

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
  new SequencedAssembly(e, 'refinedstorage:silicon')
    .deploy('#kubejs:diamond_saw_blade')
    .fill('minecraft:water', 500)
    .loops(4)
    .outputs('4x kubejs:silicon_wafer')

  // Transistor overhaul
  e.remove({ id: 'pneumaticcraft:pressure_chamber/transistor' })
  new SequencedAssembly(e, 'kubejs:silicon_wafer')
    .deploy('minecraft:glass_pane')
    .deploy('minecraft:redstone_torch')
    .deploy('pneumaticcraft:plastic')
    .press()
    .outputs('pneumaticcraft:transistor')

  // Capacitor overhaul
  new SequencedAssembly(e, 'thermal:silver_plate')
    .deploy('pneumaticcraft:plastic')
    .deploy('thermal:silver_plate')
    .press()
    .outputs('pneumaticcraft:capacitor')

  // Pneumatic cylinder overhaul
  e.remove({ id: 'pneumaticcraft:pneumatic_cylinder' })
  new SequencedAssembly(e, 'pneumaticcraft:cannon_barrel')
    .deploy('tfmg:rebar')
    .press()
    .fill('pneumaticcraft:lubricant', 250)
    .press(2)
    .outputs('pneumaticcraft:pneumatic_cylinder')

  // make gates with pneu assemblylatc

  // netherite
  //

  // red alloy + FE gen

  // Hardened planks can only be crafted in a pressure chamber

  new SequencedAssembly(e, 'create:precision_mechanism')
    .transitional('kubejs:incomplete_logistics_mechanism')
    .deploy('pneumaticcraft:plastic')
    .deploy('pneumaticcraft:printed_circuit_board')
    .outputs('kubejs:logistics_mechanism')
})
