// priority: 100

ServerEvents.recipes(e => {
  e.remove({ output: 'createaddition:electric_motor' })

  // Remove Thermal Expansion nugget recipes.
  e.remove({ mod: 'thermal', output: '#forge:nuggets' })
  e.remove({ type: 'create:splashing', output: '#forge:nuggets' })
})