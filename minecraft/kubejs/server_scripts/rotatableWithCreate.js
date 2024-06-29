// priority: 100

;(() => {
  /** @type {{string:Internal.Direction_}} */
  const direction = {
    up: Direction.UP,
    down: Direction.DOWN,
    north: Direction.NORTH,
    south: Direction.SOUTH,
    east: Direction.EAST,
    west: Direction.WEST,
  }

  const whitelist = {
    'minecraft:piston': true,
    'minecraft:sticky_piston': true,
    'minecraft:repeater': true,
    'minecraft:comparator': true,
    'minecraft:dispenser': true,
    'minecraft:dropper': true,
    'minecraft:hopper': true,
    'minecraft:observer': true,
  }

  const forbiddenStates = {
    'minecraft:hopper': 'up',
  }

  BlockEvents.rightClicked((e) => {
    const { item, hand, facing, block, player } = e
    if (hand !== 'main_hand' || player.crouching) return
    if (item.id !== 'create:wrench') return
    if (block.id.startsWith('create:')) return
    if (!whitelist[block.id]) return
    if (block.properties === undefined) return
    const blockFacing = block.properties.facing
    if (blockFacing === undefined) return
    /** @type {Internal.Direction_} */
    const blockFacingDirection = direction[blockFacing]
    let newDirection
    /**
     * facing.axis is one of [x, y, z] without regard for the positive or
     * negative direction. We need to take into account the negative or positive
     * directive or this will rotate blocks the opposite way if we are facing
     * the opposite side of the block.
     */
    if (facing.axisDirection.step > 0) {
      newDirection = blockFacingDirection.getClockWise(facing.axis)
    } else {
      newDirection = blockFacingDirection.getCounterClockWise(facing.axis)
    }
    const newProperties = Object.assign({}, block.properties, {
      facing: newDirection,
    })
    if (forbiddenStates[block.id] === newDirection) return
    block.set(block.id, newProperties)
    player.swing()
    if (newDirection !== blockFacingDirection) {
      player.playNotifySound('create:wrench_rotate', 'players', 2, 1)
    }
    e.cancel()
  })
})()
