// priority: 0

/**
 * @param {Internal.LivingEntity_} e The entity with the active effect.
 * @param {number} n The amplififer of the effect
 */
global.sinEffectTick = (e, n) => {
  console.log(e, n)
}

/**
 * @param {Internal.MobEffectEvent$Expired_} e
 */
global.sinEffectExpired = (e) => {
  console.log(e.entity, e.effectInstance)
  e.entity.server.tell(Text.yellow('God joined the game'))
}

StartupEvents.registry('mob_effect', (e) => {
  // Use a custom lang file to set the effect description
  e.create('kubejs:sin')
    .displayName('Curse of Sin')
    .harmful()
    .color(Color.BROWN_DYE)
    .effectTick((entity, n) => {
      global.sinEffectTick(entity, n)
    })
})

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.living.MobEffectEvent$Remove',
  (e) => {}
)

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.living.MobEffectEvent$Expired',
  (e) => {
    global.sinEffectExpired(e)
  }
)
