// priority: 0

JEIAddedEvents.registerCategories((e) => {
  const guiHelper = e.data.jeiHelpers.guiHelper

  e.custom('thermal:device_fisher', (category) => {
    category
      .title('Aquatic Entangler')
      .background(guiHelper.createBlankDrawable(160, 60))
      .icon(guiHelper.createDrawableItemStack('thermal:device_fisher'))
      .isRecipeHandled(() => true) // Only appropriate recipes are added?
      .handleLookup((builder, recipe) => {
        const data = recipe.data
        console.log(recipe.data)
        builder
          .addInvisibleIngredients('input')
          .addItemStack('thermal:device_fisher')
        builder
          .addSlot('input', 5, 25)
          .addTooltipCallback((view, tooltip) => {
            if (data.useChance != 0) {
              tooltip.add(
                Text.of(
                  `${data.useChance * 100}% chance to be consumed.`
                ).gold()
              )
            }
          })
          .addItemStack(data.input)
          .setBackground(guiHelper.getSlotDrawable(), -1, -1)
      })
      .setDrawHandler((recipe, _, guiGraphics) => {})
  })
})

JEIAddedEvents.registerRecipes((e) => {
  if (!global.AquaticEntanglerRecipes) return
  const r = e.custom('thermal:device_fisher')

  // const condenseJson =

  global.AquaticEntanglerRecipes.forEach((data) => {
    r.add(
      Object.assign({}, data, {
        lootTableJson: JsonIO.read(global.LootTableToJson(data.lootTable)),
      })
    )
  })
})
