// priority: 999

let $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
let $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

global.RESONANCE_CRAFTING = 'kubejs:resonance_crafting'

global.Notes = [
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

global.NoteToId = {
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
 * @typedef {Object} NoteBlockResonanceRecipeResult
 * @property {Internal.ItemStack_} result
 * @property {Internal.Block=} underBlock
 *
 * @typedef {Object.<Internal.ItemStack_, NoteBlockResonanceRecipeStep>}
 *   NoteBlockResonanceRecipeStep
 *
 * Example object format, keyed by vanilla note id to craft:
 * {
 *   24: {
 *     [ItemStack as CompoundTag]: {
 *       result: [ItemStack as CompoundTag],
 *       underBlock: "block.id|undefined"
 *     }
 *   }
 * }
 *
 * @type {Object.<number, NoteBlockResonanceRecipeStep>}
 */
global.ResonanceCraftingRecipes = {}

/**
 * Example object format stored in this array.
 * {
 *   type: 'kubejs:resonance_crafting',
 *   input: 'minecraft:stone',
 *   output: 'minecraft:ender_pearl',
 *   sequence: ['C4', 'E4', 'G4', 'D4'],
 *   hideSequence: false
 * }
 *
 * @typedef {Object} NoteBlockResonanceRecipeDataJEI
 * @property {string} type
 * @property {Internal.ItemStack_} input
 * @property {Internal.ItemStack_} output
 * @property {string[]} sequence
 * @property {boolean=} hideSequence
 *
 * @type {NoteBlockResonanceRecipeDataJEI[]}
 */
global.ResonanceCraftingRecipesJEI = []

/**
 * This should be the API used to register Resonance Crafting recipes.
 * @param {InputItem_} input
 * @param {OutputItem_} output
 * @param {string[]} notes
 * @param {{underBlock:Internal.Block, hideSequence:boolean}} options
 */
global.RegisterResonanceCraftingRecipe = (input, output, notes, options) => {
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

  options = options === undefined ? {} : options

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

  for (let i = 0; i < notes.length; ++i) {
    let vanillaNoteId = global.NoteToId[notes[i]]
    if (vanillaNoteId === undefined) {
      console.error(`Unknown note ID ${notes[i]}`)
      return
    }
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
    // Create the recipe registration if it doesn't exist.
    if (global.ResonanceCraftingRecipes[vanillaNoteId] === undefined) {
      global.ResonanceCraftingRecipes[vanillaNoteId] = {}
    }
    global.ResonanceCraftingRecipes[vanillaNoteId][inputTag] = {
      result: outputTag,
      underBlock: options?.underBlock,
    }
  }

  global.ResonanceCraftingRecipesJEI.push({
    type: global.RESONANCE_CRAFTING,
    input: input,
    output: output,
    sequence: notes,
    hideSequence: !!options.hideSequence,
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

  // First check if there are any resonance crafts for this note
  const resonanceCrafts = global.ResonanceCraftingRecipes[vanillaNoteId]
  if (resonanceCrafts === undefined) return

  // Store the block underneath the note block
  const underBlock = level.getBlock(pos.below())

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

    // The block underneath the note block does not match
    if (
      craftingResult.underBlock &&
      craftingResult.underBlock !== underBlock.getId()
    ) {
      continue
    }

    // Successful match, replace the item on the pedestal
    nbt.put('itemStack', craftingResult.result)
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
        0, // count, must be 0 for pitch argument
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
  global.RegisterResonanceCraftingRecipe(
    'minecraft:ender_pearl',
    'kubejs:resonant_ender_pearl',
    ['E4', 'D4', 'C4', 'G4']
  )
  global.RegisterResonanceCraftingRecipe(
    'minecraft:honey_bottle',
    'minecraft:ghast_tear',
    ['F#4']
  )
})
