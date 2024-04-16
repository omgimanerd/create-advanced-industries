// priority: 800

// Only matchers that should be fully removed from crafting and JEI should go
// here. JEI.hideItems uses the matcher in key: output
global.hideJEI = false
global.removedRecipes = [
  { output: /^ars_nouveau:[a-z]+_sourcelink/ },
  { output: 'compressedcreativity:compressed_iron_casing' },
  { output: 'compressedcreativity:heater' },
  { output: 'create:brass_hand' },
  { output: 'createaddition:electric_motor' },
  { output: 'createaddition:alternator' },
  { output: /^createaddition:.*connector/ },
  { output: 'createaddition:capacitor' },
  { output: 'createaddition:diamond_grit' },
  { output: 'createaddition:zinc_sheet' },
  { output: /^createaddition:[a-z_]+spool/ },
  { output: /^createconnected:copycat_[a-z_]+/ },
  { output: 'createdeco:netherite_nugget' },
  { output: /^create_new_age:heat.*/ },
  { output: /^create_new_age:[a-z_]*corium/ },
  { output: /^create_new_age:reactor.*/ },
  { output: 'create_new_age:nuclear_fuel' },
  { output: /^create_new_age:.[a-z_]*solar_heating_plate/ },
  { output: /^create_new_age:.*thorium.*/ },
  { output: 'farmersdelight:wheat_dough' },
  { output: /.*jumbo_smelting/ },
  { output: 'morered:soldering_table' },
  { output: /^morered:.*stone_plate/ },
  { output: /^pneumaticcraft:compressed_iron.*/ },
  { output: 'pneumaticcraft:pneumatic_dynamo' },
  { output: 'pneumaticcraft:copper_nugget' },
  { output: 'pneumaticcraft:ingot_iron_compressed' },
  { output: 'pneumaticcraft:drill_bit_compressed_iron' },
  { output: 'pneumaticcraft:logistics_core' },
  { output: 'pneumaticcraft:wheat_flour' },
  { output: /^tfmg:aluminum_[a-z_]+/ },
  { output: /^tfmg:[a-z_]+_concrete$/ },
  { output: 'tfmg:blast_furnace_output' },
  { output: /^tfmg:.*cast_iron.*/ },
  { output: /^tfmg:casting_.*/ },
  { output: /^tfmg:.*engine.*/ },
  { output: 'tfmg:exhaust' },
  { output: 'tfmg:sulfur_dust' },
  { output: '#thermal:dynamos' },
  { output: '#thermal:machines' },
  { output: '#forge:coins' },
  { output: /^starbunclemania:star_[a-z_]+/ },
]

// Recipes that are removed for balance or duplication reasons.
ServerEvents.recipes((e) => {
  global.removedRecipes.forEach((r) => {
    e.remove(r)

    // Debug logging
    // e.forEachRecipe(output, (r2) => {
    //   const json = JSON.parse(r2.json)
    //   console.log(json.result)
    //   console.log(json)
    //   console.log('================')
    // })
  })

  /////////////////
  // Ars Nouveau //
  /////////////////
  e.remove({ id: /ars_nouveau:manipulation_essence_to_[a-z]+ite/ })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_tuff' })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_deepslate' })

  ////////////
  // Create //
  ////////////
  e.remove({ output: '#forge:nuggets', type: 'create:splashing' })

  ///////////////////////////////////
  // PneumaticCraft: Repressurized //
  ///////////////////////////////////
  e.remove({ id: /^pneumaticcraft:[a-z_/]+compressed_iron_block$/ })
  e.remove({ id: /^pneumaticcraft:[a-z_/]+compressed_iron_ingot$/ })
  e.remove({ id: 'pneumaticcraft:thermo_plant/compressed_iron_drill_bit' })
  e.remove({ id: /^pneumaticcraft:[a-z_/]+wheat_flour$/ })

  ////////////////////
  // Thermal Series //
  ////////////////////
  // Only the crystallizer and pyrolyzer are whitelisted.
  e.remove({ id: /^thermal:machines\/(?!crystallizer|pyrolyzer).*/ })
  e.remove({ id: /^thermal:earth_charge\/[a-z_]+/ })

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder.*/)
  e.remove(/^tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
})
