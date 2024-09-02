// priority: 500

EntityEvents.hurt((e) => {
  if (e.entity.type !== 'minecraft:sheep') return

  console.log(e.entity.nbt.getByte('Color'))

  let nbt = e.entity.nbt
  nbt.putByte('Color', (nbt.getByte('Color') + 1) % 16)
  e.entity.setNbt(nbt)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Chromatic Compound Crafting
  create
    .pressurizing(Fluid.of('kubejs:chromatic_fluid', 360))
    .superheated()
    .processingTime(100)
    .outputs('create:chromatic_compound')
})
