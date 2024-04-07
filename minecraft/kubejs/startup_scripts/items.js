// priority: 10

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  registerItem('kubejs:zinc_hand')

  registerItem('kubejs:clay_ingot_cast').maxStackSize(16)
  registerItem('kubejs:clay_gem_cast').maxStackSize(16)

  // Intermediate cast items created during the sequenced assembly recipes to
  // make the reuseable casts. NOT the same as the intermediate items when
  // metal is casted INTO the steel casts.
  e.create('kubejs:intermediate_steel_ingot_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: 'minecraft:item/iron_ingot',
    })
    .color(0, global.metallurgy.steelCastLayerColor)
    .color(1, 0xacacac)
    .maxStackSize(16)
  e.create('kubejs:intermediate_steel_gem_cast')
    .textureJson({
      layer0: `${global.cai}:item/blank_cast`,
      layer1: 'minecraft:item/diamond',
    })
    .color(0, global.metallurgy.steelCastLayerColor)
    .color(1, 0x9cfce4)
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

  // Unbreakable screwdriver for crafting steel mechanisms
  e.create('kubejs:screwdriver_of_assblasting')
    .texture('tfmg:item/screwdriver')
    .displayName('Unbreakable Screwdriver of Assblasting')
    .glow(true)
    .fireResistant(true)
    .maxDamage(0)
    .use((level, player) => {
      if (level.isClientSide()) {
        player.tell('You got screwed!')
      }
      return true
    })
})
