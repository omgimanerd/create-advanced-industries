// priority: 0

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  registerItem('zinc_hand')

  registerItem('steel_nugget')
  registerItem('steel_ingot')

  registerItem('clay_ingot_cast').maxStackSize(16)
  registerItem('clay_gem_cast').maxStackSize(16)

  const registerCast = (material) => {
    registerItem(
      `${material}_intermediate_cast`,
      'create:sequenced_assembly'
    ).maxStackSize(16)
  }

  registerCast('iron')
  registerCast('copper')
  registerCast('gold')
  registerCast('zinc')
  registerCast('brass')

  registerCast('quartz')
  registerCast('diamond')
  registerCast('emerald')
  registerCast('lapis')
  registerCast('redstone')
})
