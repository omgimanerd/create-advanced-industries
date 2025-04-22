// priority: 0
// Debugging script to output all wandering villager trades.

;(() => {
  const DEBUG = false

  const E4I = Java.loadClass(
    'net.minecraft.world.entity.npc.VillagerTrades$EmeraldForItems'
  )
  const I4E = Java.loadClass(
    'net.minecraft.world.entity.npc.VillagerTrades$ItemsForEmeralds'
  )
  const IAE4I = Java.loadClass(
    'net.minecraft.world.entity.npc.VillagerTrades$ItemsAndEmeraldsToItems'
  )
  const WT = Java.loadClass(
    'dev.shadowsoffire.apotheosis.village.wanderer.WandererTrade'
  )
  const BIE = Java.loadClass('net.minecraftforge.common.BasicItemListing')

  const logTrade = (trade) => {
    switch (trade.class) {
      case E4I:
      case I4E:
      case IAE4I:
      case WT:
      case BIE:
        break
      default:
        console.log(trade.class)
        console.log(trade.class.toString())
        return
    }
    let offer = trade.getOffer(null, null)
    console.log(
      `${offer.getCostA()} + ${offer.getCostB()} = ${offer.getResult()}`
    )
  }

  if (DEBUG) {
    MoreJSEvents.villagerTrades((e) => {
      for (const profession of [
        'minecraft:farmer',
        'minecraft:fisherman',
        'minecraft:shepherd',
        'minecraft:fletcher',
        'minecraft:librarian',
        'minecraft:cartographer',
        'minecraft:cleric',
        'minecraft:armorer',
        'minecraft:weaponsmith',
        'minecraft:toolsmith',
        'minecraft:butcher',
        'minecraft:leatherworker',
        'minecraft:mason',
      ]) {
        console.log(profession)
        e.getTrades(profession, 1)
          .concat(e.getTrades(profession, 2))
          .forEach((trade) => logTrade(trade))
      }
    })

    MoreJSEvents.wandererTrades((e) => {
      console.log('wandering trader')
      e.getTrades(1)
        .concat(e.getTrades(2))
        .forEach((trade) => logTrade(trade))
    })
  }
})()
