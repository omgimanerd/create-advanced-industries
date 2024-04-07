// priority: 100

ServerEvents.recipes((e) => {
  e.remove({ output: 'createaddition:electric_motor' })

  // Remove Thermal Expansion nugget recipes.
  e.remove({ mod: 'thermal', output: '#forge:nuggets' })
  e.remove({ type: 'create:splashing', output: '#forge:nuggets' })

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder/)
  e.remove(/tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
})
