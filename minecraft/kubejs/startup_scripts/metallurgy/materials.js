// priority: 1000

// Material type constants
;(global.MATERIAL_TYPE_BASE_METAL = 'base_metal'),
  (global.MATERIAL_TYPE_ALLOY_METAL = 'alloy_metal'),
  (global.MATERIAL_TYPE_GEM = 'gem')

/**
 * @typedef {Object} Material
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
 * @property {{string:number}} alloyRatios
 */
/**
 * Holds all the mappings for every form of material for easy lookup and
 * transformation.
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

    alloyRatios: {
      'kubejs:molten_copper': 1,
      'kubejs:molten_zinc': 1,
    },
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
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:invar_block',
    ingot: 'thermal:invar_ingot',
    nugget: 'thermal:invar_nugget',

    dust: 'thermal:invar_dust',

    fluid: 'kubejs:molten_invar',
    bucketColor: 0x849494,

    alloyRatios: {
      'kubejs:molten_iron': 2,
      'kubejs:molten_nickel': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:enderium_block',
    ingot: 'thermal:enderium_ingot',
    nugget: 'thermal:enderium_nugget',

    dust: 'thermal:enderium_dust',

    fluid: 'kubejs:molten_enderium',
    bucketColor: 0x0c5c7c,
    superheated: true,

    alloyRatios: {
      'kubejs:molten_lead': 3,
      'kubejs:molten_diamond': 1,
      'thermal:ender': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:signalum_block',
    ingot: 'thermal:signalum_ingot',
    nugget: 'thermal:signalum_nugget',

    dust: 'thermal:signalum_dust',

    fluid: 'kubejs:molten_signalum',
    bucketColor: 0xa20f00,
    superheated: true,

    alloyRatios: {
      'kubejs:molten_copper': 3,
      'kubejs:molten_silver': 1,
      'thermal:redstone': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:constantan_block',
    ingot: 'thermal:constantan_ingot',
    nugget: 'thermal:constantan_nugget',

    dust: 'thermal:constantan_dust',

    fluid: 'kubejs:molten_constantan',
    bucketColor: 0xa46424,
    superheated: true,

    alloyRatios: {
      'kubejs:molten_copper': 1,
      'kubejs:molten_nickel': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:lumium_block',
    ingot: 'thermal:lumium_ingot',
    nugget: 'thermal:lumium_nugget',

    dust: 'thermal:lumium_dust',

    fluid: 'kubejs:molten_lumium',
    bucketColor: 0xfbf3c0,

    alloyRatios: {
      'kubejs:molten_tin': 3,
      'kubejs:molten_silver': 1,
      'thermal:glowstone': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:electrum_block',
    ingot: 'thermal:electrum_ingot',
    nugget: 'thermal:electrum_nugget',

    dust: 'thermal:electrum_dust',

    fluid: 'kubejs:molten_electrum',
    bucketColor: 0xbca44c,

    alloyRatios: {
      'kubejs:molten_gold': 1,
      'kubejs:molten_silver': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'thermal:bronze_block',
    ingot: 'thermal:bronze_ingot',
    nugget: 'thermal:bronze_nugget',

    dust: 'thermal:bronze_dust',

    fluid: 'kubejs:molten_bronze',
    bucketColor: 0x8c4424,

    alloyRatios: {
      'kubejs:molten_copper': 3,
      'kubejs:molten_tin': 1,
    },
  },
  {
    type: global.MATERIAL_TYPE_ALLOY_METAL,
    block: 'minecraft:netherite_block',
    ingot: 'minecraft:netherite_ingot',
    nugget: 'thermal:netherite_nugget',

    dust: 'thermal:netherite_dust',

    fluid: 'kubejs:molten_netherite',
    bucketColor: 0x44392f,
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
    blockRatio: 4,

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
  for (const { ingot, block } of global.materials) {
    if (ingot === ingot_) {
      return block
    }
  }
}
