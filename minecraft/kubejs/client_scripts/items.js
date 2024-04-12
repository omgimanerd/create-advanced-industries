// priority: 0

ItemEvents.tooltip((e) => {
  e.add(
    'kubejs:screwdriver_of_assblasting',
    Text.green('An unbreakable screwdriver!')
  )
})

ClientEvents.lang('en_us', (e) => {
  // The TFMG plastic sheet will be used as the primary liquid plastic output
  // and can be cut into the Pneumaticcraft plastic sheets.
  e.renameItem('tfmg:plastic_sheet', 'Plastic')

  // Reuse the textures from Create Crafts & Additions for the Create: New Age
  // wire spools
  e.renameItem('createaddition:iron_wire', 'Overcharged Iron Wire')
  e.renameItem('createaddition:gold_wire', 'Overcharged Gold Wire')
})
