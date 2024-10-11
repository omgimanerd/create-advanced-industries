// priority: 999
// See https://minecraft.fandom.com/wiki/Note_Block for the hardcoded data
// values in the constants.

const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

global.RESONANCE_CRAFTING = 'kubejs:resonance_crafting'

/**
 * Global constants for the notes, with their index in the array corresponding
 * to the numerical pitch on the note block.
 * @type {string}
 */
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

/**
 * A mapping of the string identifier for the notes back to their numerical
 * pitch ID. A reverse lookup for global.NOTES.
 * @type {string:number}
 */
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

/**
 * A mapping of the notes to the color the note is rendered as when played from
 * a note block.
 * @type {string:Internal.Color_}
 */
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
 * A rough mapping of the instruments that a note block can play to the blocks
 * that must be placed underneath it. Not exhaustive since Minecraft uses
 * material types and not IDs or tags.
 * @type {Internal.Instrument_:string[]}
 */
global.INSTRUMENTS = {
  bass: ['#minecraft:logs', '#minecraft:planks', '#minecraft:wooden_slabs'],
  snare: ['#minecraft:sand', 'minecraft:gravel'],
  hat: ['minecraft:glass', 'minecraft:sea_lantern', 'minecraft:beacon'],
  basedrum: [
    '#minecraft:base_stone_overworld',
    'minecraft:netherrack',
    '#minecraft:nylium',
    'minecraft:obsidian',
    'minecraft:quartz_block',
    '#forge:sandstone',
  ],
  bell: ['minecraft:gold_block'],
  flute: ['minecraft:clay'],
  chime: ['minecraft:packed_ice'],
  guitar: ['#minecraft:wool'],
  xylophone: ['minecraft:bone_block'],
  iron_xylophone: ['minecraft:iron_block'],
  cow_bell: ['minecraft:soul_sand'],
  didgeridoo: ['minecraft:pumpkin'],
  bit: ['minecraft:emerald_block'],
  banjo: ['minecraft:hay_block'],
  harp: ['minecraft:air'],
}

/**
 * Lookup table for all the transformations assigned to a note when it is played
 * by a note block.
 *
 * Example object format, keyed by instrument and vanilla note id:
 * {
 *   'harp:24': {
 *     [ItemStack as CompoundTag]: {
 *       result: [ItemStack as CompoundTag],
 *       final: true,
 *     }
 *   }
 * }
 */
global.ResonanceCraftingRecipes = {}

/**
 * Information about all the registered resonance crafting recipes, optimized
 * for processing by the JEI recipe category code.
 *
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
 * @property {{note:string, instrument:Internal.Instrument_}[]} sequence
 * @property {boolean=} hideSequence
 *
 * @type {NoteBlockResonanceRecipeDataJEI[]}
 */
global.ResonanceCraftingRecipesJEI = []

/**
 * This is the method used to register Resonance Crafting recipes.
 * @param {InputItem_} input
 * @param {OutputItem_} output
 * @param {(string|{note:string, instrument:Internal.Instrument_})[]} notes
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
   * @returns {Internal.ItemStack_}
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
    let finalStep = i === notes.length - 1
    if (finalStep) {
      output.save(outputTag)
    } else {
      transitionalItem(i + 1).save(outputTag)
    }
    // Create the recipe registration dict if it doesn't exist.
    if (global.ResonanceCraftingRecipes[recipeKey] === undefined) {
      global.ResonanceCraftingRecipes[recipeKey] = {}
    }
    global.ResonanceCraftingRecipes[recipeKey][inputTag] = {
      result: outputTag,
      final: finalStep,
    }
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
  for (let offset of BlockPos.betweenClosed(-2, 0, -2, 2, 1, 2)) {
    let p = pos.offset(offset)
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
    let resonanceCraft = resonanceCrafts[itemStackCompoundTag]
    // No crafting recipe matching this particular item
    if (resonanceCraft === undefined) continue
    let { result, final } = resonanceCraft

    // Successful match, replace the item on the pedestal
    nbt.put('itemStack', result)
    block.setEntityData(nbt)
    block.getEntity().updateBlock()

    let particlePos = p.getCenter().add(0, 0.3, 0)
    if (!final) {
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
    } else {
      level.spawnParticles(
        'minecraft:end_rod',
        true, // overrideLimiter
        particlePos.x(),
        particlePos.y() + 0.25,
        particlePos.z(),
        0.2, // vx, affects the spread around the position
        0.2, // vy, affects the spread around the position
        0.2, // vz, affects the spread around the position
        25, // count
        0.15 // speed
      )
      level.playSound(
        null, // player
        p.x,
        p.y,
        p.z,
        'ars_nouveau:ea_finish',
        'blocks',
        3, // volume
        0 // pitch
      )
    }
  }
}

ForgeEvents.onEvent('net.minecraftforge.event.level.NoteBlockEvent', (e) => {
  global.NoteBlockEventHandler(e)
})

/**
 * Recipe registrations must happen here. Item registries must be loaded for
 * resonance crafts to work.
 *
 * For debugging, since the registries are already available, comment out
 * StartupEvents.postInit() and just directly execute the registrations.
 */
StartupEvents.postInit(() => {
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
      { note: 'G4', instrument: 'xylophone' },
      { note: 'G4', instrument: 'xylophone' },
      { note: 'F#4', instrument: 'xylophone' },
      { note: 'F#4', instrument: 'xylophone' },
      { note: 'B3', instrument: 'xylophone' },
      { note: 'D4', instrument: 'xylophone' },
      { note: 'B3', instrument: 'xylophone' },
    ]
  )

  // TODO: this makes no sense
  // Should be a centrifuging recipe with intermediates or blasting potion?
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
