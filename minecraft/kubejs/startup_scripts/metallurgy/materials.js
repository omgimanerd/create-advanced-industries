// priority: 1000

// Material type constants
;(global.MATERIAL_TYPE_BASE_METAL = 'base_metal'),
  (global.MATERIAL_TYPE_ALLOY_METAL = 'alloy_metal'),
  (global.MATERIAL_TYPE_GEM = 'gem')

/** @type {string[]} */
global.MATERIALS_BASE_METALS = [
  'iron',
  'copper',
  'gold',
  'zinc',
  'tin',
  'lead',
  'silver',
  'nickel',
]

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
 *
 * @type {{string:Material}}
 */
global.materials = {
  iron: {
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
  },
  copper: {
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
  },
  gold: {
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
  },
  zinc: {
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
  },
  tin: {
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
  },
  lead: {
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
  },
  silver: {
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
  },
  nickel: {
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
  },
}

/**
 *
 * @param {string[]} l
 * @returns {Material[]}
 */
global.getMaterials = (l) => {
  l = Array.isArray(l) ? l : [l]
  return Object.entries(global.materials)
    .filter((v) => {
      return l.indexOf(v[0]) !== -1
    })
    .map((v) => {
      return v[1]
    })
}
