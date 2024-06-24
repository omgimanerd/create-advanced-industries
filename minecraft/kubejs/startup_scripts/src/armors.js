// priority: 500

ItemEvents.modification((e) => {
  // Change Pneumaticcraft's armor to be on par with netherite since it
  // requires netherite armor.
  e.modify('pneumaticcraft:pneumatic_boots', (i) => {
    i.armorProtection = 3
    i.armorToughness = 3
  })
  e.modify('pneumaticcraft:pneumatic_leggings', (i) => {
    i.armorProtection = 6
    i.armorToughness = 3
  })
  e.modify('pneumaticcraft:pneumatic_chestplate', (i) => {
    i.armorProtection = 8
    i.armorToughness = 3
  })
  e.modify('pneumaticcraft:pneumatic_helmet', (i) => {
    i.armorProtection = 3
    i.armorToughness = 3
  })
})
