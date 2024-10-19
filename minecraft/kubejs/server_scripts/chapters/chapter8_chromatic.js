// priority: 500
// Chapter 8's chromatic compound logic for processing chromatic fluid.

// Logic to drain chromatic fluid from a colored sheep using a Chromatic Bop
// Stick
EntityEvents.hurt('minecraft:sheep', (e) => {
  const { entity, source } = e

  const player = source?.player
  const mainHandItem = player?.mainHandItem
  if (!mainHandItem || mainHandItem.id !== 'kubejs:chromatic_bop_stick') {
    return
  }

  const entityNbt = entity.nbt
  const color = entityNbt.getByte('Color')
  if (color === 0) return
  const block = entity.block
  if (block.id !== 'create:item_drain') return

  // Check if the Chromatic Bop Stick has a charge available for the sheep color
  const sheepColor = global.CHROMATIC_BOP_STICK_COLORS[color]
  if (!mainHandItem.nbt.getBoolean(sheepColor)) return
  mainHandItem.nbt.putBoolean(sheepColor, false)

  // If the Bop Stick is fully empty, switch it with the empty version.
  let hasCharge = false
  // slice(1) to exclude white
  for (const color of global.CHROMATIC_BOP_STICK_COLORS.slice(1)) {
    if (mainHandItem.nbt.getBoolean(color)) {
      hasCharge = true
      break
    }
  }
  if (!hasCharge && player) {
    mainHandItem.shrink(1)
    player.giveInHand('kubejs:chromatic_bop_stick_empty')
  }

  // The item drain's fluid handler forbids regular insertion from other
  // compatible fluid handler interactions. We are copying the drain's internal
  // code that enables insertion to fill it with the fluid from an item, and
  // then immediately disables it.
  // ItemDrainBlockEntity.java#L242
  const tank = block.entity.internalTank
  tank.allowInsertion()
  const fluidDrained = tank
    .getPrimaryHandler()
    .fill(Fluid.of('kubejs:chromatic_fluid', 40), 'execute')
  tank.forbidInsertion()

  // Clear the color of the sheep's wool if we successfully drained some fluid.
  if (fluidDrained !== 0) {
    entityNbt.putByte('Color', 0)
    entity.setNbt(entityNbt)
  }
})

ItemEvents.entityInteracted('kubejs:chromatic_bop_stick', (e) => {
  const { hand, player, target } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:sheep') return
  player.tell("Don't be shy, give him a good smack...")
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Inefficient way to get Chromatic Fluid
  create
    .pressurizing('#forge:dyes')
    .secondaryFluidInput(Fluid.of('vintageimprovements:sulfuric_acid', 50))
    .heated()
    .outputs(Fluid.of('kubejs:chromatic_fluid', 1))

  // Chromatic Compound Crafting
  //
  // Since each bop with the Chromatic Bop Stick yields 40, 5 uses of its
  // charges are required to break even.
  create
    .pressurizing(Fluid.of('kubejs:chromatic_fluid', 200))
    .superheated()
    .processingTime(100)
    .outputs('create:chromatic_compound')

  // Chromatic Bop Stick
  const nbt = {}
  // slice(1) to exclude white
  for (const color of global.CHROMATIC_BOP_STICK_COLORS.slice(1)) {
    nbt[color] = true
  }
  const filledBopStick = Item.of('kubejs:chromatic_bop_stick', nbt)
  e.shaped(
    'kubejs:chromatic_bop_stick_empty',
    [
      ' S', //
      'R ', //
    ],
    { R: 'tfmg:rebar', S: '#forge:plates/electrum' }
  )
  e.shaped(
    filledBopStick,
    [
      '  C', //
      ' S ', //
      'R  ', //
    ],
    {
      R: 'tfmg:rebar',
      S: '#forge:plates/electrum',
      C: 'create:chromatic_compound',
    }
  )
  e.shapeless(filledBopStick, [
    'kubejs:chromatic_bop_stick',
    'create:chromatic_compound',
  ]).id('kubejs:chromatic_bop_stick_recharging')
  e.shapeless(filledBopStick, [
    'kubejs:chromatic_bop_stick_empty',
    'create:chromatic_compound',
  ])
  create.deploying(filledBopStick, [
    'kubejs:chromatic_bop_stick_empty',
    'create:chromatic_compound',
  ])
})
