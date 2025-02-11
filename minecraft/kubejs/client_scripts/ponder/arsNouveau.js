// priority: 0
// Ponders for Ars Nouveau and its overhauls in this pack.

Ponder.registry((e) => {
  const DEFAULT_ARS_COLOR = Color.rgba(255, 25, 180, 0)

  /**
   * @param {Internal.ExtendedSceneBuilder_} scene
   * @param {number} ticks
   * @param {BlockPos_} pos
   */
  const rightClickWithDominionWand = (scene, ticks, pos) => {
    scene
      .showControls(ticks, pos, 'down')
      .rightClick()
      .withItem('ars_nouveau:dominion_wand')
  }

  // Fluid Sourcelink
  e.create('starbunclemania:fluid_sourcelink').scene(
    'fluid_sourcelink',
    'Fluid Sourcelink',
    // kubejs/assets/kubejs/ponder/fluid_sourcelink.nbt
    'kubejs:fluid_sourcelink',
    (scene, util) => {
      const basePlate = util.select.layer(0)
      const sourceMachines = util.select.fromTo(1, 1, 2, 2, 2, 2)
      const fluidMachines = util.select.fromTo(4, 1, 0, 3, 2, 2)
      const fluidSourcelink = util.grid.at(2, 2, 2)
      const mechanicalPump = util.grid.at(4, 2, 1)
      const sourceJar1 = util.grid.at(2, 1, 2)
      const sourceJar2 = util.grid.at(1, 1, 2)

      // Scene setup
      scene.world.showSection(basePlate.add(sourceMachines), Facing.UP)
      scene.idleSeconds(1)
      scene.text(
        40,
        'Ars Nouveau requires source to be in its raw form inside source ' +
          'jars for its machines and blocks.'
      )
      scene.idle(50)
      scene.text(
        40,
        'The Fluid Sourcelink is the only way to get source into these jars ' +
          'from its liquid form.',
        fluidSourcelink
      )
      scene.idle(50)

      // Pumping
      scene.addKeyframe()
      scene.world.showSection(fluidMachines, Facing.SOUTH)
      scene.idle(10)
      scene.text(
        40,
        'Pump liquid source into the fluid condenser and it will send it ' +
          'into nearby Source Jars.',
        fluidSourcelink
      )
      scene.idle(20)
      scene.world.setKineticSpeed(fluidMachines, 96)
      scene.idle(30)
      scene.world.propagatePipeChange(mechanicalPump)
      scene.idle(40)
      scene.world.setKineticSpeed(fluidMachines, 0)
      scene.idle(10)

      // Fluid sourcelink distributing source
      scene.addKeyframe()
      scene.idle(drawSourceFlowParticles(scene, fluidSourcelink, sourceJar1))
      animateSourceJar(scene, sourceJar1, 0, 3, 1)
      scene.idle(5)
      scene.idle(drawSourceFlowParticles(scene, fluidSourcelink, sourceJar2))
      scene.world.modifyBlockEntityNBT(fluidSourcelink, (nbt) => {
        nbt.Amount = 0
      })
      animateSourceJar(scene, sourceJar2, 0, 3, 1)
      scene.idle(10)
    }
  )

  // Source Condenser
  e.create('starbunclemania:source_condenser').scene(
    'source_condenser',
    'Source Condenser',
    // kubejs/assets/kubejs/ponder/source_condenser.nbt
    'kubejs:source_condenser',
    (scene, util) => {
      const sourceCondenser = util.grid.at(3, 2, 2)
      const fluidTank = util.grid.at(3, 1, 2)
      const sourceJar = util.grid.at(1, 1, 2)

      // Scene setup
      setSourceJarFill(scene, sourceJar, 4)
      scene.world.showSection(util.select.layers(0, 3), Facing.UP)
      scene.idleSeconds(1)
      scene.text(
        40,
        'Souce Condensers perform the opposite function of fluid ' +
          'sourcelinks by converting raw source back into fluid.',
        sourceCondenser
      )
      scene.idle(50)
      scene.text(
        40,
        'The Source Condenser will automatically pull from nearby source jars.',
        sourceJar
      )
      scene.idle(drawSourceFlowParticles(scene, sourceJar, sourceCondenser))
      setSourceJarFill(scene, sourceJar, 3)
      scene.idle(10)
      scene.world.modifyBlockEntityNBT(sourceCondenser, (nbt) => {
        nbt.FluidName = 'starbunclemania:source_fluid'
        nbt.Amount = 1000
      })
      scene.idle(40)
      scene.text(
        40,
        'It will also automatically push the liquefied source to a fluid ' +
          'tank placed underneath it.',
        fluidTank
      )
      scene.world.modifyBlockEntityNBT(sourceCondenser, (nbt) => {
        nbt.Amount = 0
      })
      animateTank(scene, fluidTank, 'starbunclemania:source_fluid', 0, 1000, 50)
    }
  )

  // Imbuement Chamber
  e.create('ars_nouveau:imbuement_chamber')
    .scene(
      'ars_nouveau_imbuement_chamber',
      'The Imbuement Chamber',
      // kubejs/assets/kubejs/ponder/imbuement_chamber.nbt
      'kubejs:imbuement_chamber',
      (scene, util) => {
        const basePlate = util.select.layer(0)
        const imbuementChamber = util.grid.at(2, 1, 2)
        const sourceJar = util.grid.at(1, 1, 2)
        const pedestals = [
          util.grid.at(3, 1, 1),
          util.grid.at(3, 1, 2),
          util.grid.at(2, 1, 3),
          util.grid.at(1, 1, 3),
        ]

        // Scene setup
        scene.world.showSection(basePlate.add(imbuementChamber), Facing.UP)
        scene.idleSeconds(1)
        scene.text(
          40,
          'The Imbuement Chamber is one of the first magical crafting mechanics unlocked by Ars Nouveau.',
          imbuementChamber
        )
        scene.idle(50)

        // Pedestals
        scene.addKeyframe()
        for (const position of pedestals) {
          scene.world.showSection(util.select.position(position), Facing.DOWN)
          scene.idle(5)
        }
        scene.text(
          40,
          'Place Arcane Pedestals or Arcane Platforms around the Imbuement ' +
            'Chamber',
          pedestals[0]
        )
        scene.idle(50)
        scene.text(
          40,
          'Right click the pedestals with the necessary items.',
          pedestals[0]
        )
        setArsContainerItem(scene, pedestals[0], 'minecraft:flint_and_steel')
        scene.idle(10)
        setArsContainerItem(scene, pedestals[1], 'minecraft:gunpowder')
        scene.idle(10)
        setArsContainerItem(scene, pedestals[2], 'minecraft:torch')
        scene.idle(40)

        // Crafting
        scene.addKeyframe()
        setArsContainerItem(scene, imbuementChamber, 'ars_nouveau:source_gem')
        scene
          .showControls(40, imbuementChamber, 'down')
          .rightClick()
          .withItem('ars_nouveau:source_gem')
        scene.text(
          40,
          'Right click the Imbuement Chamber with the recipe input to begin ' +
            'the craft.',
          imbuementChamber
        )
        scene.idle(50)
        scene.text(
          40,
          'After some time, the input item will be transformed.',
          imbuementChamber
        )
        scene.idle(50)
        setArsContainerItem(scene, imbuementChamber, 'ars_nouveau:fire_essence')
        scene.particles
          .simple(5, 'minecraft:glow', imbuementChamber)
          .speed([0.2, 0.2, 0.2])
          .density(8)
          .lifetime(8)
          .color(DEFAULT_ARS_COLOR)
        scene.idle(20)
        scene.text(
          40,
          'Note that imbuement does not consume the catalyst items on the ' +
            'pedestals.',
          pedestals[3]
        )
        scene.idle(50)

        // Having source nearby increases the craft speed
        scene.addKeyframe()
        setSourceJarFill(scene, sourceJar, 6)
        scene.world.showSection(sourceJar, Facing.EAST)
        scene.idle(10)
        scene.text(
          40,
          'Having a source jar nearby significantly increases the speed of ' +
            'the imbuement process.',
          sourceJar
        )
        scene.idle(50)
      }
    )
    .scene(
      'ars_nouveau_imbuement_chamber_automation',
      'Automating The Imbuement Chamber',
      // kubejs/assets/kubejs/ponder/imbuement_chamber_automation.nbt
      'kubejs:imbuement_chamber_automation',
      (scene, util) => {
        // Scene setup
        scene.showStructure()
        const imbuementChamber = util.grid.at(2, 2, 2)
        const pedestals = [
          util.grid.at(3, 1, 1),
          util.grid.at(2, 1, 1),
          util.grid.at(1, 1, 1),
        ]
        const beltStart = util.grid.at(4, 1, 2)
        const exitFunnel = util.grid.at(1, 2, 2)
        const resultEssence = 'ars_nouveau:water_essence'
        setFunnelFilter(scene, exitFunnel, resultEssence)
        scene.idleSeconds(1)

        // Text explanation
        scene.text(
          40,
          'Like any inventory, Imbuement Chambers can be inserted into ' +
            'and extracted from.',
          imbuementChamber
        )
        scene.idle(50)

        // Fill the pedestals
        setArsContainerItem(scene, pedestals[0], 'minecraft:water_bucket')
        scene.idle(10)
        setArsContainerItem(scene, pedestals[1], 'minecraft:kelp')
        scene.idle(10)
        setArsContainerItem(scene, pedestals[2], 'minecraft:snow_block')
        scene.idle(30)

        scene.world.setKineticSpeed(util.select.everywhere(), 24)
        scene.world.createItemOnBelt(
          beltStart,
          Facing.DOWN,
          'ars_nouveau:source_gem'
        )
        scene.idle(20)
        setArsContainerItem(scene, imbuementChamber, 'ars_nouveau:source_gem')

        scene.idle(40)
        setArsContainerItem(scene, imbuementChamber, 'minecraft:air')
        scene.particles
          .simple(5, 'minecraft:glow', imbuementChamber)
          .speed([0.2, 0.2, 0.2])
          .density(8)
          .lifetime(8)
          .color(DEFAULT_ARS_COLOR)
        scene.world.flapFunnel(exitFunnel, true)
        scene.world.createItemOnBelt(
          exitFunnel.below(),
          Facing.DOWN,
          resultEssence
        )
        scene.idle(20)
      }
    )

  // Enchanting Apparatus, DOES NOT RENDER
  // e.create('ars_nouveau:enchanting_apparatus')
  //   .scene(
  //     'ars_nouveau_enchanting_apparatus',
  //     'The Enchanting Apparatus',
  //     // kubejs/assets/kubejs/ponder/enchanting_apparatus.nbt
  //     'kubejs:enchanting_apparatus',
  //     (scene, util) => {
  //       scene.showBasePlate()
  //       const enchantingApparatus = util.grid.at(3, 2, 3)

  //       const pedestals = [util.grid.at(1, 1, 1)]

  //       // Scene setup
  //       scene.world.setBlock(
  //         util.grid.at(2, 1, 2),
  //         'ars_nouveau:enchanting_apparatus',
  //         false
  //       )
  //       scene.world.modifyBlockEntityNBT(
  //         enchantingApparatus,
  //         (/** @type {Internal.CompoundTag_} */ nbt) => {
  //           nbt.itemStack.putByte('Count', 1)
  //         }
  //       )
  //       scene.world.showSection(util.select.everywhere(), Facing.DOWN)
  //       scene.idle(10)
  //       scene.idle(20)
  //     }
  //   )
  //   .scene(
  //     'ars_nouveau_enchanting_apparatus_automation',
  //     'Automating The Enchanting Apparatus',
  //     // kubejs
  //     'kubejs:enchanting_apparatus_automation',
  //     (scene, util) => {}
  //   )

  // Source Relays
  e.create([
    'ars_nouveau:source_jar',
    'ars_nouveau:relay',
    'ars_nouveau:relay_splitter',
    'ars_nouveau:relay_deposit',
    'ars_nouveau:relay_warp',
    'ars_nouveau:relay_collector',
  ])
    .scene('ars_nouveau_relay', 'Source Relays', (scene, util) => {
      // Scene setup
      const basePlate = util.select.layer(0)
      let fromSourceJar = util.grid.at(1, 1, 3)
      let sourceRelay = util.grid.at(2, 1, 2)
      let toSourceJar = util.grid.at(3, 1, 1)
      let sourceJarInitialFill = 4
      scene.world.setBlock(
        fromSourceJar,
        Block.id('ars_nouveau:source_jar', {
          fill: `${sourceJarInitialFill}`,
        }).blockState,
        false
      )
      scene.world.setBlock(sourceRelay, 'ars_nouveau:relay', false)
      scene.world.setBlock(toSourceJar, 'ars_nouveau:source_jar', false)
      scene.world.showSection(
        basePlate.add(fromSourceJar).add(sourceRelay).add(toSourceJar),
        Facing.UP
      )
      scene.idleSeconds(1)

      // Dominion wand binding
      scene.text(
        30,
        'Source Relays move raw source from jar to jar.',
        sourceRelay
      )
      scene.idle(40)
      scene.text(
        30,
        'The Dominion Wand is used to bind source and destination blocks ' +
          'for source to move between.'
      )
      scene.idle(40)
      rightClickWithDominionWand(scene, 25, fromSourceJar.above())
      scene.overlay
        .showSelectionWithText(fromSourceJar, 30)
        .text('Right click the source jar to take from.')
        .colored('green')
      scene.idle(40)
      rightClickWithDominionWand(scene, 25, sourceRelay.above())
      scene.overlay
        .showSelectionWithText(sourceRelay, 30)
        .text('Then right click the source relay to set the relay.')
        .colored('green')
      scene.idle(40)
      rightClickWithDominionWand(scene, 25, sourceRelay.above())
      scene.overlay
        .showSelectionWithText(sourceRelay, 30)
        .text('Right click the source relay again.')
        .colored('blue')
      scene.idle(40)
      rightClickWithDominionWand(scene, 25, toSourceJar.above())
      scene.overlay
        .showSelectionWithText(toSourceJar, 30)
        .text('Then right click the destination source jar.')
        .colored('blue')
      scene.idle(40)

      // Animate source transfer
      scene.addKeyframe()
      for (let i = 1; i <= sourceJarInitialFill; ++i) {
        setSourceJarFill(scene, fromSourceJar, sourceJarInitialFill - i)
        scene.idle(drawSourceFlowParticles(scene, fromSourceJar, sourceRelay))
        scene.idle(5)
        scene.idle(drawSourceFlowParticles(scene, sourceRelay, toSourceJar))
        setSourceJarFill(scene, toSourceJar, i)
        scene.idle(5)
      }
      scene.text(
        40,
        'When binding blocks with the dominion wand, the source is always ' +
          'selected first, then the destination.'
      )
      scene.idle(50)

      // Splitter source relay
      scene.addKeyframe()
      scene.text(
        40,
        'The regular source relay can only have one target and destination. ' +
          'To take and send from multiple jars, you need to upgrade it to ' +
          'a Source Relay: Splitter',
        sourceRelay
      )
      scene.world.hideSection(sourceRelay, Facing.EAST)
      scene.idle(20)
      scene.world.setBlock(sourceRelay, 'ars_nouveau:relay_splitter', false)
      scene.world.showSection(sourceRelay, Facing.EAST)
      scene.idle(40)

      // Additional source jars
      fromSourceJar = util.grid.at(3, 1, 1)
      let fromSourceJar2 = util.grid.at(3, 1, 3)
      toSourceJar = util.grid.at(1, 1, 3)
      let toSourceJar2 = util.grid.at(1, 1, 1)
      scene.world.setBlock(fromSourceJar2, 'ars_nouveau:source_jar', false)
      setSourceJarFill(scene, fromSourceJar2, sourceJarInitialFill)
      scene.world.setBlock(toSourceJar2, 'ars_nouveau:source_jar', false)
      scene.world.showSection(util.select.position(fromSourceJar2), Facing.DOWN)
      scene.world.showSection(util.select.position(toSourceJar2), Facing.DOWN)
      scene.idle(40)

      // Clear and rebind source jars
      rightClickWithDominionWand(scene, 25, sourceRelay.above())
      scene.overlay
        .showSelectionWithText(sourceRelay, 30)
        .text('Shift right click the source relay to clear the settings.')
        .colored('green')
      scene.idle(40)
      scene.text(
        40,
        'Then bind all the source jars you want to distribute to and from.',
        sourceRelay
      )
      scene.idle(50)

      // Animate binding more source jars
      scene.addKeyframe()
      let bindings = [
        [fromSourceJar, sourceRelay],
        [fromSourceJar2, sourceRelay],
        [sourceRelay, toSourceJar],
        [sourceRelay, toSourceJar2],
      ]
      for (const [from, to] of bindings) {
        rightClickWithDominionWand(scene, 10, from.above())
        scene.overlay.showOutline('green', null, util.select.position(from), 10)
        scene.idle(15)
        rightClickWithDominionWand(scene, 10, to.above())
        scene.overlay.showOutline('green', null, util.select.position(to), 10)
        scene.idle(25)
      }

      // Animate source transfer
      scene.addKeyframe()
      for (let i = 1; i <= sourceJarInitialFill; ++i) {
        setSourceJarFill(scene, fromSourceJar, sourceJarInitialFill - i)
        setSourceJarFill(scene, fromSourceJar2, sourceJarInitialFill - i)
        let delay = drawSourceFlowParticles(scene, fromSourceJar, sourceRelay)
        drawSourceFlowParticles(scene, fromSourceJar2, sourceRelay)
        scene.idle(delay + 5)
        delay = drawSourceFlowParticles(scene, sourceRelay, toSourceJar)
        drawSourceFlowParticles(scene, sourceRelay, toSourceJar2)
        setSourceJarFill(scene, toSourceJar, i)
        setSourceJarFill(scene, toSourceJar2, i)
        scene.idle(delay + 5)
      }
      scene.idle(20)

      scene.text(
        40,
        'You can also bind source relays to other source relays. This is ' +
          'very useful with the other types of source relays explained in ' +
          'the next scene',
        sourceRelay
      )
    })
    .scene(
      'ars_nouveay_relay_collector_depositor',
      'Types of Source Relays',
      (scene, util) => {
        // Scene setup
        const sourceJar1 = util.grid.at(4, 1, 3)
        const sourceJar2 = util.grid.at(4, 1, 2)
        const sourceJar3 = util.grid.at(4, 1, 1)
        const destSourceJar = util.grid.at(0, 1, 2)
        const sourceRelay = util.grid.at(2, 1, 2)
        const sourceJarInitialFill = 3
        scene.world.setBlocks(
          util.select.position(sourceJar1).add(sourceJar2).add(sourceJar3),
          Block.id('ars_nouveau:source_jar', {
            fill: `${sourceJarInitialFill}`,
          }).blockState
        )
        scene.world.setBlock(destSourceJar, 'ars_nouveau:source_jar', false)
        scene.world.setBlock(sourceRelay, 'ars_nouveau:relay_collector', false)
        scene.world.showSection(util.select.everywhere(), Facing.DOWN)
        scene.idleSeconds(1)

        // Collector relay explanation
        scene.text(
          40,
          'The Source Relay: Collector pulls source from all nearby source ' +
            'jars that are unbound.',
          sourceRelay
        )
        scene.idle(50)
        scene.text(
          40,
          'Simply bind a destination jar and it will collect source into it.',
          sourceRelay
        )
        scene.idle(50)
        rightClickWithDominionWand(scene, 10, sourceRelay.above())
        scene.overlay.showOutline(
          'green',
          null,
          util.select.position(sourceRelay),
          10
        )
        scene.idle(15)
        rightClickWithDominionWand(scene, 10, destSourceJar.above())
        scene.overlay.showOutline(
          'green',
          null,
          util.select.position(destSourceJar),
          10
        )
        scene.idle(25)

        // Animate the source transfer
        scene.addKeyframe()
        for (let i = 1; i <= sourceJarInitialFill; ++i) {
          setSourceJarFill(scene, sourceJar1, sourceJarInitialFill - i)
          setSourceJarFill(scene, sourceJar2, sourceJarInitialFill - i)
          setSourceJarFill(scene, sourceJar3, sourceJarInitialFill - i)
          let delay = drawSourceFlowParticles(scene, sourceJar1, sourceRelay)
          drawSourceFlowParticles(scene, sourceJar2, sourceRelay)
          drawSourceFlowParticles(scene, sourceJar3, sourceRelay)
          scene.idle(delay + 5)
          delay = drawSourceFlowParticles(scene, sourceRelay, destSourceJar)
          setSourceJarFill(scene, destSourceJar, i * 3)
          scene.idle(delay + 5)
        }
        scene.idle(20)

        // Depositor
        scene.addKeyframe()
        scene.text(
          40,
          'The Source Relay: Depositor does the opposite, taking source from ' +
            'unbound source jars to deposit to bound source jars.',
          sourceRelay
        )
        scene.world.hideSection(sourceRelay, Facing.NORTH)
        scene.idle(20)
        scene.world.setBlock(sourceRelay, 'ars_nouveau:relay_deposit', false)
        scene.world.showSection(sourceRelay, Facing.NORTH)
        scene.idle(40)
        const bindings = [
          [sourceRelay, sourceJar1],
          [sourceRelay, sourceJar2],
          [sourceRelay, sourceJar3],
        ]
        for (const [from, to] of bindings) {
          rightClickWithDominionWand(scene, 10, from.above())
          scene.overlay.showOutline(
            'green',
            null,
            util.select.position(from),
            10
          )
          scene.idle(15)
          rightClickWithDominionWand(scene, 10, to.above())
          scene.overlay.showOutline('green', null, util.select.position(to), 10)
          scene.idle(25)
        }

        // Animate the source transfer
        scene.addKeyframe()
        for (let i = 1; i <= sourceJarInitialFill; ++i) {
          setSourceJarFill(scene, destSourceJar, (sourceJarInitialFill - i) * 3)
          scene.idle(drawSourceFlowParticles(scene, destSourceJar, sourceRelay))
          scene.idle(5)
          let delay = drawSourceFlowParticles(scene, sourceRelay, sourceJar1)
          drawSourceFlowParticles(scene, sourceRelay, sourceJar2)
          drawSourceFlowParticles(scene, sourceRelay, sourceJar3)
          setSourceJarFill(scene, sourceJar1, i)
          setSourceJarFill(scene, sourceJar2, i)
          setSourceJarFill(scene, sourceJar3, i)
          scene.idle(delay + 5)
        }
      }
    )
})

Ponder.tags((e) => {
  e.createTag(
    'kubejs:ars_nouveau', // Tag ID
    'ars_nouveau:archmage_spell_book', // Tag icon
    'Ars Nouveau', // Tag title
    'Ponders for Ars Nouveau in this modpack', // Tag description
    // Blocks that ponders are attached to that belong in this tag.
    [
      'starbunclemania:fluid_sourcelink',
      'starbunclemania:source_condenser',
      'ars_nouveau:imbuement_chamber',
      'ars_nouveau:source_jar',
      'ars_nouveau:relay',
      'ars_nouveau:relay_splitter',
      'ars_nouveau:relay_deposit',
      'ars_nouveau:relay_warp',
      'ars_nouveau:relay_collector',
    ]
  )
})
