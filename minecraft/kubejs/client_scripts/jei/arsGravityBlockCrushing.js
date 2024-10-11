// priority: 0
// Custom JEI category for Ars Nouveau Gravity Block crushing

JEIAddedEvents.registerCategories((e) => {
  // Create class for block rendering in JEI.
  const $GuiGameElement = Java.loadClass(
    'com.simibubi.create.foundation.gui.element.GuiGameElement'
  )
  // Create class for holding default lighting objects
  const $AnimatedKinetics = Java.loadClass(
    'com.simibubi.create.compat.jei.category.animations.AnimatedKinetics'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  const slotDrawable = guiHelper.getSlotDrawable()

  e.custom(global.ARS_GRAVITY_BLOCK_CRUSHING, (category) => {
    category
      .title('Void Steel Crushing')
      .background(guiHelper.createBlankDrawable(177, 80))
      .icon(
        guiHelper.createDrawableItemStack('createutilities:void_steel_block')
      )
      .handleLookup((builder, recipe) => {
        const { ingredients, results, minimumSpeed, belowBlock } = recipe.data

        // Add the void steel block as an invisible ingredient to every recipe.
        builder
          .addInvisibleIngredients('input')
          .addItemStack('createutilities:void_steel_block')

        // Add the Ars Gravity glyph as an input
        builder
          .addSlot('input', 155, 10)
          .setBackground(slotDrawable, -1, -1)
          .addItemStack('ars_nouveau:glyph_gravity')

        for (let i = 0; i < ingredients.length; ++i) {
          builder
            .addSlot('input', 7 + i * 7, 35)
            .addItemStacks(Ingredient.of(ingredients[i]).itemStacks)
            .setBackground(slotDrawable, -1, -1)
        }
        for (let i = 0; i < results.length; ++i) {
          builder
            .addSlot('output', 155 + i * 7, 35)
            .addItemStack(Item.of(results[i]))
            .setBackground(slotDrawable, -1, -1)
        }
      })
      .setDrawHandler((recipe, _, guiGraphics) => {
        let { ingredients, results, minimumSpeed, fallingBlock, belowBlock } =
          recipe.data
        belowBlock =
          belowBlock === undefined
            ? 'createutilities:void_steel_block'
            : belowBlock
        const time = Client.level.getTime()
        const step = time % 40

        const pose = guiGraphics.pose()
        const quat = new Quaternionf()
        quat.rotationXYZ(JavaMath.toRadians(-15.5), JavaMath.toRadians(45), 0)

        // Draw the arrows
        const renderArrow = (x, y, rotation) => {
          pose.pushPose()
          pose.translate(x, y, 0)
          pose.rotateZ(rotation)
          guiGraphics.blit(
            /*atlasLocation=*/ 'kubejs:textures/gui/arrow.png',
            /*x=*/ 0,
            /*y=*/ 0,
            /*uOffset=*/ 0,
            /*vOffset=*/ 0,
            /*width=*/ 31,
            /*height=*/ 9,
            /*textureWidth=*/ 31,
            /*textureHeight=*/ 9
          )
          pose.popPose()
        }
        renderArrow(31, 38, 0)
        renderArrow(117, 38, 0)
        pose.pushPose()
        pose.translate(117, 12, 0)
        guiGraphics.blit(
          /*atlasLocation=*/ 'kubejs:textures/gui/ars_spellcast.png',
          /*x=*/ 0,
          /*y=*/ 0,
          /*uOffset=*/ 0,
          /*vOffset=*/ 0,
          /*width=*/ 31,
          /*height=*/ 9,
          /*textureWidth=*/ 31,
          /*textureHeight=*/ 9
        )
        pose.popPose()

        // Code inspired by Flux Networks JEI rendering.
        // Draw the top void steel block
        pose.pushPose()
        const offset = step > 20 ? 48 : global.lerp(step, 0, 20, 25, 48)
        pose.translate(70, offset, 128)
        pose.mulPose(quat)
        $GuiGameElement['of(net.minecraft.world.level.block.state.BlockState)'](
          Block.getBlock(belowBlock)
        )
          .scale(24)
          .lighting($AnimatedKinetics.DEFAULT_LIGHTING)
          .render(guiGraphics)
        pose.popPose()

        // Draw the bottom void steel block
        pose.pushPose()
        pose.translate(70, 70, 128 - 32)
        pose.mulPose(quat)
        $GuiGameElement['of(net.minecraft.world.level.block.state.BlockState)'](
          Block.getBlock(fallingBlock)
        )
          .scale(24)
          .lighting($AnimatedKinetics.DEFAULT_LIGHTING)
          .render(guiGraphics)
        pose.popPose()

        // Draw the floating item.
        const itemRenderer = Client.getItemRenderer()
        // This will not handle tag inputs correctly, but for now we aren't
        // registered any tags as ingredients so this should be fine for now.
        const displayedItem = Item.of(ingredients[step % ingredients.length])
        const FULL_BRIGHT = 15728880
        const NO_OVERLAY = 655360
        pose.pushPose()
        pose.translate(87, 42, 128 - 16)
        pose.scale(16, -16, 16)
        const xRot = displayedItem.block ? JavaMath.toRadians(30) : 0
        const yRot = JavaMath.toRadians(
          global.lerp(time % 100, 0, 100, -90, 90)
        )
        quat.rotationXYZ(xRot, yRot, 0)
        pose.mulPose(quat)
        itemRenderer.renderStatic(
          /*stack=*/ displayedItem,
          /*displayContext=*/ 'fixed',
          /*combinedLight=*/ FULL_BRIGHT,
          /*combinedOverlay=*/ NO_OVERLAY,
          /*poseStack=*/ pose,
          /*buffer=*/ guiGraphics.bufferSource(),
          /*level=*/ null,
          /*seed=*/ 0
        )
        pose.popPose()

        guiGraphics.bufferSource().endBatch()
      })
  })
})

JEIAddedEvents.registerRecipes((e) => {
  const r = e.custom(global.ARS_GRAVITY_BLOCK_CRUSHING)
  for (const recipes of Object.values(global.ArsGravityBlockCrushingRecipes)) {
    for (const recipe of recipes) {
      r.add(recipe)
    }
  }
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data[
    'addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])'
  ]('createutilities:void_steel_block', global.ARS_GRAVITY_BLOCK_CRUSHING)
})
