// priority: 1000

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityStruckByLightningEvent',
  (e) => {
    // Callbacks defined in server_scripts
    if (global.WanderingTraderLightningCallback) {
      global.WanderingTraderLightningCallback(e)
    }
  }
)
