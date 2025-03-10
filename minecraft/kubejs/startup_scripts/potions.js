// priority: 0

const $PotionBuilder = Java.loadClass(
  'dev.latvian.mods.kubejs.misc.PotionBuilder'
)

StartupEvents.registry('potion', (e) => {
  // This is a necessary hack if using a custom effect, since the startup event
  // registry loading for effects does not happen before custom potions.
  e.createCustom('kubejs:sin', () =>
    // Use a custom lang file to set the display name.
    new $PotionBuilder('kubejs:sin')
      .effect(
        'kubejs:sin',
        /*duration*/ 21,
        /*amplifier*/ 2,
        /*ambient*/ true,
        /*visible*/ true,
        /*showIcon*/ true,
        /*hiddenEffect*/ null
      )
      .createObject()
  )
})
