// priority: 999

global.TIME_POUCH_CRAFTING = 'kubejs:time_pouch_crafting'

/**
 * @type {{ string : { output: string, cost: number }}}
 */
global.TimePouchCraftingRecipes = {}

/**
 * Registers a Time Pouch Crafting recipe.
 * @param {Internal.Block} input The block that will be converted
 * @param {Internal.Block} output The block to be converted to
 * @param {number} cost The cost in grains of time. 20 grains = 20 ticks = 1s
 */
global.RegisterTimePouchCraftingRecipe = (input, output, cost) => {
  if (input in global.TimePouchCraftingRecipes) {
    throw new Error(`Duplicate time pouch crafting recipe for ${input}`)
  }
  global.TimePouchCraftingRecipes[input] = {
    output: output,
    cost: cost,
  }
}

/**
 * Registers the block right click event handlers for each of the crafts.
 *
 * Must be called in server_scripts to initialize all the crafting recipes.
 */
global.RegisterTimePouchCraftingEventHandlers = () => {
  for (const [input_, data_] of Object.entries(
    global.TimePouchCraftingRecipes
  )) {
    // Wrap the event handler in a closure to freeze the variable state at the
    // current iteration loop
    ;((input, output, cost) => {
      BlockEvents.rightClicked(input, (e) => {
        const { item, hand, block, level } = e
        if (hand !== 'main_hand') return
        if (item.id !== 'gag:time_sand_pouch') return
        const time = item.nbt.getInt('grains')
        if (!time || time < cost) return

        // If there are enough grains of time, replace the block and deduct the
        // cost.
        block.set(output, block.properties)
        item.nbt.putInt('grains', time - cost)
        level.spawnParticles(
          'minecraft:enchant', // particle
          true, // overrideLimiter
          block.x + 0.5, // x
          block.y + 0.5, // y
          block.z + 0.5, // z
          0.02, // vx
          0.02, // vy
          0.02, // vz
          100, // count
          0.8 // speed
        )
      })
    })(input_, data_.output, data_.cost)
  }
}

// Register all the time pouch crafts here. This registration can happen on the
// server side for debugging, but they need to be present here for the JEI
// category to work.
global.RegisterTimePouchCraftingRecipe(
  'minecraft:green_wool',
  'apotheotic_additions:timeworn_fancy',
  2000
)
global.RegisterTimePouchCraftingRecipe(
  'apotheotic_additions:timeworn_fancy',
  'apotheotic_additions:timeworn_fabric',
  2000
)
for (let copper of [
  'minecraft:copper',
  'minecraft:cut_copper',
  'minecraft:cut_copper_stairs',
  'minecraft:cut_copper_slab',
  'create:copper_shingles',
  'create:copper_shingle_slab',
  'create:copper_shingle_stairs',
  'create:copper_tiles',
  'create:copper_tile_slab',
  'create:copper_tile_stairs',
  'quark:cut_copper_vertical_slab',
]) {
  let exposed = copper.replace(':', ':exposed_')
  let weathered = copper.replace(':', ':weathered_')
  let oxidized = copper.replace(':', ':oxidized_')
  if (copper === 'minecraft:copper') copper = 'minecraft:copper_block'
  global.RegisterTimePouchCraftingRecipe(copper, exposed, 1000)
  global.RegisterTimePouchCraftingRecipe(exposed, weathered, 1000)
  global.RegisterTimePouchCraftingRecipe(weathered, oxidized, 1000)
}
