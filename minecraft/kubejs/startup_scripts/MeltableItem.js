// priority: 900

// JS prototype class to store information about meltable items for
// metallurgy item and recipe registrations.
function MeltableItem(options) {
  this.nugget = options.nugget
  this.ingot = options.ingot ? options.ingot : options.gem
  this.block = options.block
  // If options.block is a forge tag, then specify a block for the melted fluid
  // to cast back into. Mostly for glass.
  this.blockCastingOutput = options.blockCastingOutput
  this.fluid = options.fluid
  this.fluidColor = options.fluidColor
  this.noRegisterFluid = options.noRegisterFluid

  this.isGem = !!options.gem
  this.noGemCastingRecipe = !!options.noGemCastingRecipe
  this.blockRatio = options.blockRatio
    ? options.blockRatio
    : MeltableItem.DEFAULT_BLOCK_RATIO
  this.requiresSuperheating = options.requiresSuperheating

  // Names of the casts that the molten liquids will be poured into.
  this.clayCastItem = this.isGem
    ? 'kubejs:clay_gem_cast'
    : 'kubejs:clay_ingot_cast'
  this.steelCastItem = this.isGem
    ? 'kubejs:steel_gem_cast'
    : 'kubejs:steel_ingot_cast'
  this.clayBlockCastItem = 'kubejs:clay_block_cast'
  this.steelBlockCastItem = 'kubejs:steel_block_cast'

  // Names of the items that result from having the molten liquids poured into
  // them.
  const strippedName = stripPrefix(this.fluid)
  this.castedClayCastItem = `kubejs:${strippedName}_clay_cast`
  this.castedSteelCastItem = `kubejs:${strippedName}_steel_cast`
  this.castedClayBlockCastItem = `kubejs:${strippedName}_block_clay_cast`
  this.castedSteelBlockCastItem = `kubejs:${strippedName}_steel_block_cast`
}

// Units of mb
MeltableItem.DEFAULT_NUGGET_FLUID = 10
MeltableItem.DEFAULT_INGOT_FLUID = 90
MeltableItem.DEFAULT_BLOCK_RATIO = 9

MeltableItem.CLAY_CAST_RETURN_CHANCE = 0.25

MeltableItem.BASE_CAST_TEXTURE = `${global.cai}:item/blank_cast`

MeltableItem.CLAY_CAST_COLOR = 0xabb5d0
MeltableItem.STEEL_CAST_COLOR = 0x43454b
MeltableItem.NEGATIVE_CAST_COLOR = 0x646464

// Registers the fluid if necessary.
//
// Must be called in startup_scripts/
MeltableItem.prototype.registerFluid = function (e) {
  if (!this.noRegisterFluid) {
    e.create(this.fluid)
      .thickTexture(this.fluidColor)
      .bucketColor(this.fluidColor)
      .displayName(getDisplayName(this.fluid))
  }
  return this
}

// Registers the items that result from pouring the molten item into casts.
//
// Must be called in startup_scripts/
MeltableItem.prototype.registerCastedItems = function (e) {
  const ingotNegativeTexture = getResourceLocation(this.ingot)
  const fluidDisplayName = getDisplayName(this.fluid)

  if (!this.noGemCastingRecipe) {
    e.create(this.castedClayCastItem)
      .textureJson({
        layer0: MeltableItem.BASE_CAST_TEXTURE,
        layer1: ingotNegativeTexture,
      })
      .color(0, MeltableItem.CLAY_CAST_COLOR)
      .color(1, this.fluidColor)
      .displayName(`Claycast ${fluidDisplayName}`)
      .maxStackSize(16)
    e.create(this.castedSteelCastItem)
      .textureJson({
        layer0: MeltableItem.BASE_CAST_TEXTURE,
        layer1: ingotNegativeTexture,
      })
      .color(0, MeltableItem.STEEL_CAST_COLOR)
      .color(1, this.fluidColor)
      .displayName(`Steelcast ${fluidDisplayName}`)
      .maxStackSize(16)
  }
  e.create(this.castedClayBlockCastItem)
    .textureJson({
      layer0: MeltableItem.BASE_CAST_TEXTURE,
      layer1: `${global.cai}:item/block_cast_negative`,
    })
    .color(0, MeltableItem.CLAY_CAST_COLOR)
    .color(1, this.fluidColor)
    .displayName(`Claycast ${fluidDisplayName} Block`)
    .maxStackSize(16)
  e.create(this.castedSteelBlockCastItem)
    .textureJson({
      layer0: MeltableItem.BASE_CAST_TEXTURE,
      layer1: `${global.cai}:item/block_cast_negative`,
    })
    .color(0, MeltableItem.STEEL_CAST_COLOR)
    .color(1, this.fluidColor)
    .displayName(`Steelcast ${fluidDisplayName} Block`)
    .maxStackSize(16)
  return this
}

// Helper method to register a melting recipe.
//
// Can only be called in server_scripts/
MeltableItem.prototype.registerMeltingRecipe = function (e, item, fluid) {
  const recipe = e.recipes.create.mixing([fluid], item)
  if (this.requiresSuperheating) {
    recipe.superheated()
  } else {
    recipe.heated()
  }
  return this
}

// Registers the melting recipes for the nugget, ingot, and block into the
// requisite fluid.
//
// Can only be called in server_scripts/
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
  if (!this.noGemCastingRecipe) {
    e.recipes.create.filling(this.castedClayCastItem, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      this.clayCastItem,
    ])
    e.recipes.create.filling(this.castedSteelCastItem, [
      Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID),
      this.steelCastItem,
    ])
  }
  e.recipes.create.filling(this.castedClayBlockCastItem, [
    Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID * this.blockRatio),
    this.clayBlockCastItem,
  ])
  e.recipes.create.filling(this.castedSteelBlockCastItem, [
    Fluid.of(this.fluid, MeltableItem.DEFAULT_INGOT_FLUID * this.blockRatio),
    this.steelBlockCastItem,
  ])
  return this
}

// Register the washing recipes to get the ingot back from the casted items.
//
// Can only be called in server_scripts/
MeltableItem.prototype.registerWashedCastRecipes = function (e) {
  if (!this.noGemCastingRecipe) {
    e.recipes.create.splashing(
      [
        this.ingot,
        Item.of(this.clayCastItem).withChance(
          MeltableItem.CLAY_CAST_RETURN_CHANCE
        ),
      ],
      this.castedClayCastItem
    )
    e.recipes.create.splashing(
      [this.ingot, this.steelCastItem],
      this.castedSteelCastItem
    )
  }
  e.recipes.create.splashing(
    [
      this.blockCastingOutput ? this.blockCastingOutput : this.block,
      Item.of(this.clayBlockCastItem).withChance(
        MeltableItem.CLAY_CAST_RETURN_CHANCE
      ),
    ],
    this.castedClayBlockCastItem
  )
  e.recipes.create.splashing(
    [
      this.blockCastingOutput ? this.blockCastingOutput : this.block,
      this.steelBlockCastItem,
    ],
    this.castedSteelBlockCastItem
  )
  return this
}

global.MeltableItem = MeltableItem
