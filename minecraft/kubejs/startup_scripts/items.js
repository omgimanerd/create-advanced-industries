// priority: 500

ItemEvents.modification((e) => {
  // Change stack size of grenades.
  e.modify('createarmory:impact_nade', (i) => {
    i.setMaxStackSize(16)
  })
  e.modify('createarmory:smoke_nade', (i) => {
    i.setMaxStackSize(16)
  })
})
