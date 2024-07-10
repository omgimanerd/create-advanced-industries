// priority: 0

;(() => {
  // Populated on first load with the beacon crafting recipes. If a recipe uses
  // a tag, it is expanded into all matching items for fast lookup in this
  // object.
  let recipeLookup = {}

  // Postprocess the beacon crafting recipes.
  for (const {
    ingredient,
    result,
    redirectorBlock,
    energy,
  } of global.EnergizedBeaconCraftingRecipes) {
    let items = ingredient.startsWith('#')
      ? Ingredient.of(ingredient).itemIds
      : [ingredient]
    items.forEach((id) => {
      const itemIdLookup = recipeLookup[id] || {}
      const redirectorLookup = itemIdLookup[redirectorBlock]
      if (redirectorLookup !== undefined) {
        throw new Error(
          `${id} with redirector ${redirectorBlock} already has a recipe!`
        )
      }
      itemIdLookup[redirectorBlock] = {
        result: result,
        energy: energy,
      }
      recipeLookup[id] = itemIdLookup
    })
  }
  console.log(
    `Successfully processed ${
      Object.keys(recipeLookup).length
    } beacon crafting recipes`
  )

  // Must be kept in sync with the energizing recipes for each of these items.
  const allowedBeaconItems = {
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

  /**
   * Define the actual block right click handler on the beacon that will handle
   * the logic for the beacon crafting.
   */
  BlockEvents.rightClicked('minecraft:beacon', (e) => {
    const { hand, item, block, player, level, server } = e
    if (level.isClientSide()) return
    if (block.entity.getBeamSections === undefined) return

    const allowedItem = allowedBeaconItems[item.id]
    if (hand !== 'main_hand' || allowedItem === undefined) return
    let { result, energy } = allowedItem

    // Return the uncharged item to the player.
    item.shrink(1)
    player.give(result)

    // While iterating through the beam sections, store the previous beam
    // redirector and direction.
    let redirectorBlock = block
    let direction = Direction.UP

    /**
     * Helper method to process an individual item entity against the
     * preprocessed dictionary of valid beacon crafts.
     * @param {Internal.ItemEntity_} itemEntity
     * @param {Internal.BlockContainerJS_} redirectorBlock The block that was
     *   used to redirect the beacon, if any
     */
    const processEntities = (itemEntity, redirectorBlock) => {
      const { id, count } = itemEntity.item
      // First check if there was a direct item match for this.
      const itemLookup = recipeLookup[id]
      if (itemLookup === undefined) return
      const redirectorLookup = itemLookup[redirectorBlock]
      if (redirectorLookup === undefined) return
      let result = redirectorLookup.result
      let energyCost = redirectorLookup.energy
      // There is a recipe match, so process it as many times as possible.
      const numCrafts = Math.min(count, Math.floor(energy / energyCost))
      itemEntity.item.shrink(numCrafts)
      itemEntity.block.popItem(Item.of(result, numCrafts))
      energy -= numCrafts * energyCost
    }

    /**
     * Helper method to perform the processing for each block in a beacon beam's
     * collision box. Handles checking all entities with a given block and
     * spawning firework particles.
     * @param {BlockPos_} pos The current on the beacon beam to process
     * @param {Internal.BlockContainerJS_} redirectorBlock The block that was
     *   used to redirect the beacon, if any
     * @param {number} delay The delay in ticks to schedule the entity
     *   processing function and subsequent firework animation
     */
    const processEntitiesInBlock = (pos, redirectorBlock, delay) => {
      // Each of these scheduled functions will run to completion within the
      // tick it is scheduled for. This has two implications.
      // 1) they are atomic with respect to each other and cannot run across
      //    ticks, we do not have to worry about data races when reading
      //    the energy variable.
      // 2) they must execute relatively fast or the game will lag
      server.scheduleInTicks(delay, () => {
        // If we have no energy remaining, do not perform the entity processing.
        if (energy > 0) {
          level
            .getEntitiesWithin(AABB.ofBlock(pos))
            .filter((entity) => {
              return entity.type === 'minecraft:item'
            })
            .forEach((itemEntity) => {
              processEntities(itemEntity, redirectorBlock)
            })
        }
        spawnParticles(
          level,
          'minecraft:firework',
          pos.getCenter(),
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
        processEntitiesInBlock(block, redirectorBlock.id, delay)
        delay++
      }

      // Set the previous redirector block and beam direction for the next beam.
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
    for (const block of global.getBlockList(finalCollisionBox)) {
      processEntitiesInBlock(block, redirectorBlock.id, delay)
      delay++
    }

    // Play the beacon power selection sound.
    block.getPlayersInRadius(48).forEach((p) => {
      // https://minecraft.fandom.com/wiki/Commands/playsound
      Utils.server.runCommandSilent(
        'playsound minecraft:block.beacon.power_select block ' +
          `${p.displayName.string} ${block.x} ${block.y} ${block.z} 3 1`
      )
    })

    // Cancel the event so the beacon UI doesn't open.
    e.cancel()
  })

  // Tag all the corundum clusters so that they can be used in the corresponding
  // recipe.
  ServerEvents.tags('item', (e) => {
    Ingredient.of(/^quark:[a-z]+_corundum_cluster$/).itemIds.forEach((id) => {
      e.add('kubejs:corundum_cluster', id)
    })
  })
})()
