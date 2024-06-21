// priority: 0
// Create a custom JEI category for time pouch crafting.

JEIAddedEvents.registerCategories((e) => {
  // Create has factory oriented constructors for its ItemApplicationCategory
  // and ItemApplicationRecipe code, meaning it is a pain in the ass to try
  // and construct an ItemApplicationRecipe to pass into a custom recipe
  // category that uses the rendering code for ItemApplicationCategory.
  //
  // Instead of deferring the rendering to Create's existing category class,
  // we will copy the rendering code from it since we need to augment it
  // with some additional functionality anyway.

  // Create class for JEI arrow textures.
  const $AllGuiTextures = Java.loadClass(
    'com.simibubi.create.foundation.gui.AllGuiTextures'
  )
  // Create class for default block rendering behavior
  const $GuiGameElement = Java.loadClass(
    'com.simibubi.create.foundation.gui.element.GuiGameElement'
  )
  // Create class for holding default lighting objects
  const $AnimatedKinetics = Java.loadClass(
    'com.simibubi.create.compat.jei.category.animations.AnimatedKinetics'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  e.custom(global.TIME_POUCH_CRAFTING, (category) => {
    category
      .title('Temporal Pouch Crafting')
      // Dimensions from CreateJEI.java
      .background(guiHelper.createBlankDrawable(177, 60))
      .icon(guiHelper.createDrawableItemStack('gag:time_sand_pouch'))
      .isRecipeHandled(() => true) // Only relevant recipes are registered
      .handleLookup((builder, recipe) => {
        const { input, output, cost } = recipe.data
        const seconds = (cost / 20).toFixed(1)
        builder
          .addSlot('input', 27, 38)
          .addItemStack(Item.of(input))
          .setBackground(guiHelper.getSlotDrawable(), -1, -1)
        builder
          .addSlot('input', 51, 5)
          .addItemStack(Item.of('gag:time_sand_pouch'))
          .setBackground(guiHelper.getSlotDrawable(), -1, -1)
          .addTooltipCallback((_, tooltip) => {
            tooltip.remove(tooltip.size() - 2)
            tooltip.add(
              tooltip.size() - 2,
              Text.of(`Consumes ${seconds}s worth of time.`).gold()
            )
          })
        builder
          .addSlot('output', 132, 38)
          .addItemStack(Item.of(output))
          .setBackground(guiHelper.getSlotDrawable(), -1, -1)
      })
      .setDrawHandler((recipe, _, guiGraphics) => {
        const block = Block.getBlock(recipe.data.output)
        if (block.id === 'minecraft:air') {
          throw new Error(`${recipe.data} output is not a block`)
        }
        $AllGuiTextures.JEI_SHADOW.render(guiGraphics, 62, 47)
        $AllGuiTextures.JEI_DOWN_ARROW.render(guiGraphics, 74, 10)

        const seconds = (recipe.data.cost / 20).toFixed(1)
        guiGraphics.drawWordWrap(
          Client.font,
          Text.of(`${seconds}s of time`),
          100, // x
          10, // y
          100, // lineWidth
          0 // color
        )

        // From ItemApplicationCategory.java
        const pose = guiGraphics.pose()
        pose.pushPose()
        pose.translate(74, 51, 100)
        pose.mulPose(RotationAxis.XP.deg(-15.5))
        pose.mulPose(RotationAxis.YP.deg(22.5))
        $GuiGameElement['of(net.minecraft.world.level.block.state.BlockState)'](
          block.defaultBlockState()
        )
          .lighting($AnimatedKinetics.DEFAULT_LIGHTING)
          .scale(20)
          .render(guiGraphics)
        pose.popPose()
      })
  })
})

JEIAddedEvents.registerRecipes((e) => {
  if (!global.TimePouchCraftingRecipes) return
  const r = e.custom(global.TIME_POUCH_CRAFTING)
  for (const [input, recipe] of Object.entries(
    global.TimePouchCraftingRecipes
  )) {
    r.add({
      input: input,
      output: recipe.output,
      cost: recipe.cost,
    })
  }
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data.addRecipeCatalyst('gag:time_sand_pouch', 'kubejs:time_pouch_crafting')
})
