// priority: 100
// Chapter 8: Spawning Pembi the Artist and giving them paintings to paint.

// Closure to avoid leaking to global namespace.
;(() => {
  const PEMBI_THE_ARTIST = 'Pembi the Artist'

  /**
   * Helper to get a painting ItemStack with a preset painting variant.
   * @param {ResourceLocation} variant
   * @returns {Internal.ItemStack_}
   */
  const getPainting = (variant) => {
    return Item.of('minecraft:painting', {
      EntityTag: { variant: variant.toString() },
    })
  }

  /**
   * Event handler to handle spawning Pembi the Artist
   */
  BlockEvents.rightClicked((e) => {
    const { block, item, hand } = e
    if (hand !== 'main_hand') return
    if (item.id !== 'kubejs:pembi_spawner') return

    const golem = block.createEntity('ars_nouveau:amethyst_golem')
    // Center Pembi on the top of the block
    golem.setPos(block.pos.center.add(0, 1, 0))
    golem.setCustomName(PEMBI_THE_ARTIST)
    golem.setCustomNameVisible(true)
    golem.persistentData.legitimatelySpawned = true
    golem.persistentData.paintLevel = -1
    golem.setItemSlot('mainhand', 'toms_storage:ts.paint_kit')
    golem.spawn()
    item.shrink(1)
  })

  /**
   * Amethyst golems have their charm drop when killed. This is hardcoded into
   * the source code of Ars Nouveau. If a custom golem is killed, it should drop
   * its crafting ingredients.
   */
  LootJS.modifiers((e) => {
    e.addEntityLootModifier('ars_nouveau:amethyst_golem')
      .entityPredicate((entity) => {
        return (
          !!entity.persistentData.legitimatelySpawned &&
          entity.name.getString() === PEMBI_THE_ARTIST
        )
      })
      .addWeightedLoot([2, 4], [Item.of('kubejs:suffering_essence')])
      .addWeightedLoot([2, 4], [Item.of('toms_storage:ts.paint_kit')])
      .playerAction((player) => {
        player.tell('Oh, the horror!')
      })
  })

  // Function that can be invoked to randomly generate a painting variant.
  // Lazily populated when it is called the first time using the painting
  // weight distribution in the Vose Alias sampler.
  let paintingVariantGenerator = null
  /**
   * Generates the probability weight distribution that a rare painting is
   * produced from Pembi the Artist using the world seed's RNG.
   *
   * Used by the Vose Alias sampler to generate the painting variants in their
   * corresponding yield probability.
   */
  const getPaintingWeightDistribution = () => {
    const [variants, _] = global.getPaintingRegistryAndWorldSeed()
    const tieredVariants = global.getTieredPaintingVariants()
    const weights = {}
    const tierWeight = {
      artifact: 1, // 1 total artifact painting
      legendary: 3, // 2 total legendary paintings for a total weight of 6
      epic: 10, // 3 total epic paintings for a total weight of 30
      rare: 15, // 5 total rare paintings for a total weight of 75
      other: 20, // All other paintings take up the rest of the probability
    }
    variants.forEach((variant) => {
      if (variant in tieredVariants) {
        weights[variant] = tierWeight[tieredVariants[variant]]
      } else {
        weights[variant] = tierWeight.other
      }
    })
    return weights
  }

  /**
   * Event handler for interacting with Pembi the Artist
   */
  ItemEvents.entityInteracted((e) => {
    const { item, hand, level, player, server, target } = e
    if (hand !== 'main_hand') return
    if (target.type !== 'ars_nouveau:amethyst_golem') return
    if (target.name.getString() !== 'Pembi the Artist') return
    const { x, y, z } = target
    // A manually named amethyst golem will be smited
    if (!target.persistentData.legitimatelySpawned) {
      level.getBlock(x, y, z).createEntity('minecraft:lightning_bolt').spawn()
      target.kill()
      server.tell(
        Text.of(player.name).append(' was smited for worshipping a false idol!')
      )
      return
    }

    const paintLevel = target.persistentData.getInt('paintLevel')
    // Refilling Pembi's paints
    if (item.id === 'toms_storage:ts.paint_kit') {
      if (paintLevel !== -1) {
        target.block.popItemFromFace('minecraft:bucket', 'up')
      }
      target.persistentData.putInt('paintLevel', 4)
      item.shrink(1)
      player.swing()
    } else if (item.id === 'farmersdelight:canvas') {
      // Giving Pembi a blank canvas
      if (paintLevel <= 0) {
        return
      } else {
        target.persistentData.putInt('paintLevel', paintLevel - 1)
      }
      // Select a painting variant. Lazily populate the paintingVariantGenerator
      // function if it is not populated.
      if (paintingVariantGenerator === null) {
        paintingVariantGenerator = getVoseAliasSampler(
          getPaintingWeightDistribution()
        )
      }
      let paintingVariant = paintingVariantGenerator()
      item.shrink(1)
      target.block.popItemFromFace(getPainting(paintingVariant), 'up')
      repeat(
        /*server*/ server,
        /*duration*/ 5,
        /*interval*/ 1,
        /*cb*/ () => {
          spawnParticles(
            level,
            'minecraft:electric_spark',
            target.position().add(0, 0.4, 0),
            0.4,
            10,
            0.1
          )
        }
      )
      player.swing()
    }
  })

  ServerEvents.tags('item', (e) => {
    // Bales that can be smoked into straw
    e.add('kubejs:bales_to_straw', 'minecraft:hay_block')
    e.add('kubejs:bales_to_straw', 'farmersdelight:rice_bale')
    e.add('kubejs:bales_to_straw', 'supplementaries:flax_block')

    // Valid ingredients for brush tips
    e.add('kubejs:brush_heads', 'minecraft:feather')
    e.add('kubejs:brush_heads', 'farmersdelight:straw')
    e.add('kubejs:brush_heads', 'minecraft:white_wool')
  })

  ServerEvents.recipes((e) => {
    const create = defineCreateRecipes(e)

    // Alternative sources of Straw
    e.recipes.farmersdelight.cutting(
      'minecraft:grass',
      ['farmersdelight:straw', Item.of('farmersdelight:straw').withChance(0.5)],
      '#farmersdelight:tools/knives'
    )
    e.recipes.farmersdelight.cutting(
      'minecraft:tall_grass',
      ['farmersdelight:straw', Item.of('farmersdelight:straw').withChance(0.5)],
      '#farmersdelight:tools/knives'
    )
    e.smoking('farmersdelight:straw_bale', '#kubejs:bales_to_straw')

    // Paintings can only be crafted with paint kits, and will have no NBT data.
    e.remove({ output: 'minecraft:painting' })
    e.shapeless(Item.of('minecraft:painting'), [
      'farmersdelight:canvas',
      'toms_storage:ts.paint_kit',
    ])
      .damageIngredient('toms_storage:ts.paint_kit')
      .id('kubejs:painting_manual_only')

    // A little bit of paint can be recovered by draining a painting.
    create.emptying(
      [
        'farmersdelight:canvas',
        Fluid.of('create_enchantment_industry:ink', 10),
      ],
      'minecraft:painting'
    )

    // Crafting the Pembi Spawner
    e.recipes.ars_nouveau.enchanting_apparatus(
      [
        Item.of('minecraft:enchanted_book')
          .enchant('apotheosis:exploitation', 1)
          .weakNBT(),
        'kubejs:suffering_essence',
        'toms_storage:ts.paint_kit',
        'kubejs:suffering_essence',
        'easel_does_it:easel',
        'kubejs:suffering_essence',
        'toms_storage:ts.paint_kit',
        'kubejs:suffering_essence',
      ],
      'ars_nouveau:amethyst_golem_charm',
      'kubejs:pembi_spawner'
    )
  })
})()
