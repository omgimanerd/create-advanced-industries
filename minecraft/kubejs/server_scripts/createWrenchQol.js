// priority: 100

ServerEvents.tags('block', (e) => {
  // Trapdoors can be picked up by the Create wrench.
  Ingredient.of(/.*_trapdoor$/).itemIds.forEach((id) => {
    if (Item.of(id).block) {
      e.add('create:wrench_pickup', id)
      // Some modded trapdoors are not correctly tagged.
      e.add('minecraft:trapdoors', id)
    }
  })

  // Make Functional Storage drawers wrenchable.
  Ingredient.of(/^functionalstorage:.*$/).itemIds.forEach((id) => {
    if (Item.of(id).block) {
      e.add('create:wrench_pickup', id)
    }
  })

  // Make Tom's Simple Storage Mod items wrenchable.
  Ingredient.of(/^toms_storage:.*$/).itemIds.forEach((id) => {
    if (Item.of(id).block) {
      e.add('create:wrench_pickup', id)
    }
  })
})

// Allow vanilla and modded blocks to be rotatable with the Create wrench.
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

  const blockWhitelist = {
    'minecraft:piston': true,
    'minecraft:sticky_piston': true,
    'minecraft:repeater': true,
    'minecraft:comparator': true,
    'minecraft:dispenser': true,
    'minecraft:dropper': true,
    'minecraft:hopper': true,
    'minecraft:observer': true,
  }

  // This is only needed for the hopper, which will throw an error if we
  // attempt set it into this state.
  const forbiddenStates = {
    'minecraft:hopper': 'up',
  }

  BlockEvents.rightClicked((e) => {
    const { item, hand, facing, block, player } = e
    // Rotation must be done with the Create wrench in the main hand.
    if (item.id !== 'create:wrench' || hand !== 'main_hand') return
    // If the player is crouching, defer to the default breaking behavior.
    if (player.crouching) return
    // Create blocks themselves have special handlers we should not mess with.
    if (block.id.startsWith('create:')) return

    // Only allow whitelisted blocks to be rotated.
    let allowed = !!blockWhitelist[block.id]
    // If the block list check fails, check to see if it has the
    // kubejs:create_wrench_rotate tag, which is slower.
    if (!allowed) {
      if (block.hasTag('kubejs:create_wrench_rotate')) {
        allowed = true
      }
    }
    if (!allowed) return

    // If the block does not have rotation property (for whatever reason), stop
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
     *
     * Rotate the block until it is not in a forbidden state.
     */
    if (facing.axisDirection.step > 0) {
      newDirection = blockFacingDirection.getClockWise(facing.axis)
    } else {
      newDirection = blockFacingDirection.getCounterClockWise(facing.axis)
    }
    if (newDirection === forbiddenStates[block.id]) {
      // Theoretically should never end up in a forbidden state since it's a
      // dict, but the new direction could still be invalid and cause an error.
      newDirection = blockFacingDirection.getOpposite()
    }
    // block.properties is immutable, so we need to copy it.
    const newProperties = Object.assign({}, block.properties, {
      facing: newDirection,
    })
    block.set(block.id, newProperties)
    player.swing()
    if (newDirection !== blockFacingDirection) {
      player.playNotifySound('create:wrench_rotate', 'players', 1, 1)
    }
    e.cancel()
  })
})()
