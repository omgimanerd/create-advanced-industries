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
})
