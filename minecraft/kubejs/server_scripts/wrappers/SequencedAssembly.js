// priority: 1000

/** @author omgimanerd alvin@omgimanerd.tech */

let $UUID = Java.loadClass('java.util.UUID')

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
 *   .outputs(KINETIC_MECHANISM)
 *
 * @param {Internal.RecipesEventJS} e
 * @param {Internal.ItemStack_} input
 * @param {Internal.ItemStack_=} transitional
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
      preItemText: Text.of('Next: Cut on a Mechanical Saw'),
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
      preItemText: Text.of('Next: Press with a Mechanical Press'),
    })
  )
  return this
}

/**
 * @param {Internal.FluidStackJS|string} fluid
 * @param {number=} qty_mb
 * @param {string=} fluidTextLabel Text used for the fluid in the item lore
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.fill = function (fluid, qty_mb, fluidTextLabel) {
  // 1-argument, Fluid object is provided.
  // 2-argument, fluid should be a string and qty_mb should be provided.
  /**
   * @type {Internal.FluidStackJS}
   */
  const f =
    qty_mb === undefined || qty_mb === null ? fluid : Fluid.of(fluid, qty_mb)
  qty_mb = f.amount
  this.steps_.push({
    type: 'filling',
    preItemText: Text.of(`Next: Fill with ${qty_mb}mb `).append(
      f.getFluidStack().getName()
    ),
    fluid: f,
  })
  return this
}

/**
 * @param {Internal.ItemStack_} item
 * @param {boolean=} keepHeldItem
 * @param {string=} itemTextLabel
 * @returns {SequencedAssembly}
 */
SequencedAssembly.prototype.deploy = function (
  item,
  keepHeldItem,
  additionalOutputs,
  itemTextLabel
) {
  const itemStack = typeof item === 'string' ? Item.of(item) : item
  additionalOutputs = additionalOutputs === undefined ? [] : additionalOutputs
  let label = null
  if (itemTextLabel !== undefined) {
    label = Text.of(itemTextLabel)
  } else if (itemStack.getHoverName) {
    label = itemStack.getHoverName()
  } else if (itemStack.getStacks) {
    label = itemStack.getStacks().getFirst()
  } else {
    throw new Error(`Unable to determine an item label for ${item}`)
  }
  this.steps_.push({
    type: 'deploying',
    preItemText: Text.of(`Next: Deploy `).append(label),
    item: item,
    additionalOutputs: Array.isArray(additionalOutputs)
      ? additionalOutputs
      : [additionalOutputs],
    keepHeldItem: !!keepHeldItem,
  })
  return this
}

if (Platform.isLoaded('create_new_age')) {
  /**
   * @param {number} energyNeeded
   * @returns {SequencedAssembly}
   */
  SequencedAssembly.prototype.energize = function (energyNeeded) {
    if (!Platform.isLoaded('create_new_age')) {
      throw new Error('Create: New Age is not loaded!')
    }
    this.steps_.push({
      type: 'energising',
      preItemText: Text.of(`Next: Energize with ${energyNeeded}RF`),
      energyNeeded: energyNeeded,
    })
    return this
  }
}

if (Platform.isLoaded('vintageimprovements')) {
  /**
   * @param {number|string} input
   * @returns {SequencedAssembly}
   */
  SequencedAssembly.prototype.curve = function (input) {
    let itemAsHead, mode
    if (typeof input === 'number') {
      mode = input
    } else {
      itemAsHead = input
    }
    this.steps_.push({
      type: 'curving',
      preItemText: Text.of('Press with a curving press'),
      itemAsHead: itemAsHead,
      mode: mode,
    })
    return this
  }

  /**
   * @param {number} energy
   * @param {number=} maxChargeRate
   * @returns {SequencedAssembly}
   */
  SequencedAssembly.prototype.laser = function (energy, maxChargeRate) {
    this.steps_.push({
      type: 'laser_cutting',
      preItemText: Text.of('Cut with a laser'),
      energy: energy,
      maxChargeRate: maxChargeRate === undefined ? energy : maxChargeRate,
    })
    return this
  }

  /**
   * @param {number} processingTime
   * @returns {SequencedAssembly}
   */
  SequencedAssembly.prototype.vibrate = function (processingTime) {
    this.steps_.push({
      type: 'vibrating',
      preItemText: Text.of(`Next: Pass through a vibrating table`),
      processingTime: processingTime,
    })
    return this
  }
}

/**
 * If this custom step is the first step in the sequence, the pre item will be
 * whatever was given as this.input_. If this custom step is the last step in
 * the sequence the post item is whatever will be passed as the output item.
 * @callback customSequencedAssemblyCallback
 * @param {Internal.ItemStack_|string} pre
 * @param {OutputItem_[]|string} post
 * @param {(item:Internal.Ingredient_) => object} json Helper to convert
 *   ingredients to JSON objects.
 */
/**
 * @param {Internal.MutableComponent} preItemText
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
    preItemText:
      typeof preItemText === 'string' ? Text.of(preItemText) : preItemText,
    callback: prePostItemHandler,
  })
  return this
}

/**
 * @private
 * @param {number} stepNumber
 * @param {Internal.MutableComponent} loreText
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
      loreText.aqua().italic(false),
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
      let preItemStep = loop * this.steps_.length + index
      let postItemStep = preItemStep + 1
      let hideInJEI = loop > 0
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
        hideInJEI = false
      } else {
        postItem = this.getCustomTransitionalItem(
          postItemStep,
          this.steps_[(index + 1) % this.steps_.length].preItemText
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
        case 'energising':
          r = this.e_.recipes.create_new_age.energising(
            postItem,
            preItem,
            data.energyNeeded
          )
          break
        case 'curving':
          r = this.e_.recipes.vintageimprovements.curving(post, pre)
          if (data.itemAsHead) {
            r.itemAsHead(data.itemAsHead)
          } else if (data.mode) {
            r.mode(data.mode)
          }
          break
        case 'vibrating':
          r = this.e_.recipes.vintageimprovements.vibrating(post, pre)
          if (data.processingTime) r.processingTime(data.processingTime)
          break
        case 'custom':
          r = data.callback(preItem, postItem, json)
          break
        default:
          throw new Error(`Unknown type ${data.type}`)
      }
      if (hideInJEI) r.id(`kubejs:${$UUID.randomUUID()}_hidejei`)
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
              [this.transitional_].concat(data.additionalOutputs),
              [this.transitional_, data.item]
            )
            if (data.keepHeldItem) deployingStep.keepHeldItem()
            return deployingStep
          case 'energising':
            return this.e_.recipes.create_new_age.energising(
              this.transitional_,
              this.transitional_,
              data.energyNeeded
            )
          case 'curving':
            const curvingStep = this.e_.recipes.vintageimprovements.curving(
              this.transitional_,
              this.transitional_
            )
            if (data.itemAsHead) {
              curvingStep.itemAsHead(data.itemAsHead)
            } else if (data.mode) {
              curvingStep.mode(data.mode)
            }
            return curvingStep
          case 'laser_cutting':
            const laserCuttingStep =
              this.e_.recipes.vintageimprovements.laser_cutting(
                this.transitional_,
                this.transitional_
              )
            if (data.energy) laserCuttingStep.energy(data.energy)
            if (data.maxChargeRate) {
              laserCuttingStep.maxChargeRate(data.maxChargeRate)
            }
            return laserCuttingStep
          case 'vibrating':
            const vibratingStep = this.e_.recipes.vintageimprovements.vibrating(
              this.transitional_,
              this.transitional_
            )
            if (data.processingTime) {
              vibratingStep.processingTime(data.processingTime)
            }
            return vibratingStep
          default:
            throw new Error(`Unknown assembly step ${JSON.stringify(data)}`)
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
