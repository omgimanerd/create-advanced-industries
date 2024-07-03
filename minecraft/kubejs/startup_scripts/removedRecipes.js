// priority: 0

// List of recipes that should be fully removed from crafting and JEI.
// JEI.hideItems uses the matcher in key: output
// This is declared here to be available to both server_scripts and
// client_scripts.
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
  { output: 'createaddition:electrum_ingot' },
  { output: 'createaddition:electrum_nugget' },
  // Prefer Create Deco's zinc sheet texture
  { output: 'createaddition:zinc_sheet' },
  { output: /^createaddition:[a-z_]+spool/ },
  { output: /^createarmory:.*_mold(_complete)*$/ },
  { output: 'create_central_kitchen:cherry_pie_slice' },
  { output: 'create_central_kitchen:truffle_pie_slice' },
  { output: 'create_central_kitchen:mulberry_pie_slice' },
  { output: 'create_central_kitchen:yucca_pie_slice' },
  { output: 'create_central_kitchen:aloe_pie_slice' },
  { output: 'create_central_kitchen:passionfruit_pie_slice' },
  { output: 'create_central_kitchen:pumpkin_cake_slice' },
  { output: 'create_central_kitchen:sweet_berry_cake_slice' },
  { output: /^create_connected:copycat_[a-z_]+$/ },
  { output: /^createdeco:[a-z_]+_coin$/ },
  { output: /^createdeco:[a-z_]+_coinstack$/ },
  { output: 'createdeco:netherite_nugget' },
  { output: /^createcasing:.*creative.*$/ },
  // Conflicts with Create: Connected's brass gearboxes
  { output: /^createcasing:(vertical_)*brass_gearbox$/ },
  { output: 'createcasing:brass_shaft' },
  { output: /^create_new_age:heat.*/ },
  { output: /^create_new_age:[a-z_]*corium/ },
  { output: /^create_new_age:reactor.*/ },
  { output: 'create_new_age:nuclear_fuel' },
  { output: /^create_new_age:.[a-z_]*solar_heating_plate/ },
  { output: /^create_new_age:.*thorium.*/ },
  { output: 'create_things_and_misc:sprinkler' },
  { output: 'create_things_and_misc:sprinkler_head' },
  { output: 'createutilities:gearcube' },
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
  { output: 'tfmg:block_mold' },
  { output: /^tfmg:.*cast_iron.*/ },
  { output: /^tfmg:casting_.*/ },
  { output: /^tfmg:.*engine.*/ },
  { output: 'tfmg:exhaust' },
  { output: 'tfmg:ingot_mold' },
  { output: 'tfmg:nitrate_dust' },
  { output: 'tfmg:sulfur_dust' },
  { output: 'thermal:apple_block' },
  { output: 'thermal:beetroot_block' },
  { output: 'thermal:carrot_block' },
  { output: 'thermal:chiller_rod_cast' },
  { output: 'thermal:coal_coke' },
  { output: 'thermal:coal_coke_block' },
  { output: 'thermal:copper_nugget' },
  // Very specific matcher to avoid chestplate and rubberwood_pressure_plate
  { output: /^thermal:[a-z]+_plate$/ },
  { output: 'thermal:potato_block' },
  // TODO Reconsider usages of Phyto Gro
  { output: 'thermal:phytogro' },
  { output: 'thermal:phyto_grenade' },
  { output: 'thermal:phyto_tnt' },
  { output: /^thermal:machine_(?!crystallizer|pyrolyzer).*/ },
  { output: /^thermal:dynamo_.*/ },
  { output: 'thermal:tinker_bench' },
  { output: 'thermal:charge_bench' },
  { output: 'thermal:energy_cell' },
  { output: 'thermal:energy_cell_frame' },
  { output: 'thermal:fluid_cell' },
  { output: 'thermal:fluid_cell_frame' },
  { output: 'thermal:device_hive_extractor' },
  { output: 'thermal:device_soil_infuser' },
  { output: 'thermal:device_rock_gen' },
  { output: 'thermal:device_xp_condenser' },
  { output: /^thermal:diving_.*/ },
  { output: 'thermal:xp_crystal' },
  { output: '#forge:coins' },
  { output: /^starbunclemania:star_[a-z_]+/ },
  { output: 'starbunclemania:wyrm_degree' },
  { output: 'starbunclemania:direction_scroll' },
  { output: 'starbunclemania:fluid_scroll_allow' },
  { output: 'starbunclemania:fluid_scroll_deny' },
  { output: 'vintageimprovements:sulfur_chunk' },
  { output: 'vintageimprovements:sulfur' },
  { output: 'vintageimprovements:sulfur_block' },
  // Duplicated sheets that aren't needed
  { output: 'vintageimprovements:andesite_sheet' },
  { output: 'vintageimprovements:cast_iron_sheet' },
  { output: 'vintageimprovements:netherite_sheet' },
  { output: 'vintageimprovements:zinc_sheet' },
]
