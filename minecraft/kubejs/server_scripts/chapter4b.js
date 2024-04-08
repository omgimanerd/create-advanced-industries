// priority: 100
// Recipe overhauls for Chapter 4B progression.

EntityEvents.death('minecraft:wandering_trader', (e) => {
  // console.log(e)
  // console.log(e.source)
})

EntityEvents.spawned((e) => {
  let { entity, level } = e
  if (entity.type == 'ars_nouveau:an_lightning') {
    const surroundingBlocks = [
      { x: -1, y: -1, z: -1 },
      { x: -1, y: -1, z: 0 },
      { x: -1, y: -1, z: 1 },
      { x: 0, y: -1, z: -1 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: -1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: -1, z: 0 },
      { x: 1, y: -1, z: 1 },
    ]
    for (let offset of surroundingBlocks) {
      let block = entity.block.offset(offset.x, offset.y, offset.z)
      if (block == 'minecraft:emerald_block') {
        let trader = block.createEntity('minecraft:wandering_trader')
        trader.spawn()
        level.destroyBlock(block.getPos(), false)
      }
    }
  }
})

ServerEvents.recipes((e) => {
  // Automate emeralds
  // Strike emerald block with lightning to spawn a wandering trader
  // Kill wandering trader in 4 ways to get essences
})
