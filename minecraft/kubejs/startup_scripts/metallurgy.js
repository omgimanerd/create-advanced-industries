// priority: 10

global.metallurgy = {}
global.metallurgy.kDefaultNuggetFluid = 10
global.metallurgy.kDefaultIngotFluid = 90
global.metallurgy.kDefaultBlockRatio = 9
global.metallurgy.clayCastLayerColor = 0xabb5d0
global.metallurgy.steelCastLayerColor = 0x7f8382

global.metallurgy.getClayCastName = (fluid) => {
  return `kubejs:${stripPrefix(fluid)}_clay_cast`
}

global.metallurgy.getSteelCastName = (fluid) => {
  return `kubejs:${stripPrefix(fluid)}_steel_cast`
}

global.metallurgy.meltable_item_data = [
  {
    nugget: 'minecraft:iron_nugget',
    ingot: 'minecraft:iron_ingot',
    block: 'minecraft:iron_block',
    fluid: 'kubejs:molten_iron',
    color: 0x790a0a,
  },
  {
    nugget: 'create:copper_nugget',
    ingot: 'minecraft:copper_ingot',
    block: 'minecraft:copper_block',
    fluid: 'kubejs:molten_copper',
    color: 0xa33b1f,
  },
  {
    nugget: 'minecraft:gold_nugget',
    ingot: 'minecraft:gold_ingot',
    block: 'minecraft:gold_block',
    fluid: 'kubejs:molten_gold',
    color: 0xf3d000,
  },
  {
    nugget: 'create:zinc_nugget',
    ingot: 'create:zinc_ingot',
    block: 'create:zinc_block',
    fluid: 'kubejs:molten_zinc',
    color: 0xaebda8,
  },
  {
    nugget: 'create:brass_nugget',
    ingot: 'create:brass_ingot',
    block: 'create:brass_block',
    fluid: 'kubejs:molten_brass',
    color: 0xf8ca67,
  },
  {
    nugget: 'thermal:lead_nugget',
    ingot: 'thermal:lead_ingot',
    block: 'thermal:lead_block',
    fluid: 'kubejs:molten_lead',
    color: 0x262653,
  },
  {
    nugget: 'thermal:silver_nugget',
    ingot: 'thermal:silver_ingot',
    block: 'thermal:silver_block',
    fluid: 'kubejs:molten_silver',
    color: 0x64747c,
  },
  {
    ingot: 'tfmg:cast_iron_ingot',
    block: 'tfmg:cast_iron_block',
    fluid: 'kubejs:molten_cast_iron',
    color: 0x363639,
  },
  {
    ingot: 'tfmg:steel_ingot',
    block: 'tfmg:steel_block',
    fluid: 'tfmg:molten_steel',
    noRegisterFluid: true,
    color: 0xffed56,
  },
  {
    gem: 'minecraft:quartz',
    block: 'minecraft:quartz_block',
    block_ratio: 4,
    fluid: 'kubejs:molten_quartz',
    color: 0xd6c0bf,
  },
  {
    gem: 'minecraft:diamond',
    block: 'minecraft:diamond_block',
    fluid: 'kubejs:molten_diamond',
    color: 0x25ebec,
    superheated: true,
  },
  {
    gem: 'minecraft:emerald',
    block: 'minecraft:emerald_block',
    fluid: 'kubejs:molten_emerald',
    color: 0x2cc879,
    superheated: true,
  },
  {
    gem: 'minecraft:lapis_lazuli',
    block: 'minecraft:lapis_block',
    fluid: 'kubejs:molten_lapis',
    color: 0x2c5cc8,
  },
  {
    gem: 'minecraft:redstone',
    block: 'minecraft:redstone_block',
    fluid: 'kubejs:molten_redstone',
    color: 0xc82c2c,
  },
]

// Register fluids for all the molten metals
StartupEvents.registry('fluid', (e) => {
  for (const data of global.metallurgy.meltable_item_data) {
    if (!data.noRegisterFluid) {
      e.create(data.fluid)
        .thickTexture(data.color)
        .bucketColor(data.color)
        .displayName(getDisplayName(data.fluid))
    }
  }
})

// Register all items for all the metallurgy
StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Breakable clay casts for early metallurgy
  registerItem('kubejs:clay_ingot_cast').maxStackSize(16)
  registerItem('kubejs:clay_gem_cast').maxStackSize(16)

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
    .color(0, global.metallurgy.steelCastLayerColor)
    .color(1, 0x232323)
    .maxStackSize(16)
  e.create('kubejs:intermediate_steel_gem_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: 'minecraft:item/diamond',
    })
    .color(0, global.metallurgy.steelCastLayerColor)
    .color(1, 0x232323)
    .maxStackSize(16)

  // Reuseable steel casts used for metallurgy.
  e.create('kubejs:steel_ingot_cast')
    .textureJson({
      layer0: `${global.cai}:item/clay_ingot_cast`,
    })
    .color(0, global.metallurgy.steelCastLayerColor)
    .displayName('Steel Ingot Cast')
    .maxStackSize(16)
  e.create('kubejs:steel_gem_cast')
    .textureJson({
      layer0: `${global.cai}:item/clay_gem_cast`,
    })
    .color(0, global.metallurgy.steelCastLayerColor)
    .displayName('Steel Gem Cast')
    .maxStackSize(16)

  // Register casting recipes for molten metals into both the clay and steel
  // casts.
  global.metallurgy.meltable_item_data.forEach((data) => {
    const isGem = data.gem !== undefined
    const baseLayer = `${global.cai}:item/blank_cast`
    const fluidLayer = getResourceLocation(isGem ? data.gem : data.ingot)
    const displayName = getDisplayName(data.fluid)
    e.create(global.metallurgy.getClayCastName(data.fluid))
      .textureJson({
        layer0: baseLayer,
        layer1: fluidLayer,
      })
      .color(0, global.metallurgy.clayCastLayerColor)
      .color(1, data.color)
      .displayName(`Claycast ${displayName}`)
      .maxStackSize(16)
    e.create(global.metallurgy.getSteelCastName(data.fluid))
      .textureJson({
        layer0: baseLayer,
        layer1: fluidLayer,
      })
      .color(0, global.metallurgy.steelCastLayerColor)
      .color(1, data.color)
      .displayName(`Steelcast ${displayName}`)
      .maxStackSize(16)
  })
})
