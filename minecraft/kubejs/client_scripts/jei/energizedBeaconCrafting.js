// priority: 0
// Custom JEI category for energized beacon crafting.

JEIAddedEvents.registerCategories((e) => {
  // Take some arrow textures from Create.
  const $AllGuiTextures = Java.loadClass(
    'com.simibubi.create.foundation.gui.AllGuiTextures'
  )
  const $BeaconRenderer = Java.loadClass(
    'net.minecraft.client.renderer.blockentity.BeaconRenderer'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  const slotDrawable = guiHelper.getSlotDrawable()
  e.custom(global.ENERGIZED_BEACON_CRAFTING, (category) => {
    category
      .title('Energized Beacon Crafting')
      .background(guiHelper.createBlankDrawable(177, 60))
      .icon(doubleItemIcon('minecraft:beacon', 'quark:red_corundum_cluster'))
      .isRecipeHandled(() => true) // Only relevant recipes are registered
      .handleLookup((builder, recipe) => {
        const { ingredient, result, redirectorBlock, energy } = recipe.data
        const input = builder
          .addSlot('input', 27, 38)
          .setBackground(slotDrawable, -1, -1)
        if (ingredient.startsWith('#')) {
          Ingredient.of(ingredient).itemIds.forEach((id) => {
            input.addItemStack(id)
          })
        } else {
          input.addItemStack(id)
        }
        builder.addSlot('input', 50, 5).addItemStack('minecraft:beacon')
        builder
          .addSlot('output', 80, 40)
          .addItemStack(result)
          .setBackground(slotDrawable, -1, -1)
      })
      .setDrawHandler((recipe, _, guiGraphics) => {
        const bufferSource = guiGraphics.bufferSource()
        const pose = guiGraphics.pose()
        $BeaconRenderer.renderBeaconBeam(
          pose,
          bufferSource,
          0,
          2,
          1,
          4,
          [12, 12, 12]
        )
      })
  })
})

JEIAddedEvents.registerRecipes((e) => {
  e.custom(global.ENERGIZED_BEACON_CRAFTING).addAll(
    global.EnergizedBeaconCraftingRecipes
  )
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data.addRecipeCatalyst('minecraft:beacon', global.ENERGIZED_BEACON_CRAFTING)
})
