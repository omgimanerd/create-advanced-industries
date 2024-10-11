// priority: 0
// Custom JEI category for energized beacon crafting.

JEIAddedEvents.registerCategories((e) => {
  // Create class for JEI arrow textures.
  const $AllGuiTextures = Java.loadClass(
    'com.simibubi.create.foundation.gui.AllGuiTextures'
  )
  // Create class for block rendering in JEI.
  const $GuiGameElement = Java.loadClass(
    'com.simibubi.create.foundation.gui.element.GuiGameElement'
  )
  // Create class for holding default lighting objects
  const $AnimatedKinetics = Java.loadClass(
    'com.simibubi.create.compat.jei.category.animations.AnimatedKinetics'
  )
  // Native Minecraft rendering logic for the beacon beam.
  const $BeaconRenderer = Java.loadClass(
    'net.minecraft.client.renderer.blockentity.BeaconRenderer'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  const slotDrawable = guiHelper.getSlotDrawable()

  // Preprocess the list of beacon items into a list.
  const beaconItems = Object.keys(global.EnergizedBeaconItems).map((id) =>
    Item.of(id)
  )

  // Hardcoded locations to draw the results, recipes that exceed this many
  // outputs will throw an error.
  const resultOffsets = [
    [135, 35],
    [154, 35],
    [135, 54],
    [154, 54],
  ]

  e.custom(global.ENERGIZED_BEACON_CRAFTING, (category) => {
    category
      .title('Energized Beacon Crafting')
      .background(guiHelper.createBlankDrawable(177, 100))
      .icon(doubleItemIcon('minecraft:beacon', 'quark:red_corundum_cluster'))
      .isRecipeHandled(() => true) // Only relevant recipes are registered
      .handleLookup((builder, recipe) => {
        let { ingredient, results, redirectorBlock, energy } = recipe.data
        const corundumName = Block.getBlock(redirectorBlock).name.gold()

        // Add the beacon as an invisible ingredient to every recipe.
        builder
          .addInvisibleIngredients('input')
          .addItemStack('minecraft:beacon')

        // Add the corundum redirector block as an invisible ingredient to every
        // recipe.
        builder.addInvisibleIngredients('input').addItemStack(redirectorBlock)

        // Add the precomputed beacon energy carriers and a tooltip for the
        // energy that they will provide the beacon.
        builder
          .addSlot('input', 10, 46)
          .addItemStacks(beaconItems)
          .setBackground(slotDrawable, -1, -1)
          .addTooltipCallback((recipeSlotView, list) => {
            const displayedIngredientOpt = recipeSlotView.displayedItemStack
            // This should never happen, but try not to explode the computer.
            if (displayedIngredientOpt.isEmpty()) return
            const displayedIngredient = displayedIngredientOpt.get()
            const providedEnergy =
              global.EnergizedBeaconItems[displayedIngredient.id]?.energy
            if (!providedEnergy) {
              console.error(
                `Unable to fetch energy cost for ${displayedIngredient}`
              )
            }
            list.add(
              1,
              Text.gold(
                `Right click on a beacon to impart ${providedEnergy}RF to it.`
              )
            )
          })

        // Add all the possible input items for this recipe.
        const input = builder
          .addSlot('input', 111, 11)
          .setBackground(slotDrawable, -1, -1)
          .addTooltipCallback((_, list) => {
            list.add(
              1,
              Text.gold(
                'Throw into the path of a beacon beam redirected with '
              ).append(corundumName)
            )
          })
        if (ingredient.startsWith('#')) {
          Ingredient.of(ingredient).itemIds.forEach((id) => {
            input.addItemStack(id)
          })
        } else {
          input.addItemStack(ingredient)
        }

        // Add the output recipe and a tooltip for the energy cost.
        results = Array.isArray(results) ? results : [results]
        let i = 0
        if (results.length > resultOffsets.length) {
          throw new Error(`Too many outputs for recipe with results ${results}`)
        }
        for (const result of results) {
          let [x, y] = resultOffsets[i++]
          builder
            .addSlot('output', x, y)
            .addItemStack(result)
            .setBackground(slotDrawable, -1, -1)
            .addTooltipCallback((_, list) => {
              list.add(1, Text.gold(`Costs ${energy}RF per craft.`))
            })
        }
      })
      .setDrawHandler((recipe, _, guiGraphics) => {
        const { redirectorBlock, beaconColor } = recipe.data
        const bufferSource = guiGraphics.bufferSource()
        const pose = guiGraphics.pose()

        // Render the two beacon beams.
        /**
         * Internal helper for rendering beacon beams.
         * @param {number} x
         * @param {number} y
         * @param {number} height
         * @param {number} rotation
         * @param {[number, number, number]} color
         */
        const renderBeaconBeam = (x, y, height, rotation, color) => {
          pose.pushPose()
          pose.translate(x, y, 0)
          if (rotation !== undefined && rotation !== null) {
            pose.rotateZ(rotation)
          }
          pose.scale(12, 12, 12)
          $BeaconRenderer.renderBeaconBeam(
            /*poseStack=*/ pose,
            /*bufferSource=*/ bufferSource,
            /*beamLocation=*/ 'textures/entity/beacon_beam.png',
            /*partialTick=*/ Client.partialTick,
            /*textureScale=*/ 1,
            /*gameTime=*/ Client.level.time,
            /*yOffset=*/ 0,
            /*height=*/ height,
            /*colors=*/ color,
            /*beamRadius=*/ 0.25,
            /*glowRadius=*/ 0.4
          )
          pose.popPose()
        }
        renderBeaconBeam(34, 24, 4, null, [1, 1, 1])
        renderBeaconBeam(45, 24, 5, -90, beaconColor)

        /**
         * Internal helper to draw a down right arrow.
         * @param {number} x
         * @param {number} y
         */
        const renderDownRightArrow = (x, y) => {
          guiGraphics.blit(
            /*atlasLocation=*/ 'kubejs:textures/gui/down_right_arrow.png',
            /*x=*/ x,
            /*y=*/ y,
            /*uOffset=*/ 0,
            /*vOffset=*/ 0,
            /*width=*/ 14,
            /*height=*/ 18,
            /*textureWidth=*/ 14,
            /*textureHeight=*/ 18
          )
        }
        renderDownRightArrow(14, 65) // Item to right click the beacon with
        renderDownRightArrow(116, 28) // Crafting output

        // Draw a shadow for the beacon block block
        $AllGuiTextures.JEI_SHADOW.render(guiGraphics, 17, 81)
        // Render the beacon block.
        pose.pushPose()
        pose.translate(30, 85, 0)
        pose.mulPose(RotationAxis.XP.deg(-15.5))
        pose.mulPose(RotationAxis.YP.deg(22.5))
        $GuiGameElement['of(net.minecraft.world.level.block.state.BlockState)'](
          Block.getBlock('minecraft:beacon').defaultBlockState()
        )
          .lighting($AnimatedKinetics.DEFAULT_LIGHTING)
          .scale(15)
          .render(guiGraphics)
        pose.popPose()

        // Draw the corundum crystal.
        pose.pushPose()
        pose.translate(49, 27, 0)
        pose.mulPose(RotationAxis.ZP.deg(-90))
        $GuiGameElement['of(net.minecraft.world.level.block.state.BlockState)'](
          Block.getBlock(redirectorBlock).defaultBlockState()
        )
          .lighting($AnimatedKinetics.DEFAULT_LIGHTING)
          .scale(15)
          .render(guiGraphics)
        pose.popPose()

        bufferSource.endBatch()
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
