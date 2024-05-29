// priority: 1000

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)
  const registerMechanism = (name) => {
    registerItem(name)
    registerItem(
      `kubejs:incomplete_${stripModPrefix(name)}`,
      'create:sequenced_assembly'
    )
  }

  // Chapter 1: Andesite Mechanisms
  registerMechanism('kubejs:andesite_mechanism')
  // Chapter 2a: Copper Mechanisms
  registerMechanism('kubejs:copper_mechanism')
  // Chapter 2b: Source Mechanisms
  registerMechanism('kubejs:source_mechanism')
  // Precision mechanism defined by Create
  // Steel mechanism defined by TFMG
  // Chapter 5a: Logistics Mechanisms
  registerMechanism('kubejs:logistics_mechanism')
  // Chapter 5b: Crystalline Mechanism
  registerMechanism('kubejs:crystalline_mechanism')
  // Vibrational Mechanisms defined by Create: Misc and Things
  // Quantum mechanisms defined by Create: Teleporters

  // Wooden hand used for crafting deployers
  registerItem('kubejs:wooden_hand')

  // Unbreakable screwdriver for crafting steel mechanisms
  e.create('kubejs:unbreakable_screwdriver')
    .texture(getTextureLocation('tfmg:screwdriver'))
    .displayName('Unbreakable Screwdriver')
    .tooltip(Text.green('An unbreakable screwdriver!'))
    .glow(true)
    .fireResistant(true)
    .maxDamage(0)

  // Diamond sawblades for silicon cutting
  e.create('kubejs:diamond_saw_blade')
    .textureJson({
      layer0: getTextureLocation('thermal:saw_blade'),
    })
    .color(0xaffffa)
    .displayName('Diamond Saw Blade')
    .fireResistant(true)
    .maxDamage(64)
    .tag('kubejs:diamond_saw_blade')
    .unstackable()
  e.create('kubejs:unbreakable_diamond_saw_blade')
    .textureJson({
      layer0: getTextureLocation('thermal:saw_blade'),
    })
    .color(0xaffffa)
    .displayName('Unbreakable Diamond Saw Blade')
    .tooltip(Text.green("An unbreakable diamond saw blade. It's quite sharp."))
    .fireResistant(true)
    .glow(true)
    .maxDamage(0)
    .tag('kubejs:diamond_saw_blade')
    .unstackable()

  // Silicon wafers produced from cutting silicon
  e.create('kubejs:silicon_wafer')
    .textureJson({
      layer0: getTextureLocation('refinedstorage:silicon'),
    })
    .color(0, 0xaa9eac)
    .displayName('Silicon Wafer')

  // Intermediate item for transistors
  e.create('kubejs:intermediate_transistor', 'create:sequenced_assembly')
    .texture(getTextureLocation('pneumaticcraft:transistor'))
    .maxStackSize(16)

  // Intermediate item for capacitors
  e.create('kubejs:intermediate_capacitor', 'create:sequenced_assembly')
    .texture(getTextureLocation('pneumaticcraft:capacitor'))
    .maxStackSize(16)

  // Intermediate item for pneumatic cylinders
  e.create(
    'kubejs:intermediate_pneumatic_cylinder',
    'create:sequenced_assembly'
  )
    .texture(getTextureLocation('pneumaticcraft:pneumatic_cylinder'))
    .maxStackSize(16)

  // Wire variant of Create: New Age charged items
  e.create('kubejs:overcharged_diamond_wire')
    .textureJson({
      layer0: getTextureLocation('createaddition:iron_wire'),
    })
    .color(0, 0x75eae3)
    .displayName('Overcharged Diamond Wire')

  // Graphite, produced by heating silicon carbide
  registerItem('kubejs:graphite')

  // Essences from killing wandering traders
  e.create('kubejs:agony_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_tube_coral',
    })
    .color(0, 0x75eae3)
    .glow(true)
    .displayName('Agony Essence')
  e.create('kubejs:suffering_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_brain_coral',
    })
    .color(0, 0xab87d2)
    .glow(true)
    .displayName('Suffering Essence')
  e.create('kubejs:torment_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_bubble_coral',
    })
    .color(0, 0x69fa00)
    .glow(true)
    .displayName('Torment Essence')
  e.create('kubejs:debilitation_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_fire_coral',
    })
    .color(0, 0x696969)
    .glow(true)
    .displayName('Debilitation Essence')
  e.create('kubejs:mutilation_essence')
    .textureJson({
      layer0: 'minecraft:block/dead_horn_coral',
    })
    .color(0, 0xa999bc)
    .glow(true)
    .displayName('Mutilation Essence')

  // Custom amethyst golem charm to spawn a special golem named Remy.
  e.create('kubejs:remy_spawner')
    .texture(getTextureLocation('ars_nouveau:amethyst_golem_charm'))
    .glow(true)
    .displayName('Remy Spawner')
    .tooltip(Text.green('Summons a epicure named Remy!'))

  // Elemental air gem
  registerItem('kubejs:topaz')

  // Resonant ender pearl for melting to resonant ender
  registerItem('kubejs:resonant_ender_pearl')

  // Hyper XP condenser
  registerItem('kubejs:xp_condenser').glow(true)
  registerItem('kubejs:inert_xp_condenser')
  registerItem('kubejs:incomplete_xp_condenser', 'create:sequenced_assembly')

  // Fish chum
  e.create('kubejs:fish_chum')
    .texture(getTextureLocation('farmersdelight:cod_slice'))
    .displayName('Fish Chum')
    .food((food) => {
      food.hunger(1).saturation(1).effect('minecraft:hunger', 30, 0, 1)
    })

  // Treasure net
  e.create('kubejs:treasure_net')
    .texture(getTextureLocation('thermal:junk_net'))
    .displayName('Treasure Net')
    .glow(true)
    .unstackable()
})
