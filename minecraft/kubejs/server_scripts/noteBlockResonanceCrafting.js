// priority: 1000

let $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
let $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

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

global.NoteBlockResonanceCrafts = {
  /**
   * Example object format, keyed by vanilla note id to craft:
   * {
   *   24: {
   *     "ItemStack as CompoundTag": {
   *       result: "ItemStack as CompoundTag",
   *       underBlock: "block.id|undefined"
   *     }
   *   }
   * }
   */
}

/**
 * @param {InputItem_} input
 * @param {OutputItem_} output
 * @param {string[]} notes
 * @param {Internal.Block} underBlock
 */
global.RegisterNoteBlockResonanceCraft = (input, output, notes, underBlock) => {
  input = typeof input === 'string' ? Item.of(input) : input
  output = typeof output === 'string' ? Item.of(output) : output
  if (input.class !== $ItemStack) {
    console.error(`Cannot process input ${input} for resonance craft!`)
    return
  }
  if (output.class !== $ItemStack) {
    console.error(`Cannot process output ${output} for resonance craft!`)
    return
  }

  /**
   * Helper to generate the transitional items.
   * @param {number} step
   * @returns {Internal.ItemStack}
   */
  let transitionalItem = (step) => {
    return input.withNBT({
      ResonanceCraftProgress: step,
    })
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
    if (global.NoteBlockResonanceCrafts[vanillaNoteId] === undefined) {
      global.NoteBlockResonanceCrafts[vanillaNoteId] = {}
    }
    global.NoteBlockResonanceCrafts[vanillaNoteId][inputTag] = {
      result: outputTag,
      underBlock: underBlock,
    }
  }
}

/**
 * @param {Internal.NoteBlockEvent} e
 */
global.NoteBlockEvent = (e) => {
  if (e.level.isClientSide()) return
  const { level, pos, vanillaNoteId } = e

  // First check if there are any resonance crafts for this note.
  const resonanceCrafts = global.NoteBlockResonanceCrafts[vanillaNoteId]
  if (resonanceCrafts === undefined) return

  // Store the block underneath the note block
  const underBlock = level.getBlock(pos)

  // Search the surrounding pedestals for matching items in the resonance
  // crafts.
  for (const vec of getOffsetList(AABB.of(-2, 0, -2, 2, 1, 2))) {
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
      craftingResult.underBlock !== undefined &&
      craftingResult.underBlock !== underBlock
    ) {
      continue
    }

    // Successful match, replace the item on the pedestal
    nbt.merge({
      itemStack: craftingResult.result,
    })
    block.setEntityData(nbt)
    block.getEntity().updateBlock()
    spawnNoteParticles(
      level,
      p.getCenter().add(0, 0.5, 0),
      5,
      0.3,
      vanillaNoteId
    )
  }
}
