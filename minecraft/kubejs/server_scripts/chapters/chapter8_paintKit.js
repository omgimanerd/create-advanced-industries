// priority: 500
// Custom painting functionality for the Tom's Storage Paint Kit

// The paint kit can color paintable blocks a random color
BlockEvents.rightClicked((e) => {
  const { block, hand, item, player } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'toms_storage:ts.paint_kit') return

  // See if the right clicked block has a color
  const colorRegex = global.CHROMATIC_BOP_STICK_COLORS.join('|')
  const m = new RegExp(`([a-z_]+:[a-z_]*?)(${colorRegex})([a-z_]*)`)
  const match = m.exec(block.id)
  if (match === null) return

  // Does the block have forms for all the other colors?
  const [_, prefix, currentColor, suffix] = match
  // Items that are blacklisted from being dyed
  if (
    ['minecraft:_bed', 'morered:_network_cable'].indexOf(
      `${prefix}${suffix}`
    ) !== -1
  ) {
    return
  }

  let repaintedBlocks = []
  let allColorsValid = true
  for (const color of global.CHROMATIC_BOP_STICK_COLORS) {
    let newBlock = `${prefix}${color}${suffix}`
    // Does there exist a block with this other color?
    if (Item.of(newBlock).isBlock()) {
      // Exclude the current color from the repainting candidates
      if (color !== currentColor) {
        repaintedBlocks.push(newBlock)
      }
    } else {
      allColorsValid = false
      break
    }
  }
  if (!allColorsValid) return

  // Replace the block with one of a random color.
  const newBlock = global.choice(repaintedBlocks)
  block.set(newBlock, block.properties)
  player.swing()
  player.damageHeldItem('main_hand', 1, () => {
    player.playNotifySound(
      'minecraft:entity.item.break',
      'players',
      /*volume=*/ 2,
      /*pitch=*/ 1
    )
  })
  player.playNotifySound(
    'minecraft:entity.slime.squish',
    'blocks',
    /*volume=*/ 2,
    /*pitch=*/ 1
  )
  e.cancel()
})

// The paint kit can also paint sheep a random color
ItemEvents.entityInteracted('toms_storage:ts.paint_kit', (e) => {
  const { hand, player, target } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:sheep') return

  // Recolor the sheep a random color
  const nbt = target.nbt
  const currentColor = nbt.getByte('Color')
  let newColor = global.randRangeInt(0, 16)
  while (newColor === currentColor) {
    newColor = global.randRangeInt(0, 16)
  }
  nbt.putByte('Color', newColor)
  target.setNbt(nbt)

  player.swing()
  player.damageHeldItem('main_hand', 1, () => {
    player.playNotifySound(
      'minecraft:entity.item.break',
      'players',
      /*volume=*/ 2,
      /*pitch=*/ 1
    )
  })
  player.playNotifySound(
    'minecraft:entity.slime.squish',
    'blocks',
    /*volume=*/ 2,
    /*pitch=*/ 1
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Minecraft Brush overhaul
  e.remove({ id: 'minecraft:brush' })
  e.shaped(
    'minecraft:brush',
    [
      '  H', //
      ' C ', //
      'S  ', //
    ],
    {
      H: '#kubejs:brush_heads',
      C: 'createaddition:copper_wire',
      S: 'minecraft:stick',
    }
  )

  // Paint Kits (from Tom's Storage)
  e.remove({ id: 'toms_storage:paint_kit' })
  e.shapeless('toms_storage:ts.paint_kit', [
    'create_enchantment_industry:ink_bucket',
    '#forge:dyes/red',
    '#forge:dyes/green',
    '#forge:dyes/blue',
    '#forge:dyes/black',
    'minecraft:brush',
    '#forge:dyes/red',
    '#forge:dyes/red',
    '#forge:dyes/red',
  ])
  create
    .SequencedAssembly('create_enchantment_industry:ink_bucket')
    .deploy('#forge:dyes/red')
    .deploy('#forge:dyes/green')
    .deploy('#forge:dyes/blue')
    .deploy('#forge:dyes/black')
    .deploy('minecraft:brush')
    .outputs('toms_storage:ts.paint_kit')
})
