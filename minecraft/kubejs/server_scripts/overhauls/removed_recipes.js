// priority: 500

// TODO: do a pass on removed fluids

// Only matchers that should be fully removed from crafting and JEI should go
// here. JEI.hideItems uses the matcher in key: output
global.hideJEI = true
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
  { output: /^create_connected:copycat_[a-z_]+$/ },
  { output: /^createdeco:[a-z_]+_coin$/ },
  { output: /^createdeco:[a-z_]+_coinstack$/ },
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
  { output: 'refinedstorage:processor_binding' },
  { output: /^tfmg:aluminum_[a-z_]+/ },
  { output: /^tfmg:[a-z_]+_concrete$/ },
  { output: 'tfmg:blasting_mixture' },
  { output: 'tfmg:blast_furnace_output' },
  { output: /^tfmg:.*cast_iron.*/ },
  { output: /^tfmg:casting_.*/ },
  { output: /^tfmg:.*engine.*/ },
  { output: 'tfmg:exhaust' },
  { output: 'tfmg:nitrate_dust' },
  { output: 'tfmg:sulfur_dust' },
  { output: 'thermal:apple_block' },
  { output: 'thermal:beetroot_block' },
  { output: 'thermal:carrot_block' },
  { output: 'thermal:copper_nugget' },
  { output: 'thermal:potato_block' },
  // TODO maybe use this?
  { output: 'thermal:phytogro' },
  { output: 'thermal:phyto_grenade' },
  { output: 'thermal:phyto_tnt' },
  { output: /^thermal:machine_(?!crystallizer|pyrolyzer).*/ },
  { output: /^thermal:dynamo_.*/ },
  { output: 'thermal:tinker_bench' },
  { output: 'thermal:charge_bench' },
  { output: 'thermal:device_hive_extractor' },
  { output: 'thermal:device_soil_infuser' },
  { output: 'thermal:device_rock_gen' },
  { output: 'thermal:device_xp_condenser' },
  { output: /^thermal:diving_.*/ },
  { output: '#forge:coins' },
  { output: /^starbunclemania:star_[a-z_]+/ },
  { output: 'starbunclemania:wyrm_degree' },
  { output: 'starbunclemania:direction_scroll' },
  { output: 'starbunclemania:fluid_scroll_allow' },
  { output: 'starbunclemania:fluid_scroll_deny' },
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
  // Create: The Factory Must Grow //
  ///////////////////////////////////

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder.*/)

  // Suppresses colored concrete warnings in KubeJS logs.
  e.remove(/^tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
  e.remove({ id: 'tfmg:fractional_distillation/crude_oil' })

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
  // Only the crystallizer and pyrolyzer recipes are whitelisted.
  e.remove({ id: /^thermal:machines\/(?!crystallizer|pyrolyzer).*/ })
  e.remove({ id: /^thermal:earth_charge\/[a-z_]+/ })

  // TODO remove all thermal recipes that aren't used
})
