// priority: 1000

/** @author omgimanerd alvin@omgimanerd.tech */

/**
 * @constructor
 * @description JS prototype class to make registering Create sequenced assembly
 * recipes easier.
 *
 * Example usage:
 * new SequencedAssembly(e, 'minecraft:wooden_slabs')
 *   .deploy('create:andesite_alloy')
 *   .deploy('create:shaft')
 *   .press(2)
 *   .outputs('kubejs:andesite_mechanism')
 *
 * @param {Internal.RecipesEventJS} e
 * @param {Internal.ItemStack_} input
 * @param {Internal.ItemStack_} transitional
 */
function SequencedAssembly(e, input, transitional) {
  this.e_ = e
  this.input_ = input
  this.transitional_ = transitional ? transitional : input

  this.loops_ = 1
  this.steps_ = []
  this.hasCustomSteps_ = false
}

/**
 * @param {number} loops
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.loops = function (loops) {
  this.loops_ = loops
  return this
}

/**
 * @param {number} repeats
 * @param {number} processingTime
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.cut = function (repeats, processingTime) {
  repeats = repeats === undefined ? 1 : repeats
  this.steps_ = this.steps_.concat(
    Array(repeats).fill({
      type: 'cutting',
      preItemText: 'Next: Cut on a Mechanical Saw',
      processingTime: processingTime,
    })
  )
  return this
}

/**
 * @param {number} repeats
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.press = function (repeats) {
  repeats = repeats === undefined ? 1 : repeats
  this.steps_ = this.steps_.concat(
    Array(repeats).fill({
      type: 'pressing',
      preItemText: 'Next: Press with a Mechanical Press',
    })
  )
  return this
}

/**
 * @param {Internal.FluidStackJS_|string} fluid
 * @param {number?} qty_mb
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.fill = function (fluid, qty_mb) {
  // 1-argument, Fluid object is provided.
  // 2-argument, fluid should be a string and qty_mb should be provided.
  /**
   * @type {Internal.FluidStackJS}
   */
  const f = qty_mb === undefined ? fluid : Fluid.of(fluid, qty_mb)
  let id = f.id
  qty_mb = f.amount
  this.steps_.push({
    type: 'filling',
    preItemText: `Next: Fill with ${qty_mb}mb ${id}`,
    fluid: f,
  })
  return this
}

/**
 * @param {Internal.ItemStack_|string} item
 * @param {boolean?} keepHeldItem
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.deploy = function (item, keepHeldItem) {
  const label = typeof item === 'string' ? item : item.id
  this.steps_.push({
    type: 'deploying',
    preItemText: `Next: Deploy ${label}`,
    item: item,
    keepHeldItem: !!keepHeldItem,
  })
  return this
}

/**
 * If this custom step is the first step in the sequence, the pre item will be
 * whatever was given as this.input_. If this custom step is the last step in
 * the sequence the post item is whatever will be passed as the output item.
 * @callback customSequencedAssemblyCallback
 * @param {Internal.ItemStack_|string} pre
 * @param {OutputItem_[]|string} post
 * @param {function} json Helper to convert ingredients to JSON objects.
 */
/**
 * @param {string} preItemText
 * @param {customSequencedAssemblyCallback} prePostItemHandler
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.custom = function (
  preItemText,
  prePostItemHandler
) {
  this.hasCustomSteps_ = true
  this.steps_.push({
    type: 'custom',
    preItemText: preItemText,
    callback: prePostItemHandler,
  })
  return this
}

/**
 * @private
 * @param {number} stepNumber
 * @param {string} loreText
 * @returns {Internal.Ingredient}
 */
SequencedAssembly.prototype.getCustomTransitionalItem = function (
  stepNumber,
  loreText
) {
  const totalSteps = this.steps_.length * this.loops_
  const progress = stepNumber / totalSteps
  return Item.of(this.transitional_, {
    SequencedAssembly: {
      Progress: progress,
      Step: stepNumber,
    },
  })
    .withLore([
      Text.empty(),
      Text.gray('Recipe Sequence').italic(false),
      Text.darkGray(`Progress: ${stepNumber}/${totalSteps}`).italic(false),
      Text.aqua(loreText).italic(false),
      Text.empty(),
    ])
    .weakNBT()
}

/**
 * @private
 * @param {OutputItem_[]} output
 * @returns {null}
 */
SequencedAssembly.prototype.outputCustomSequence = function (output) {
  output = typeof output === 'string' ? [output] : output

  /**
   * Helper method that's passed to the custom callback to convert Ingredients
   * to JSON for custom recipes.
   * @param {Internal.Ingredient} item
   * @returns {object}
   */
  const json = (item) => JSON.parse(item.toJson())

  const totalSteps = this.steps_.length * this.loops_
  // Generate and define recipes for each of the steps in the sequence.
  this.steps_.forEach((data, index) => {
    for (let loop = 0; loop < this.loops_; ++loop) {
      const preItemStep = index + loop * this.steps_.length
      const postItemStep = preItemStep + 1
      let preItem, postItem
      // The first and last items in the sequence should be the input and output
      // items respectively. Otherwise, we form an item with the relevant NBT
      // data and lore for the input and outputs of the intermediate steps.
      //
      // Custom steps must respect the NBT of the pre and post items.
      if (preItemStep === 0) {
        preItem = this.input_
      } else {
        preItem = this.getCustomTransitionalItem(preItemStep, data.preItemText)
      }
      if (postItemStep === totalSteps) {
        postItem = output
      } else {
        postItem = this.getCustomTransitionalItem(
          postItemStep,
          this.steps_[index + 1].preItemText
        )
      }
      // Store the recipe in case we need to chain calls to it. Define the
      // actual recipe with the intermediate items.
      let r
      switch (data.type) {
        case 'cutting':
          r = this.e_.recipes.create.cutting(postItem, preItem)
          if (data.processingTime) r.processingTime(data.processingTime)
          break
        case 'pressing':
          r = this.e_.recipes.create.pressing(postItem, preItem)
          break
        case 'filling':
          r = this.e_.recipes.create.filling(postItem, [preItem, data.fluid])
          break
        case 'deploying':
          r = this.e_.recipes.create.deploying(postItem, [preItem, data.item])
          if (data.keepHeldItem) r.keepHeldItem()
          break
        case 'custom':
          r = data.callback(preItem, postItem, json)
          break
        default:
          throw new Error(`Unknown type ${data.type}`)
      }
    }
  })
  return null
}

/**
 * @private
 * @param {OutputItem_[]} output
 * @returns {Special.Recipes.SequencedAssemblyCreate}
 */
SequencedAssembly.prototype.outputNativeCreate = function (output) {
  return this.e_.recipes.create
    .sequenced_assembly(
      output,
      this.input_,
      this.steps_.map((data) => {
        switch (data.type) {
          case 'cutting':
            const cuttingStep = this.e_.recipes.createCutting(
              this.transitional_,
              this.transitional_
            )
            if (data.processingTime !== undefined) {
              cuttingStep.processingTime(data.processingTime)
            }
            return cuttingStep
          case 'pressing':
            return this.e_.recipes.createPressing(
              this.transitional_,
              this.transitional_
            )
          case 'filling':
            return this.e_.recipes.createFilling(this.transitional_, [
              this.transitional_,
              data.fluid,
            ])
          case 'deploying':
            const deployingStep = this.e_.recipes.createDeploying(
              this.transitional_,
              [this.transitional_, data.item]
            )
            if (data.keepHeldItem) deployingStep.keepHeldItem()
            return deployingStep
          default:
            throw new Error(`Unknown assembly step ${data}`)
        }
      })
    )
    .transitionalItem(this.transitional_)
    .loops(this.loops_)
}

/**
 * @param {OutputItem_[]} output
 * @returns {Special.Recipes.SequencedAssemblyCreate?}
 */
SequencedAssembly.prototype.outputs = function (output) {
  if (this.hasCustomSteps_) {
    return this.outputCustomSequence(output)
  }
  return this.outputNativeCreate(output)
}
