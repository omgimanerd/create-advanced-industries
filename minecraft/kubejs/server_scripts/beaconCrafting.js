// priority: 0

BlockEvents.rightClicked('minecraft:beacon', (e) => {
  const { block, level, server } = e
  if (block.entity.getBeamSections === undefined) return

  // While iterating through the beam sections, store the previous beam
  // redirector and direction.
  let color = [1, 1, 1]
  let redirectorBlock = block
  let direction = Direction.UP

  /**
   * Helper method to perform the processing for each beacon beam's collision
   * box. Handles checking all entities with the collision box and spawning
   * firework particles along the length of the box.
   * @param {Internal.AABB_} aabb
   * @param {number[]} color
   * @param {Internal.BlockContainerJS_} block
   * @param {number} baseDelay
   */
  const processEntitiesInCollisionBox = (aabb, color, block, baseDelay) => {
    // Average out the box size and use half its size to determine the
    // processing delay.
    const volume = global.getVolume(aabb)
    server.scheduleInTicks(baseDelay + volume / 2, () => {
      level
        .getEntitiesWithin(aabb)
        .filter((entity) => {
          return entity.type === 'minecraft:item'
        })
        .forEach((entity) => {
          if (entity.item.id === 'minecraft:glass') entity.discard()
          entity.block.popItem(Item.of('minecraft:yellow_stained_glass'))
        })
    })

    // Draw entities along the entire collision box at the correct delay.
    // TODO this needs to take into account the beam direction.
    let i = 0
    for (const /** @type {BlockPos} */ blockPos of global.getBlockList(aabb)) {
      // Wrap the scheduler in a closure to bind the value of the variables at
      // the current iteration loop.
      ;((blockPos_, baseDelay_, i_) => {
        server.scheduleInTicks(baseDelay_ + i_, () => {
          spawnParticles(
            level,
            'minecraft:firework',
            blockPos_.getCenter(),
            0.25,
            25,
            0.05,
            true
          )
        })
      })(blockPos, baseDelay, i++)
    }
  }

  // Counter used to draw a firework entity per tick.
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

    let start, end
    // Integer coordinates represent the north-west corner of a block. The start
    // and end coordinates of the bounding box itself need to be computed
    // differently depending on which direction the beam was facing. Each
    // bounding box encapsulates the block modifying the beam and every block
    // up to the next modifying block, end exclusive.
    switch (direction) {
      case 'up':
        start = redirectorBlock.pos
        end = modifyingBlock.pos.offset(1, 0, 1)
        break
      case 'down':
        start = redirectorBlock.pos.offset(0, 1, 0)
        end = modifyingBlock.pos.offset(1, 1, 1)
        break
      case 'west':
        start = redirectorBlock.pos.offset(1, 1, 1)
        end = modifyingBlock.pos.offset(1, 0, 0)
        break
      case 'east':
        start = redirectorBlock.pos
        end = modifyingBlock.offset(0, 1, 1)
        break
      case 'north':
        start = redirectorBlock.pos.offset(0, 0, 1)
        end = modifyingBlock.pos.offset(1, 1, 1)
        break
      case 'south':
        start = redirectorBlock.pos
        end = modifyingBlock.pos.offset(1, 1, 0)
        break
      default:
        throw new Error(`Unexpected direction ${direction}`)
    }
    const beamCollisionBox = AABB.of(
      start.x,
      start.y,
      start.z,
      end.x,
      end.y,
      end.z
    )
    processEntitiesInCollisionBox(
      beamCollisionBox,
      color,
      redirectorBlock,
      delay
    )
    delay += global.getVolume(beamCollisionBox)

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
    redirectorBlock.x + 1,
    256,
    redirectorBlock.z + 1
  )
  processEntitiesInCollisionBox(
    finalCollisionBox,
    color,
    redirectorBlock,
    delay
  )

  block.getPlayersInRadius(48).forEach((p) => {
    // https://minecraft.fandom.com/wiki/Commands/playsound
    Utils.server.runCommandSilent(
      'playsound minecraft:block.beacon.power_select block ' +
        `${p.displayName.string} ${block.x} ${block.y} ${block.z} 3 1`
    )
  })

  e.cancel()
})
