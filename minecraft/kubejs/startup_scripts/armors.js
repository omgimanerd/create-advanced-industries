// priority: 500

ItemEvents.modification((e) => {
  // Change Pneumaticcraft's armor to be on par with netherite since it
  // requires netherite armor.
  e.modify('pneumaticcraft:pneumatic_boots', (i) => {
    i.setArmorProtection(3)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_leggings', (i) => {
    i.setArmorProtection(6)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_chestplate', (i) => {
    i.setArmorProtection(8)
    i.setArmorToughness(3)
  })
  e.modify('pneumaticcraft:pneumatic_helmet', (i) => {
    i.setArmorProtection(3)
    i.setArmorToughness(3)
  })
})
