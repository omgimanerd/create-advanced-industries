// priority: 999

let $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
let $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

global.RESONANCE_CRAFTING = 'kubejs:resonance_crafting'

global.NOTES = [
  'F#3', // 0
  'G3', // 1
  'G#3', // 2
  'A3', // 3
  'A#3', // 4
  'B3', // 5
  'C4', // 6
  'C#4', // 7
  'D4', // 8
  'D#4', // 9
  'E4', // 10
  'F4', // 11
  'F#4', // 12
  'G4', // 13
  'G#4', // 14
  'A4', // 15
  'A#4', // 16
  'B4', // 17
  'C5', // 18
  'C#5', // 19
  'D5', // 20
  'D#5', // 21
  'E5', // 22
  'F5', // 23
  'F#5', // 24
]

global.NOTE_TO_ID = {
  'F#3': 0,
  G3: 1,
  'G#3': 2,
  A3: 3,
  'A#3': 4,
  B3: 5,
  C4: 6,
  'C#4': 7,
  D4: 8,
  'D#4': 9,
  E4: 10,
  F4: 11,
  'F#4': 12,
  G4: 13,
  'G#4': 14,
  A4: 15,
  'A#4': 16,
  B4: 17,
  C5: 18,
  'C#5': 19,
  D5: 20,
  'D#5': 21,
  E5: 22,
  F5: 23,
  'F#5': 24,
}

global.NOTE_TO_COLOR = {
  'F#3': Color.rgba(119, 210, 5, 0), // #77D700
  G3: Color.rgba(149, 192, 0, 0), // #95C000
  'G#3': Color.rgba(178, 165, 0, 0), // #B2A500
  A3: Color.rgba(204, 134, 0, 0), // #CC8600
  'A#3': Color.rgba(226, 101, 0, 0), // #E26500
  B3: Color.rgba(243, 65, 0, 0), // #F34100
  C4: Color.rgba(252, 30, 0, 0), // #FC1E00
  'C#4': Color.rgba(254, 0, 15, 0), // #FE000F
  D4: Color.rgba(247, 0, 51, 0), // #F70033,
  'D#4': Color.rgba(232, 0, 90, 0), // #E8005A
  E4: Color.rgba(207, 0, 131, 0), // #CF0083,
  F4: Color.rgba(174, 0, 169, 0), // #AE00A9,
  'F#4': Color.rgba(134, 0, 204, 0), // #8600CC
  G4: Color.rgba(91, 0, 231, 0), // #5B00E7
  'G#4': Color.rgba(45, 0, 249, 0), // #2D00F9,
  A4: Color.rgba(2, 10, 254, 0), // #020AFE
  'A#4': Color.rgba(0, 55, 246, 0), // #0037F6
  B4: Color.rgba(0, 104, 224, 0), // #0068E0
  C5: Color.rgba(0, 154, 188, 0), // #009ABC
  'C#5': Color.rgba(0, 198, 141, 0), // #00C68D
  D5: Color.rgba(0, 233, 88, 0), // #00E958
  'D#5': Color.rgba(0, 252, 33, 0), // #00FC21
  E5: Color.rgba(31, 252, 0, 0), // #1FFC00
  F5: Color.rgba(89, 232, 0, 0), // #59E800
  'F#5': Color.rgba(148, 193, 0, 0), // #94C100
  '?': Color.rgba(255, 255, 255, 0), // Special case
}

/**
 * Example object format, keyed by instrument and vanilla note id:
 * {
 *   'harp:24': {
 *     [ItemStack as CompoundTag]: [ItemStack as CompoundTag],
 *   }
 * }
 */
global.ResonanceCraftingRecipes = {}

/**
 * Example object format stored in this array.
 * {
 *   type: 'kubejs:resonance_crafting',
 *   input: 'minecraft:stone',
 *   output: 'minecraft:ender_pearl',
 *   sequence: [{
 *     note: 'C4',
 *     instrument: 'harp',
 *   }, {
 *     note: 'D5',
 *     instrument: 'bell',
 *   }],
 *   hideSequence: false
 * }
 *
 * @typedef {Object} NoteBlockResonanceRecipeDataJEI
 * @property {string} type
 * @property {Internal.ItemStack_} input
 * @property {Internal.ItemStack_} output
 * @property {{note:string, instrument:Internal.Instrument}[]} sequence
 * @property {boolean=} hideSequence
 *
 * @type {NoteBlockResonanceRecipeDataJEI[]}
 */
global.ResonanceCraftingRecipesJEI = []

/**
 * This is the method used to register Resonance Crafting recipes.
 * @param {InputItem_} input
 * @param {OutputItem_} output
 * @param {(string|{note:string, instrument:Internal.Instrument})[]} notes
 * @param {boolean} hideSequence
 */
global.RegisterResonanceCraftingRecipe = (
  input,
  output,
  notes,
  hideSequence
) => {
  input = typeof input === 'string' ? Item.of(input) : input
  output = typeof output === 'string' ? Item.of(output) : output
  if (input === null || input.class !== $ItemStack) {
    console.error(`Cannot process input ${input} for resonance craft!`)
    return
  }
  if (output === null || output.class !== $ItemStack) {
    console.error(`Cannot process output ${output} for resonance craft!`)
    return
  }

  /**
   * Helper to generate the transitional items.
   * @param {number} step
   * @returns {Internal.ItemStack}
   */
  let transitionalItem = (step) => {
    return input
      .withNBT({
        ResonanceCraftProgress: step,
      })
      .withLore([
        Text.aqua('Play the right note to resonate with this item...').italic(
          false
        ),
      ])
  }

  // Register each individual note played as a recipe step
  for (let i = 0; i < notes.length; ++i) {
    // Input parsing, can accept an object or string
    let note = notes[i]
    let noteIsObj = typeof note === 'object'
    let noteStr = noteIsObj ? note.note : note
    if (noteStr === undefined) {
      console.error(`Unknown note sequence ${notes}`)
      return
    }
    let instrument = noteIsObj ? note.instrument : 'harp'
    if (instrument === undefined || !(instrument in global.INSTRUMENTS)) {
      console.error(`Unknown note sequence ${notes}`)
      return
    }

    // Generate the recipe key from the instrument and note
    let vanillaNoteId = global.NOTE_TO_ID[noteStr]
    if (vanillaNoteId === undefined) {
      console.error(`Unknown note ID ${note}`)
      return
    }
    let recipeKey = `${instrument}:${vanillaNoteId}`

    let inputTag = new $CompoundTag()
    let outputTag = new $CompoundTag()
    // If this is the first step of the recipe, use the input item.
    if (i == 0) {
      input.save(inputTag)
    } else {
      transitionalItem(i).save(inputTag)
    }
    // If this is the last step of the recipe, use the output item.
    if (i == notes.length - 1) {
      output.save(outputTag)
    } else {
      transitionalItem(i + 1).save(outputTag)
    }
    // Create the recipe registration dict if it doesn't exist.
    if (global.ResonanceCraftingRecipes[recipeKey] === undefined) {
      global.ResonanceCraftingRecipes[recipeKey] = {}
    }
    global.ResonanceCraftingRecipes[recipeKey][inputTag] = outputTag
  }

  // Make the recipe data available to JEI.
  global.ResonanceCraftingRecipesJEI.push({
    type: global.RESONANCE_CRAFTING,
    input: input,
    output: output,
    sequence: notes,
    hideSequence: !!hideSequence,
  })
}

/**
 * Event handler for when a note block is played to enable resonance crafting.
 * Handler registered here to allow for easy reloading.
 *
 * @param {Internal.NoteBlockEvent} e
 */
global.NoteBlockEventHandler = (e) => {
  if (e.level.isClientSide()) return
  const { level, pos, vanillaNoteId } = e

  // First check if there are any resonance crafts for this note and instrument
  const noteBlock = level.getBlock(pos)
  const instrument = noteBlock?.properties?.instrument
  if (instrument === undefined) {
    console.error('Unable to find note block instrument!')
    return
  }
  const recipeKey = `${instrument}:${vanillaNoteId}`
  const resonanceCrafts = global.ResonanceCraftingRecipes[recipeKey]
  if (resonanceCrafts === undefined) return

  /**
   * Generates the random spread for the note particles.
   * @returns {number}
   */
  const randomSpread = () => {
    return (Math.random() * 2 * 0.4) - 0.2 // prettier-ignore
  }

  // Search the surrounding pedestals for matching items in the resonance
  // crafts.
  for (let vec of global.getOffsetList(AABB.of(-2, 0, -2, 2, 1, 2))) {
    let p = pos.offset(vec)
    let block = level.getBlock(p)
    let blockId = block.getId()
    if (
      blockId !== 'ars_nouveau:arcane_pedestal' &&
      blockId !== 'ars_nouveau:arcane_platform'
    ) {
      continue
    }

    let nbt = block.getEntityData()
    let itemStackCompoundTag = nbt.itemStack
    let craftingResult = resonanceCrafts[itemStackCompoundTag]
    // No crafting recipe matching this particular item
    if (craftingResult === undefined) continue

    // Successful match, replace the item on the pedestal
    nbt.put('itemStack', craftingResult)
    block.setEntityData(nbt)
    block.getEntity().updateBlock()
    let particlePos = p.getCenter().add(0, 0.3, 0)
    let count = 10
    for (let i = 0; i < count; ++i) {
      level.spawnParticles(
        'minecraft:note',
        true, // overrideLimiter
        particlePos.x() + randomSpread(), // x position
        particlePos.y() + randomSpread(), // y position
        particlePos.z() + randomSpread(), // z position
        vanillaNoteId / 24, // vx, used as pitch when count is 0
        0, // vy, unused
        0, // vz, unused
        0, // count, must be 0 for pitch argument to work
        1 // speed, must be 1 for pitch argument to work
      )
    }
  }
}

ForgeEvents.onEvent('net.minecraftforge.event.level.NoteBlockEvent', (e) => {
  global.NoteBlockEventHandler(e)
})

// Recipe registrations must happen here.
StartupEvents.postInit(() => {
  /**
   * Internal helper to get all items for a list of item ids or tags.
   * @param {string[]} tags
   * @returns {Internal.List<Internal.ItemStack_>}
   */
  const getAllItemStacks = (tags) => {
    const itemStacks = Utils.newList()
    for (const tag of tags) {
      Ingredient.of(tag).itemIds.forEach((id) => {
        itemStacks.add(Item.of(id))
      })
    }
    return itemStacks
  }

  // Mapping of all note block instruments and the block required to play them
  // This can only be populated after the item registry is available.
  global.INSTRUMENTS = {
    bass: getAllItemStacks([
      '#minecraft:logs',
      '#minecraft:planks',
      '#minecraft:wooden_slabs',
    ]),
    snare: getAllItemStacks(['#minecraft:sand', 'minecraft:gravel']),
    hat: getAllItemStacks([
      'minecraft:glass',
      'minecraft:sea_lantern',
      'minecraft:beacon',
    ]),
    basedrum: getAllItemStacks([
      '#minecraft:base_stone_overworld',
      'minecraft:netherrack',
      '#minecraft:nylium',
      'minecraft:obsidian',
      'minecraft:quartz_block',
      '#forge:sandstone',
    ]),
    bell: [Item.of('minecraft:gold_block')],
    flute: [Item.of('minecraft:clay')],
    chime: [Item.of('minecraft:packed_ice')],
    guitar: getAllItemStacks(['#minecraft:wool']),
    xylophone: [Item.of('minecraft:bone_block')],
    iron_xylophone: [Item.of('minecraft:iron_block')],
    cow_bell: [Item.of('minecraft:soul_sand')],
    didgeridoo: [Item.of('minecraft:pumpkin')],
    bit: [Item.of('minecraft:emerald_block')],
    banjo: [Item.of('minecraft:hay_block')],
    harp: [Item.getEmpty()],
  }

  // Recipes must be registered here to work properly in JEI. For local testing,
  // they can still be registered in server_scripts.

  // Recipes used in Chapter 6
  global.RegisterResonanceCraftingRecipe(
    'minecraft:ender_pearl',
    'kubejs:resonant_ender_pearl',
    ['E4', 'D4', 'C4', 'G4']
  )
  global.RegisterResonanceCraftingRecipe(
    'minecraft:bone',
    'minecraft:skeleton_skull',
    [
      { note: 'D4', instrument: 'xylophone' },
      { note: 'D4', instrument: 'xylophone' },
      { note: 'D5', instrument: 'xylophone' },
      { note: 'A4', instrument: 'xylophone' },
    ]
  )

  global.RegisterResonanceCraftingRecipe(
    'minecraft:honey_bottle',
    'minecraft:ghast_tear',
    [
      { note: 'E4', instrument: 'bell' },
      { note: 'C4', instrument: 'bell' },
      { note: 'D4', instrument: 'bell' },
      { note: 'G3', instrument: 'bell' },
    ]
  )

  global.RegisterResonanceCraftingRecipe(
    'apotheosis:warden_tendril',
    'kubejs:warden_tendril_vine_seed',
    [
      { note: 'C4', instrument: 'banjo' },
      { note: 'D4', instrument: 'banjo' },
      { note: 'F4', instrument: 'banjo' },
      { note: 'D4', instrument: 'banjo' },
      { note: 'A4', instrument: 'banjo' },
      { note: 'A4', instrument: 'banjo' },
      { note: 'G4', instrument: 'banjo' },
    ]
  )
})
