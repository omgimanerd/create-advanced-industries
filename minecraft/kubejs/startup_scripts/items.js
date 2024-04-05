// priority: 0

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  registerItem('zinc_hand')

  registerItem('clay_ingot_cast').maxStackSize(16)
  registerItem('clay_gem_cast').maxStackSize(16)

  e.create('steel_ingot_cast')
    .textureJson({
      layer0: 'createadvancedindustries:item/clay_ingot_cast',
    })
    .color(0, 0x626262)
    .displayName('Steel Ingot Cast')
    .maxStackSize(16)
  e.create('steel_gem_cast')
    .textureJson({
      layer0: 'createadvancedindustries:item/clay_gem_cast',
    })
    .color(0, 0x626262)
    .displayName('Steel Gem Cast')
    .maxStackSize(16)
})
