// priority: 1000

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityStruckByLightningEvent',
  (e) => {
    if (global.WanderingTraderLightningCallback) {
      global.WanderingTraderLightningCallback(e)
    }
  }
)

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityTeleportEvent',
  (e) => {
    if (global.EntityTeleportEventCallback) {
      global.EntityTeleportEventCallback(e)
    }
  }
)
