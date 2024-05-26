// priority: 100

JEIAddedEvents.registerCategories((e) => {
  /**
   * Internal helper to get the color and centered x offset for a note.
   * @param {string} note
   * @returns {[Internal.Color, number]}
   */
  const getNoteTextAndOffset = (note) => {
    const shortened = note.replace(/[0-9]/, '')
    return [
      Text.of(shortened).color(global.NOTE_TO_COLOR[note]),
      shortened.length === 1 ? 6 : 3,
    ]
  }

  /**
   * Internal helper to parse note inputs which can be a string or object
   * @param {string|{note:string, instrument: Internal.Instrument}} note
   * @returns {[string, Internal.Instrument]}
   */
  const parseNote = (note) => {
    if (typeof note === 'object') {
      return [note.note, note.instrument]
    }
    return [note, 'harp']
  }

  const line1Y = 5
  const line2Y = 25
  const line3Y = 45
  const sequenceXStart = 30

  const guiHelper = e.data.jeiHelpers.guiHelper
  e.custom(global.RESONANCE_CRAFTING, (category) => {
    category
      .title('Resonance Crafting')
      .background(guiHelper.createBlankDrawable(140, 70))
      .icon(guiHelper.createDrawableItemStack(Item.of('minecraft:note_block')))
      .isRecipeHandled(() => true) // Only appropriate recipes are added?
      .handleLookup((builder, recipe) => {
        const data = recipe.data
        const sequence = data.sequence
        builder.addSlot('input', 5, line1Y).addItemStack(data.input)
        builder.addSlot('output', 115, line1Y).addItemStack(data.output)
        builder
          .addSlot('input', 5, line2Y)
          .addItemStack('ars_nouveau:arcane_pedestal')
        builder
          .addSlot('input', 115, line2Y)
          .addItemStack('ars_nouveau:arcane_pedestal')
        builder
          .addInvisibleIngredients('input')
          .addItemStacks([
            Item.of('minecraft:note_block'),
            Item.of('ars_nouveau:arcane_platform'),
          ])
        for (let i = 0; i < sequence.length; ++i) {
          let [_, instrument] = parseNote(sequence[i])
          let x = sequenceXStart + i * 15
          if (instrument !== 'harp') {
            builder
              .addSlot('input', x, line3Y)
              .addItemStacks(global.INSTRUMENTS[instrument])
          }
        }
      })
      .setDrawHandler((recipe, _, guiGraphics) => {
        const sequence = recipe.data.sequence
        for (let i = 0; i < sequence.length; ++i) {
          let [note, _] = parseNote(sequence[i])
          let x = sequenceXStart + i * 15
          let [noteText, textOffset] = getNoteTextAndOffset(note)
          guiGraphics.drawWordWrap(
            Client.font,
            noteText, // TextComponent
            x + textOffset, // x
            line2Y - 10, // y
            20, // width
            0 // color, unused
          )
          guiGraphics.renderItem('minecraft:note_block', x, line2Y)
        }
      })
  })
})

JEIAddedEvents.registerRecipes((e) => {
  if (!global.ResonanceCraftingRecipesJEI) return
  const r = e.custom(global.RESONANCE_CRAFTING)
  for (const data of global.ResonanceCraftingRecipesJEI) {
    r.add(data)
  }
})
