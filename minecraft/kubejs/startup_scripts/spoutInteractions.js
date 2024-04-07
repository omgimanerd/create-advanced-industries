// priority: 0

CreateEvents.spoutHandler((e) => {
  // Registers a custom spout interaction.
  //
  // Stolen from the Create-Arcane-Engineering code where they did cool things
  // with the Create spout.
  const registerSpoutInteraction = (
    blockId,
    fluidId,
    fluidAmount,
    result,
    requiredFluidAmount
  ) => {
    const prefix = blockId.replace(/[a-z]+:/, 'kubejs:')

    if (requiredFluidAmount === undefined) {
      requiredFluidAmount = fluidAmount
    }

    e.add(`${prefix}_spout_interaction`, blockId, (block, fluid, simulate) => {
      if (fluid.id !== fluidId) {
        return 0
      }
      if (fluid.amount < requiredFluidAmount) {
        return 0
      }
      if (!simulate) {
        if (result !== undefined) {
          block.setBlockState(Block.getBlock(result).defaultBlockState())
        } else {
          const level = block.getLevel()
          block.blockState.randomTick(level, block.pos, level.random)
        }
      }
      return fluidAmount
    })
  }

  registerSpoutInteraction('minecraft:wheat', 'minecraft:water', 100)
})
