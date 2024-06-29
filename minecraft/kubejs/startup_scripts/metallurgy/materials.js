// priority: 1000

// Material type constants
;(global.MATERIAL_TYPE_BASE_METAL = 'base_metal'),
  (global.MATERIAL_TYPE_ALLOY_METAL = 'alloy_metal'),
  (global.MATERIAL_TYPE_GEM = 'gem')

/**
 * Holds all the mappings for every form of material for easy lookup and
 * transformation.
 *
 * @typedef {object} Material
 * @property {string} type
 * @property {string} block
 * @property {string} ingot
 * @property {string} nugget
 * @property {string} raw
 * @property {string} crushed
 * @property {string} dirty
 * @property {string} dust
 * @property {string} fluid
 * @property {number=} bucketColor Must be kept synchronized with the list in
 *   generate_fluid_textures.py
 * @property {string=} fluidTextureLocation
 * @property {boolean=} superheated
 *
 * @type {Material[]}
 */
global.materials = [
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'minecraft:iron_block',
    ingot: 'minecraft:iron_ingot',
    nugget: 'minecraft:iron_nugget',

    // Ore processing and metallurgy
    raw: 'minecraft:raw_iron',
    crushed: 'create:crushed_raw_iron',
    dirty: 'kubejs:dirty_iron_dust',
    dust: 'thermal:iron_dust',

    fluid: 'kubejs:molten_iron',
    bucketColor: 0x5a0303,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'minecraft:copper_block',
    ingot: 'minecraft:copper_ingot',
    nugget: 'create:copper_nugget',

    // Ore processing and metallurgy
    raw: 'minecraft:raw_copper',
    crushed: 'create:crushed_raw_copper',
    dirty: 'kubejs:dirty_copper_dust',
    dust: 'thermal:copper_dust',

    fluid: 'kubejs:molten_copper',
    bucketColor: 0xa33b1f,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'minecraft:gold_block',
    ingot: 'minecraft:gold_ingot',
    nugget: 'minecraft:gold_nugget',

    // Ore processing and metallurgy
    raw: 'minecraft:raw_gold',
    crushed: 'create:crushed_raw_gold',
    dirty: 'kubejs:dirty_gold_dust',
    dust: 'thermal:gold_dust',

    fluid: 'kubejs:molten_gold',
    bucketColor: 0xecd129,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'create:zinc_block',
    ingot: 'create:zinc_ingot',
    nugget: 'create:zinc_nugget',

    // Ore processing and metallurgy
    raw: 'create:raw_zinc',
    crushed: 'create:crushed_raw_zinc',
    dirty: 'kubejs:dirty_zinc_dust',
    dust: 'kubejs:zinc_dust',

    fluid: 'kubejs:molten_zinc',
    bucketColor: 0xaebda8,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'thermal:tin_block',
    ingot: 'thermal:tin_ingot',
    nugget: 'thermal:tin_nugget',

    // Ore processing and metallurgy
    raw: 'thermal:raw_tin',
    crushed: 'create:crushed_raw_tin',
    dirty: 'kubejs:dirty_tin_dust',
    dust: 'thermal:tin_dust',

    fluid: 'kubejs:molten_tin',
    bucketColor: 0x44697c,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'thermal:lead_block',
    ingot: 'thermal:lead_ingot',
    nugget: 'thermal:lead_nugget',

    // Ore processing and metallurgy
    raw: 'thermal:raw_lead',
    crushed: 'create:crushed_raw_lead',
    dirty: 'kubejs:dirty_lead_dust',
    dust: 'thermal:lead_dust',

    fluid: 'kubejs:molten_lead',
    bucketColor: 0x262653,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'thermal:silver_block',
    ingot: 'thermal:silver_ingot',
    nugget: 'thermal:silver_nugget',

    // Ore processing and metallurgy
    raw: 'thermal:raw_silver',
    crushed: 'create:crushed_raw_silver',
    dirty: 'kubejs:dirty_silver_dust',
    dust: 'thermal:silver_dust',

    fluid: 'kubejs:molten_silver',
    bucketColor: 0xa8b8bf,
  },
  {
    type: global.MATERIAL_TYPE_BASE_METAL,
    block: 'thermal:nickel_block',
    ingot: 'thermal:nickel_ingot',
    nugget: 'thermal:nickel_nugget',

    // Ore processing and metallurgy
    raw: 'thermal:raw_nickel',
    crushed: 'create:crushed_raw_nickel',
    dirty: 'kubejs:dirty_nickel_dust',
    dust: 'thermal:nickel_dust',

    fluid: 'kubejs:molten_nickel',
    bucketColor: 0xdbcf96,
  },

  // Alloyed metals
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'create:brass_block',
    ingot: 'create:brass_ingot',
    nugget: 'create:brass_nugget',

    fluid: 'kubejs:molten_brass',
    bucketColor: 0xd19c39,
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'tfmg:steel_block',
    ingot: 'tfmg:steel_ingot',
    // No nugget form

    dust: 'kubejs:steel_dust',

    fluid: 'tfmg:molten_steel',
    fluidTextureLocation: 'tfmg:fluid/molten_steel_still',
    superheated: true,
  },

  // Gems
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:glass',
    ingot: 'quark:clear_shard',
    // No nugget form
    blockRatio: 4,

    fluid: 'kubejs:molten_glass',
    bucketColor: 0xcee7e6,
    noIngotCastingRecipe: true,
  },
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:quartz_block',
    ingot: 'minecraft:quartz',
    // No nugget form

    dust: 'thermal:quartz_dust',

    fluid: 'kubejs:molten_quartz',
    bucketColor: 0x9e9999,
  },
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:diamond_block',
    ingot: 'minecraft:diamond',

    dust: 'thermal:diamond_dust',

    fluid: 'kubejs:molten_diamond',
    bucketColor: 0x1ec2c3,
    superheated: true,
  },
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:emerald_block',
    ingot: 'minecraft:emerald',

    dust: 'thermal:emerald_dust',

    fluid: 'kubejs:molten_emerald',
    bucketColor: 0x16bd6e,
    superheated: true,
  },
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:lapis_block',
    ingot: 'minecraft:lapis_lazuli',

    dust: 'thermal:lapis_dust',

    fluid: 'kubejs:molten_lapis',
    bucketColor: 0x2c5cc8,
  },
  {
    type: global.MATERIAL_TYPE_GEM,
    block: 'minecraft:redstone_block',
    ingot: 'minecraft:redstone',

    fluid: 'kubejs:molten_redstone',
    bucketColor: 0x871515,
  },
]

/**
 * @param {string} type
 * @returns {Material[]}
 */
global.getMaterialType = (type) => {
  return global.materials.filter((v) => v.type === type)
}

/**
 * @returns {Material[]}
 */
global.getBaseMetals = () => {
  return global.getMaterialType(global.MATERIAL_TYPE_BASE_METAL)
}

/**
 * Given the ingot form of a material, returns the name of the crushed dust
 * equivalent if it exists.
 * @param {string} ingot_
 * @returns {string}
 */
global.lookupDust = (ingot_) => {
  const missingDustLookups = {
    'thermal:invar_ingot': 'thermal:invar_dust',
    'thermal:enderium_ingot': 'thermal:enderium_dust',
    'thermal:signalum_ingot': 'thermal:signalum_dust',
    'thermal:constantan_ingot': 'thermal:constantan_dust',
    'thermal:lumium_ingot': 'thermal:lumium_dust',
    'thermal:electrum_ingot': 'thermal:electrum_dust',
    'thermal:bronze_ingot': 'thermal:bronze_dust',
    'minecraft:netherite_ingot': 'thermal:netherite_dust',
  }
  const missingLookup = missingDustLookups[ingot_]
  if (missingLookup) return missingLookup
  for (const { ingot, dust } of global.materials) {
    if (ingot === ingot_) {
      return dust
    }
  }
}

/**
 * Given the ingot form of a material, returns the name of the block form
 * if it exists.
 * @param {string} ingot_
 * @returns {string}
 */
global.lookupBlock = (ingot_) => {
  const missingBlockLookups = {
    'thermal:invar_ingot': 'thermal:invar_block',
    'thermal:enderium_ingot': 'thermal:enderium_block',
    'thermal:signalum_ingot': 'thermal:signalum_block',
    'thermal:constantan_ingot': 'thermal:constantan_block',
    'thermal:lumium_ingot': 'thermal:lumium_block',
    'thermal:electrum_ingot': 'thermal:electrum_block',
    'thermal:bronze_ingot': 'thermal:bronze_block',
    'minecraft:netherite_ingot': 'minecraft:netherite_block',
  }
  const missingLookup = missingBlockLookups[ingot_]
  if (missingLookup) return missingLookup
  for (const { ingot, block } of global.materials) {
    if (ingot === ingot_) {
      return block
    }
  }
}
