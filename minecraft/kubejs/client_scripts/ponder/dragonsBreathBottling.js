// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:dragon_head').scene(
    'dragons_breath_bottling',
    "Dragon's Breath Bottling",
    'kubejs:dragons_breath', // kubejs/assets/kubejs/ponder/dragons_breath.nbt
    (scene, util) => {
      const bottlingDeployer = util.grid.at(2, 3, 2)
      const bottlingFunnel = util.grid.at(1, 3, 2)
      const bottlingDeployerSection = util.select.fromTo(2, 3, 2, 1, 3, 2)
      const baseSection = util.select
        .everywhere()
        .substract(bottlingDeployerSection)
      const dragonHead = util.grid.at(4, 2, 2)
      const dragonHeadDeployer = util.grid.at(4, 4, 2)

      // Scene setup
      scene.world.showSection(baseSection, Facing.UP)
      scene.idleSeconds(1)

      // Trigger dragon's breath
      const strongRegenPotion = Item.of('minecraft:potion').withNBT({
        Potion: 'minecraft:strong_regeneration',
      })
      scene.addKeyframe()
      scene.text(
        40,
        "Dragon's breath can be automated using a dragon head.",
        dragonHead
      )
      scene.idle(50)
      scene
        .showControls(20, bottlingDeployer, 'left')
        .rightClick()
        .withItem(strongRegenPotion)
      setDeployerFilter(scene, dragonHeadDeployer, strongRegenPotion)
      setDeployerHeldItem(scene, dragonHeadDeployer, strongRegenPotion)
      scene.text(
        40,
        'Right click the dragon head with a Potion of Regeneration II.',
        dragonHead
      )
      scene.idle(50)
      scene.world.setKineticSpeed(dragonHeadDeployer, 24)
      let dragonsBreathParticles
      cycleDeployerMovement(scene, dragonHeadDeployer, 20, false, () => {
        dragonsBreathParticles = scene.world.createEntity(
          'minecraft:area_effect_cloud',
          new Vec3d(2, 2, 2),
          (entity) => {
            entity.mergeNbt({
              Particle: 'dragon_breath',
              Radius: 1,
            })
          }
        )
        setDeployerHeldItem(scene, dragonHeadDeployer, 'minecraft:glass_bottle')
      })
      scene.world.setKineticSpeed(dragonHeadDeployer, 0)
      scene.idle(20)

      // Bottling
      scene.addKeyframe()
      scene.world.showSection(bottlingDeployerSection, Facing.EAST)
      scene.idle(10)
      scene.text(
        40,
        'It can be automatically bottled with a deployer clicking the block ' +
          'below it.',
        bottlingDeployer
      )
      scene.idle(50)
      scene
        .showControls(20, bottlingDeployer, 'down')
        .rightClick()
        .withItem('minecraft:glass_bottle')
      scene.idle(10)
      setDeployerFilter(scene, bottlingDeployer, 'minecraft:glass_bottle')
      setDeployerHeldItem(scene, bottlingDeployer, 'minecraft:glass_bottle')
      scene.world.setKineticSpeed(bottlingDeployer, 24)
      scene.world.removeEntity(dragonsBreathParticles)
      cycleDeployerMovement(scene, bottlingDeployer, 20, true, () => {
        scene.world.flapFunnel(bottlingFunnel, false)
        scene.world.createItemEntity(
          bottlingFunnel,
          [-0.05, 0.04, 0],
          'minecraft:dragon_breath'
        )
      })
      scene.idle(20)
      scene.overlay
        .showSelectionWithText(
          util.select.position(bottlingDeployer.below(2)),
          40
        )
        .text('The deployer must have a block to right click on!')
        .colored('green')
      scene.idle(50)
    }
  )
})
