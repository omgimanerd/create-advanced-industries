// priority: 500

// Only matchers that should be fully removed from crafting and JEI should go
// here.
global.hideJEI = false
global.removedRecipes = [
  { output: 'compressedcreativity:compressed_iron_casing' },
  { output: 'createaddition:electric_motor' },
  { output: 'createaddition:alternator' },
  { output: /^tfmg:[a-z_]+_concrete$/ },
  { output: /^tfmg:aluminum_.*/ },
  { output: /^tfmg:cast_iron_distillation.*/ },
  { output: /^tfmg:casting_.*/ },
  { output: /^tfmg:.*bauxite.*/ },
  { output: /^tfmg:.*engine.*/ },
  { output: 'tfmg:lignite' },
  { output: 'tfmg:fireclay' },
  { output: 'tfmg:exhaust' },
  { output: 'tfmg:sulfur_dust' },
  { output: /^thermal:.*plate$/ },
]

ServerEvents.recipes((e) => {
  global.removedRecipes.forEach((r) => {
    if (r.output) {
      e.remove({ output: r.output })
    }
  })

  // Remove Thermal Expansion nugget recipes.
  e.remove({ mod: 'thermal', output: '#forge:nuggets' })
  e.remove({ type: 'create:splashing', output: '#forge:nuggets' })

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder/)
  e.remove(/tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
})
