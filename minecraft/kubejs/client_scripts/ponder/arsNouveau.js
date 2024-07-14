// priority: 100
// Ponders for Ars Nouveau and its overhauls in this pack.

Ponder.registry((e) => {
  const DEFAULT_ARS_COLOR = Color.rgba(255, 25, 180, 0)

  // Fluid Sourcelink
  e.create('starbunclemania:fluid_sourcelink').scene(
    'fluid_sourcelink',
    'Fluid Sourcelink',
    // kubejs/assets/kubejs/ponder/fluid_sourcelink.nbt
    'kubejs:fluid_sourcelink',
    (scene, util) => {
      scene.showBasePlate()
      const sourceMachines = util.select.fromTo(1, 1, 2, 2, 2, 2)
      const fluidMachines = util.select.fromTo(4, 1, 0, 3, 2, 2)
      const fluidSourcelink = util.grid.at(2, 2, 2)
      const mechanicalPump = util.grid.at(4, 2, 1)
      const sourceJar1 = util.grid.at(2, 1, 2)
      const sourceJar2 = util.grid.at(1, 1, 2)

      // Scene setup
      scene.showBasePlate()
      scene.world.showSection(sourceMachines, Facing.DOWN)
      scene.idle(10)
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
      scene.particles
        .simple(5, 'minecraft:cloud', fluidSourcelink)
        .motion([0, -0.15, 0])
        .scale(0.5)
        .density(2)
        .lifetime(10)
        .color(DEFAULT_ARS_COLOR)
      scene.idle(10)
      animateSourceJar(scene, sourceJar1, 0, 3, 5)
      scene.particles
        .simple(5, 'minecraft:cloud', fluidSourcelink)
        .motion([-0.15, -0.15, 0])
        .scale(0.5)
        .density(2)
        .lifetime(10)
        .color(DEFAULT_ARS_COLOR)
      scene.world.modifyBlockEntityNBT(fluidSourcelink, (nbt) => {
        nbt.Amount = 0
      })
      scene.idle(10)
      animateSourceJar(scene, sourceJar2, 0, 3, 5)
    }
  )

  // Source Condenser
  e.create('starbunclemania:source_condenser').scene(
    'source_condenser',
    'Source Condenser',
    // kubejs/assets/kubejs/ponder/source_condenser.nbt
    'kubejs:source_condenser',
    (scene, util) => {
      scene.showBasePlate()
      const sourceCondenser = util.grid.at(3, 2, 2)
      const fluidTank = util.grid.at(3, 1, 2)
      const sourceJar = util.grid.at(1, 1, 2)

      // Scene setup
      setSourceJarFill(scene, sourceJar, 4)
      scene.world.showSection(util.select.layers(1, 2), Facing.DOWN)
      scene.idle(10)
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
      scene.particles
        .simple(5, 'minecraft:cloud', sourceJar)
        .motion([0.3, 0.15, 0])
        .scale(0.5)
        .density(2)
        .lifetime(9)
        .color(DEFAULT_ARS_COLOR)
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
        scene.showBasePlate()
        const imbuementChamber = util.grid.at(2, 1, 2)
        const sourceJar = util.grid.at(1, 1, 2)
        const pedestals = [
          util.grid.at(3, 1, 1),
          util.grid.at(3, 1, 2),
          util.grid.at(2, 1, 3),
          util.grid.at(1, 1, 3),
        ]

        // Scene setup
        scene.world.showSection(
          util.select.position(imbuementChamber),
          Facing.DOWN
        )
        scene.idle(10)
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

        // Having source nearby increases the craft speed.
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

        scene.idle(10)
        setFunnelFilter(scene, exitFunnel, resultEssence)
        scene.text(
          40,
          'Like any inventory, Imbuement Chambers can be inserted into ' +
            'and extracted from.',
          imbuementChamber
        )
        scene.idle(50)

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
  //           console.log(nbt)
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
})

Ponder.tags((e) => {
  e.createTag(
    'kubejs:ars_nouveau', // Tag ID
    'ars_nouveau:archmage_spell_book', // Tag icon
    'Ars Nouveau', // Tag title
    'Ponders for Ars Nouveau in this modpack', // Tag description
    // Ponder IDs that belong in this tag.
    [
      'starbunclemania:fluid_sourcelink',
      'starbunclemania:source_condenser',
      'ars_nouveau:imbuement_chamber',
    ]
  )
})
