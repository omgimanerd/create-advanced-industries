// priority: 100

// JEIAddedEvents.registerCategories((e) => {
//   const guiHelper = e.data.jeiHelpers.guiHelper
//   e.custom('kubejs:resonance_crafting', (category) => {
//     category
//       .title('Resonance Crafting')
//       .background(guiHelper.createBlankDrawable(100, 50))
//       .icon(guiHelper.createDrawableItemStack(Item.of('minecraft:note_block')))
//       .isRecipeHandled((recipe) => {
//         return recipe?.type === 'kubejs:resonance_crafting'
//       })
//       .handleLookup((builder, recipe, focuses) => {
//         builder.addSlot('input', 20, 20).addItemStack(Item.of(recipe.input))
//         builder.addSlot('output', 60, 20).addItemStack(Item.of(recipe.output))
//       })
//       .setDrawHandler(
//         (recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => {}
//       )
//   })
// })

// JEIAddedEvents.registerRecipes((e) => {
//   console.log(global.ResonanceCraftingRecipesJEI)

//   if (!global.ResonanceCraftingRecipesJEI) return
//   console.log(global.ResonanceCraftingRecipesJEI)
//   for (const data of global.ResonanceCraftingRecipesJEI) {
//     console.log(data)
//     e.custom('kubejs:resonance_crafting').add(data)
//   }
// })
