// priority: 500

ItemEvents.rightClicked('kubejs:creative_remote', (e) => {
  const { player, level, server } = e
  if (!player || player.isFake()) return
  const mode = player.isCreative() ? 'survival' : 'creative'
  server.runCommandSilent(`/gamemode ${mode} ${player.name.string}`)
  level.playSound(
    null, // player
    player.x,
    player.y,
    player.z,
    player.isCreative() ? 'kubejs:creative_on' : 'kubejs:creative_off',
    'players',
    3, // volume
    1 // pitch
  )
  player.swing()
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  create.mechanical_crafting(
    'kubejs:creative_remote',
    [
      '  S  ', //
      'IMMMI', //
      'MPRPM', //
      'MAMEM', //
      'MBCDM', //
      'IMMMI', //
    ],
    {
      I: 'createcasing:chorium_ingot',
      M: CREATIVE_MECHANISM,
      A: Item.of('buildinggadgets2:gadget_building', {
        energy: 500000,
      }).weakNBT(),
      B: Item.of('buildinggadgets2:gadget_exchanging', {
        energy: 500000,
      }).weakNBT(),
      C: Item.of('buildinggadgets2:gadget_copy_paste', {
        energy: 1000000,
      }).weakNBT(),
      D: Item.of('buildinggadgets2:gadget_cut_paste', {
        energy: 5000000,
      }).weakNBT(),
      E: Item.of('buildinggadgets2:gadget_destruction', {
        energy: 1000000,
      }).weakNBT(),
      S: 'kubejs:singularity',
      R: 'balancedflight:ascended_flight_ring',
      P: Item.of('minecraft:potion', {
        Potion: 'apotheosis:extra_long_flying',
      }).weakNBT(),
    }
  )
})
