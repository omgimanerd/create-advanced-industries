// priority: 100

JEIAddedEvents.registerCategories((e) => {
  const guiHelper = e.data.jeiHelpers.guiHelper
  const Integer = Java.loadClass('java.lang.Integer')
  e.custom(global.RESONANCE_CRAFTING, (category) => {
    category
      .title('Resonance Crafting')
      .background(guiHelper.createBlankDrawable(140, 50))
      .icon(guiHelper.createDrawableItemStack(Item.of('minecraft:note_block')))
      .isRecipeHandled(() => true) // Only appropriate recipes are added?
      .handleLookup((builder, recipe) => {
        const data = recipe.data
        builder.addSlot('input', 20, 10).addItemStack(data.input)
        builder.addSlot('output', 100, 10).addItemStack(data.output)
      })
      .setDrawHandler(
        (recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => {
          const sequence = recipe.data.sequence
          console.log(Object.keys(guiGraphics))

          const drawCenteredString = guiGraphics.class.declaredMethods.filter(
            (method) => method.name.includes('m_280137_')
          )[0]

          // What the fuck
          for (let i = 0; i < sequence.length; ++i) {
            drawCenteredString.invoke(guiGraphics, [
              Client.font,
              new String('test'),
              Integer.valueOf('20'),
              Integer.valueOf('20'),
              Integer.valueOf('1'),
            ])
          }
          guiGraphics.renderItem('ars_nouveau:arcane_pedestal', 20, 30, 0)
        }
      )
  })
})

JEIAddedEvents.registerRecipes((e) => {
  if (!global.ResonanceCraftingRecipesJEI) return
  const r = e.custom(global.RESONANCE_CRAFTING)
  for (const data of global.ResonanceCraftingRecipesJEI) {
    r.add(data)
  }
})
