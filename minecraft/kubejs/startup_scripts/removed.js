// priority: 0

/**
 * List of recipes that should be fully removed from crafting and JEI.
 *
 * This is declared here to be available to both server_scripts and
 * client_scripts.
 * @type {(string|RegExp)[]}
 */
global.REMOVED_ITEMS = [
  /^ars_nouveau:[a-z]+_sourcelink/,
  'compressedcreativity:compressed_iron_casing',
  'compressedcreativity:heater',
  'create:brass_hand',
  'createaddition:electric_motor',
  'createaddition:alternator',
  /^createaddition:.*connector/,
  'createaddition:capacitor',
  'createaddition:diamond_grit',
  'createaddition:electrum_ingot',
  'createaddition:electrum_nugget',
  // Prefer Create Deco's zinc sheet texture
  'createaddition:zinc_sheet',
  /^createaddition:[a-z_]+spool/,
  /^createarmory:.*_mold(_complete)*$/,
  'create_central_kitchen:cherry_pie_slice',
  'create_central_kitchen:truffle_pie_slice',
  'create_central_kitchen:mulberry_pie_slice',
  'create_central_kitchen:yucca_pie_slice',
  'create_central_kitchen:aloe_pie_slice',
  'create_central_kitchen:passionfruit_pie_slice',
  'create_central_kitchen:pumpkin_cake_slice',
  'create_central_kitchen:sweet_berry_cake_slice',
  // TODO maybe useful as an intermediate somewhere else?
  'create_connected:control_chip',
  /^create_connected:copycat_[a-z_]+$/,
  'create_connected:fan_freezing_catalyst',
  /^createdeco:[a-z_]+_coin$/,
  /^createdeco:[a-z_]+_coinstack$/,
  'createdeco:netherite_nugget',
  'createdeco:netherite_sheet',
  'createcasing:creative_mixer',
  'createcasing:creative_press',
  'createcasing:creative_depot',
  // Conflicts with Create: Connected's brass gearboxes
  /^createcasing:(vertical_)*brass_gearbox$/,
  'createcasing:brass_shaft',
  /^create_new_age:heat.*/,
  /^create_new_age:[a-z_]*corium/,
  /^create_new_age:reactor.*/,
  'create_new_age:nuclear_fuel',
  /^create_new_age:.[a-z_]*solar_heating_plate/,
  /^create_new_age:.*thorium.*/,
  'create_things_and_misc:sprinkler',
  'create_things_and_misc:sprinkler_head',
  'createutilities:gearcube',
  'farmersdelight:wheat_dough',
  /.*jumbo_smelting/,
  'morered:soldering_table',
  /^morered:.*stone_plate/,
  // Compressed iron gear is disabled.
  /^pneumaticcraft:compressed_iron_(boots|chestplate|helmet|leggings)$/,
  'pneumaticcraft:compressed_iron_gear',
  /^pneumaticcraft:drill_bit_.*/,
  'pneumaticcraft:pneumatic_dynamo',
  'pneumaticcraft:copper_nugget',
  'pneumaticcraft:drill_bit_compressed_iron',
  'pneumaticcraft:logistics_core',
  'pneumaticcraft:wheat_flour',
  'refinedstorage:processor_binding',
  'tfmg:air_intake',
  'tfmg:cement',
  /^tfmg:[a-z_]+concrete$/,
  'tfmg:bitumen',
  'tfmg:blasting_mixture',
  'tfmg:blast_furnace_output',
  'tfmg:block_mold',
  /^tfmg:.*cast_iron.*/,
  /^tfmg:casting_.*/,
  /^tfmg:.*engine.*/,
  'tfmg:exhaust',
  'tfmg:flarestack',
  'tfmg:ingot_mold',
  'tfmg:nitrate_dust',
  'tfmg:slag',
  'tfmg:spark_plug',
  'tfmg:steel_distillation_controller',
  'tfmg:steel_distillation_output',
  'tfmg:sulfur_dust',
  'tfmg:turbine_blade',
  /^thermal:.*apatite.*/,
  /^thermal:.*cinnabar.*/,
  'thermal:apple_block',
  'thermal:beetroot_block',
  'thermal:carrot_block',
  'thermal:chiller_rod_cast',
  'thermal:coal_coke',
  'thermal:coal_coke_block',
  'thermal:copper_nugget',
  // Very specific matcher to avoid chestplate and rubberwood_pressure_plate
  /^thermal:[a-z]+_plate$/,
  'thermal:potato_block',
  // TODO Reconsider usages of Phyto Gro
  'thermal:phytogro',
  'thermal:phyto_grenade',
  'thermal:phyto_tnt',
  // Only the crystallizer and pyrolyzer machines are whitelisted
  'thermal:machine_furnace',
  'thermal:machine_sawmill',
  'thermal:machine_pulverizer',
  'thermal:machine_smelter',
  'thermal:machine_insolator',
  'thermal:machine_centrifuge',
  'thermal:machine_press',
  'thermal:machine_crucible',
  // thermal:machine_chiller is enabled
  // thermal:machine_refinery is enabled
  // thermal:machine_pyrolyzer is enabled
  'thermal:machine_bottler',
  'thermal:machine_brewer',
  // thermal:machine_crystallizer is enabled
  // thermal:machine_crafter is enabled
  'thermal:machine_frame',
  // All dynamos are disabled
  /^thermal:dynamo_.*/,
  'thermal:tinker_bench',
  'thermal:charge_bench',
  'thermal:energy_cell',
  'thermal:energy_cell_frame',
  'thermal:fluid_cell',
  'thermal:fluid_cell_frame',
  'thermal:device_hive_extractor',
  'thermal:device_soil_infuser',
  'thermal:device_rock_gen',
  'thermal:device_xp_condenser',
  'thermal:rs_control_augment',
  'thermal:side_config_augment',
  'thermal:xp_storage_augment',
  /^thermal:rf_coil.*_augment$/,
  /^thermal:fluid_tank.*augment$/,
  /^thermal:diving_.*/,
  'thermal:xp_crystal',
  '#forge:coins',
  /^starbunclemania:star_[a-z_]+/,
  'starbunclemania:wyrm_degree',
  'starbunclemania:direction_scroll',
  'starbunclemania:fluid_scroll_allow',
  'starbunclemania:fluid_scroll_deny',
  'vintageimprovements:sulfur_chunk',
  'vintageimprovements:sulfur',
  'vintageimprovements:sulfur_block',
  // Duplicated sheets that aren't needed
  'vintageimprovements:andesite_sheet',
  'vintageimprovements:cast_iron_sheet',
  'vintageimprovements:zinc_sheet',
  // Remove CVI Steel Rod in favor of using TFMG's rebar
  'vintageimprovements:steel_rod',
  /^vintageimprovements:small_[a-z_]+_spring$/,
]
