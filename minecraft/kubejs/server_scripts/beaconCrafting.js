// priority: 0

BlockEvents.rightClicked('minecraft:beacon', (e) => {
  const { hand, item, block, player, level, server } = e
  if (block.entity.getBeamSections === undefined) return

  // Must be kept in sync with the energizing recipes for each of these items.
  const allowedItems = {
    'create_new_age:overcharged_iron': {
      result: 'minecraft:iron_ingot',
      energy: 1000,
    },
    'create_new_age:overcharged_gold': {
      result: 'minecraft:gold_ingot',
      energy: 2000,
    },
    'create_new_age:overcharged_diamond': {
      result: 'minecraft:diamond',
      energy: 10000,
    },
    'gag:energized_hearthstone': {
      result: 'gag:hearthstone',
      energy: 20000,
    },
  }
  const allowedItem = allowedItems[item.id]
  if (hand !== 'main_hand' || allowedItem === undefined) return
  let { result, energy } = allowedItem

  // Return the uncharged item to the player.
  item.shrink(1)
  player.give(result)

  // While iterating through the beam sections, store the previous beam
  // redirector and direction.
  let color = [1, 1, 1]
  let redirectorBlock = block
  let direction = Direction.UP

  /**
   * Helper method to perform the processing for each block in a beacon beam's
   * collision box. Handles checking all entities with a given block and
   * spawning firework particles.
   * @param {BlockPos_} block
   * @param {number[]} color
   * @param {Internal.BlockContainerJS_} redirectorBlock
   * @param {number} delay
   */
  const processEntitiesInBlock = (block, color, redirectorBlock, delay) => {
    const aabb = AABB.ofBlock(block)
    // Average out the box size and use half its size to determine the
    // processing delay.
    server.scheduleInTicks(delay, () => {
      level
        .getEntitiesWithin(aabb)
        .filter((entity) => {
          return entity.type === 'minecraft:item'
        })
        .forEach((entity) => {
          if (entity.item.id === 'minecraft:glass') entity.discard()
          entity.block.popItem(Item.of('minecraft:yellow_stained_glass'))
        })
      spawnParticles(
        level,
        'minecraft:firework',
        block.getCenter(),
        0.25,
        25,
        0.05,
        true
      )
    })
  }

  // Delay counter in ticks, used to schedule the processing along the length
  // of the beacon beam.
  let delay = 0

  const origin = new Vec3i(0, 0, 0)
  block.entity.getBeamSections().forEach((beam) => {
    // Skip the first beam originating from the beacon itself.
    if (beam.offset.equals(origin)) return
    // The modifying block at this beacon beam's starting point.
    const modifyingBlock = block.offset(
      beam.offset.x,
      beam.offset.y,
      beam.offset.z
    )
    // Integer coordinates represent the north-west corner of a block. The start
    // and end coordinates of the bounding box itself need to be computed
    // differently depending on which direction the beam was facing. Each
    // bounding box encapsulates the block modifying the beam and every block
    // up to the next modifying block, end exclusive.
    let start = redirectorBlock.pos
    let end = modifyingBlock.pos
    switch (direction) {
      // POSITIVE axis direction
      case 'up':
      case 'east':
      case 'south':
        end = end.offset(direction.opposite.normal)
        break
      // NEGATIVE axis direction
      case 'down':
      case 'west':
      case 'north':
        start = start.offset(direction.opposite.normal)
        break
      default:
        throw new Error(`Unexpected direction ${direction}`)
    }
    const beamCollisionBox = AABB.ofBlocks(start, end)
    let blocksInCollisionBox = global.getBlockList(beamCollisionBox)
    // The block list in the AABB is always sorted from lowest to highest
    // coordinate, so the beam direction tells us what direction to iterate
    // either forwards or backwards.
    if (direction.axisDirection.step < 0) blocksInCollisionBox.reverse()
    // Go through each block in the beam collision box
    for (const block of blocksInCollisionBox) {
      processEntitiesInBlock(block, color, redirectorBlock, delay)
      delay++
    }

    // Set the color and redirector block for the next beam.
    color = beam.getColor().map((v) => v)
    redirectorBlock = modifyingBlock
    direction = beam.dir
  })

  // Get the collision box for the final beam into the sky and process it.
  const finalCollisionBox = AABB.of(
    redirectorBlock.x,
    redirectorBlock.y,
    redirectorBlock.z,
    redirectorBlock.x,
    256,
    redirectorBlock.z
  )
  for (const block of global.getBlockList(finalCollisionBox)) {
    processEntitiesInBlock(AABB.of(block), color, redirectorBlock, delay)
    delay++
  }

  block.getPlayersInRadius(48).forEach((p) => {
    // https://minecraft.fandom.com/wiki/Commands/playsound
    Utils.server.runCommandSilent(
      'playsound minecraft:block.beacon.power_select block ' +
        `${p.displayName.string} ${block.x} ${block.y} ${block.z} 3 1`
    )
  })

  e.cancel()
})
