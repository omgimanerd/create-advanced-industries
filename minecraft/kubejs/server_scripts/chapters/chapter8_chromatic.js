// priority: 500

// Logic to drain chromatic fluid from a colored sheep.
EntityEvents.hurt((e) => {
  const { entity } = e
  if (e.entity.type !== 'minecraft:sheep') return
  const color = entity.nbt.getByte('Color')
  if (color === 0) return
  const block = entity.block
  if (block.id !== 'create:item_drain') return

  // TODO check the item the sheep is hit with.

  // The item drain's fluid handler forbids regular insertion from other
  // compatible fluid handler interactions. We are copying the drain's internal
  // code that enables insertion to fill it with the fluid from an item, and
  // then immediately disables it.
  // ItemDrainBlockEntity.java#L242
  const tank = block.entity.internalTank
  tank.allowInsertion()
  tank
    .getPrimaryHandler()
    .fill(Fluid.of('kubejs:chromatic_fluid', 40), 'execute')
  tank.forbidInsertion()

  // Clear the color of the sheep's wool.
  const nbt = entity.nbt
  nbt.putByte('Color', 0)
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
