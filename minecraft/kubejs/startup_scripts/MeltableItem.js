// priority: 900

// JS prototype class to store information about meltable items for
// metallurgy item and recipe registrations. Used by both startup_scripts and
// server_scripts
function MeltableItem(options) {
  this.nugget = options.nugget
  this.ingot = options.ingot
  this.block = options.block

  // If options.block is a forge tag, then specify a block for the melted fluid
  // to cast back into. Mostly for glass.
  this.blockCastingOutput = options.blockCastingOutput
  this.fluid = options.fluid
  this.bucketColor = options.bucketColor
  this.noRegisterFluid = options.noRegisterFluid
  this.fluidTextureLocation = options.fluidTextureLocation

  this.noIngotCastingRecipe = !!options.noIngotCastingRecipe
  this.blockRatio = options.blockRatio
    ? options.blockRatio
    : MeltableItem.DEFAULT_BLOCK_RATIO
  this.requiresSuperheating = options.requiresSuperheating

  // Names of the casts that the molten liquids will be poured into.
  this.ceramicIngotCast = 'kubejs:ceramic_ingot_cast'
  this.steelIngotCast = 'kubejs:steel_ingot_cast'

  // Names of the items that result from having the molten liquids poured into
  // them.
  this.fluidName = stripModPrefix(this.fluid)
  this.fluidDisplayName = getDisplayName(this.fluid)
  this.ceramicMoltenIngotCast = `kubejs:ceramic_ingot_cast_${this.fluidName}`
  this.steelMoltenIngotCast = `kubejs:steel_ingot_cast_${this.fluidName}`
}

// Units of mb
MeltableItem.DEFAULT_NUGGET_FLUID = 10
MeltableItem.DEFAULT_INGOT_FLUID = 90
MeltableItem.DEFAULT_BLOCK_RATIO = 9

MeltableItem.CERAMIC_CAST_RETURN_CHANCE = 0.25

/**
 * Registers the fluid for the MeltableItem if necessary.
 * Must be called in startup_scripts
 *
 * @param {Registry.Fluid} e
 */
MeltableItem.prototype.registerFluid = function (e) {
  if (!this.noRegisterFluid) {
    e.create(this.fluid)
      .bucketColor(this.bucketColor)
      .viscosity(2000)
      .stillTexture(`kubejs:fluid/${this.fluidName}_still`)
      .flowingTexture(`kubejs:fluid/${this.fluidName}_flow`)
      .displayName(getDisplayName(this.fluidDisplayName))
  }
}

/**
 * Registers the filled casts that result from pouring the molten item into a
 * cast.
 * @param {Registry.Block} e
 */
MeltableItem.prototype.registerCastedItems = function (e) {
  const fluidTextureLocation = this.fluidTextureLocation
    ? this.fluidTextureLocation
    : `kubejs:fluid/${this.fluidName}_still`
  if (!this.noIngotCastingRecipe) {
    registerFilledIngotCast(
      e,
      this.ceramicMoltenIngotCast,
      `Ceramic Ingot Cast (${this.fluidDisplayName})`,
      'minecraft:block/terracotta',
      fluidTextureLocation
    )
    registerFilledIngotCast(
      e,
      this.steelMoltenIngotCast,
      `Steel Ingot Cast (${this.fluidDisplayName})`,
      'kubejs:block/steel',
      fluidTextureLocation
    )
  }
}

/**
 * Helper method to register a melting recipe for this item.
 * Can only be called in server_scripts/
 *
 * @param {Internal.RecipesEventJS} e
 * @param {string} item
 * @param {string} fluid
 * @returns {MeltableItem}
 */
MeltableItem.prototype.registerMeltingRecipe = function (e, item, fluid) {
  const recipe = e.recipes.create.mixing([fluid], item)
  if (this.requiresSuperheating) {
    recipe.superheated()
  } else {
    recipe.heated()
  }
  return this
}

/**
 * Registers the melting recipes for the nugget, ingot, and block of this
 * MeltableItem.
 * Can only be called in server_scripts/
 *
 * @param {Internal.RecipesEventJS} e
 * @returns
 */
MeltableItem.prototype.registerMeltingRecipes = function (e) {
  if (this.nugget) {
    this.registerMeltingRecipe(
      e,
      this.nugget,
      Fluid.of(this.fluid, MeltableItem.DEFAULT_NUGGET_FLUID)
    )
  }
  this.registerMeltingRecipe(
    e,
    this.ingot,
    Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID)
  )
  this.registerMeltingRecipe(
    e,
    this.block,
    Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID * this.blockRatio)
  )
  return this
}

// Register the fluid filling recipes for the ingot and block casts.
//
// Can only be called in server_scripts/
MeltableItem.prototype.registerCastingRecipes = function (e) {
  if (!this.noIngotCastingRecipe) {
    e.recipes.create.filling(this.ceramicMoltenIngotCast, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      this.ceramicIngotCast,
    ])
    e.recipes.create.filling(this.steelMoltenIngotCast, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      this.steelIngotCast,
    ])
  }
  return this
}

// Register the washing recipes to get the ingot back from the casted items.
//
// Can only be called in server_scripts/
MeltableItem.prototype.registerWashedCastRecipes = function (e) {
  if (!this.noIngotCastingRecipe) {
    e.recipes.create.splashing(
      [
        this.ingot,
        Item.of(this.ceramicIngotCast).withChance(
          MeltableItem.CERAMIC_CAST_RETURN_CHANCE
        ),
      ],
      this.ceramicMoltenIngotCast
    )
    e.recipes.create.splashing(
      [this.ingot, this.steelIngotCast],
      this.steelMoltenIngotCast
    )
  }
  return this
}

// Export the class to the global namespace for use on the server side.
global.MeltableItem = MeltableItem
