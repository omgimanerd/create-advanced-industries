// priority: 0

ClientEvents.lang('en_us', (e) => {
  // The TFMG plastic sheet will be used as the primary liquid plastic output
  // and can be cut into the Pneumaticcraft plastic sheets.
  e.renameItem('tfmg:plastic_sheet', 'Plastic')

  // Reuse the textures from Create Crafts & Additions for the Create: New Age
  // wire spools.
  e.renameItem('createaddition:iron_wire', 'Overcharged Iron Wire')
  e.renameItem('createaddition:gold_wire', 'Overcharged Gold Wire')

  // Why is this not capitalized?
  e.renameItem('createarmory:impact_nade', 'Impact Grenade')

  // Rename fluid buckets to be consistent with Minecraft naming scheme.
  e.renameItem('createaddition:seed_oil_bucket', 'Seed Oil Bucket')
  e.renameItem('createaddition:bioethanol_bucket', 'Biofuel Bucket')
  e.renameItem('sliceanddice:fertilizer_bucket', 'Liquid Fertilizer Bucket')

  // Name this a mechanism instead of a module.
  e.renameItem('vintageimprovements:redstone_module', 'Redstone Mechanism')

  // Creative Items whose names aren't colored
  const creative = [
    { type: 'item', id: 'ars_nouveau:creative_spell_book' },
    { type: 'block', id: 'ars_nouveau:creative_source_jar' },
    { type: 'item', id: 'wands:creative_wand' },
    { type: 'item', id: 'functionalstorage:creative_vending_upgrade' },
    { type: 'item', id: 'refinedstorage:creative_storage_disk' },
    { type: 'item', id: 'refinedstorage:creative_fluid_storage_disk' },
    { type: 'item', id: 'refinedstorage:creative_wireless_grid' },
    { type: 'item', id: 'refinedstorage:creative_wireless_fluid_grid' },
    { type: 'item', id: 'refinedstorage:creative_wireless_crafting_monitor' },
    { type: 'block', id: 'refinedstorage:creative_portable_grid' },
    { type: 'block', id: 'refinedstorage:creative_storage_block' },
    { type: 'block', id: 'refinedstorage:creative_fluid_storage_block' },
    { type: 'block', id: 'refinedstorage:creative_controller' },
    { type: 'item', id: 'universalgrid:creative_wireless_universal_grid' },
  ]
  for (const { type, id } of creative) {
    let displayName = getDisplayName(id)
    switch (type) {
      case 'item':
        e.renameItem(id, `§d${displayName}`)
        break
      case 'block':
        e.renameBlock(id, `§d${displayName}`)
        break
      default:
        throw new Error(`Unknown type ${type}`)
    }
  }
})
