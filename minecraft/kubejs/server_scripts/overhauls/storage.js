// priority: 500
// Recipe overhauls for storage and logistics mods

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const redefineRecipe = redefineRecipe_(e)

  ////////////////////////
  // Functional Storage //
  ////////////////////////
  e.replaceInput(
    [
      {
        id: 'functionalstorage:armory_cabinet',
      },
      { id: 'functionalstorage:storage_controller' },
    ],
    'minecraft:comparator',
    'create:precision_mechanism'
  )
  redefineRecipe(
    'functionalstorage:framed_storage_controller',
    [
      'NNN', //
      'NCN', //
      'NNN', //
    ],
    {
      N: 'minecraft:iron_nugget',
      C: 'functionalstorage:storage_controller',
    }
  )
  redefineRecipe('functionalstorage:controller_extension', [
    'functionalstorage:storage_controller',
  ])
  redefineRecipe(
    'functionalstorage:framed_controller_extension',
    [
      'NNN', //
      'NCN', //
      'NNN', //
    ],
    {
      N: 'minecraft:iron_nugget',
      C: 'functionalstorage:controller_extension',
    }
  )
  // TODO gate behind quantum mechanisms
  e.remove({ id: 'functionalstorage:ender_drawer' })
  e.replaceInput(
    [
      {
        id: 'functionalstorage:collector_upgrade',
      },
      {
        id: 'functionalstorage:pusher_upgrade',
      },
      {
        id: 'functionalstorage:puller_upgrade',
      },
    ],
    'minecraft:redstone',
    'create:precision_mechanism'
  )

  /////////////////////
  // Refined Storage //
  /////////////////////
  e.remove({ output: 'refinedstorage:machine_casing' })
  create.item_application('refinedstorage:machine_casing', [
    'tfmg:steel_casing',
    'refinedstorage:quartz_enriched_iron',
  ])

  //////////////////////////////
  // Tom's Simple Storage Mod //
  //////////////////////////////
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    'minecraft:comparator',
    'create:precision_mechanism'
  )
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    '#minecraft:trapdoors',
    'create:brass_ingot'
  )
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    'minecraft:quartz',
    'create:electron_tube'
  )
  e.replaceInput(
    {
      id: 'toms_storage:inventory_cable_connector',
    },
    'minecraft:quartz',
    'create:precision_mechanism'
  )
  // TODO gate behind quantum mechanism
  e.remove({ id: 'toms_storage:adv_wireless_terminal' })
  e.replaceInput(
    { id: 'toms_storage:tag_item_filter' },
    'minecraft:name_tag',
    'create:attribute_filter'
  )
})
