// priority: 100
// Ponders for Ars Nouveau and its overhauls in this pack.

Ponder.registry((e) => {
  const DEFAULT_ARS_COLOR = Color.rgba(255, 25, 180, 0)

  // Imbuement Chamber
  e.create('ars_nouveau:imbuement_chamber')
    .scene(
      'ars_nouveau_imbuement_chamber',
      'The Imbuement Chamber',
      // kubejs/assets/kubejs/ponder/imbuement_chamber.nbt
      'kubejs:imbuement_chamber',
      (scene, util) => {
        scene.showBasePlate()
        const center = util.grid.at(2, 1, 2)
        const sourceJar = util.grid.at(1, 1, 2)
        const pedestals = [
          util.grid.at(3, 1, 1),
          util.grid.at(3, 1, 2),
          util.grid.at(2, 1, 3),
          util.grid.at(1, 1, 3),
        ]

        // Scene setup
        scene.world.showSection(util.select.position(center), Facing.DOWN)
        scene.idle(10)
        scene.text(
          40,
          'The Imbuement Chamber is one of the first magical crafting mechanics unlocked by Ars Nouveau.',
          center
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
        setArsContainerItem(scene, center, 'ars_nouveau:source_gem')
        scene
          .showControls(40, center, 'down')
          .rightClick()
          .withItem('ars_nouveau:source_gem')
        scene.text(
          40,
          'Right click the Imbuement Chamber with the recipe input to begin ' +
            'the craft.',
          center
        )
        scene.idle(50)
        scene.text(
          40,
          'After some time, the input item will be transformed!',
          center
        )
        scene.idle(50)
        setArsContainerItem(scene, center, 'ars_nouveau:fire_essence')
        scene.particles
          .simple(5, 'minecraft:poof', center)
          .speed([0.2, 0.2, 0.2])
          .density(1)
          .lifetime(5)
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
          .simple(5, 'minecraft:poof', imbuementChamber)
          .speed([0.2, 0.2, 0.2])
          .density(1)
          .lifetime(5)
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
})
