// priority: 0

global.metallurgy = {}

global.metallurgy.meltable_items = [
  new MeltableItem({
    nugget: 'minecraft:iron_nugget',
    ingot: 'minecraft:iron_ingot',
    block: 'minecraft:iron_block',
    fluid: 'kubejs:molten_iron',
    fluidColor: 0x790a0a,
  }),
  new MeltableItem({
    nugget: 'create:copper_nugget',
    ingot: 'minecraft:copper_ingot',
    block: 'minecraft:copper_block',
    fluid: 'kubejs:molten_copper',
    fluidColor: 0xa33b1f,
  }),
  new MeltableItem({
    nugget: 'minecraft:gold_nugget',
    ingot: 'minecraft:gold_ingot',
    block: 'minecraft:gold_block',
    fluid: 'kubejs:molten_gold',
    fluidColor: 0xf3d000,
  }),
  new MeltableItem({
    nugget: 'create:zinc_nugget',
    ingot: 'create:zinc_ingot',
    block: 'create:zinc_block',
    fluid: 'kubejs:molten_zinc',
    fluidColor: 0xaebda8,
  }),
  new MeltableItem({
    nugget: 'create:brass_nugget',
    ingot: 'create:brass_ingot',
    block: 'create:brass_block',
    fluid: 'kubejs:molten_brass',
    fluidColor: 0xf8ca67,
  }),
  new MeltableItem({
    nugget: 'thermal:lead_nugget',
    ingot: 'thermal:lead_ingot',
    block: 'thermal:lead_block',
    fluid: 'kubejs:molten_lead',
    fluidColor: 0x262653,
  }),
  new MeltableItem({
    nugget: 'thermal:silver_nugget',
    ingot: 'thermal:silver_ingot',
    block: 'thermal:silver_block',
    fluid: 'kubejs:molten_silver',
    fluidColor: 0x64747c,
  }),
  new MeltableItem({
    ingot: 'tfmg:cast_iron_ingot',
    block: 'tfmg:cast_iron_block',
    fluid: 'kubejs:molten_cast_iron',
    fluidColor: 0x363639,
  }),
  new MeltableItem({
    ingot: 'tfmg:steel_ingot',
    block: 'tfmg:steel_block',
    fluid: 'tfmg:molten_steel',
    noRegisterFluid: true,
    fluidColor: 0xffed56,
    requiresSuperheating: true,
  }),
  new MeltableItem({
    gem: 'quark:clear_shard',
    block: '#forge:glass',
    blockCastingOutput: 'minecraft:glass',
    blockRatio: 4,
    fluid: 'kubejs:molten_glass',
    fluidColor: 0xcee7e6,
    noGemCastingRecipe: true,
  }),
  new MeltableItem({
    gem: 'minecraft:quartz',
    block: 'minecraft:quartz_block',
    blockRatio: 4,
    fluid: 'kubejs:molten_quartz',
    fluidColor: 0xd6c0bf,
  }),
  new MeltableItem({
    gem: 'minecraft:diamond',
    block: 'minecraft:diamond_block',
    fluid: 'kubejs:molten_diamond',
    fluidColor: 0x25ebec,
    requiresSuperheating: true,
  }),
  new MeltableItem({
    gem: 'minecraft:emerald',
    block: 'minecraft:emerald_block',
    fluid: 'kubejs:molten_emerald',
    fluidColor: 0x2cc879,
    requiresSuperheating: true,
  }),
  new MeltableItem({
    gem: 'minecraft:lapis_lazuli',
    block: 'minecraft:lapis_block',
    fluid: 'kubejs:molten_lapis',
    fluidColor: 0x2c5cc8,
  }),
  new MeltableItem({
    gem: 'minecraft:redstone',
    block: 'minecraft:redstone_block',
    fluid: 'kubejs:molten_redstone',
    fluidColor: 0xc82c2c,
  }),
]

// Register the fluids for all the meltable items if necessary
StartupEvents.registry('fluid', (e) => {
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerFluid(e)
  })
})

// Register all metallurgy related items.
StartupEvents.registry('item', (e) => {
  // Helper method to dynamically create textures for the base casts that molten
  // materials will be poured into.
  const negatives = {
    ingot: 'minecraft:iron_ingot',
    gem: `${global.cai}:gem_cast_negative`,
    block: `${global.cai}:block_cast_negative`,
  }
  const registerBaseCasts = (type, shape) => {
    if (type !== 'clay' && type !== 'steel') {
      throw Error(`Invalid type ${type} specified.`)
    }
    const baseColor =
      type === 'clay'
        ? MeltableItem.CLAY_CAST_COLOR
        : MeltableItem.STEEL_CAST_COLOR
    const negativeShape = negatives[shape]
    if (negativeShape === undefined) {
      throw Error(`Invalid shape ${shape} specified.`)
    }
    e.create(`kubejs:${type}_${shape}_cast`)
      .textureJson({
        layer0: `${global.cai}:item/blank_cast`,
        layer1: getResourceLocation(negativeShape),
      })
      .color(0, baseColor)
      .color(1, MeltableItem.NEGATIVE_CAST_COLOR)
      .maxStackSize(16)
  }
  // Breakable clay casts for early metallurgy
  registerBaseCasts('clay', 'gem')
  registerBaseCasts('clay', 'ingot')
  registerBaseCasts('clay', 'block')
  // Reuseable steel casts for metallurgy
  registerBaseCasts('steel', 'gem')
  registerBaseCasts('steel', 'ingot')
  registerBaseCasts('steel', 'block')

  // Intermediate item when cast iron is forged into industrial iron
  e.create('kubejs:intermediate_industrial_iron_ingot')
    .texture('createdeco:item/industrial_iron_ingot')
    .maxStackSize(16)

  // Intermediate cast items created during the sequenced assembly recipes to
  // make the reuseable casts. NOT the same as the intermediate items when
  // metal is casted INTO the steel casts.
  e.create('kubejs:intermediate_steel_ingot_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: 'minecraft:item/iron_ingot',
    })
    .color(0, MeltableItem.STEEL_CAST_COLOR)
    .color(1, MeltableItem.NEGATIVE_CAST_COLOR)
    .maxStackSize(16)
  e.create('kubejs:intermediate_steel_gem_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: `${global.cai}:item/gem_cast_negative`,
    })
    .color(0, MeltableItem.STEEL_CAST_COLOR)
    .color(1, MeltableItem.NEGATIVE_CAST_COLOR)
    .maxStackSize(16)
  e.create('kubejs:intermediate_steel_block_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: `${global.cai}:item/block_cast_negative`,
    })
    .color(0, MeltableItem.STEEL_CAST_COLOR)
    .color(1, MeltableItem.NEGATIVE_CAST_COLOR)
    .maxStackSize(16)

  // Register casting recipes for the meltable items into both the clay and
  // steel casts.
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerCastedItems(e)
  })
})
