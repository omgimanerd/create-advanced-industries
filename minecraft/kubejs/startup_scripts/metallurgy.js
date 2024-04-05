// priority: 0

global.kDefaultNuggetFluid = 10
global.kDefaultIngotFluid = 90
global.kDefaultBlockRatio = 9

global.meltable_item_data = [
  {
    nugget: 'minecraft:iron_nugget',
    ingot: 'minecraft:iron_ingot',
    block: 'minecraft:iron_block',
    fluid: 'kubejs:molten_iron',
    color: 0xe05555,
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
  for (const data of global.meltable_item_data) {
    e.create(data.fluid)
      .thickTexture(data.color)
      .bucketColor(data.color)
      .displayName(getDisplayName(data.fluid))
  }
})

// Register items for all the metal cast intermediates
StartupEvents.registry('item', (e) => {
  const clayCastLayerColor = 0xabb5d0
  const steelCastLayerColor = 0x272122

  global.meltable_item_data.forEach((data) => {
    const isGem = data.gem !== undefined
    const baseLayer = 'createadvancedindustries:item/blank_cast'
    const fluidLayer = getResourceLocation(isGem ? data.gem : data.ingot)
    const displayName = getDisplayName(data.fluid)
    e.create(`${data.fluid}_clay_cast`)
      .textureJson({
        layer0: baseLayer,
        layer1: fluidLayer,
      })
      .color(0, clayCastLayerColor)
      .color(1, data.color)
      .displayName(`Claycast ${displayName}`)
    e.create(`${data.fluid}_steel_cast`)
      .textureJson({
        layer0: baseLayer,
        layer1: fluidLayer,
      })
      .color(0, steelCastLayerColor)
      .color(1, data.color)
      .displayName(`Steelcast ${displayName}`)
  })
})
