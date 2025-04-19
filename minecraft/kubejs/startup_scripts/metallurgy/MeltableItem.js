// priority: 900

/**
 * JS prototype class to store information about meltable items for metallurgy
 * item and recipe registrations. Used by both startup_scripts and
 * server_scripts.
 * @param {Material} options
 */
function MeltableItem(options) {
  this.type = options.type

  // The three storage forms of the metal/gem input.
  this.nugget = options.nugget
  this.ingot = options.ingot
  this.block = options.block

  // The dust form, which can be melted
  this.dust = options.dust

  // Information about the fluid that the metal/gem will melt into to help with
  // registration.
  this.fluid = options.fluid
  this.fluidName = stripNamespace(this.fluid)
  this.fluidDisplayName = getDisplayName(this.fluid)
  this.bucketColor = options.bucketColor
  this.fluidTextureLocation = options.fluidTextureLocation

  // Whether or not the ingot form should have a casting recipe, also mostly
  // for glass.
  this.noIngotCastingRecipe = !!options.noIngotCastingRecipe

  // The ratio at which the ingot converts to the block form, used to determine
  // the amount of molten fluid that should result from melting a block.
  this.blockRatio = options.blockRatio
    ? options.blockRatio
    : MeltableItem.DEFAULT_BLOCK_RATIO
  this.superheated = options.superheated

  // Names of the casts that result from having the molten liquids poured into
  // them.
  this.ceramicMoltenIngotCast = `kubejs:ceramic_ingot_cast_${this.fluidName}`
  this.steelMoltenIngotCast = `kubejs:steel_ingot_cast_${this.fluidName}`
}

// Units of mb
MeltableItem.DEFAULT_NUGGET_FLUID = 10
MeltableItem.DEFAULT_INGOT_FLUID = 90
MeltableItem.DEFAULT_BLOCK_RATIO = 9
MeltableItem.DEFAULT_CRUSH_RETURN_CHANCE = 0.75

MeltableItem.CERAMIC_INGOT_CAST = 'kubejs:ceramic_ingot_cast'
MeltableItem.STEEL_INGOT_CAST = 'kubejs:steel_ingot_cast'

/**
 * Registers the fluid for the MeltableItem if necessary.
 * Must be called in startup_scripts.
 * @param {Registry.Fluid} e
 */
MeltableItem.prototype.registerFluid = function (e) {
  // Only custom fluids start with kubejs:
  if (this.fluid.startsWith('kubejs:')) {
    let fluid = e
      .create(this.fluid)
      .bucketColor(this.bucketColor)
      .noBlock()
      .stillTexture(`kubejs:fluid/${this.fluidName}_still`)
      .flowingTexture(`kubejs:fluid/${this.fluidName}_flow`)
      .displayName(getDisplayName(this.fluidDisplayName))
    switch (this.type) {
      case global.MATERIAL_TYPE_BASE_METAL:
        fluid.tag('kubejs:molten_base_metal')
        break
      case global.MATERIAL_TYPE_ALLOY_METAL:
        fluid.tag('kubejs:molten_alloy_metal')
        break
      case global.MATERIAL_TYPE_GEM:
        fluid.tag('kubejs:molten_gem')
        break
      default:
        throw new Error(`Unknown material type ${this.type}`)
    }
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

/**
 * Helper method to register a melting recipe for this item.
 * Can only be called in server_scripts.
 *
 * @param {Internal.RecipesEventJS_} e
 * @param {string} item
 * @param {string} fluid
 * @returns {MeltableItem}
 */
MeltableItem.prototype.registerMeltingRecipe = function (e, item, fluid) {
  const recipe = e.recipes.create.compacting([fluid], item)
  if (this.superheated) {
    recipe.superheated()
  } else {
    recipe.heated()
  }
  return this
}

/**
 * Registers the melting recipes for the nugget, ingot, block, and dust of this
 * MeltableItem.
 * Can only be called in server_scripts.
 * @param {Internal.RecipesEventJS_} e
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
  if (this.dust) {
    this.registerMeltingRecipe(
      e,
      this.dust,
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID * (4 / 3))
    )
  }
  return this
}

/**
 * Register the fluid filling recipes for the ingot and block casts.
 * Can only be called in server_scripts.
 * @param {Internal.RecipesEventJS_} e
 * @returns {MeltableItem}
 */
MeltableItem.prototype.registerCastingRecipes = function (e) {
  if (!this.noIngotCastingRecipe) {
    e.recipes.create.filling(this.ceramicMoltenIngotCast, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      MeltableItem.CERAMIC_INGOT_CAST,
    ])
    e.recipes.create.filling(this.steelMoltenIngotCast, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      MeltableItem.STEEL_INGOT_CAST,
    ])
  }
  return this
}

/**
 * Register the washing recipes to get the ingot back from the casted items.
 * Can only be called in server_scripts.
 * @param {Internal.RecipesEventJS_} e
 * @returns {MeltableItem}
 */
MeltableItem.prototype.registerWashedCastRecipes = function (e) {
  if (!this.noIngotCastingRecipe) {
    e.recipes.create.splashing([this.ingot], this.ceramicMoltenIngotCast)
    e.recipes.create.splashing(
      [this.ingot, MeltableItem.STEEL_INGOT_CAST],
      this.steelMoltenIngotCast
    )
  }
  return this
}

/**
 * Register the milling/crushing recipes to get the dust from the ingot form.
 * Can only be called in server_scripts.
 * @param {Internal.RecipesEventJS_} e
 * @returns {MeltableItem}
 */
MeltableItem.prototype.registerDustCrushingRecipes = function (e) {
  if (this.dust) {
    e.recipes.create.milling(
      Item.of(this.dust).withChance(MeltableItem.DEFAULT_CRUSH_RETURN_CHANCE),
      this.ingot
    )
  }
  return this
}

// Export the class to the global namespace for use on the server side.
global.MeltableItem = MeltableItem
