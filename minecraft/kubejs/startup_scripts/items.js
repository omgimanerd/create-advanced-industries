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
  registerItem('kubejs:silicon_wafer')

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
    .tag('forge:wires')
    .tag('forge:wires/overcharged_diamond')

  // Graphite, produced by heating silicon carbide
  registerItem('kubejs:graphite')

  // Essences from killing wandering traders
  registerItem('kubejs:agony_essence').glow(true)
  registerItem('kubejs:suffering_essence').glow(true)
  registerItem('kubejs:torment_essence').glow(true)
  registerItem('kubejs:debilitation_essence').glow(true)
  registerItem('kubejs:mutilation_essence').glow(true)

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
  registerItem('kubejs:fish_chum').food((food) => {
    food.hunger(1).saturation(1).effect('minecraft:hunger', 30, 0, 1)
  })

  // Treasure net
  e.create('kubejs:treasure_net')
    .texture(getTextureLocation('thermal:junk_net'))
    .tooltip(
      Text.empty()
        .append(Text.of('Use in the ').gold())
        .append(Text.of('Aquatic Entangler').yellow().italic())
        .append(Text.of(' to catch treasure.').gold())
    )
    .displayName('Treasure Net')
    .glow(true)
    .unstackable()

  // Totem of Undying Parts
  registerItem('kubejs:totem_body_casing')
  registerItem('kubejs:incomplete_totem_body', 'create:sequenced_assembly')
  registerItem('kubejs:totem_body')

  registerItem('kubejs:totem_head_casing')
  registerItem('kubejs:incomplete_totem_head', 'create:sequenced_assembly')
  registerItem('kubejs:totem_head')

  registerItem('kubejs:inactive_totem')

  // Inert potion residue from potion centrifuging
  registerItem('kubejs:inert_potion_residue')

  // Saturated honeycomb
  e.create('kubejs:saturated_honeycomb')
    .texture(getTextureLocation('minecraft:honeycomb'))
    .glow(true)
    .displayName('Saturated Honeycomb')

  // Fish hook
  registerItem('kubejs:fish_hook')
})

ItemEvents.modification((e) => {
  // Change stack size of grenades.
  e.modify('createarmory:impact_nade', (i) => {
    i.setMaxStackSize(16)
  })
  e.modify('createarmory:smoke_nade', (i) => {
    i.setMaxStackSize(16)
  })

  // Change Pneumaticcraft's armor to be on par with netherite since it
  // requires netherite armor.
  e.modify('pneumaticcraft:pneumatic_boots', (i) => {
    i.setArmorProtection(3)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_leggings', (i) => {
    i.setArmorProtection(6)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_chestplate', (i) => {
    i.setArmorProtection(8)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_helmet', (i) => {
    i.setArmorProtection(3)
    i.setArmorToughness(3)
  })
})
