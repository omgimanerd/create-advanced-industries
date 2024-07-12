// priority: 100

Ponder.registry((e) => {
  /**
   * Helper method for the Arcane Portal ponder
   * @param {Internal.ExtendedSceneBuilder_} scene
   * @param {BlockPos_} center
   */
  const setupArcanePortalBlockScene = (scene, center) => {
    // Set up all blocks in scene.
    scene.world.setBlock(center, 'minecraft:crying_obsidian', true)
    const fluidSpots = [
      center.north(),
      center.south(),
      center.east(),
      center.west(),
    ]
    for (const spot of fluidSpots) {
      scene.world.setBlock(spot, 'starbunclemania:source_fluid_block', false)
    }
    const pumps = {
      south: center.north().north(),
      north: center.south().south(),
      west: center.east().east(),
      east: center.west().west(),
    }
    for (const [pumpDirection, pumpSpot] of Object.entries(pumps)) {
      scene.world.setBlock(
        pumpSpot,
        Block.id('create:mechanical_pump').with('facing', pumpDirection),
        false
      )
      scene.world.setKineticSpeed(pumpSpot, 24)
    }
    return {
      fluidSpots: fluidSpots,
      pumps: pumps,
    }
  }

  /**
   * Helper method for the Arcane Portal ponder
   * @param {Internal.ExtendedSceneBuilder_} scene
   * @param {BlockPos_} pos
   */
  const spawnPortalConsumptionParticles = (scene, pos) => {
    scene.particles
      .simple(3, 'minecraft:enchant', pos)
      .motion([0, -0.15, 0])
      .scale(2.5)
      .density(10)
      .withinBlockSpace()
  }

  const center = new BlockPos(2, 1, 2)

  e.create('kubejs:arcane_portal')
    .scene('arcane_portal_open', 'Opening The Arcane Portal', (scene, util) => {
      scene.showBasePlate()

      // First segment before keyframe to show scene.
      const { pumps } = setupArcanePortalBlockScene(scene, center)
      scene.world.showIndependentSectionImmediately(center)
      scene.idleSeconds(1)

      // Opening the portal.
      scene.addKeyframe()
      scene.text(
        40,
        'Right click a crying obsidian block with a source gem to open an ' +
          'Arcane Portal.',
        [2, 2, 2]
      )
      scene
        .showControls(40, [2, 1, 2], 'up')
        .rightClick()
        .withItem('ars_nouveau:source_gem')
      scene.idleSeconds(1)
      scene.world.replaceBlocks(
        util.select.position([2, 1, 2]),
        'kubejs:arcane_portal',
        true
      )
      scene.world.createEntity('lightning_bolt', [2, 2, 2])
      scene.idleSeconds(3)

      // Supplying the portal with source.
      scene.addKeyframe()
      scene.world.showSection(util.select.layer(1), Facing.UP)
      scene.text(
        40,
        'Once you open the portal, it requires a constant supply of ' +
          'liquefied source to stay open.',
        [2, 2, 2]
      )
      scene.idleSeconds(3)

      // Source being consumed.
      const consumptionSpot = center.west()
      scene.addKeyframe()
      scene.text(
        40,
        'The Arcane Portal will consume a random liquefied source block ' +
          ' every so often.',
        consumptionSpot
      )
      scene.idleSeconds(1)
      scene.world.destroyBlock(consumptionSpot)
      spawnPortalConsumptionParticles(scene, consumptionSpot)

      scene.idleSeconds(2)
      scene.world.setBlock(
        consumptionSpot,
        'starbunclemania:source_fluid_block',
        true
      )
      scene.idleSeconds(2)

      // Instability and portal collapse
      scene.addKeyframe()
      for (const [_, pumpSpot] of Object.entries(pumps)) {
        scene.world.setKineticSpeed(pumpSpot, 0)
      }
      scene.world.destroyBlock(consumptionSpot)
      spawnPortalConsumptionParticles(scene, consumptionSpot)
      scene.text(
        40,
        "If you don't replace the liquid source, the portal will rapidly " +
          'become unstable and collapse.',
        consumptionSpot
      )
      scene.idleSeconds(1)
      scene.particles
        .simple(80, 'minecraft:campfire_cosy_smoke', center.above())
        .delta([0.2, 0.2, 0.2])
        .scale(0.4)
        .motion([0, 0.05, 0])
        .density(2)
      scene.idleSeconds(4)
      scene.particles.simple(5, 'minecraft:explosion', center).density(10)
      scene.world.destroyBlock(center)
      scene.idleSeconds(1)
    })
    .scene('arcane_portal_usage', 'Using the Arcane Portal', (scene, util) => {
      // First segment before keyframe to show scene.
      scene.showBasePlate()
      setupArcanePortalBlockScene(scene, center)
      scene.world.setBlock(center, 'kubejs:arcane_portal', false)
      scene.world.showSection(util.select.layer(1), Facing.DOWN)
      scene.idleSeconds(1)

      // Wandering Traders being consumed.
      scene.addKeyframe()
      const wanderingTrader = scene.world.createEntity(
        'minecraft:wandering_trader',
        center.offset(0, 1, 0),
        (e) => {
          e.setY(2)
        }
      )
      scene.text(40, 'The portal will absorb wandering traders.', center)
      scene.idleSeconds(1)
      scene.world.removeEntity(wanderingTrader)
      spawnPortalConsumptionParticles(scene, center.above())
      scene.idleSeconds(2)

      // Pickaxes being consumed
      scene.addKeyframe()
      const enchantedPickaxe = scene.world.createItemEntity(
        [2.5, 2, 2.5],
        [0, 0, 0],
        Item.of('minecraft:iron_pickaxe')
          .enchant('minecraft:efficiency', 3)
          .enchant('minecraft:unbreaking', 3)
          .withName("Laborer's Pickaxe")
      )
      scene.text(
        40,
        'The portal will also absorb correctly enchanted named pickaxes. The ' +
          'quest book will guide you on how to make the appropriate sacrifice.',
        center
      )
      scene.idleSeconds(2)
      scene.world.removeEntity(enchantedPickaxe)
      spawnPortalConsumptionParticles(scene, center.above())
      scene.idleSeconds(2)

      // Hearthstone reward
      scene.addKeyframe()
      scene.text(
        40,
        'With the right sacrifices, the eldritch gods will be appeased and ' +
          'grant you a reward.',
        center
      )
      scene.idleSeconds(1)
      scene.world.createItemEntity(
        [2.5, 2, 2.5],
        [0, 0.4, 0.01],
        'gag:hearthstone'
      )
      scene.idleSeconds(1)
    })
})
