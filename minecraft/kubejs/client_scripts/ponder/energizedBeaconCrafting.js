// priority: 100

Ponder.registry((e) => {
  // Native Minecraft rendering logic for the beacon beam.
  const $BeaconRenderer = Java.loadClass(
    'net.minecraft.client.renderer.blockentity.BeaconRenderer'
  )

  const RED_CORUNDUM_CLUSTER_COLOR = [1.0, 0.25, 0.25]
  const GREEN_CORUNDUM_CLUSTER_COLOR = [0.25, 0.96493566, 0.00390625]

  e.create('minecraft:beacon').scene(
    'beacon_usage',
    'Energized Crafting with Beacons',
    'beacon',
    (scene, util) => {
      const beacon = util.grid.at(3, 2, 3)
      const redCorundumCluster = beacon.above(2)
      const greenCorundumCluster = redCorundumCluster.west(2)
      const funnel = util.grid.at(2, 5, 3)

      const itemDropSection = util.select.fromTo(2, 3, 3, 2, 5, 4)
      const firstSection = util.select.everywhere().substract(itemDropSection)

      // Scene setup
      scene.world.showSection(firstSection, Facing.DOWN)

      /**
       * @param {BlockPos_} pos
       * @param {Internal.Direction_} direction
       * @param {number} height
       * @param {number} color
       */
      const setupBeacon = (pos, direction, height, color) => {
        let t1 = 0
        /** @type {Internal.Direction_} */
        direction = direction === null ? Direction.UP : direction
        // Add 0.5 to the y to make the beacon beam end at the halfway point
        // of the next redirecting corundum block.
        let translation = new Vec3d(pos.x, pos.y + 0.5, pos.z)
        if (direction !== Direction.UP) {
          translation = translation
            // Negate the getCenter calculation of the beacon renderer.
            .add(0.5, 0.5, 0.5)
            .relative(direction.clockWise, 0.5)
        }
        scene.world.addElement().onRenderFirst((ctx) => {
          const { buffer, poseStack, partialTicks } = ctx
          poseStack.pushPose()
          poseStack.translate(translation)
          poseStack.mulPose(direction.rotation)
          $BeaconRenderer.renderBeaconBeam(
            /*poseStack=*/ poseStack,
            /*bufferSource=*/ buffer,
            /*beamLocation=*/ 'textures/entity/beacon_beam.png',
            /*partialTick=*/ partialTicks,
            /*textureScale=*/ 1,
            /*gameTime=*/ Math.round(t1 / 4),
            /*yOffset=*/ 0,
            /*height=*/ height,
            /*colors=*/ color,
            /*beamRadius=*/ 0.25,
            /*glowRadius=*/ 0.25
          )
          t1 = (t1 + 1) % 16
          poseStack.popPose()
        })
      }
      // Set up the beacon beams to render.
      setupBeacon(beacon, null, 2, [1, 1, 1])
      setupBeacon(
        beacon.above(2),
        Direction.WEST,
        2,
        RED_CORUNDUM_CLUSTER_COLOR
      )
      setupBeacon(
        beacon.above(2).west(2),
        null,
        4,
        GREEN_CORUNDUM_CLUSTER_COLOR
      )

      // Explanation of beacon beam redirection.
      scene.idle(20)
      scene.text(
        40,
        'Beacons have some interesting additional behavior in this pack.',
        beacon
      )
      scene.idle(50)
      scene.text(
        40,
        'The beam of an active beacon can be redirected by corundum ' +
          'clusters, which also changes the color of the beam.',
        redCorundumCluster
      )
      scene.idle(50)
      scene.text(
        40,
        'The final crystal cluster must still point towards the sky.',
        greenCorundumCluster
      )
      scene.idle(50)

      // Energized crafting scene setup
      scene.addKeyframe()
      scene.world.showSection(itemDropSection, Facing.NORTH)
      scene.idle(20)
      scene.text(
        40,
        'To perform an energized beacon craft, drop an item in the path of ' +
          'the beacon beam.',
        funnel
      )
      scene.idle(50)

      scene.world.flapFunnel(funnel, false)
      let glass = scene.world.createItemEntity(
        funnel.getCenter().add(0, -0.4, 0),
        util.vector.of(0, 0, -0.02),
        Item.of('minecraft:glass', 4)
      )

      scene.idle(20)
      scene.text(
        40,
        'Then, right click the beacon with an energy carrier. See the ' +
          'recipes in JEI all for valid items.',
        beacon
      )
      scene
        .showControls(40, beacon, 'right')
        .rightClick()
        .withItem('create_new_age:overcharged_diamond')
      scene.idle(50)

      const path = [
        beacon.above(),
        redCorundumCluster,
        redCorundumCluster.west(),
        greenCorundumCluster,
        greenCorundumCluster.above(),
        greenCorundumCluster.above(2),
        greenCorundumCluster.above(3),
        greenCorundumCluster.above(4),
      ]
      const itemLocation = funnel.below()
      for (const loc of path) {
        scene.particles
          .simple(1, 'minecraft:firework', loc)
          .speed([0.05, 0.05, 0.05])
          .delta([0.25, 0.25, 0.25])
          .density(25)
        if (loc.equals(itemLocation)) {
          scene.world.removeEntity(glass)
          scene.world.createItemEntity(
            itemLocation,
            util.vector.of(0, 0.2, -0.05),
            Item.of('minecraft:red_stained_glass', 4)
          )
        }
        scene.idle(1)
      }
    }
  )
})
